export type OnboardingLanguage = "english" | "spanish";
export type OnboardingSchoolYear = "first" | "second" | "third";
export type OnboardingStudyTime = "15m" | "30m" | "1h" | "2h_plus";
export type OnboardingMainGoal =
  | "improve_english"
  | "improve_spanish"
  | "pass_exam"
  | "improve_writing"
  | "improve_interview";

export type OnboardingInput = {
  idioma: OnboardingLanguage;
  anoEscolar: OnboardingSchoolYear;
  tempoDisponivel: OnboardingStudyTime;
  jaParticipouPgm: boolean;
  objetivoPrincipal: OnboardingMainGoal;
};

export type PlanContentTarget = {
  title: string;
  href: string;
  language?: OnboardingLanguage | "mixed" | "portuguese" | "psychosocial";
};

export type ApprovalPlanTask = {
  title: string;
  href: string;
  type: "diagnostic" | "path" | "flashcards" | "simulation" | "subjective" | "interview";
};

export type ApprovalPlanWeek = {
  week: number;
  title: string;
  focus: string;
  tasks: ApprovalPlanTask[];
};

export type DailyMissionTask = {
  id: "questions" | "flashcards" | "subjective" | "lesson";
  title: string;
  description: string;
  href: string;
  target: number;
  progress: number;
  completed: boolean;
};

export type MissionProgressInput = {
  answeredQuestionsToday: number;
  reviewedFlashcardsToday: number;
  subjectiveSubmittedToday: number;
  completedLessonsToday: number;
  preferredLessonHref: string;
};

export type PreparationComponent = {
  id: "paths" | "simulations" | "subjective" | "general";
  title: string;
  completed: number;
  total: number;
  percentage: number;
};

export type NextActionInput = {
  hasPaidAccess: boolean;
  onboardingCompleted: boolean;
  hasDiagnostic: boolean;
  completedSimulations: number;
  subjectiveSubmitted: number;
  weakRecommendation?: { title: string; href: string } | null;
  completedPaths: number;
};

export type NextAction = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

const dailyTargetsByTime: Record<
  OnboardingStudyTime,
  { questions: number; flashcards: number }
> = {
  "15m": { questions: 5, flashcards: 5 },
  "30m": { questions: 10, flashcards: 10 },
  "1h": { questions: 15, flashcards: 15 },
  "2h_plus": { questions: 20, flashcards: 20 },
};

export const onboardingLabels = {
  idioma: {
    english: "Inglês",
    spanish: "Espanhol",
  },
  anoEscolar: {
    first: "1º ano",
    second: "2º ano",
    third: "3º ano",
  },
  tempoDisponivel: {
    "15m": "15 minutos",
    "30m": "30 minutos",
    "1h": "1 hora",
    "2h_plus": "2 horas ou mais",
  },
  objetivoPrincipal: {
    improve_english: "Melhorar inglês",
    improve_spanish: "Melhorar espanhol",
    pass_exam: "Passar na prova",
    improve_writing: "Melhorar escrita",
    improve_interview: "Melhorar entrevista psicossocial",
  },
} as const;

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(Math.round(value), 0), 100);
}

function completionPercentage(completed: number, total: number) {
  if (!Number.isFinite(total) || total <= 0) return 0;
  return clampPercentage((Math.max(completed, 0) / total) * 100);
}

function firstMatchingPath(
  paths: PlanContentTarget[],
  input: OnboardingInput,
) {
  const objectiveText = onboardingLabels.objetivoPrincipal[
    input.objetivoPrincipal
  ].toLowerCase();
  const languagePath = paths.find((path) => path.language === input.idioma);
  const objectivePath = paths.find((path) =>
    path.title.toLowerCase().includes(objectiveText.split(" ").at(-1) ?? ""),
  );

  return objectivePath ?? languagePath ?? paths[0] ?? { title: "Trilhas", href: "/trilhas" };
}

export function buildAutomaticApprovalPlan(
  input: OnboardingInput,
  paths: PlanContentTarget[],
): ApprovalPlanWeek[] {
  const preferredPath = firstMatchingPath(paths, input);
  const languageLabel = onboardingLabels.idioma[input.idioma];
  const needsWritingFocus = input.objetivoPrincipal === "improve_writing";
  const needsInterviewFocus = input.objetivoPrincipal === "improve_interview";
  const repeatedCandidate = input.jaParticipouPgm;

  return [
    {
      week: 1,
      title: "Semana 1",
      focus: repeatedCandidate
        ? "Recalibrar diagnóstico e corrigir lacunas anteriores."
        : "Criar base inicial e medir o ponto de partida.",
      tasks: [
        {
          title: "Fazer diagnóstico inicial",
          href: "/diagnostico",
          type: "diagnostic",
        },
        {
          title: `Concluir a trilha recomendada: ${preferredPath.title}`,
          href: preferredPath.href,
          type: "path",
        },
        {
          title: `Revisar flashcards de ${languageLabel}`,
          href: "/flashcards",
          type: "flashcards",
        },
      ],
    },
    {
      week: 2,
      title: "Semana 2",
      focus: "Entrar em ritmo de prova e iniciar produção escrita.",
      tasks: [
        {
          title: "Realizar o Simulado Oficial PGM",
          href: "/simulados",
          type: "simulation",
        },
        {
          title: needsWritingFocus
            ? "Fazer o Simulado Subjetivo Oficial"
            : "Enviar a primeira atividade subjetiva",
          href: "/simulados/subjetivo-oficial",
          type: "subjective",
        },
      ],
    },
    {
      week: 3,
      title: "Semana 3",
      focus: "Ajustar pontos fracos com base no desempenho real.",
      tasks: [
        {
          title: `Reforçar ${languageLabel} com trilhas e materiais`,
          href: preferredPath.href,
          type: "path",
        },
        {
          title: "Refazer treino objetivo após revisão",
          href: "/simulados",
          type: "simulation",
        },
      ],
    },
    {
      week: 4,
      title: "Semana 4",
      focus: needsInterviewFocus
        ? "Consolidar prova e entrevista psicossocial."
        : "Consolidar prova, escrita e confiança para entrevista.",
      tasks: [
        {
          title: "Treinar entrevista psicossocial",
          href: "/entrevista",
          type: "interview",
        },
        {
          title: "Revisar feedbacks e pendências",
          href: "/subjetivas/minhas-respostas",
          type: "subjective",
        },
      ],
    },
  ];
}

export function buildDailyMission(
  input: OnboardingInput | null,
  progress: MissionProgressInput,
): { tasks: DailyMissionTask[]; percentage: number } {
  const targets = dailyTargetsByTime[input?.tempoDisponivel ?? "30m"];
  const tasks: DailyMissionTask[] = [
    {
      id: "questions",
      title: `Resolver ${targets.questions} questões`,
      description: "Treino objetivo baseado em tentativas concluídas hoje.",
      href: "/simulados",
      target: targets.questions,
      progress: Math.min(progress.answeredQuestionsToday, targets.questions),
      completed: progress.answeredQuestionsToday >= targets.questions,
    },
    {
      id: "flashcards",
      title: `Revisar ${targets.flashcards} flashcards`,
      description: "Fixação de vocabulário e conceitos por revisão ativa.",
      href: "/flashcards",
      target: targets.flashcards,
      progress: Math.min(progress.reviewedFlashcardsToday, targets.flashcards),
      completed: progress.reviewedFlashcardsToday >= targets.flashcards,
    },
    {
      id: "subjective",
      title: "Fazer 1 atividade subjetiva",
      description: "Produção escrita dentro do limite oficial de palavras.",
      href: "/simulados/subjetivo-oficial",
      target: 1,
      progress: Math.min(progress.subjectiveSubmittedToday, 1),
      completed: progress.subjectiveSubmittedToday >= 1,
    },
    {
      id: "lesson",
      title: "Concluir 1 aula recomendada",
      description: "Avanço real registrado em materiais ou trilhas.",
      href: progress.preferredLessonHref,
      target: 1,
      progress: Math.min(progress.completedLessonsToday, 1),
      completed: progress.completedLessonsToday >= 1,
    },
  ];
  const percentage = clampPercentage(
    tasks.reduce(
      (sum, task) => sum + completionPercentage(task.progress, task.target),
      0,
    ) / tasks.length,
  );

  return { tasks, percentage };
}

export function calculatePreparationProgress(input: {
  completedPaths: number;
  totalPaths: number;
  completedSimulationTemplates: number;
  totalSimulationTemplates: number;
  subjectiveSubmitted: number;
  targetSubjectiveAnswers: number;
  completedProgressItems: number;
  totalProgressItems: number;
}) {
  const components: PreparationComponent[] = [
    {
      id: "paths",
      title: "Trilhas concluídas",
      completed: input.completedPaths,
      total: input.totalPaths,
      percentage: completionPercentage(input.completedPaths, input.totalPaths),
    },
    {
      id: "simulations",
      title: "Simulados realizados",
      completed: input.completedSimulationTemplates,
      total: input.totalSimulationTemplates,
      percentage: completionPercentage(
        input.completedSimulationTemplates,
        input.totalSimulationTemplates,
      ),
    },
    {
      id: "subjective",
      title: "Atividades subjetivas",
      completed: input.subjectiveSubmitted,
      total: input.targetSubjectiveAnswers,
      percentage: completionPercentage(
        input.subjectiveSubmitted,
        input.targetSubjectiveAnswers,
      ),
    },
    {
      id: "general",
      title: "Progresso geral",
      completed: input.completedProgressItems,
      total: input.totalProgressItems,
      percentage: completionPercentage(
        input.completedProgressItems,
        input.totalProgressItems,
      ),
    },
  ];
  const availableComponents = components.filter((component) => component.total > 0);
  const percentage =
    availableComponents.length === 0
      ? 0
      : clampPercentage(
          availableComponents.reduce(
            (sum, component) => sum + component.percentage,
            0,
          ) / availableComponents.length,
        );

  return { percentage, components };
}

export function chooseNextAction(input: NextActionInput): NextAction {
  if (!input.hasPaidAccess) {
    return {
      title: "Ativar acesso premium",
      description: "Libere simulados, trilhas, subjetivas e painel de missão.",
      href: "/planos",
      cta: "Ver planos",
    };
  }

  if (!input.onboardingCompleted) {
    return {
      title: "Concluir onboarding premium",
      description: "Personalize idioma, tempo disponível e objetivo principal.",
      href: "/onboarding",
      cta: "Começar onboarding",
    };
  }

  if (!input.hasDiagnostic) {
    return {
      title: "Fazer diagnóstico inicial",
      description: "Defina seu ponto de partida antes de seguir o plano.",
      href: "/diagnostico",
      cta: "Fazer diagnóstico",
    };
  }

  if (input.completedSimulations === 0) {
    return {
      title: "Realizar o Simulado Oficial PGM",
      description: "Gere seu primeiro relatório por categoria.",
      href: "/simulados",
      cta: "Abrir simulados",
    };
  }

  if (input.subjectiveSubmitted === 0) {
    return {
      title: "Enviar a primeira subjetiva oficial",
      description: "Treine escrita dentro do limite de 90 a 150 palavras.",
      href: "/simulados/subjetivo-oficial",
      cta: "Fazer subjetiva",
    };
  }

  if (input.weakRecommendation) {
    return {
      title: input.weakRecommendation.title,
      description: "Recomendação gerada por desempenho real nos analytics.",
      href: input.weakRecommendation.href,
      cta: "Estudar agora",
    };
  }

  if (input.completedPaths === 0) {
    return {
      title: "Concluir a primeira trilha",
      description: "Feche uma sequência completa de aprendizagem.",
      href: "/trilhas",
      cta: "Abrir trilhas",
    };
  }

  return {
    title: "Revisar analytics e manter ritmo",
    description: "Use os dados recentes para escolher o próximo reforço.",
    href: "/analytics",
    cta: "Ver analytics",
  };
}
