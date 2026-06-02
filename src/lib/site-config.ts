export const siteConfig = {
  name: "PGM Academy",
  price: "R$ 29,90",
  paymentModel: "Pagamento único",
  disclaimer:
    "Plataforma independente de preparação. Não possui vínculo oficial com o Governo de Pernambuco.",
  editalUrl:
    "https://portal.educacao.pe.gov.br/wp-content/uploads/2026/05/0d68cd50-48a7-492c-88f7-0c7b9af530c0.pdf",
};

export const navigationItems = [
  { label: "Diagnóstico", href: "#diagnostico" },
  { label: "Trilha", href: "#trilha" },
  { label: "IA", href: "#ia" },
  { label: "Premium", href: "#premium" },
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
    value: "3 niveis",
    detail: "Elegivel, parcialmente elegivel ou nao elegivel.",
  },
];

export const approvalSteps = [
  "Verificação dos requisitos",
  "Prova objetiva",
  "Prova subjetiva",
  "Entrevista psicossocial",
];

export const platformModules = [
  {
    title: "Diagnóstico de elegibilidade",
    description:
      "Coleta idade, série, frequência e médias escolares para orientar o estudante com base no edital informado.",
  },
  {
    title: "Plano de aprovação",
    description:
      "Transforma o processo seletivo em uma trilha visível, com etapas e progresso do aluno.",
  },
  {
    title: "Simulados inteligentes",
    description:
      "Estrutura preparada para banco de questões, histórico de desempenho e ranking pessoal.",
  },
  {
    title: "Correção com IA",
    description:
      "Arquitetura pronta para avaliar respostas escritas em inglês e espanhol pelo backend.",
  },
  {
    title: "Mentor IA",
    description:
      "Base preparada para um chatbot especializado em edital, intercâmbio e processo seletivo.",
  },
  {
    title: "Painel administrativo",
    description:
      "Fundação planejada para conteúdos, simulados, usuários, métricas e pagamentos.",
  },
];

export const architecturePillars = [
  "Dados isolados por aluno",
  "Acesso premium controlado",
  "Pagamento seguro via Asaas",
  "IA protegida no backend",
  "Histórico e auditoria planejados",
  "Infraestrutura pronta para escala",
];
