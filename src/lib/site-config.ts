export const siteConfig = {
  name: "PGM Academy",
  price: "R$ 29,90",
  paymentModel: "Pagamento unico",
  disclaimer:
    "Plataforma independente de preparacao. Consulte sempre o edital vigente e os canais oficiais do Programa Ganhe o Mundo.",
  institutionalNotice:
    "A PGM Academy e uma plataforma independente de preparacao. Nao possui vinculo oficial com o Governo de Pernambuco nem com o Programa Ganhe o Mundo. Consulte sempre os editais e canais oficiais.",
  editalUrl:
    "https://portal.educacao.pe.gov.br/wp-content/uploads/2026/05/0d68cd50-48a7-492c-88f7-0c7b9af530c0.pdf",
};

export const navigationItems = [
  { label: "Inicio", href: "/" },
  { label: "Plataforma", href: "/#plataforma" },
  { label: "Planos", href: "/planos" },
  { label: "Avaliacoes", href: "/avaliacoes" },
  { label: "FAQ", href: "/planos#faq" },
];

export const eligibilitySignals = [
  {
    label: "Frequencia",
    value: "85%+",
    detail: "Sinal critico para elegibilidade no edital.",
  },
  {
    label: "Medias",
    value: "7,0+",
    detail: "Portugues, Matematica e Humanas entram no diagnostico.",
  },
  {
    label: "Status",
    value: "3 niveis",
    detail: "Elegivel, parcialmente elegivel ou nao elegivel.",
  },
];

export const approvalSteps = [
  "Verificacao dos requisitos",
  "Prova objetiva",
  "Prova subjetiva",
  "Entrevista psicossocial",
];

export const platformModules = [
  {
    title: "Diagnostico de elegibilidade",
    description:
      "Ajuda o aluno a entender requisitos, prontidao inicial e proximos passos de preparacao.",
  },
  {
    title: "Central de estudos",
    description:
      "Organiza materiais autorais, categorias, idiomas e dificuldade para estudar com foco.",
  },
  {
    title: "Simulados realistas",
    description:
      "Usa questoes objetivas autorais importadas e correcao automatica protegida.",
  },
  {
    title: "Subjetivas com feedback",
    description:
      "Permite treinar respostas em idiomas com acompanhamento manual dentro do plano premium.",
  },
  {
    title: "Entrevista psicossocial",
    description:
      "Prepara postura, maturidade, responsabilidade e adaptacao cultural com perguntas autorais.",
  },
  {
    title: "Analytics de evolucao",
    description:
      "Transforma desempenho e progresso em metas, diagnosticos e recomendacoes baseadas em regras.",
  },
];

export const architecturePillars = [
  "Dados isolados por aluno",
  "Acesso premium controlado",
  "Pagamento seguro via Asaas",
  "Historico e auditoria planejados",
  "RLS e autorizacao no servidor",
  "Infraestrutura pronta para escala",
];
