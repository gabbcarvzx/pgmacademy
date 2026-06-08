import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

import { editorialDifficultyLevels } from "@/lib/editorial/taxonomy";

import {
  detectEditorialImportFormat,
  parseEditorialImportFileContent,
} from "./parsers";
import type {
  EditorialImportItemResult,
  EditorialImportQuestion,
  EditorialImportReport,
  EditorialImportRunOptions,
  EditorialQuestionPersistPayload,
} from "./types";
import { validateEditorialImportQuestions } from "./validation";

export async function runEditorialImportPipeline(
  options: EditorialImportRunOptions,
): Promise<EditorialImportReport> {
  const content = readFileSync(options.filePath, "utf8");
  const format = detectEditorialImportFormat(options.filePath);
  const parseResult = parseEditorialImportFileContent(content, format);
  const validation = validateEditorialImportQuestions(parseResult.questions);
  const invalidIds = new Set(validation.invalidQuestionIds);
  const items: EditorialImportItemResult[] = [];

  if (options.mode === "execute" && validation.invalidQuestions > 0) {
    for (const question of parseResult.questions) {
      items.push({
        questionId: question.id || "(sem id)",
        action: invalidIds.has(question.id) ? "rejected" : "ignored",
        reason: invalidIds.has(question.id)
          ? "Questão inválida na validação editorial."
          : "Importação bloqueada porque o arquivo possui itens inválidos.",
      });
    }

    return finalizeReport(options, validation, parseResult.warnings, items);
  }

  for (const question of parseResult.questions) {
    if (invalidIds.has(question.id)) {
      items.push({
        questionId: question.id || "(sem id)",
        action: options.mode === "dry-run" ? "would_reject" : "rejected",
        reason: "Questão inválida na validação editorial.",
      });
      continue;
    }

    const existing = options.repository
      ? await options.repository.findQuestionByEditorialId(question.id)
      : null;

    if (options.mode === "dry-run") {
      items.push({
        questionId: question.id,
        action: existing
          ? options.updateExisting
            ? "would_update"
            : "would_ignore"
          : "would_create",
        reason: dryRunReason(Boolean(existing), options.updateExisting),
      });
      continue;
    }

    if (!options.repository) {
      throw new Error("Importação real exige repositório de persistência.");
    }

    if (existing && !options.updateExisting) {
      items.push({
        questionId: question.id,
        action: "ignored",
        reason: "Questão já existe e --update não foi informado.",
      });
      continue;
    }

    const dependencies = await options.repository.prepareQuestionDependencies(question);
    const payload = toPersistPayload(question, dependencies);

    if (existing) {
      await options.repository.updateQuestion(existing.id, payload);
      items.push({
        questionId: question.id,
        action: "updated",
        reason: "Questão existente atualizada com --update.",
      });
      continue;
    }

    await options.repository.createQuestion(payload);
    items.push({
      questionId: question.id,
      action: "created",
      reason: "Questão criada.",
    });
  }

  return finalizeReport(options, validation, parseResult.warnings, items);
}

function finalizeReport(
  options: EditorialImportRunOptions,
  validation: ReturnType<typeof validateEditorialImportQuestions>,
  parseWarnings: string[],
  items: EditorialImportItemResult[],
) {
  const report: EditorialImportReport = {
    filePath: options.filePath,
    generatedAt: new Date().toISOString(),
    mode: options.mode,
    updateExisting: options.updateExisting,
    totalItems: validation.totalQuestions,
    validItems: validation.validQuestions,
    invalidItems: validation.invalidQuestions,
    created: countActions(items, "created", "would_create"),
    updated: countActions(items, "updated", "would_update"),
    ignored: countActions(items, "ignored", "would_ignore"),
    rejected: countActions(items, "rejected", "would_reject"),
    warnings: [
      ...parseWarnings.map((message) => ({
        questionId: null,
        severity: "warning" as const,
        code: "parse_warning",
        message,
      })),
      ...validation.warnings,
    ],
    errors: validation.errors,
    criticalErrors: validation.criticalErrors,
    items,
  };

  if (options.writeReport ?? true) {
    report.reportPath = writeEditorialImportReport(
      report,
      options.reportDirectory ?? join(process.cwd(), "docs", "import-reports"),
    );
  }

  return report;
}

export function toPersistPayload(
  question: EditorialImportQuestion,
  dependencies: {
    bankId: string;
    categoryId: string;
    editorialVersionId: string;
    primaryCompetencyId: string;
  },
): EditorialQuestionPersistPayload {
  const legacyDifficulty =
    editorialDifficultyLevels.find((level) => level.level === question.difficulty_level)
      ?.legacyDifficulty ?? "intermediate";

  return {
    question,
    legacyDifficulty,
    ...dependencies,
  };
}

export function writeEditorialImportReport(
  report: EditorialImportReport,
  reportDirectory: string,
) {
  mkdirSync(reportDirectory, { recursive: true });
  const timestamp = report.generatedAt.replace(/[:.]/g, "-");
  const reportFileName = `${timestamp}-${report.mode}-${basename(report.filePath).replace(/[^a-zA-Z0-9_.-]/g, "_")}.md`;
  const reportPath = join(reportDirectory, reportFileName);

  writeFileSync(reportPath, renderEditorialImportReport(report), "utf8");
  return reportPath;
}

export function renderEditorialImportReport(report: EditorialImportReport) {
  const lines = [
    "# Relatório de Importação Editorial",
    "",
    `Arquivo: ${report.filePath}`,
    `Data: ${report.generatedAt}`,
    `Modo: ${report.mode}`,
    `Update habilitado: ${report.updateExisting ? "sim" : "não"}`,
    "",
    "## Resumo",
    "",
    `- Total de itens: ${report.totalItems}`,
    `- Válidos: ${report.validItems}`,
    `- Inválidos: ${report.invalidItems}`,
    `- Criados: ${report.created}`,
    `- Atualizados: ${report.updated}`,
    `- Ignorados: ${report.ignored}`,
    `- Rejeitados: ${report.rejected}`,
    `- Avisos: ${report.warnings.length}`,
    `- Erros: ${report.errors.length}`,
    `- Erros críticos: ${report.criticalErrors.length}`,
    "",
    "## Itens",
    "",
    ...report.items.map(
      (item) => `- ${item.questionId}: ${item.action} - ${item.reason}`,
    ),
    "",
    "## Avisos",
    "",
    ...renderIssues(report.warnings),
    "",
    "## Erros",
    "",
    ...renderIssues(report.errors),
    "",
    "## Erros Críticos",
    "",
    ...renderIssues(report.criticalErrors),
    "",
  ];

  return lines.join("\n");
}

function dryRunReason(existing: boolean, updateExisting: boolean) {
  if (!existing) return "Questão seria criada.";
  if (updateExisting) return "Questão existente seria atualizada.";
  return "Questão existente seria ignorada sem --update.";
}

function countActions(
  items: EditorialImportItemResult[],
  realAction: EditorialImportItemResult["action"],
  dryRunAction: EditorialImportItemResult["action"],
) {
  return items.filter(
    (item) => item.action === realAction || item.action === dryRunAction,
  ).length;
}

function renderIssues(issues: EditorialImportReport["warnings"]) {
  if (issues.length === 0) return ["- Nenhum."];

  return issues.map(
    (issue) =>
      `- ${issue.questionId ?? "arquivo"} [${issue.code}]: ${issue.message}`,
  );
}
