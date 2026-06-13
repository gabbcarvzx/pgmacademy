import type { CategoryPerformance } from "@/lib/simulations/scoring";

export const INTENSIVE_SIMULATION_SOURCE_REFERENCE =
  "Autoral PGM Academy - Sprint 6E Intensivo";

export const intensiveSimulationTemplateIds = {
  english: "TEMPLATE-PGM-INTENSIVO-EN-2026",
  spanish: "TEMPLATE-PGM-INTENSIVO-ES-2026",
} as const;

export const intensiveSimulationTemplates = [
  {
    editorialId: intensiveSimulationTemplateIds.english,
    title: "Simulado Intensivo Final PGM 2026 - Ingles",
    description:
      "Simulado intensivo de preparacao independente para a reta final, com questoes autorais calibradas a partir de padroes observados em provas anteriores do Programa Ganhe o Mundo.",
    type: "full" as const,
    language: "english" as const,
    totalQuestions: 30,
    durationMinutes: 180,
    isPremium: true,
    sourceReference: INTENSIVE_SIMULATION_SOURCE_REFERENCE,
  },
  {
    editorialId: intensiveSimulationTemplateIds.spanish,
    title: "Simulado Intensivo Final PGM 2026 - Espanhol",
    description:
      "Simulado intensivo de preparacao independente para a reta final, com questoes autorais calibradas a partir de padroes observados em provas anteriores do Programa Ganhe o Mundo.",
    type: "full" as const,
    language: "spanish" as const,
    totalQuestions: 30,
    durationMinutes: 180,
    isPremium: true,
    sourceReference: INTENSIVE_SIMULATION_SOURCE_REFERENCE,
  },
] as const;

export type IntensivePreparationAssessment = {
  tone: "success" | "warning" | "danger";
  title: string;
  description: string;
};

export type IntensiveRecoveryAction = {
  area: "grammar" | "reading" | "vocabulary" | "general";
  title: string;
  description: string;
  href: string;
};

export function isIntensiveSimulationTemplate(template: {
  editorial_id?: string | null;
}) {
  return Object.values(intensiveSimulationTemplateIds).includes(
    template.editorial_id as (typeof intensiveSimulationTemplateIds)[keyof typeof intensiveSimulationTemplateIds],
  );
}

export function getIntensivePreparationAssessment(
  percentage: number,
): IntensivePreparationAssessment {
  if (percentage >= 80) {
    return {
      tone: "success",
      title: "Preparacao forte",
      description:
        "Seu desempenho mostra dominio consistente. Revise os erros pontuais e preserve o ritmo ate a prova.",
    };
  }

  if (percentage >= 60) {
    return {
      tone: "warning",
      title: "Boa base, mas precisa reforcar pontos especificos",
      description:
        "Voce ja construiu uma base util. Concentre a revisao nas categorias abaixo de 60% antes de repetir o intensivo.",
    };
  }

  return {
    tone: "danger",
    title: "Atencao: revise conteudos essenciais antes da prova",
    description:
      "Use o diagnostico para priorizar fundamentos, praticar em blocos curtos e refazer questoes comentadas.",
  };
}

export function buildIntensiveRecoveryPlan(
  weakCategories: CategoryPerformance[],
): IntensiveRecoveryAction[] {
  const weakText = weakCategories
    .map((category) => category.categoryName)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const actions: IntensiveRecoveryAction[] = [];

  if (/grammar|gramatica|communication|comunicacion/.test(weakText)) {
    actions.push({
      area: "grammar",
      title: "Recuperar gramatica e uso da lingua",
      description:
        "Revise os materiais de gramatica, faca uma rodada de flashcards e finalize com um mini treino por idioma.",
      href: "/estudos",
    });
  }

  if (/reading|comprension|leitura/.test(weakText)) {
    actions.push({
      area: "reading",
      title: "Aprimorar interpretacao",
      description:
        "Pratique textos curtos, localizacao de evidencias, ideia principal e inferencia antes de refazer o simulado.",
      href: "/trilhas",
    });
  }

  if (/vocabulary|vocabulario/.test(weakText)) {
    actions.push({
      area: "vocabulary",
      title: "Reforcar vocabulario em contexto",
      description:
        "Revise flashcards, cognatos e falsos cognatos e confirme o sentido das palavras dentro de frases completas.",
      href: "/flashcards",
    });
  }

  if (actions.length === 0) {
    actions.push({
      area: "general",
      title: "Consolidar a reta final",
      description:
        "Revise as questoes erradas, mantenha uma rotina curta e repita o intensivo apenas depois de corrigir as lacunas.",
      href: "/dashboard",
    });
  }

  return actions;
}
