import { intensiveSimulationTemplateIds } from "@/lib/simulations/intensive-pgm";
import type { SimulationTemplateAccess } from "@/lib/simulations/catalog";

export type ReviewFinalSectionCard = {
  title: string;
  description: string;
  badge?: string;
};

export type ReviewFinalSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: ReviewFinalSectionCard[];
};

export type ReviewFinalSimulationLink = {
  key:
    | "objective-english"
    | "objective-spanish"
    | "subjective-english"
    | "subjective-spanish"
    | "others";
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  tone: "premium" | "success" | "info";
};

function findTemplateHref(
  templates: SimulationTemplateAccess[],
  editorialId: string,
) {
  const template = templates.find((item) => item.editorial_id === editorialId);
  return template ? `/simulados/${template.id}` : "/simulados";
}

export function buildReviewFinalSimulationLinks(
  templates: SimulationTemplateAccess[],
): ReviewFinalSimulationLink[] {
  return [
    {
      key: "objective-english",
      title: "Simulado Final Objetivo de Ingles",
      description:
        "Treino intensivo para revisar leitura, vocabulario, gramatica funcional e tomada de decisao sob tempo.",
      href: findTemplateHref(templates, intensiveSimulationTemplateIds.english),
      ctaLabel: "Abrir objetivo de Ingles",
      tone: "premium",
    },
    {
      key: "objective-spanish",
      title: "Simulado Final Objetivo de Espanhol",
      description:
        "Treino intensivo para revisar compreensao leitora, vocabulario, conectivos e gramatica essencial.",
      href: findTemplateHref(templates, intensiveSimulationTemplateIds.spanish),
      ctaLabel: "Abrir objetivo de Espanhol",
      tone: "premium",
    },
    {
      key: "subjective-english",
      title: "Simulado Final Subjetivo de Ingles",
      description:
        "Use o subjetivo oficial para treinar clareza, coesao, vocabulario e limite de palavras antes da prova.",
      href: "/simulados/subjetivo-oficial?idioma=english",
      ctaLabel: "Abrir subjetivo de Ingles",
      tone: "success",
    },
    {
      key: "subjective-spanish",
      title: "Simulado Final Subjetivo de Espanhol",
      description:
        "Treine respostas mais claras e coerentes em espanhol, com foco em estrutura e naturalidade.",
      href: "/simulados/subjetivo-oficial?idioma=spanish",
      ctaLabel: "Abrir subjetivo de Espanhol",
      tone: "success",
    },
    {
      key: "others",
      title: "Outros simulados disponiveis",
      description:
        "Explore o restante do banco para completar a reta final com mais tentativas, historico e diagnostico.",
      href: "/simulados",
      ctaLabel: "Ver todos os simulados",
      tone: "info",
    },
  ];
}

export const reviewFinalSections: ReviewFinalSection[] = [
  {
    id: "comece-por-aqui",
    eyebrow: "Comece por aqui",
    title: "Ultimo passo antes da prova",
    description:
      "Use esta central para organizar sua preparacao final sem dispersar energia no que tem menor impacto agora.",
    cards: [
      {
        title: "Organize sua reta final",
        description:
          "Defina um bloco curto para revisar conteudos prioritarios, um bloco para simulados e um bloco leve para descanso e recuperacao.",
        badge: "Planejamento",
      },
      {
        title: "Revise os pontos mais importantes",
        description:
          "Concentre sua atencao em leitura, vocabulario, gramatica funcional, conectivos e erros recorrentes nas suas tentativas.",
        badge: "Prioridade",
      },
      {
        title: "Chegue mais confiante no dia da prova",
        description:
          "A meta agora nao e estudar tudo de novo, e sim consolidar o que mais merece atencao e reduzir falhas evitaveis.",
        badge: "Confianca",
      },
    ],
  },
  {
    id: "assuntos-prioritarios",
    eyebrow: "Assuntos prioritarios",
    title: "O que merece mais atencao nesta revisao",
    description:
      "Esses blocos concentram conteudos que costumam exigir mais controle do aluno na reta final.",
    cards: [
      {
        title: "Ingles",
        description:
          "Revise leitura guiada, vocabulario em contexto, uso de conectivos e estruturas verbais mais frequentes.",
        badge: "Idioma",
      },
      {
        title: "Espanhol",
        description:
          "Foque em compreensao leitora, falsos cognatos, conectores e constrastes de tempo verbal em contexto.",
        badge: "Idioma",
      },
      {
        title: "Interpretacao de texto",
        description:
          "Treine ideia principal, inferencia, localizacao de evidencia e leitura atenta de alternativas parecidas.",
        badge: "Leitura",
      },
      {
        title: "Gramatica",
        description:
          "Priorize usos funcionais: concordancia, pronomes, preposicoes, artigos, negacao e estrutura frasal.",
        badge: "Base",
      },
      {
        title: "Vocabulario",
        description:
          "Revise palavras de alta recorrencia em contexto, expressoes e pistas semanticas que ajudam na eliminacao.",
        badge: "Contexto",
      },
      {
        title: "Falsos cognatos",
        description:
          "Passe por palavras que parecem familiares, mas mudam o sentido da alternativa quando lidas sem cuidado.",
        badge: "Atencao",
      },
      {
        title: "Conectivos",
        description:
          "Revise contraste, causa, consequencia, condicao, adicao e conclusao para nao perder coerencia textual.",
        badge: "Coesao",
      },
      {
        title: "Tempos verbais",
        description:
          "Observe relacao entre tempo, contexto e intencao comunicativa em vez de decorar regras isoladas.",
        badge: "Uso real",
      },
    ],
  },
  {
    id: "estrategia",
    eyebrow: "Execucao",
    title: "Evite erros comuns e revise com estrategia",
    description:
      "A melhor reta final reduz ansiedade operacional e aumenta consistencia na prova.",
    cards: [
      {
        title: "Observacoes importantes",
        description:
          "Nao troque uma revisao objetiva por excesso de teoria. Vale mais consolidar do que abrir muitas frentes novas agora.",
        badge: "Foco",
      },
      {
        title: "Dicas estrategicas",
        description:
          "Leia primeiro o comando, identifique a habilidade exigida e use eliminacao ativa quando duas alternativas parecerem proximas.",
        badge: "Estrategia",
      },
      {
        title: "Erros comuns na prova",
        description:
          "Responder por impulso, ignorar conectivos, confundir cognatos e mudar resposta sem evidencia costumam custar pontos.",
        badge: "Evite",
      },
    ],
  },
  {
    id: "entrevista",
    eyebrow: "Entrevista",
    title: "Preparacao para entrevista",
    description:
      "A reta final tambem pede clareza para falar sobre voce, seus objetivos e sua maturidade no programa.",
    cards: [
      {
        title: "Como responder melhor",
        description:
          "Prefira respostas objetivas, honestas e organizadas em contexto, acao e impacto. Mostre motivacao com clareza e sem exagero.",
        badge: "Resposta",
      },
      {
        title: "O que evitar na entrevista",
        description:
          "Nao memorize falas artificiais, nao responda em blocos longos e nao use argumentos vagos sem exemplos concretos.",
        badge: "Evite",
      },
      {
        title: "Postura final",
        description:
          "Escute com calma, confirme a pergunta se precisar e mantenha um tom seguro, respeitoso e natural.",
        badge: "Postura",
      },
    ],
  },
  {
    id: "checklist",
    eyebrow: "Fechamento",
    title: "Checklist final da prova",
    description:
      "Feche a preparacao com uma revisao simples e repetivel para nao depender de memoria improvisada no ultimo dia.",
    cards: [
      {
        title: "Checklist final da prova",
        description:
          "Revise os assuntos prioritarios, confirme seus simulados finais, preserve sono e chegue com estrategia definida.",
        badge: "Checklist",
      },
      {
        title: "Ultimos lembretes",
        description:
          "Nao tente compensar semanas de estudo em uma noite. Entre na prova buscando clareza, leitura cuidadosa e bom gerenciamento de tempo.",
        badge: "Reta final",
      },
    ],
  },
];
