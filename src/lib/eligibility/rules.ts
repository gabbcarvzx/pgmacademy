export type SchoolYear = "first" | "second" | "other";

export type RequirementStatus = "passed" | "warning" | "failed";

export type EligibilityStatus = "eligible" | "partial" | "ineligible";

export type EligibilityInput = {
  birthDate: string;
  schoolYear: SchoolYear;
  hasStateSchoolEnrollment: boolean;
  hasActiveSiepeEnrollment: boolean;
  isExcludedSchool: boolean;
  attendancePercent: number;
  portugueseAverage: number;
  mathAverage: number;
  humanitiesAverage: number;
  hasPartialProgression: boolean;
  wasPreviouslySelected: boolean;
};

export type RequirementEvaluation = {
  key: string;
  label: string;
  category: "identity" | "school" | "academic" | "history";
  status: RequirementStatus;
  requirement: string;
  current: string;
  explanation: string;
};

export type EligibilityResult = {
  status: EligibilityStatus;
  title: string;
  summary: string;
  readinessScore: number;
  evaluations: RequirementEvaluation[];
  hardFailures: number;
  academicWarnings: number;
};

export const pgm2026Rules = {
  edital: "Edital de Abertura nº 01/2026",
  sourceUrl:
    "https://portal.educacao.pe.gov.br/wp-content/uploads/2026/05/0d68cd50-48a7-492c-88f7-0c7b9af530c0.pdf",
  birthDateStart: "2009-05-01",
  birthDateEnd: "2012-10-01",
  minimumAttendancePercent: 85,
  minimumAverage: 7,
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const evaluations: RequirementEvaluation[] = [
    evaluateBirthDate(input.birthDate),
    evaluateSchoolYear(input.schoolYear),
    evaluateBooleanRequirement({
      key: "state-school",
      label: "Rede estadual de Pernambuco",
      category: "school",
      passed: input.hasStateSchoolEnrollment,
      requirement: "Estar matriculado em escola pública da rede estadual de Pernambuco.",
      current: input.hasStateSchoolEnrollment ? "Sim" : "Não",
      passedExplanation:
        "A informação atende ao requisito de vínculo escolar informado no edital.",
      failedExplanation:
        "O edital exige matrícula em escola pública da rede estadual de Pernambuco.",
    }),
    evaluateBooleanRequirement({
      key: "siepe",
      label: "Cadastro ativo no SIEPE",
      category: "school",
      passed: input.hasActiveSiepeEnrollment,
      requirement: "Ter cadastro ativo e enturmação no SIEPE.",
      current: input.hasActiveSiepeEnrollment ? "Sim" : "Não",
      passedExplanation:
        "O estudante informa possuir cadastro ativo e enturmação no SIEPE.",
      failedExplanation:
        "A verificação oficial usa o SIEPE; sem cadastro ativo, a homologação pode ser impedida.",
    }),
    evaluateBooleanRequirement({
      key: "excluded-school",
      label: "Tipo de escola permitido",
      category: "school",
      passed: !input.isExcludedSchool,
      requirement:
        "Não estar em escola da Polícia Militar, Escola de Aplicação da UPE, escola indígena ou escola quilombola.",
      current: input.isExcludedSchool ? "Categoria excluída" : "Categoria permitida",
      passedExplanation:
        "A escola informada não está entre as categorias excluídas pelo edital.",
      failedExplanation:
        "O edital exclui algumas categorias de escola para este processo seletivo.",
    }),
    evaluateNumberRequirement({
      key: "attendance",
      label: "Frequência escolar",
      category: "academic",
      value: input.attendancePercent,
      minimum: pgm2026Rules.minimumAttendancePercent,
      suffix: "%",
      requirement: "Frequência mínima de 85%.",
    }),
    evaluateNumberRequirement({
      key: "portuguese",
      label: "Média em Língua Portuguesa",
      category: "academic",
      value: input.portugueseAverage,
      minimum: pgm2026Rules.minimumAverage,
      suffix: "",
      requirement: "Média mínima de 7,0 em Língua Portuguesa.",
    }),
    evaluateNumberRequirement({
      key: "math",
      label: "Média em Matemática",
      category: "academic",
      value: input.mathAverage,
      minimum: pgm2026Rules.minimumAverage,
      suffix: "",
      requirement: "Média mínima de 7,0 em Matemática.",
    }),
    evaluateNumberRequirement({
      key: "humanities",
      label: "Média em Ciências Humanas",
      category: "academic",
      value: input.humanitiesAverage,
      minimum: pgm2026Rules.minimumAverage,
      suffix: "",
      requirement:
        "Média mínima de 7,0 na média aritmética de História, Geografia, Filosofia e Sociologia.",
    }),
    evaluateBooleanRequirement({
      key: "partial-progression",
      label: "Progressão parcial",
      category: "history",
      passed: !input.hasPartialProgression,
      requirement: "Não estar em regime de progressão parcial no ano letivo de 2026.",
      current: input.hasPartialProgression ? "Possui progressão parcial" : "Não possui",
      passedExplanation:
        "O estudante informa não estar em regime de progressão parcial.",
      failedExplanation:
        "O edital impede participação de estudante em progressão parcial no ano letivo de 2026.",
    }),
    evaluateBooleanRequirement({
      key: "previous-selection",
      label: "Convocação anterior",
      category: "history",
      passed: !input.wasPreviouslySelected,
      requirement:
        "Não ter sido anteriormente convocado para intercâmbio no Programa Ganhe o Mundo.",
      current: input.wasPreviouslySelected ? "Já foi convocado" : "Não foi convocado",
      passedExplanation:
        "O estudante informa não ter sido convocado anteriormente para intercâmbio pelo PGM.",
      failedExplanation:
        "O edital veda participação de estudante anteriormente convocado para intercâmbio pelo programa.",
    }),
  ];

  const hardFailures = evaluations.filter(
    (item) => item.status === "failed" && item.category !== "academic",
  ).length;
  const academicWarnings = evaluations.filter(
    (item) => item.status === "warning",
  ).length;
  const passed = evaluations.filter((item) => item.status === "passed").length;
  const readinessScore = Math.round((passed / evaluations.length) * 100);

  if (hardFailures > 0) {
    return {
      status: "ineligible",
      title: "Não elegível",
      summary:
        "Há requisito estrutural do edital que impede a elegibilidade neste diagnóstico.",
      readinessScore,
      evaluations,
      hardFailures,
      academicWarnings,
    };
  }

  if (academicWarnings > 0) {
    return {
      status: "partial",
      title: "Parcialmente elegível",
      summary:
        "Os requisitos estruturais parecem atendidos, mas há desempenho ou frequência abaixo do mínimo do edital.",
      readinessScore,
      evaluations,
      hardFailures,
      academicWarnings,
    };
  }

  return {
    status: "eligible",
    title: "Elegível",
    summary:
      "Todos os requisitos avaliados pelo diagnóstico estão alinhados ao edital informado.",
    readinessScore,
    evaluations,
    hardFailures,
    academicWarnings,
  };
}

function evaluateBirthDate(birthDate: string): RequirementEvaluation {
  const start = parseRequiredIsoDate(pgm2026Rules.birthDateStart);
  const end = parseRequiredIsoDate(pgm2026Rules.birthDateEnd);
  const value = parseIsoDate(birthDate);
  const valid = Boolean(value && value >= start && value <= end);

  return {
    key: "birth-date",
    label: "Faixa de nascimento",
    category: "identity",
    status: valid ? "passed" : "failed",
    requirement: "Data de nascimento entre 01/05/2009 e 01/10/2012.",
    current: value ? dateFormatter.format(value) : "Data invalida",
    explanation: valid
      ? "A data informada está dentro da faixa de nascimento prevista no edital."
      : "A data informada está fora da faixa de nascimento prevista no edital.",
  };
}

function evaluateSchoolYear(schoolYear: SchoolYear): RequirementEvaluation {
  const labels: Record<SchoolYear, string> = {
    first: "1º ano do Ensino Médio",
    second: "2º ano do Ensino Médio",
    other: "Outra série",
  };
  const valid = schoolYear === "first" || schoolYear === "second";

  return {
    key: "school-year",
    label: "Série atual",
    category: "school",
    status: valid ? "passed" : "failed",
    requirement: "Estar no 1º ou 2º ano do Ensino Médio em 2026.",
    current: labels[schoolYear],
    explanation: valid
      ? "A série informada está dentro do recorte previsto no edital."
      : "O edital limita a participação a estudantes do 1º ou 2º ano do Ensino Médio.",
  };
}

function evaluateNumberRequirement({
  key,
  label,
  category,
  value,
  minimum,
  suffix,
  requirement,
}: {
  key: string;
  label: string;
  category: RequirementEvaluation["category"];
  value: number;
  minimum: number;
  suffix: string;
  requirement: string;
}): RequirementEvaluation {
  const normalizedValue = Number.isFinite(value) ? value : 0;
  const passed = normalizedValue >= minimum;

  return {
    key,
    label,
    category,
    status: passed ? "passed" : "warning",
    requirement,
    current: `${formatNumber(normalizedValue)}${suffix}`,
    explanation: passed
      ? "O valor informado atende ao mínimo do edital."
      : "O valor informado está abaixo do mínimo do edital e deve ser tratado como ponto crítico.",
  };
}

function evaluateBooleanRequirement({
  key,
  label,
  category,
  passed,
  requirement,
  current,
  passedExplanation,
  failedExplanation,
}: {
  key: string;
  label: string;
  category: RequirementEvaluation["category"];
  passed: boolean;
  requirement: string;
  current: string;
  passedExplanation: string;
  failedExplanation: string;
}): RequirementEvaluation {
  return {
    key,
    label,
    category,
    status: passed ? "passed" : "failed",
    requirement,
    current,
    explanation: passed ? passedExplanation : failedExplanation,
  };
}

function parseRequiredIsoDate(value: string): Date {
  const parsed = parseIsoDate(value);
  if (!parsed) {
    throw new Error(`Invalid rule date: ${value}`);
  }
  return parsed;
}

function parseIsoDate(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(value);
}
