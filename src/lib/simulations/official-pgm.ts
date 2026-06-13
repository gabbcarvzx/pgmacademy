import { isIntensiveSimulationTemplate } from "@/lib/simulations/intensive-pgm";

export const officialObjectiveSimulation = {
  title: "Simulado Objetivo Oficial PGM 2026",
  questionCount: 30,
  durationMinutes: 240,
  pointsPerQuestion: 2,
  description:
    "Modelo premium com 30 questões objetivas, cronômetro, navegação por questão e relatório por categoria.",
} as const;

export const officialSubjectiveSimulation = {
  title: "Simulado Subjetivo Oficial PGM 2026",
  questionCount: 5,
  minWords: 90,
  maxWords: 150,
  pointsPerQuestion: 8,
  maxScore: 40,
  description:
    "Treino premium com 5 respostas no idioma escolhido, cada uma entre 90 e 150 palavras.",
} as const;

export const officialSubjectiveRubric = [
  {
    key: "grammar",
    title: "Correção gramatical",
    description:
      "Uso adequado de tempos verbais, concordância, pronomes, artigos, preposições e estruturas do idioma.",
  },
  {
    key: "vocabulary",
    title: "Precisão vocabular",
    description:
      "Escolha de palavras compatíveis com o tema, evitando traduções literais, falsos cognatos e termos vagos.",
  },
  {
    key: "syntax",
    title: "Estrutura sintática",
    description:
      "Frases organizadas, compreensíveis e com relação clara entre sujeito, verbo, complementos e conectores.",
  },
  {
    key: "cohesion",
    title: "Coesão",
    description:
      "Uso de conectores e encadeamento lógico entre ideias, exemplos e conclusão.",
  },
  {
    key: "clarity",
    title: "Clareza",
    description:
      "Resposta objetiva, completa e fácil de entender dentro do limite oficial de palavras.",
  },
] as const;

export function isOfficialObjectiveTemplate(template: {
  type: "quick" | "full";
}) {
  return template.type === "full";
}

export function simulationDurationMinutes(template: {
  editorial_id?: string | null;
  type: "quick" | "full";
  total_questions: number;
}) {
  if (isIntensiveSimulationTemplate(template)) {
    return 180;
  }

  if (isOfficialObjectiveTemplate(template)) {
    return officialObjectiveSimulation.durationMinutes;
  }

  return Math.max(Math.ceil(template.total_questions * 1.5), 10);
}

export function simulationPointsPerQuestion(template: {
  type: "quick" | "full";
}) {
  return isOfficialObjectiveTemplate(template)
    ? officialObjectiveSimulation.pointsPerQuestion
    : 1;
}

export function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function validateOfficialSubjectiveAnswer(value: string) {
  const count = wordCount(value);

  return {
    count,
    valid:
      count >= officialSubjectiveSimulation.minWords &&
      count <= officialSubjectiveSimulation.maxWords,
  };
}
