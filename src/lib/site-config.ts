import { pgm2026OfficialSnapshot } from "@/lib/official/pgm-2026";

export const siteConfig = {
  name: "PGM Academy",
  price: "R$ 29,90",
  paymentModel: "Pagamento único",
  disclaimer:
    "Plataforma independente de preparação. Consulte sempre o edital vigente e os canais oficiais do Programa Ganhe o Mundo.",
  institutionalNotice: pgm2026OfficialSnapshot.institutionalNotice,
  editalUrl: pgm2026OfficialSnapshot.editalUrl,
  officialNewsUrl: pgm2026OfficialSnapshot.seeNewsUrl,
  officialSelectionUrl: pgm2026OfficialSnapshot.igeducUrl,
};

export const navigationItems = [
  { label: "Início", href: "/" },
  { label: "Plataforma", href: "/#plataforma" },
  { label: "Planos", href: "/planos" },
  { label: "Avaliações", href: "/avaliacoes" },
  { label: "FAQ", href: "/planos#faq" },
];

export const eligibilitySignals = [
  {
    label: "Frequência",
    value: "85%+",
    detail: "Sinal crítico para elegibilidade no edital.",
  },
  {
    label: "Médias",
    value: "7,0+",
    detail: "Português, Matemática e Humanas entram no diagnóstico.",
  },
  {
    label: "Status",
    value: "3 níveis",
    detail: "Elegível, parcialmente elegível ou não elegível.",
  },
];

export const approvalSteps = [
  "Verificação dos requisitos",
  "Prova objetiva: 30 questões",
  "Prova subjetiva: 5 respostas",
  "Entrevista psicossocial telepresencial",
];

export const platformModules = [
  {
    title: "Diagnóstico de elegibilidade",
    description:
      "Ajuda o aluno a entender requisitos, prontidão inicial e próximos passos de preparação.",
  },
  {
    title: "Central de estudos",
    description:
      "Organiza materiais autorais, categorias, idiomas e dificuldade para estudar com foco.",
  },
  {
    title: "Simulados realistas",
    description:
      "Prepara o aluno para a prova objetiva de 30 questões com correção protegida.",
  },
  {
    title: "Subjetivas com feedback",
    description:
      "Treina respostas de 90 a 150 palavras com rubrica linguística e acompanhamento manual.",
  },
  {
    title: "Entrevista psicossocial",
    description:
      "Prepara postura, maturidade, responsabilidade e adaptação cultural com perguntas autorais.",
  },
  {
    title: "Analytics de evolução",
    description:
      "Transforma desempenho e progresso em metas, diagnósticos e recomendações baseadas em regras.",
  },
];

export const architecturePillars = [
  "Dados isolados por aluno",
  "Acesso premium controlado",
  "Pagamento seguro via Asaas",
  "Histórico e auditoria planejados",
  "RLS e autorização no servidor",
  "Infraestrutura pronta para escala",
];
