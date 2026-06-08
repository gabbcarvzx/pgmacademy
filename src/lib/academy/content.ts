import {
  FileText,
  Globe2,
  GraduationCap,
  Languages,
  PlaneTakeoff,
  ScrollText,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AcademyModuleId =
  | "approval-route"
  | "english"
  | "spanish"
  | "international-writing"
  | "psychosocial"
  | "international-life"
  | "boarding-documents";

export type AcademyContentType =
  | "path"
  | "material"
  | "flashcards"
  | "simulation"
  | "subjective"
  | "psychosocial"
  | "onboarding";

export type AcademyContentItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: AcademyContentType;
  matchKeywords: string[];
};

export type AcademyModuleDefinition = {
  id: AcademyModuleId;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  whyItExists: string;
  outcome: string;
  icon: LucideIcon;
  contents: AcademyContentItem[];
};

const approvalKeywords = [
  "programa",
  "ganhe",
  "mundo",
  "edital",
  "diagnostico",
  "aprovação",
  "aprovacao",
  "elegibilidade",
  "estrategia",
  "requisitos",
];

export const academyModules: AcademyModuleDefinition[] = [
  {
    id: "approval-route",
    order: 1,
    title: "Rota de Aprovação PGM",
    shortTitle: "Rota de Aprovação",
    description: "Base estratégica para entender o processo seletivo e estudar com segurança.",
    whyItExists:
      "Antes de estudar mais, o aluno precisa saber como o PGM funciona, quais etapas importam e como usar o edital sem depender de boatos.",
    outcome: "Sair com estratégia, diagnóstico e rota de estudo clara.",
    icon: ScrollText,
    contents: [
      {
        id: "approval-program",
        title: "Como funciona o Programa Ganhe o Mundo",
        description: "Visão geral independente sobre a preparação para o PGM.",
        href: "/sucesso#edital-pgm",
        type: "material",
        matchKeywords: approvalKeywords,
      },
      {
        id: "approval-steps",
        title: "Etapas do processo seletivo",
        description: "Organize diagnóstico, prova, subjetiva e entrevista.",
        href: "/dashboard",
        type: "onboarding",
        matchKeywords: approvalKeywords,
      },
      {
        id: "approval-diagnostic",
        title: "Critérios de elegibilidade",
        description: "Use o diagnóstico para entender sua situação inicial.",
        href: "/diagnostico",
        type: "material",
        matchKeywords: approvalKeywords,
      },
      {
        id: "approval-strategy",
        title: "Estratégia de preparação",
        description: "Siga o Plano de Aprovação gerado pelo onboarding.",
        href: "/onboarding",
        type: "onboarding",
        matchKeywords: approvalKeywords,
      },
      {
        id: "approval-edital",
        title: "Como usar o edital de forma segura",
        description: "Confirme regras e prazos nos canais oficiais.",
        href: "/sucesso#edital-pgm",
        type: "material",
        matchKeywords: approvalKeywords,
      },
    ],
  },
  {
    id: "english",
    order: 2,
    title: "Inglês para o PGM",
    shortTitle: "Inglês",
    description: "Interpretação, vocabulário, gramática e questões aplicadas.",
    whyItExists:
      "O idioma escolhido precisa virar rotina prática, com leitura, vocabulário e treino objetivo.",
    outcome: "Ganhar consistência em leitura e resposta objetiva em inglês.",
    icon: Languages,
    contents: [
      {
        id: "english-interpretation",
        title: "Interpretação",
        description: "Leitura e compreensão de enunciados em inglês.",
        href: "/trilhas",
        type: "path",
        matchKeywords: ["ingles", "inglês", "english", "interpretacao", "interpretação"],
      },
      {
        id: "english-vocabulary",
        title: "Vocabulário",
        description: "Palavras essenciais para escola, viagem e prova.",
        href: "/flashcards",
        type: "flashcards",
        matchKeywords: ["ingles", "inglês", "english", "vocabulario", "vocabulário"],
      },
      {
        id: "english-grammar",
        title: "Gramática",
        description: "Estruturas recorrentes em questões objetivas.",
        href: "/estudos?idioma=english",
        type: "material",
        matchKeywords: ["ingles", "inglês", "english", "gramatica", "gramática"],
      },
      {
        id: "english-communication",
        title: "Comunicação cotidiana",
        description: "Frases e situações de rotina internacional.",
        href: "/estudos?idioma=english",
        type: "material",
        matchKeywords: ["ingles", "inglês", "english", "comunicacao", "comunicação"],
      },
      {
        id: "english-questions",
        title: "Questões aplicadas",
        description: "Treino objetivo por simulados e questões.",
        href: "/simulados",
        type: "simulation",
        matchKeywords: ["ingles", "inglês", "english", "questoes", "questões", "simulado"],
      },
    ],
  },
  {
    id: "spanish",
    order: 3,
    title: "Espanhol para o PGM",
    shortTitle: "Espanhol",
    description: "Interpretação, vocabulário, gramática e questões aplicadas.",
    whyItExists:
      "O espanhol precisa ser treinado como idioma de prova e também como ferramenta de comunicação internacional.",
    outcome: "Avançar em leitura, vocabulário e respostas objetivas em espanhol.",
    icon: Globe2,
    contents: [
      {
        id: "spanish-interpretation",
        title: "Interpretação",
        description: "Leitura e compreensão de textos em espanhol.",
        href: "/trilhas",
        type: "path",
        matchKeywords: ["espanhol", "spanish", "interpretacao", "interpretação"],
      },
      {
        id: "spanish-vocabulary",
        title: "Vocabulário",
        description: "Palavras úteis para prova e rotina internacional.",
        href: "/flashcards",
        type: "flashcards",
        matchKeywords: ["espanhol", "spanish", "vocabulario", "vocabulário"],
      },
      {
        id: "spanish-grammar",
        title: "Gramática",
        description: "Estruturas fundamentais para interpretação.",
        href: "/estudos?idioma=spanish",
        type: "material",
        matchKeywords: ["espanhol", "spanish", "gramatica", "gramática"],
      },
      {
        id: "spanish-communication",
        title: "Comunicação cotidiana",
        description: "Situações de convivência e adaptação.",
        href: "/estudos?idioma=spanish",
        type: "material",
        matchKeywords: ["espanhol", "spanish", "comunicacao", "comunicação"],
      },
      {
        id: "spanish-questions",
        title: "Questões aplicadas",
        description: "Treino com simulados e revisão de erros.",
        href: "/simulados",
        type: "simulation",
        matchKeywords: ["espanhol", "spanish", "questoes", "questões", "simulado"],
      },
    ],
  },
  {
    id: "international-writing",
    order: 4,
    title: "Escrita Internacional",
    shortTitle: "Escrita",
    description: "Estrutura, coesão, clareza e respostas entre 90 e 150 palavras.",
    whyItExists:
      "A subjetiva exige treino específico: escrever pouco, com clareza e dentro de critérios de rubrica.",
    outcome: "Responder subjetivas com estrutura, vocabulário e coesão.",
    icon: FileText,
    contents: [
      {
        id: "writing-word-limit",
        title: "Como responder de 90 a 150 palavras",
        description: "Controle de extensão sem perder clareza.",
        href: "/simulados/subjetivo-oficial",
        type: "subjective",
        matchKeywords: ["escrita", "subjetiva", "90", "150", "palavras"],
      },
      {
        id: "writing-structure",
        title: "Estrutura ideal de resposta",
        description: "Introdução curta, desenvolvimento e fechamento.",
        href: "/subjetivas",
        type: "subjective",
        matchKeywords: ["escrita", "subjetiva", "estrutura"],
      },
      {
        id: "writing-cohesion",
        title: "Coesão e clareza",
        description: "Conectores e organização de ideias.",
        href: "/subjetivas",
        type: "subjective",
        matchKeywords: ["escrita", "coesao", "coesão", "clareza"],
      },
      {
        id: "writing-mistakes",
        title: "Erros frequentes",
        description: "Evite respostas longas, vagas ou sem progressão.",
        href: "/sucesso#subjetivas",
        type: "subjective",
        matchKeywords: ["escrita", "erros", "subjetiva"],
      },
      {
        id: "writing-practice",
        title: "Treinos subjetivos",
        description: "Envie respostas para criar histórico de prática.",
        href: "/simulados/subjetivo-oficial",
        type: "subjective",
        matchKeywords: ["escrita", "subjetiva", "treino"],
      },
    ],
  },
  {
    id: "psychosocial",
    order: 5,
    title: "Treino Psicossocial",
    shortTitle: "Psicossocial",
    description: "Comunicação, maturidade, autonomia e preparação para entrevista.",
    whyItExists:
      "A entrevista e a convivência internacional exigem clareza emocional, responsabilidade e comunicação madura.",
    outcome: "Responder com maturidade, autonomia e coerência.",
    icon: Users,
    contents: [
      {
        id: "psy-communication",
        title: "Como se comunicar bem",
        description: "Respostas objetivas, maduras e bem organizadas.",
        href: "/entrevista",
        type: "psychosocial",
        matchKeywords: ["psicossocial", "entrevista", "comunicacao", "comunicação"],
      },
      {
        id: "psy-maturity",
        title: "Maturidade e responsabilidade",
        description: "Postura esperada em processos e convivência.",
        href: "/entrevista",
        type: "psychosocial",
        matchKeywords: ["psicossocial", "maturidade", "responsabilidade"],
      },
      {
        id: "psy-autonomy",
        title: "Autonomia",
        description: "Como demonstrar independência com segurança.",
        href: "/entrevista",
        type: "psychosocial",
        matchKeywords: ["psicossocial", "autonomia"],
      },
      {
        id: "psy-coexistence",
        title: "Convivência",
        description: "Respeito, regras e adaptação a novas rotinas.",
        href: "/entrevista",
        type: "psychosocial",
        matchKeywords: ["psicossocial", "convivencia", "convivência"],
      },
      {
        id: "psy-interview",
        title: "Preparação para entrevista",
        description: "Treine respostas antes da etapa real.",
        href: "/entrevista",
        type: "psychosocial",
        matchKeywords: ["psicossocial", "entrevista"],
      },
    ],
  },
  {
    id: "international-life",
    order: 6,
    title: "Vida Internacional",
    shortTitle: "Vida Internacional",
    description: "Host family, escola no exterior, cultura, rotina e adaptação.",
    whyItExists:
      "Preparação internacional não termina na prova; o aluno precisa entender convivência, escola e adaptação cultural.",
    outcome: "Chegar mais preparado para rotina, cultura e convivência.",
    icon: GraduationCap,
    contents: [
      {
        id: "life-host-family",
        title: "Host family",
        description: "Regras de casa, respeito e comunicação.",
        href: "/premium#international-life",
        type: "material",
        matchKeywords: ["host", "family", "familia", "família", "adaptacao", "adaptação"],
      },
      {
        id: "life-school",
        title: "Escola no exterior",
        description: "Rotina acadêmica e participação.",
        href: "/premium#international-life",
        type: "material",
        matchKeywords: ["escola", "exterior", "internacional"],
      },
      {
        id: "life-culture",
        title: "Cultura",
        description: "Diferenças culturais e respeito.",
        href: "/premium#international-life",
        type: "material",
        matchKeywords: ["cultura", "adaptacao", "adaptação"],
      },
      {
        id: "life-routine",
        title: "Rotina",
        description: "Organização de horários, escola e convivência.",
        href: "/premium#international-life",
        type: "material",
        matchKeywords: ["rotina", "vida", "internacional"],
      },
      {
        id: "life-adaptation",
        title: "Adaptação",
        description: "Primeiras semanas, rotina nova e comunicação segura.",
        href: "/premium#international-life",
        type: "material",
        matchKeywords: ["adaptacao", "adaptação", "vida", "internacional"],
      },
      {
        id: "life-culture-shock",
        title: "Choque cultural",
        description: "Como lidar com saudade, estranhamento e mudanças.",
        href: "/premium#international-life",
        type: "material",
        matchKeywords: ["choque", "cultural", "saudade", "adaptacao", "adaptação"],
      },
    ],
  },
  {
    id: "boarding-documents",
    order: 7,
    title: "Embarque e Documentação",
    shortTitle: "Embarque",
    description: "Passaporte, visto, mala, aeroporto, viagem e primeiros dias.",
    whyItExists:
      "Documentos e embarque exigem organização antecipada, responsabilidade familiar e confirmação oficial.",
    outcome: "Saber organizar documentos e chegar ao embarque com menos risco.",
    icon: PlaneTakeoff,
    contents: [
      {
        id: "boarding-passport",
        title: "Passaporte",
        description: "Documento essencial para continuidade da jornada.",
        href: "/premium#boarding-documents",
        type: "material",
        matchKeywords: ["passaporte", "documentacao", "documentação"],
      },
      {
        id: "boarding-visa",
        title: "Visto",
        description: "Etapa consular dependente do destino.",
        href: "/premium#boarding-documents",
        type: "material",
        matchKeywords: ["visto", "documentacao", "documentação"],
      },
      {
        id: "boarding-luggage",
        title: "Mala",
        description: "Organização de bagagem e itens essenciais.",
        href: "/premium#boarding-documents",
        type: "material",
        matchKeywords: ["mala", "bagagem", "viagem"],
      },
      {
        id: "boarding-airport",
        title: "Aeroporto",
        description: "Disciplina de grupo e documentos acessíveis.",
        href: "/premium#boarding-documents",
        type: "material",
        matchKeywords: ["aeroporto", "embarque", "viagem"],
      },
      {
        id: "boarding-trip",
        title: "Viagem",
        description: "Organização, comunicação familiar e disciplina de grupo.",
        href: "/premium#boarding-documents",
        type: "material",
        matchKeywords: ["viagem", "embarque", "grupo"],
      },
      {
        id: "boarding-first-days",
        title: "Primeiros dias",
        description: "Chegada, adaptação inicial e comunicação.",
        href: "/premium#boarding-documents",
        type: "material",
        matchKeywords: ["primeiros dias", "chegada", "adaptacao", "adaptação"],
      },
    ],
  },
];

export const academyJourneyLabels = academyModules.map((module) => module.shortTitle);

export const academyContentTotal = academyModules.reduce(
  (sum, module) => sum + module.contents.length,
  0,
);

export const academyPublishedModuleCount = academyModules.length;

export const academyOverview = {
  title: "Academia PGM",
  description:
    "Programa premium guiado para organizar preparação, idioma, escrita, entrevista, vida internacional e embarque.",
  modules: academyModules.length,
  contents: academyContentTotal,
};

export function normalizeAcademyText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
