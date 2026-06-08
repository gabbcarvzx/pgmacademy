export type SuccessArticle = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  href: string;
  tags: string[];
};

export type SuccessFaq = {
  id: string;
  question: string;
  answer: string;
  categorySlug: string;
  tags: string[];
};

export type SuccessCategory = {
  slug: string;
  title: string;
  description: string;
  articles: SuccessArticle[];
  faqs: SuccessFaq[];
};

export type SuccessGuide = {
  id: string;
  title: string;
  description: string;
  href: string;
  steps: string[];
  tags: string[];
};

export type SupportChannel = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  responseNote: string;
};

export type UsefulResource = {
  title: string;
  description: string;
  href: string;
};

export type SuccessSearchItem = {
  id: string;
  type: "artigo" | "pergunta" | "guia" | "recurso";
  title: string;
  description: string;
  href: string;
  categoryTitle: string;
  text: string;
};

function article(
  id: string,
  title: string,
  summary: string,
  body: string[],
  href: string,
  tags: string[],
): SuccessArticle {
  return { id, title, summary, body, href, tags };
}

function faq(
  id: string,
  question: string,
  answer: string,
  categorySlug: string,
  tags: string[],
): SuccessFaq {
  return { id, question, answer, categorySlug, tags };
}

export const successCenterCategories: SuccessCategory[] = [
  {
    slug: "primeiros-passos",
    title: "Primeiros Passos",
    description: "Entrada guiada para entender a plataforma e começar sem fricção.",
    articles: [
      article(
        "como-comecar",
        "Como começar na PGM Academy",
        "Sequência recomendada para o primeiro dia de uso.",
        [
          "Acesse o Painel de Missão para ver sua próxima ação principal.",
          "Se o premium estiver ativo, conclua o onboarding para gerar seu Plano de Aprovação PGM.",
          "Faça o diagnóstico inicial antes de interpretar relatórios avançados.",
          "Use simulados, trilhas e subjetivas como ciclo de estudo semanal.",
        ],
        "/dashboard",
        ["inicio", "dashboard", "missao", "plano"],
      ),
      article(
        "plano-aprovacao",
        "Como seguir o Plano de Aprovação",
        "Uso prático do plano automático criado no onboarding.",
        [
          "O plano organiza semanas de estudo usando recursos já existentes na plataforma.",
          "Cada semana aponta atividades como diagnóstico, trilhas, simulados e subjetivas.",
          "O plano não promete aprovação; ele organiza preparação e consistência.",
        ],
        "/dashboard",
        ["onboarding", "plano", "premium"],
      ),
    ],
    faqs: [
      faq(
        "primeiro-acesso",
        "O que faço no primeiro acesso?",
        "Entre no Painel de Missão, conclua o onboarding se ele aparecer, faça o diagnóstico inicial e siga a próxima ação recomendada. O objetivo é evitar que você precise decidir tudo sozinho.",
        "primeiros-passos",
        ["inicio", "onboarding", "diagnostico"],
      ),
      faq(
        "painel-missao",
        "Como usar o Painel de Missão?",
        "O Painel de Missão mostra uma ação principal, missões do dia, preparação geral e recomendações. Priorize a próxima ação recomendada antes de explorar outras áreas.",
        "primeiros-passos",
        ["dashboard", "missao", "rotina"],
      ),
    ],
  },
  {
    slug: "conta-acesso",
    title: "Conta e Acesso",
    description: "Login, recuperação de acesso, status da conta e uso seguro.",
    articles: [
      article(
        "recuperar-acesso",
        "Como recuperar acesso",
        "Orientações para problemas de login e conta.",
        [
          "Confirme se está usando o mesmo e-mail usado no cadastro ou pagamento.",
          "Se o acesso premium não aparecer, aguarde a confirmação do pagamento e atualize a sessão.",
          "Ao falar com suporte, informe e-mail da conta e horário aproximado da tentativa.",
        ],
        "/login",
        ["login", "acesso", "email"],
      ),
    ],
    faqs: [
      faq(
        "como-acessar-assinatura",
        "Como acessar minha assinatura?",
        "Entre com o mesmo e-mail usado na compra. A liberação premium depende do status financeiro registrado no perfil da conta.",
        "conta-acesso",
        ["assinatura", "premium", "login"],
      ),
      faq(
        "recuperar-conta",
        "Como recupero meu acesso?",
        "Use o fluxo de login e confira se o e-mail está correto. Se o problema continuar, fale com suporte informando o e-mail cadastrado e o comprovante ou referência do pagamento.",
        "conta-acesso",
        ["recuperar", "login", "suporte"],
      ),
    ],
  },
  {
    slug: "assinatura-premium",
    title: "Assinatura Premium",
    description: "Benefícios, áreas bloqueadas e liberação do premium.",
    articles: [
      article(
        "como-funciona-premium",
        "Como funciona o Premium",
        "O que muda quando o acesso premium está ativo.",
        [
          "O premium libera trilhas, simulados oficiais, subjetivas, analytics completo e Painel de Missão personalizado.",
          "O acesso é controlado por profiles.access_status.",
          "Conteúdos oficiais continuam sendo referência externa; a PGM Academy é independente.",
        ],
        "/premium",
        ["premium", "acesso", "plano"],
      ),
    ],
    faqs: [
      faq(
        "premium-funciona",
        "Como funciona o Premium?",
        "O Premium libera recursos avançados de preparação, incluindo simulados oficiais, trilhas, correção manual quando disponível, analytics e orientação personalizada. Ele não garante aprovação.",
        "assinatura-premium",
        ["premium", "beneficios"],
      ),
      faq(
        "area-bloqueada-premium",
        "Por que ainda vejo área bloqueada?",
        "Se o pagamento já foi aprovado, pode haver atraso de confirmação do webhook ou sessão antiga no navegador. Atualize a página e, se persistir, fale com suporte com o e-mail da compra.",
        "assinatura-premium",
        ["bloqueio", "webhook", "pagamento"],
      ),
    ],
  },
  {
    slug: "pagamentos",
    title: "Pagamentos",
    description: "Status financeiro, confirmação e dúvidas sobre liberação.",
    articles: [
      article(
        "pagamento-aprovado",
        "Pagamento aprovado e acesso",
        "Como entender a liberação automática.",
        [
          "A plataforma libera acesso após confirmação do provedor de pagamento.",
          "PIX tende a confirmar mais rápido; boleto pode levar mais tempo.",
          "Se houver divergência, o suporte precisa do e-mail e referência do pagamento.",
        ],
        "/planos",
        ["pagamento", "asaas", "pix", "boleto"],
      ),
    ],
    faqs: [
      faq(
        "pagamento-aprovado-faq",
        "O pagamento foi aprovado?",
        "Confira o status no painel e no comprovante do provedor. Se o comprovante indicar aprovação e a plataforma não liberar, fale com suporte para conferência manual.",
        "pagamentos",
        ["pagamento", "aprovado"],
      ),
      faq(
        "garantia-aprovacao",
        "A plataforma garante aprovação?",
        "Não. A PGM Academy organiza preparação, simulados, estudos e orientação, mas a aprovação depende do edital, desempenho do aluno, critérios oficiais e decisões institucionais.",
        "pagamentos",
        ["aprovacao", "garantia", "institucional"],
      ),
    ],
  },
  {
    slug: "simulados-oficiais",
    title: "Simulados Oficiais",
    description: "Tentativas objetivas, cronômetro, resultado e relatório premium.",
    articles: [
      article(
        "primeiro-simulado",
        "Como realizar seu primeiro Simulado Oficial",
        "Passo a passo para resolver e interpretar o resultado.",
        [
          "Acesse Simulados e abra as instruções do modelo oficial.",
          "Responda as questões com o cronômetro ativo e revise antes de finalizar.",
          "Depois da finalização, use o relatório por categoria para escolher o próximo estudo.",
        ],
        "/simulados",
        ["simulado", "resultado", "cronometro"],
      ),
    ],
    faqs: [
      faq(
        "como-funciona-simulado",
        "Como funciona o Simulado Oficial?",
        "O simulado objetivo usa questões autorais, cronômetro, salvamento de respostas e correção no servidor. O gabarito só aparece depois da finalização.",
        "simulados-oficiais",
        ["simulado", "gabarito", "resultado"],
      ),
      faq(
        "posso-refazer-simulado",
        "Posso refazer um simulado?",
        "Sim. Use o histórico para revisar resultados anteriores e refaça depois de estudar as categorias fracas indicadas no relatório.",
        "simulados-oficiais",
        ["historico", "refazer"],
      ),
    ],
  },
  {
    slug: "subjetivas",
    title: "Subjetivas",
    description: "Respostas escritas, limite de palavras e correção manual.",
    articles: [
      article(
        "subjetiva-oficial",
        "Como funciona a subjetiva oficial",
        "Treino escrito com 5 respostas e limite oficial de palavras.",
        [
          "Cada resposta deve ter entre 90 e 150 palavras.",
          "O envio entra na fila de correção manual quando esse fluxo está disponível.",
          "A rubrica considera gramática, vocabulário, sintaxe, coesão e clareza.",
        ],
        "/simulados/subjetivo-oficial",
        ["subjetiva", "rubrica", "palavras"],
      ),
    ],
    faqs: [
      faq(
        "correcao-subjetiva",
        "Como funciona a correção subjetiva?",
        "A resposta é enviada para uma fila de correção manual. A arquitetura já está preparada para rubrica por competência, mas a devolutiva depende do processo editorial da plataforma.",
        "subjetivas",
        ["correcao", "manual", "rubrica"],
      ),
    ],
  },
  {
    slug: "treino-psicossocial",
    title: "Treino Psicossocial",
    description: "Preparação para entrevista, clareza de resposta e postura.",
    articles: [
      article(
        "entrevista-psicossocial",
        "Como treinar entrevista psicossocial",
        "Uso dos prompts psicossociais para ganhar clareza.",
        [
          "Leia a pergunta com atenção e responda de forma objetiva.",
          "Evite decorar respostas; priorize coerência, experiência real e clareza.",
          "Revise feedbacks recebidos antes de enviar nova resposta.",
        ],
        "/entrevista",
        ["entrevista", "psicossocial", "resposta"],
      ),
    ],
    faqs: [
      faq(
        "como-funciona-entrevista",
        "Como funciona a entrevista psicossocial?",
        "A plataforma oferece treinos autorais para praticar organização de ideias. A entrevista real segue regras e critérios oficiais do processo seletivo.",
        "treino-psicossocial",
        ["entrevista", "oficial"],
      ),
    ],
  },
  {
    slug: "mentor-ia",
    title: "Mentor IA",
    description: "Uso correto do mentor, limites e relação com documentos oficiais.",
    articles: [
      article(
        "usar-mentor",
        "Como usar o Mentor IA",
        "Perguntas úteis e limites do recurso.",
        [
          "Use o Mentor IA para organizar estudo, tirar dúvidas gerais e entender etapas.",
          "Não use o Mentor como substituto do edital ou dos canais oficiais.",
          "Confirme sempre datas, convocações e decisões nos canais oficiais.",
        ],
        "/mentor",
        ["mentor", "ia", "edital"],
      ),
    ],
    faqs: [
      faq(
        "mentor-substitui-edital",
        "O Mentor IA substitui o edital?",
        "Não. O Mentor IA ajuda na orientação de estudo, mas o edital, a Secretaria de Educação e os canais oficiais continuam sendo a fonte final para regras, prazos e resultados.",
        "mentor-ia",
        ["mentor", "edital", "oficial"],
      ),
    ],
  },
  {
    slug: "edital-pgm",
    title: "Edital PGM",
    description: "Independência institucional, regras oficiais e checagem de fontes.",
    articles: [
      article(
        "independencia-institucional",
        "A PGM Academy é oficial?",
        "Entenda a relação entre a plataforma e o Programa Ganhe o Mundo.",
        [
          "A PGM Academy é uma plataforma independente de preparação.",
          "A plataforma não representa o Governo de Pernambuco, a Secretaria de Educação ou bancas oficiais.",
          "Use a plataforma para estudar e consulte sempre os canais oficiais para regras finais.",
        ],
        "/mentor",
        ["oficial", "independente", "edital"],
      ),
    ],
    faqs: [
      faq(
        "pgm-academy-oficial",
        "A PGM Academy é oficial?",
        "Não. A PGM Academy é independente e não possui vínculo oficial com o Governo de Pernambuco, Secretaria de Educação ou organizadores do Programa Ganhe o Mundo.",
        "edital-pgm",
        ["oficial", "independente"],
      ),
    ],
  },
  {
    slug: "vida-internacional",
    title: "Vida Internacional",
    description: "Adaptação cultural, convivência, rotina e preparação emocional.",
    articles: [
      article(
        "adaptacao-cultural",
        "Como estudar adaptação cultural",
        "Orientação para vida internacional sem romantizar o intercâmbio.",
        [
          "Estude convivência, regras, rotina escolar e comunicação intercultural.",
          "Use materiais de vida internacional como preparação comportamental.",
          "Confirme qualquer orientação operacional nos canais oficiais.",
        ],
        "/premium",
        ["intercambio", "cultura", "vida internacional"],
      ),
    ],
    faqs: [
      faq(
        "vida-internacional-ajuda",
        "A plataforma ajuda na vida internacional?",
        "Sim, com materiais de preparação cultural e comportamental. Ela não substitui orientações oficiais de viagem, família anfitriã, escola ou empresa responsável.",
        "vida-internacional",
        ["intercambio", "cultura"],
      ),
    ],
  },
  {
    slug: "problemas-tecnicos",
    title: "Problemas Técnicos",
    description: "Falhas de carregamento, sessão, navegador e erros comuns.",
    articles: [
      article(
        "pagina-nao-carrega",
        "O que fazer quando uma página não carrega",
        "Checklist rápido antes de acionar suporte.",
        [
          "Atualize a página e confirme sua conexão.",
          "Saia e entre novamente se a sessão parecer antiga.",
          "Informe rota, horário e print do erro ao suporte.",
        ],
        "/dashboard",
        ["erro", "navegador", "sessao"],
      ),
    ],
    faqs: [
      faq(
        "erro-tecnico",
        "Como reporto um problema técnico?",
        "Envie a rota acessada, horário aproximado, e-mail da conta, print do erro e o que você tentou fazer. Isso reduz o tempo de diagnóstico.",
        "problemas-tecnicos",
        ["erro", "suporte"],
      ),
    ],
  },
  {
    slug: "seguranca-privacidade",
    title: "Segurança e Privacidade",
    description: "Dados da conta, acesso entre usuários e boas práticas.",
    articles: [
      article(
        "dados-seguros",
        "Como a plataforma protege acesso",
        "Resumo dos controles de segurança aplicados.",
        [
          "O acesso é autenticado e as áreas do aluno são protegidas por sessão.",
          "Dados de progresso, simulados e respostas são vinculados ao usuário e tenant.",
          "Não compartilhe senha ou sessão com terceiros.",
        ],
        "/dashboard",
        ["seguranca", "privacidade", "tenant"],
      ),
    ],
    faqs: [
      faq(
        "dados-privacidade",
        "Outros alunos veem meus dados?",
        "Não devem ver. A arquitetura usa autenticação, user_id, tenant_id e políticas de acesso para isolar dados de progresso, simulados e respostas.",
        "seguranca-privacidade",
        ["privacidade", "dados", "tenant"],
      ),
    ],
  },
];

export const firstStepsGuide: SuccessGuide = {
  id: "primeiros-passos-pgm-academy",
  title: "Guia de Primeiros Passos",
  description: "Roteiro curto para transformar a plataforma em rotina de estudo.",
  href: "/dashboard",
  steps: [
    "Abra o Painel de Missão e siga a próxima ação recomendada.",
    "Conclua o onboarding premium para gerar o Plano de Aprovação.",
    "Faça o diagnóstico inicial para calibrar sua preparação.",
    "Realize o Simulado Oficial PGM e leia o relatório por categoria.",
    "Envie a primeira subjetiva oficial para treinar escrita.",
    "Use Analytics para revisar pontos fracos e manter rotina.",
  ],
  tags: ["primeiros passos", "dashboard", "onboarding", "simulados", "analytics"],
};

export const successCenterGuides: SuccessGuide[] = [
  firstStepsGuide,
  {
    id: "guia-simulado-oficial",
    title: "Como interpretar relatórios de simulado",
    description: "Use acertos, erros e categorias para decidir o próximo estudo.",
    href: "/simulados",
    steps: [
      "Finalize a tentativa para liberar o gabarito.",
      "Veja categorias abaixo de 60% como prioridade.",
      "Abra trilhas recomendadas antes de refazer o simulado.",
      "Compare tempo gasto, percentual e evolução no analytics.",
    ],
    tags: ["simulado", "relatorio", "analytics"],
  },
  {
    id: "guia-premium",
    title: "Como aproveitar melhor o Premium",
    description: "Ciclo recomendado para extrair valor da assinatura.",
    href: "/premium",
    steps: [
      "Conclua onboarding e diagnóstico.",
      "Siga a missão diária.",
      "Estude trilhas recomendadas.",
      "Use simulados e subjetivas como validação semanal.",
    ],
    tags: ["premium", "missao", "retencao"],
  },
];

export const professionalFaqs: SuccessFaq[] =
  successCenterCategories.flatMap((category) => category.faqs);

export const supportChannels: SupportChannel[] = [
  {
    id: "whatsapp",
    title: "WhatsApp",
    description: "Canal recomendado para dúvidas de acesso e pagamento.",
    href: "https://wa.me/5500000000000",
    cta: "Abrir WhatsApp",
    responseNote: "Informe e-mail da conta, print e descrição objetiva do problema.",
  },
  {
    id: "email",
    title: "E-mail",
    description: "Melhor para casos com comprovantes, prints e detalhes.",
    href: "mailto:suporte@pgmacademy.com.br",
    cta: "Enviar e-mail",
    responseNote: "Use um assunto claro, como: Acesso premium não liberado.",
  },
  {
    id: "tickets",
    title: "Tickets futuros",
    description: "Estrutura prevista para atendimento rastreável dentro da plataforma.",
    href: "/sucesso",
    cta: "Em preparação",
    responseNote: "A sprint atual prepara conteúdo e arquitetura, sem abrir tickets ainda.",
  },
];

export const usefulResources: UsefulResource[] = [
  {
    title: "Painel de Missão",
    description: "Próxima ação, missão diária e preparação geral.",
    href: "/dashboard",
  },
  {
    title: "Simulados Oficiais",
    description: "Prova objetiva e treino subjetivo oficial.",
    href: "/simulados",
  },
  {
    title: "Analytics",
    description: "Desempenho por categoria, metas e recomendações.",
    href: "/analytics",
  },
  {
    title: "Planos",
    description: "Status e liberação do acesso premium.",
    href: "/planos",
  },
];

export const futureSupportArchitecture = [
  "support_tickets",
  "support_ticket_messages",
  "atendimento premium",
  "base dinâmica versionada",
  "sugestões automáticas por contexto",
] as const;

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function buildSuccessSearchIndex(): SuccessSearchItem[] {
  const articleItems = successCenterCategories.flatMap((category) =>
    category.articles.map((item) => ({
      id: item.id,
      type: "artigo" as const,
      title: item.title,
      description: item.summary,
      href: item.href,
      categoryTitle: category.title,
      text: [
        item.title,
        item.summary,
        item.body.join(" "),
        item.tags.join(" "),
        category.title,
        category.description,
      ].join(" "),
    })),
  );
  const faqItems = successCenterCategories.flatMap((category) =>
    category.faqs.map((item) => ({
      id: item.id,
      type: "pergunta" as const,
      title: item.question,
      description: item.answer,
      href: `/sucesso#${category.slug}`,
      categoryTitle: category.title,
      text: [
        item.question,
        item.answer,
        item.tags.join(" "),
        category.title,
        category.description,
      ].join(" "),
    })),
  );
  const guideItems = successCenterGuides.map((guide) => ({
    id: guide.id,
    type: "guia" as const,
    title: guide.title,
    description: guide.description,
    href: guide.href,
    categoryTitle: "Guias",
    text: [
      guide.title,
      guide.description,
      guide.steps.join(" "),
      guide.tags.join(" "),
    ].join(" "),
  }));
  const resourceItems = usefulResources.map((resource) => ({
    id: resource.href,
    type: "recurso" as const,
    title: resource.title,
    description: resource.description,
    href: resource.href,
    categoryTitle: "Recursos úteis",
    text: [resource.title, resource.description].join(" "),
  }));

  return [...articleItems, ...faqItems, ...guideItems, ...resourceItems];
}

export function searchSuccessCenter(query: string, limit = 8) {
  const normalizedQuery = normalizeSearchText(query.trim());

  if (!normalizedQuery) {
    return [];
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return buildSuccessSearchIndex()
    .map((item) => {
      const normalizedText = normalizeSearchText(item.text);
      const titleText = normalizeSearchText(item.title);
      const score = terms.reduce((sum, term) => {
        if (titleText.includes(term)) return sum + 4;
        if (normalizedText.includes(term)) return sum + 1;
        return sum;
      }, 0);

      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((result) => result.item);
}
