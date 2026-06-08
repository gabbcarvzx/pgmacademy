export type EditorialLanguage =
  | "english"
  | "spanish"
  | "portuguese"
  | "mixed"
  | "psychosocial";

export type EditorialCategorySlug =
  | "english"
  | "spanish"
  | "pgm-selection-process"
  | "international-life"
  | "international-writing"
  | "psychosocial-training";

export type EditorialDifficultyCode =
  | "level_1_foundations"
  | "level_2_intermediate"
  | "level_3_advanced"
  | "level_4_competitive_pgm";

export type EditorialCategory = {
  slug: EditorialCategorySlug;
  title: string;
  language: EditorialLanguage;
  description: string;
  subcategories: {
    slug: string;
    title: string;
  }[];
};

export type EditorialCompetency = {
  code: string;
  title: string;
  description: string;
  categorySlug: EditorialCategorySlug;
  subcategorySlug: string;
  language: EditorialLanguage;
};

export type EditorialDifficultyLevel = {
  level: 1 | 2 | 3 | 4;
  code: EditorialDifficultyCode;
  title: string;
  legacyDifficulty: "beginner" | "intermediate" | "advanced";
  criteria: string[];
};

export const editorialVersion = {
  code: "pgm-2026-v1",
  title: "PGM Academy 2026 - Matriz Editorial Oficial",
  editalYear: 2026,
  status: "active",
  sourceReference: "Edital PGM 2026 e base oficial centralizada da Sprint 1",
} as const;

export const editorialCategories: EditorialCategory[] = [
  {
    slug: "english",
    title: "Inglês",
    language: "english",
    description: "Competências de leitura, vocabulário, gramática e comunicação em inglês.",
    subcategories: [
      { slug: "reading-comprehension", title: "Reading Comprehension" },
      { slug: "grammar", title: "Grammar" },
      { slug: "vocabulary", title: "Vocabulary" },
      { slug: "communication", title: "Communication" },
    ],
  },
  {
    slug: "spanish",
    title: "Espanhol",
    language: "spanish",
    description: "Competências de leitura, vocabulário, gramática e comunicação em espanhol.",
    subcategories: [
      { slug: "comprension-lectora", title: "Comprensión Lectora" },
      { slug: "gramatica", title: "Gramática" },
      { slug: "vocabulario", title: "Vocabulario" },
      { slug: "comunicacion", title: "Comunicación" },
    ],
  },
  {
    slug: "pgm-selection-process",
    title: "Processo Seletivo PGM",
    language: "portuguese",
    description: "Conhecimento institucional, elegibilidade, cronograma e documentação.",
    subcategories: [
      { slug: "edital", title: "Edital" },
      { slug: "eligibilidade", title: "Elegibilidade" },
      { slug: "cronograma", title: "Cronograma" },
      { slug: "documentacao", title: "Documentação" },
    ],
  },
  {
    slug: "international-life",
    title: "Vida Internacional",
    language: "mixed",
    description: "Preparação cultural, escolar e prática para vivência internacional.",
    subcategories: [
      { slug: "cultura", title: "Cultura" },
      { slug: "host-family", title: "Host Family" },
      { slug: "escola", title: "Escola" },
      { slug: "adaptacao-cultural", title: "Adaptação Cultural" },
      { slug: "intercambio", title: "Intercâmbio" },
    ],
  },
  {
    slug: "international-writing",
    title: "Escrita Internacional",
    language: "mixed",
    description: "Produção textual curta, clara, coesa e adequada ao idioma.",
    subcategories: [
      { slug: "estrutura", title: "Estrutura" },
      { slug: "coesao", title: "Coesão" },
      { slug: "clareza", title: "Clareza" },
      { slug: "gramatica", title: "Gramática" },
      { slug: "vocabulario", title: "Vocabulário" },
    ],
  },
  {
    slug: "psychosocial-training",
    title: "Treino Psicossocial",
    language: "psychosocial",
    description: "Competências comportamentais para entrevista, adaptação e convivência.",
    subcategories: [
      { slug: "comunicacao", title: "Comunicação" },
      { slug: "adaptabilidade", title: "Adaptabilidade" },
      { slug: "autonomia", title: "Autonomia" },
      { slug: "responsabilidade", title: "Responsabilidade" },
      { slug: "diversidade-cultural", title: "Diversidade Cultural" },
      { slug: "resolucao-de-conflitos", title: "Resolução de Conflitos" },
    ],
  },
];

export const editorialCompetencies: EditorialCompetency[] = [
  {
    code: "eng-identify-main-idea",
    title: "Identificar ideia principal",
    description: "Reconhecer o tema central e a intenção comunicativa de textos em inglês.",
    categorySlug: "english",
    subcategorySlug: "reading-comprehension",
    language: "english",
  },
  {
    code: "eng-infer-implicit-information",
    title: "Inferir informação implícita",
    description: "Deduzir sentido a partir de contexto, pistas textuais e relações lógicas.",
    categorySlug: "english",
    subcategorySlug: "reading-comprehension",
    language: "english",
  },
  {
    code: "eng-contextual-vocabulary",
    title: "Reconhecer vocabulário contextual",
    description: "Interpretar palavras e expressões em inglês pelo uso no enunciado.",
    categorySlug: "english",
    subcategorySlug: "vocabulary",
    language: "english",
  },
  {
    code: "eng-apply-grammar-rule",
    title: "Aplicar regra gramatical",
    description: "Selecionar estruturas gramaticais corretas para leitura e resposta objetiva.",
    categorySlug: "english",
    subcategorySlug: "grammar",
    language: "english",
  },
  {
    code: "eng-everyday-communication",
    title: "Comunicar-se em situações cotidianas",
    description: "Resolver situações simples de comunicação escolar, familiar e social.",
    categorySlug: "english",
    subcategorySlug: "communication",
    language: "english",
  },
  {
    code: "spa-interpret-texts",
    title: "Interpretar textos",
    description: "Compreender textos curtos e médios em espanhol com foco em sentido global.",
    categorySlug: "spanish",
    subcategorySlug: "comprension-lectora",
    language: "spanish",
  },
  {
    code: "spa-apply-grammar",
    title: "Aplicar gramática",
    description: "Usar regras gramaticais recorrentes do espanhol em questões objetivas.",
    categorySlug: "spanish",
    subcategorySlug: "gramatica",
    language: "spanish",
  },
  {
    code: "spa-recognize-false-cognates",
    title: "Reconhecer falsos cognatos",
    description: "Evitar interpretações erradas causadas por semelhança com o português.",
    categorySlug: "spanish",
    subcategorySlug: "vocabulario",
    language: "spanish",
  },
  {
    code: "spa-everyday-communication",
    title: "Comunicar-se em situações cotidianas",
    description: "Responder a situações práticas em espanhol com clareza e adequação.",
    categorySlug: "spanish",
    subcategorySlug: "comunicacion",
    language: "spanish",
  },
  {
    code: "pgm-understand-edital",
    title: "Interpretar regras do edital",
    description: "Identificar requisitos, etapas e limites do processo seletivo vigente.",
    categorySlug: "pgm-selection-process",
    subcategorySlug: "edital",
    language: "portuguese",
  },
  {
    code: "pgm-check-eligibility",
    title: "Avaliar elegibilidade",
    description: "Relacionar critérios oficiais à situação acadêmica do estudante.",
    categorySlug: "pgm-selection-process",
    subcategorySlug: "eligibilidade",
    language: "portuguese",
  },
  {
    code: "pgm-organize-documentation",
    title: "Organizar documentação",
    description: "Reconhecer documentos e cuidados necessários nas etapas do programa.",
    categorySlug: "pgm-selection-process",
    subcategorySlug: "documentacao",
    language: "portuguese",
  },
  {
    code: "life-understand-cultural-differences",
    title: "Compreender diferenças culturais",
    description: "Interpretar situações de convivência internacional com respeito e contexto.",
    categorySlug: "international-life",
    subcategorySlug: "cultura",
    language: "mixed",
  },
  {
    code: "life-host-family-rules",
    title: "Respeitar regras de host family",
    description: "Reconhecer responsabilidades, limites e comunicação dentro da casa anfitriã.",
    categorySlug: "international-life",
    subcategorySlug: "host-family",
    language: "mixed",
  },
  {
    code: "life-school-routine",
    title: "Adaptar-se à escola no exterior",
    description: "Entender rotina, participação e responsabilidades em ambiente escolar internacional.",
    categorySlug: "international-life",
    subcategorySlug: "escola",
    language: "mixed",
  },
  {
    code: "writing-structure-answer",
    title: "Estruturar resposta curta",
    description: "Organizar resposta com início, desenvolvimento e fechamento dentro do limite.",
    categorySlug: "international-writing",
    subcategorySlug: "estrutura",
    language: "mixed",
  },
  {
    code: "writing-use-cohesion",
    title: "Usar coesão",
    description: "Conectar ideias de forma lógica usando marcadores adequados.",
    categorySlug: "international-writing",
    subcategorySlug: "coesao",
    language: "mixed",
  },
  {
    code: "writing-keep-clarity",
    title: "Manter clareza",
    description: "Escrever resposta objetiva, compreensível e sem excesso de palavras.",
    categorySlug: "international-writing",
    subcategorySlug: "clareza",
    language: "mixed",
  },
  {
    code: "psy-demonstrate-autonomy",
    title: "Demonstrar autonomia",
    description: "Apresentar decisões responsáveis e capacidade de agir com independência.",
    categorySlug: "psychosocial-training",
    subcategorySlug: "autonomia",
    language: "psychosocial",
  },
  {
    code: "psy-demonstrate-maturity",
    title: "Demonstrar maturidade",
    description: "Responder com equilíbrio, responsabilidade e consciência das consequências.",
    categorySlug: "psychosocial-training",
    subcategorySlug: "responsabilidade",
    language: "psychosocial",
  },
  {
    code: "psy-resolve-conflicts",
    title: "Resolver conflitos",
    description: "Propor soluções respeitosas para situações de convivência e desacordo.",
    categorySlug: "psychosocial-training",
    subcategorySlug: "resolucao-de-conflitos",
    language: "psychosocial",
  },
  {
    code: "psy-communicate-adequately",
    title: "Comunicar-se adequadamente",
    description: "Expressar ideias, limites e necessidades com clareza e respeito.",
    categorySlug: "psychosocial-training",
    subcategorySlug: "comunicacao",
    language: "psychosocial",
  },
  {
    code: "psy-respect-cultural-diversity",
    title: "Respeitar diversidade cultural",
    description: "Lidar com diferenças culturais sem preconceito e com abertura ao aprendizado.",
    categorySlug: "psychosocial-training",
    subcategorySlug: "diversidade-cultural",
    language: "psychosocial",
  },
];

export const editorialDifficultyLevels: EditorialDifficultyLevel[] = [
  {
    level: 1,
    code: "level_1_foundations",
    title: "Fundamentos",
    legacyDifficulty: "beginner",
    criteria: [
      "Cobra reconhecimento direto de conceito, vocabulário ou regra.",
      "Usa enunciado curto e sem distrações complexas.",
      "Serve para diagnóstico inicial e fixação.",
    ],
  },
  {
    level: 2,
    code: "level_2_intermediate",
    title: "Intermediário",
    legacyDifficulty: "intermediate",
    criteria: [
      "Exige aplicação de conceito em contexto simples.",
      "Pode combinar leitura e regra gramatical.",
      "Possui distratores plausíveis, mas controlados.",
    ],
  },
  {
    level: 3,
    code: "level_3_advanced",
    title: "Avançado",
    legacyDifficulty: "advanced",
    criteria: [
      "Exige inferência, comparação ou síntese de informações.",
      "Usa textos ou situações com mais nuances.",
      "A resposta correta depende de domínio e atenção ao detalhe.",
    ],
  },
  {
    level: 4,
    code: "level_4_competitive_pgm",
    title: "Competitivo PGM",
    legacyDifficulty: "advanced",
    criteria: [
      "Simula pressão e nível de prova competitiva.",
      "Combina competência linguística, interpretação e tomada de decisão.",
      "Deve aparecer em menor volume e com explicação robusta.",
    ],
  },
];

export function getEditorialCategory(slug: EditorialCategorySlug) {
  return editorialCategories.find((category) => category.slug === slug) ?? null;
}
