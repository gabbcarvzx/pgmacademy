import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { runEditorialImportPipeline } from "../src/lib/editorial/import/runner";
import { SupabaseEditorialImportRepository } from "../src/lib/editorial/import/supabase-repository";
import type { EditorialImportRepository } from "../src/lib/editorial/import/types";
import type { Database } from "../src/types/database";

type CliOptions = {
  filePath: string | null;
  execute: boolean;
  update: boolean;
  offline: boolean;
};

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Erro no pipeline editorial: ${message}`);
  process.exit(1);
});

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.filePath) {
    printUsage();
    process.exit(1);
  }

  const repository = options.offline
    ? undefined
    : createRepository(options.execute);

  const report = await runEditorialImportPipeline({
    filePath: options.filePath,
    mode: options.execute ? "execute" : "dry-run",
    updateExisting: options.update,
    repository,
    reportDirectory: join(process.cwd(), "docs", "import-reports"),
    writeReport: true,
  });

  console.log("Pipeline editorial concluído.");
  console.log(`Modo: ${report.mode}`);
  console.log(`Total: ${report.totalItems}`);
  console.log(`Válidos: ${report.validItems}`);
  console.log(`Inválidos: ${report.invalidItems}`);
  console.log(`Criados: ${report.created}`);
  console.log(`Atualizados: ${report.updated}`);
  console.log(`Ignorados: ${report.ignored}`);
  console.log(`Rejeitados: ${report.rejected}`);
  console.log(`Avisos: ${report.warnings.length}`);
  console.log(`Erros: ${report.errors.length}`);
  console.log(`Erros críticos: ${report.criticalErrors.length}`);
  console.log(`Relatório: ${report.reportPath}`);

  if (report.invalidItems > 0 || report.criticalErrors.length > 0) {
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    filePath: null,
    execute: false,
    update: false,
    offline: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--file") {
      options.filePath = args[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (arg === "--execute") {
      options.execute = true;
      continue;
    }
    if (arg === "--update") {
      options.update = true;
      continue;
    }
    if (arg === "--offline") {
      options.offline = true;
      continue;
    }
  }

  return options;
}

function createRepository(required: boolean): EditorialImportRepository | undefined {
  loadLocalEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    if (required) {
      throw new Error(
        "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY para executar importação real.",
      );
    }

    console.warn(
      "Supabase não configurado. Dry-run será executado sem consulta de duplicidade no banco.",
    );
    return undefined;
  }

  return new SupabaseEditorialImportRepository(
    createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    }),
  );
}

function loadLocalEnv(): void {
  for (const fileName of [".env.local", ".env"]) {
    const filePath = join(process.cwd(), fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex < 1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed.slice(separatorIndex + 1).replace(/^["']|["']$/g, "");
      process.env[key] ??= value;
    }
  }
}

function printUsage() {
  console.log(`
Uso:
  npm run editorial:import -- --file caminho/arquivo.json
  npm run editorial:import -- --file caminho/arquivo.csv --offline
  npm run editorial:import -- --file caminho/arquivo.md --execute
  npm run editorial:import -- --file caminho/arquivo.json --execute --update

Opções:
  --file       Caminho do arquivo JSON, CSV ou Markdown estruturado.
  --execute    Executa importação real. Sem esta flag, roda em dry-run.
  --update     Atualiza questões existentes. Sem esta flag, existentes são ignoradas.
  --offline    Dry-run sem consultar Supabase.
`);
}
