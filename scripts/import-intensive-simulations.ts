import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import {
  intensiveSimulationQuestions,
  intensiveSimulationTemplates,
} from "./content/intensive-simulations";
import { runEditorialImportPipeline } from "../src/lib/editorial/import/runner";
import { SupabaseEditorialImportRepository } from "../src/lib/editorial/import/supabase-repository";
import type { Database } from "../src/types/database";

type AdminClient = ReturnType<typeof createClient<Database>>;

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Falha na importacao dos simulados intensivos: ${message}`);
  process.exit(1);
});

async function main() {
  const execute = process.argv.includes("--execute");
  const update = process.argv.includes("--update");
  loadLocalEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (execute && (!url || !serviceRoleKey)) {
    throw new Error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY para executar a importacao.",
    );
  }

  const admin =
    url && serviceRoleKey
      ? createClient<Database>(url, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;
  const tempDirectory = mkdtempSync(join(tmpdir(), "pgm-intensive-"));
  const contentFile = join(tempDirectory, "sprint-6e-intensive-pgm-2026.json");

  try {
    writeFileSync(
      contentFile,
      JSON.stringify({ questions: intensiveSimulationQuestions }, null, 2),
      "utf8",
    );

    const report = await runEditorialImportPipeline({
      filePath: contentFile,
      mode: execute ? "execute" : "dry-run",
      updateExisting: update,
      repository: admin
        ? new SupabaseEditorialImportRepository(admin)
        : undefined,
      reportDirectory: join(process.cwd(), "docs", "import-reports"),
      writeReport: true,
    });

    if (report.invalidItems > 0 || report.criticalErrors.length > 0) {
      throw new Error(
        `Pipeline rejeitou ${report.invalidItems} itens e encontrou ${report.criticalErrors.length} erros criticos.`,
      );
    }

    if (execute && admin) {
      await importTemplates(admin);
    } else {
      console.log(`Templates em dry-run: ${intensiveSimulationTemplates.length}`);
    }

    console.log("Sprint 6E validada pelo pipeline editorial.");
    console.log(`Modo: ${execute ? "execute" : "dry-run"}`);
    console.log(`Questoes: ${intensiveSimulationQuestions.length}`);
    console.log(`Criadas: ${report.created}`);
    console.log(`Atualizadas: ${report.updated}`);
    console.log(`Ignoradas: ${report.ignored}`);
    console.log(`Templates: ${intensiveSimulationTemplates.length}`);
    console.log(`Relatorio: ${report.reportPath}`);
  } finally {
    rmSync(tempDirectory, { recursive: true, force: true });
  }
}

async function importTemplates(client: AdminClient) {
  for (const template of intensiveSimulationTemplates) {
    const { data: existing, error: selectError } = await client
      .from("simulation_templates")
      .select("id")
      .eq("editorial_id", template.editorialId)
      .maybeSingle();

    if (selectError) {
      throw new Error(
        `Nao foi possivel consultar o template ${template.editorialId}: ${selectError.message}`,
      );
    }

    const payload = {
      tenant_id: null,
      title: template.title,
      description: template.description,
      type: template.type,
      language: template.language,
      total_questions: template.totalQuestions,
      is_premium: template.isPremium,
      is_active: true,
      source_reference: template.sourceReference,
      tags: ["reta-final", "intensivo-pgm-2026", template.language],
    };

    if (existing?.id) {
      const { error } = await client
        .from("simulation_templates")
        .update(payload)
        .eq("id", existing.id);

      if (error) {
        throw new Error(
          `Nao foi possivel atualizar o template ${template.editorialId}: ${error.message}`,
        );
      }
    } else {
      const { error } = await client.from("simulation_templates").insert({
        editorial_id: template.editorialId,
        ...payload,
      });

      if (error) {
        throw new Error(
          `Nao foi possivel criar o template ${template.editorialId}: ${error.message}`,
        );
      }
    }
  }

  console.log(
    `Templates intensivos importados/atualizados: ${intensiveSimulationTemplates.length}`,
  );
}

function loadLocalEnv() {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = join(process.cwd(), fileName);
    if (!existsSync(filePath)) continue;

    for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex < 1) continue;

      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed
        .slice(separatorIndex + 1)
        .replace(/^["']|["']$/g, "");
      process.env[key] ??= value;
    }
  }
}
