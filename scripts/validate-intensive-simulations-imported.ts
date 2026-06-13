import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import {
  intensiveSimulationQuestions,
  intensiveSimulationTemplates,
} from "./content/intensive-simulations";
import { INTENSIVE_SIMULATION_SOURCE_REFERENCE } from "../src/lib/simulations/intensive-pgm";
import type { Database } from "../src/types/database";

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Falha na validacao dos intensivos importados: ${message}`);
  process.exit(1);
});

async function main() {
  loadLocalEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const templateIds = intensiveSimulationTemplates.map(
    (template) => template.editorialId,
  );

  const [
    { data: templates, error: templateError },
    { data: questions, error: questionError },
  ] = await Promise.all([
      admin
        .from("simulation_templates")
        .select(
          "id, editorial_id, language, total_questions, is_premium, is_active, source_reference",
        )
        .in("editorial_id", templateIds),
      admin
        .from("questions")
        .select(
          "id, editorial_id, bank_id, language, primary_competency_id, editorial_difficulty_level, tags, source_reference, is_active",
        )
        .eq("source_reference", INTENSIVE_SIMULATION_SOURCE_REFERENCE),
    ]);

  if (templateError) throw new Error(templateError.message);
  if (questionError) throw new Error(questionError.message);

  expectEqual("templates", templates?.length ?? 0, 2);
  expectEqual("questoes", questions?.length ?? 0, 60);

  const questionIds = (questions ?? []).map((question) => question.id);
  const { data: questionOptions, error: optionError } = await admin
    .from("question_options")
    .select("question_id, option_label, is_correct")
    .in("question_id", questionIds);
  if (optionError) throw new Error(optionError.message);

  const optionsByQuestion = new Map<
    string,
    NonNullable<typeof questionOptions>
  >();
  for (const option of questionOptions ?? []) {
    const current = optionsByQuestion.get(option.question_id) ?? [];
    current.push(option);
    optionsByQuestion.set(option.question_id, current);
  }

  const bankIds = [...new Set((questions ?? []).map((question) => question.bank_id))];
  const { data: banks, error: bankError } = await admin
    .from("question_banks")
    .select("id, is_premium, is_active")
    .in("id", bankIds);
  if (bankError) throw new Error(bankError.message);

  for (const bank of banks ?? []) {
    if (!bank.is_premium || !bank.is_active) {
      throw new Error(`Banco ${bank.id} precisa permanecer ativo e premium.`);
    }
  }

  for (const template of templates ?? []) {
    if (
      !template.is_premium ||
      !template.is_active ||
      template.total_questions !== 30 ||
      template.source_reference !== INTENSIVE_SIMULATION_SOURCE_REFERENCE
    ) {
      throw new Error(`Template intensivo invalido: ${template.editorial_id}.`);
    }
  }

  const expectedByLanguage = new Map(
    intensiveSimulationTemplates.map((template) => [
      template.language,
      template.totalQuestions,
    ]),
  );

  for (const [language, expected] of expectedByLanguage.entries()) {
    expectEqual(
      `questoes ${language}`,
      (questions ?? []).filter((question) => question.language === language)
        .length,
      expected,
    );
  }

  const labels = ["A", "B", "C", "D", "E"] as const;
  for (const language of ["english", "spanish"] as const) {
    const languageQuestions = (questions ?? []).filter(
      (question) => question.language === language,
    );

    for (const label of labels) {
      const count = languageQuestions.filter((question) => {
        const options = optionsByQuestion.get(question.id) ?? [];
        return options.some(
          (option) => option.is_correct && option.option_label === label,
        );
      }).length;
      expectEqual(`${language} gabarito ${label}`, count, 6);
    }

    for (const question of languageQuestions) {
      const options = optionsByQuestion.get(question.id) ?? [];
      expectEqual(`${question.editorial_id} alternativas`, options.length, 5);
      expectEqual(
        `${question.editorial_id} respostas corretas`,
        options.filter((option) => option.is_correct).length,
        1,
      );

      if (
        !question.primary_competency_id ||
        !question.editorial_difficulty_level ||
        !question.tags.includes("intensivo-pgm-2026") ||
        !question.is_active
      ) {
        throw new Error(
          `Metadados editoriais incompletos em ${question.editorial_id}.`,
        );
      }
    }
  }

  expectEqual(
    "IDs editoriais locais",
    new Set(intensiveSimulationQuestions.map((question) => question.id)).size,
    60,
  );

  console.log("Simulados intensivos importados validados com sucesso.");
  console.log("Templates: 2");
  console.log("Questoes: 60");
  console.log("Ingles: 30");
  console.log("Espanhol: 30");
  console.log("Gabarito por idioma: A=6, B=6, C=6, D=6, E=6");
}

function expectEqual(label: string, actual: number, expected: number) {
  if (actual !== expected) {
    throw new Error(`${label}: esperado ${expected}, encontrado ${actual}.`);
  }
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
