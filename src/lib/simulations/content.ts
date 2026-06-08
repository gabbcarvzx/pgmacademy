import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Brain,
  ClipboardList,
  History,
  Layers3,
  LibraryBig,
  LockKeyhole,
  Timer,
} from "lucide-react";

export type SimulationMode = {
  title: string;
  description: string;
  access: "free" | "premium";
  Icon: LucideIcon;
};

export type LearningFoundationItem = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export const simulationModes: SimulationMode[] = [
  {
    title: "Simulado Rápido",
    description:
      "Treinos curtos para aquecimento antes do modelo oficial de 30 questões.",
    access: "free",
    Icon: Timer,
  },
  {
    title: "Simulado Objetivo PGM",
    description:
      "Experiência premium alinhada à prova objetiva do edital 2026, com histórico e correção completa.",
    access: "premium",
    Icon: ClipboardList,
  },
  {
    title: "Histórico",
    description:
      "Registro de tentativas, pontuação, percentual e status por aluno.",
    access: "free",
    Icon: History,
  },
  {
    title: "Estatísticas",
    description:
      "Base para taxa de acerto, evolução e categorias fortes ou fracas antes da prova.",
    access: "premium",
    Icon: BarChart3,
  },
];

export const learningFoundationItems: LearningFoundationItem[] = [
  {
    title: "Banco de Questões",
    description: "Estrutura para objetivas, subjetivas e psicossociais.",
    Icon: LibraryBig,
  },
  {
    title: "Materiais de Estudo",
    description: "Base preparada para conteúdos em Markdown por categoria.",
    Icon: Layers3,
  },
  {
    title: "Flashcards",
    description: "Modelo pronto para revisão rápida por dificuldade e idioma.",
    Icon: Brain,
  },
  {
    title: "Controle Premium",
    description: "Acesso completo liberado por profiles.access_status = paid.",
    Icon: LockKeyhole,
  },
];

export const seededCategoryGroups = [
  {
    title: "Inglês",
    categories: [
      "Reading Comprehension",
      "Vocabulary",
      "Grammar",
      "Verb Tenses",
      "Modal Verbs",
      "Conditionals",
      "Phrasal Verbs",
      "Everyday English",
    ],
  },
  {
    title: "Espanhol",
    categories: [
      "Comprension Lectora",
      "Vocabulário",
      "Gramatica",
      "Verbos",
      "Interpretacion",
    ],
  },
  {
    title: "Entrevista Psicossocial",
    categories: [
      "Autoconhecimento",
      "Lideranca",
      "Trabalho em Equipe",
      "Adaptabilidade",
      "Inteligencia Emocional",
      "Diversidade Cultural",
      "Responsabilidade",
    ],
  },
];
