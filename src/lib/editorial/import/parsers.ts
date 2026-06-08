import { extname } from "node:path";

import type {
  EditorialImportFormat,
  EditorialImportOption,
  EditorialImportOptionLabel,
  EditorialImportParseResult,
  EditorialImportQuestion,
  EditorialImportStatus,
} from "./types";

type RawQuestion = Record<string, unknown>;

const optionLabels = ["A", "B", "C", "D", "E"] as const;

export function detectEditorialImportFormat(filePath: string): EditorialImportFormat {
  const extension = extname(filePath).toLowerCase();

  if (extension === ".json") return "json";
  if (extension === ".csv") return "csv";
  if ([".md", ".markdown"].includes(extension)) return "markdown";

  throw new Error(`Formato nao suportado: ${extension || "sem extensao"}.`);
}

export function parseEditorialImportFileContent(
  content: string,
  format: EditorialImportFormat,
): EditorialImportParseResult {
  if (format === "json") return parseJsonImport(content);
  if (format === "csv") return parseCsvImport(content);
  return parseMarkdownImport(content);
}

function parseJsonImport(content: string): EditorialImportParseResult {
  const parsed = JSON.parse(content) as unknown;
  const rawQuestions = Array.isArray(parsed)
    ? parsed
    : isObject(parsed) && Array.isArray(parsed.questions)
      ? parsed.questions
      : null;

  if (!rawQuestions) {
    throw new Error("JSON deve ser um array de questoes ou um objeto com `questions`.");
  }

  return {
    format: "json",
    questions: rawQuestions.map((question) => normalizeQuestion(question as RawQuestion)),
    warnings: [],
  };
}

function parseCsvImport(content: string): EditorialImportParseResult {
  const rows = parseCsvRows(content);
  if (rows.length < 2) {
    return { format: "csv", questions: [], warnings: ["CSV sem linhas de dados."] };
  }

  const headers = rows[0].map((header) => normalizeHeader(header));
  const questions = rows
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .map((row) => {
      const record: RawQuestion = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? "";
      });

      record.options = optionLabels
        .map((label) => ({
          label,
          text: stringValue(record[`option_${label.toLowerCase()}`]),
        }))
        .filter((option) => option.text.length > 0);

      record.tags = splitList(record.tags);
      return normalizeQuestion(record);
    });

  return { format: "csv", questions, warnings: [] };
}

function parseMarkdownImport(content: string): EditorialImportParseResult {
  const blocks = content
    .split(/\n-{3,}\n/g)
    .map((block) => block.trim())
    .filter(Boolean);

  const questions = blocks.map((block) => {
    const record: RawQuestion = {};
    const options: EditorialImportOption[] = [];
    let currentMultilineKey: string | null = null;
    const multilineValues = new Map<string, string[]>();

    for (const line of block.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const optionMatch = trimmed.match(/^([A-E])[\).:-]\s+(.+)$/i);
      if (optionMatch) {
        options.push({
          label: optionMatch[1].toUpperCase() as EditorialImportOptionLabel,
          text: optionMatch[2].trim(),
        });
        currentMultilineKey = null;
        continue;
      }

      const keyMatch = trimmed.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (keyMatch) {
        const key = normalizeHeader(keyMatch[1]);
        const value = keyMatch[2].trim();
        currentMultilineKey = value.length === 0 ? key : null;
        record[key] = value;
        if (currentMultilineKey) {
          multilineValues.set(currentMultilineKey, []);
        }
        continue;
      }

      if (currentMultilineKey) {
        multilineValues.get(currentMultilineKey)?.push(trimmed);
      }
    }

    for (const [key, values] of multilineValues.entries()) {
      if (values.length > 0) {
        record[key] = values.join("\n");
      }
    }

    record.options = options;
    record.tags = splitList(record.tags);
    return normalizeQuestion(record);
  });

  return { format: "markdown", questions, warnings: [] };
}

function normalizeQuestion(raw: RawQuestion): EditorialImportQuestion {
  const correctAnswer = stringValue(raw.correct_answer || raw.correctAnswer).toUpperCase();

  return {
    id: stringValue(raw.id || raw.editorial_id || raw.editorialId),
    title: stringValue(raw.title),
    statement: stringValue(raw.statement),
    language: stringValue(raw.language) as EditorialImportQuestion["language"],
    category: stringValue(raw.category),
    subcategory: stringValue(raw.subcategory),
    competence: stringValue(raw.competence || raw.competency || raw.primary_competency_code),
    difficulty_level: Number(raw.difficulty_level || raw.difficultyLevel) as EditorialImportQuestion["difficulty_level"],
    options: normalizeOptions(raw.options, correctAnswer),
    correct_answer: correctAnswer as EditorialImportOptionLabel,
    explanation: stringValue(raw.explanation),
    tags: splitList(raw.tags),
    editorial_version: stringValue(raw.editorial_version || raw.editorialVersion),
    source_reference: stringValue(raw.source_reference || raw.sourceReference),
    is_premium: booleanValue(raw.is_premium ?? raw.isPremium ?? true),
    status: normalizeStatus(raw.status),
  };
}

function normalizeOptions(value: unknown, correctAnswer: string): EditorialImportOption[] {
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (typeof item === "string") {
        const label = optionLabels[index] ?? "A";
        return {
          label,
          text: item.trim(),
          isCorrect: label === correctAnswer,
        };
      }

      if (isObject(item)) {
        const label = stringValue(item.label || item.option_label || optionLabels[index]).toUpperCase();
        return {
          label: label as EditorialImportOptionLabel,
          text: stringValue(item.text || item.option_text || item.value),
          isCorrect: booleanValue(item.is_correct ?? item.isCorrect ?? label === correctAnswer),
        };
      }

      return {
        label: optionLabels[index] ?? "A",
        text: "",
        isCorrect: false,
      };
    });
  }

  if (isObject(value)) {
    return optionLabels
      .map((label) => ({
        label,
        text: stringValue(value[label] || value[label.toLowerCase()]),
        isCorrect: label === correctAnswer,
      }))
      .filter((option) => option.text.length > 0);
  }

  return [];
}

function parseCsvRows(content: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current);
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

function splitList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => stringValue(item)).filter(Boolean);
  }

  return stringValue(value)
    .split(/[;|,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function normalizeStatus(value: unknown): EditorialImportStatus {
  const status = stringValue(value || "active").toLowerCase();
  if (status === "draft" || status === "inactive") return status;
  return "active";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function booleanValue(value: unknown) {
  if (typeof value === "boolean") return value;
  const normalized = stringValue(value).toLowerCase();
  return !["false", "0", "no", "nao", "não", "inactive"].includes(normalized);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
