import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { InMemoryEditorialImportRepository } from "../src/lib/editorial/import/memory-repository";
import {
  parseEditorialImportFileContent,
} from "../src/lib/editorial/import/parsers";
import { runEditorialImportPipeline } from "../src/lib/editorial/import/runner";
import type { EditorialImportQuestion } from "../src/lib/editorial/import/types";
import { validateEditorialImportQuestions } from "../src/lib/editorial/import/validation";

const validQuestion: EditorialImportQuestion = {
  id: "ENG-RC-0001",
  title: "Main idea in school exchange text",
  statement:
    "Read the short exchange-program text and identify the main idea expressed by the student narrator.",
  language: "english",
  category: "english",
  subcategory: "reading-comprehension",
  competence: "eng-identify-main-idea",
  difficulty_level: 2,
  options: [
    { label: "A", text: "The student wants to compare weather in two countries." },
    { label: "B", text: "The student describes the central value of the exchange experience." },
    { label: "C", text: "The student explains airport procedures for international travel." },
    { label: "D", text: "The student lists documents required before enrollment." },
  ],
  correct_answer: "B",
  explanation:
    "The text focuses on the value of the exchange experience as a whole. The distractors mention details that could appear in PGM preparation, but they do not represent the central idea requested by the question.",
  tags: ["sprint-6b-2", "reading", "main-idea"],
  editorial_version: "pgm-2026-v1",
  source_reference: "Autoral PGM Academy - Sprint 6B.2",
  is_premium: true,
  status: "active",
};

const tempDir = mkdtempSync(join(tmpdir(), "pgm-editorial-import-"));

function writeJsonFixture(fileName: string, questions: unknown[]) {
  const filePath = join(tempDir, fileName);
  writeFileSync(filePath, JSON.stringify({ questions }, null, 2), "utf8");
  return filePath;
}

const validReport = validateEditorialImportQuestions([validQuestion]);
assert.equal(validReport.totalQuestions, 1);
assert.equal(validReport.validQuestions, 1);
assert.equal(validReport.invalidQuestions, 0);

const duplicateReport = validateEditorialImportQuestions([
  validQuestion,
  { ...validQuestion },
]);
assert.equal(duplicateReport.criticalErrors.some((issue) => issue.code === "duplicate_id"), true);
assert.equal(duplicateReport.invalidQuestions, 2);

const invalidCategoryReport = validateEditorialImportQuestions([
  { ...validQuestion, id: "BAD-CAT-1", category: "math" },
]);
assert.equal(
  invalidCategoryReport.criticalErrors.some((issue) => issue.code === "invalid_category"),
  true,
);

const missingAnswerReport = validateEditorialImportQuestions([
  { ...validQuestion, id: "NO-ANSWER-1", correct_answer: "" as "A" },
]);
assert.equal(
  missingAnswerReport.criticalErrors.some((issue) => issue.code === "missing_correct_answer"),
  true,
);

const missingExplanationReport = validateEditorialImportQuestions([
  { ...validQuestion, id: "NO-EXPLANATION-1", explanation: "" },
]);
assert.equal(
  missingExplanationReport.criticalErrors.some((issue) => issue.code === "missing_explanation"),
  true,
);

const csv = [
  "id,title,statement,language,category,subcategory,competence,difficulty_level,option_a,option_b,option_c,option_d,correct_answer,explanation,tags,editorial_version,source_reference,is_premium,status",
  [
    validQuestion.id,
    validQuestion.title,
    validQuestion.statement,
    validQuestion.language,
    validQuestion.category,
    validQuestion.subcategory,
    validQuestion.competence,
    validQuestion.difficulty_level,
    validQuestion.options[0].text,
    validQuestion.options[1].text,
    validQuestion.options[2].text,
    validQuestion.options[3].text,
    validQuestion.correct_answer,
    validQuestion.explanation,
    validQuestion.tags.join(";"),
    validQuestion.editorial_version,
    validQuestion.source_reference,
    String(validQuestion.is_premium),
    validQuestion.status,
  ]
    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
    .join(","),
].join("\n");

assert.equal(parseEditorialImportFileContent(csv, "csv").questions.length, 1);

const markdown = `
id: ENG-RC-0002
title: Reading context question
statement: Identify the main point of a student reflection about preparing for an international school exchange.
language: english
category: english
subcategory: reading-comprehension
competence: eng-identify-main-idea
difficulty_level: 2
A) The student only wants to memorize vocabulary.
B) The student explains the main purpose of preparation.
C) The student ignores cultural adaptation.
D) The student lists unrelated school subjects.
correct_answer: B
explanation: The statement asks for the main point. The correct answer captures the general purpose of preparation, while the other options mention isolated or unrelated details.
tags: sprint-6b-2; reading
editorial_version: pgm-2026-v1
source_reference: Autoral PGM Academy - Sprint 6B.2
is_premium: true
status: active
`;

assert.equal(parseEditorialImportFileContent(markdown, "markdown").questions.length, 1);

const validFile = writeJsonFixture("valid.json", [validQuestion]);

const invalidFile = writeJsonFixture("invalid.json", [
  validQuestion,
  { ...validQuestion, id: "BAD-IMPORT-1", category: "outside-scope" },
]);

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const dryRunRepository = new InMemoryEditorialImportRepository();
  const beforeDryRun = dryRunRepository.countQuestions();
  const dryRunReport = await runEditorialImportPipeline({
    filePath: validFile,
    mode: "dry-run",
    updateExisting: false,
    repository: dryRunRepository,
    writeReport: false,
  });

  assert.equal(dryRunReport.created, 1);
  assert.equal(dryRunRepository.countQuestions(), beforeDryRun);

  const importRepository = new InMemoryEditorialImportRepository();
  const executeReport = await runEditorialImportPipeline({
    filePath: validFile,
    mode: "execute",
    updateExisting: false,
    repository: importRepository,
    writeReport: false,
  });

  assert.equal(executeReport.created, 1);
  assert.equal(importRepository.countQuestions(), 1);

  const rerunReport = await runEditorialImportPipeline({
    filePath: validFile,
    mode: "execute",
    updateExisting: false,
    repository: importRepository,
    writeReport: false,
  });

  assert.equal(rerunReport.created, 0);
  assert.equal(rerunReport.ignored, 1);
  assert.equal(importRepository.countQuestions(), 1);

  const blockedRepository = new InMemoryEditorialImportRepository();
  const blockedReport = await runEditorialImportPipeline({
    filePath: invalidFile,
    mode: "execute",
    updateExisting: false,
    repository: blockedRepository,
    writeReport: false,
  });

  assert.equal(blockedReport.created, 0);
  assert.equal(blockedReport.rejected, 1);
  assert.equal(blockedReport.ignored, 1);
  assert.equal(blockedRepository.countQuestions(), 0);

  console.log("Editorial import passed");
}
