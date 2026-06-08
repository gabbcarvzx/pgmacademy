export const pgm2026OfficialSnapshot = {
  editalTitle: "Edital de Abertura nº 01/2026",
  editalUrl:
    "https://portal.educacao.pe.gov.br/wp-content/uploads/2026/05/0d68cd50-48a7-492c-88f7-0c7b9af530c0.pdf",
  seeNewsUrl:
    "https://portal.educacao.pe.gov.br/governo-de-pernambuco-oferta-duas-mil-vagas-para-o-programa-ganhe-o-mundo/",
  igeducUrl: "https://igeduc.selecao.net.br/informacoes/156/",
  sourceUpdatedAt: "2026-06-04",
  selectionYear: 2026,
  totalVacancies: 2000,
  minimumMunicipalOffer:
    "Oferta mínima de duas vagas para cada município de Pernambuco e Fernando de Noronha, sendo uma por idioma.",
  languages: [
    {
      name: "Língua Inglesa",
      vacancies: 1400,
      destinations: ["Canadá", "Estados Unidos", "Reino Unido"],
    },
    {
      name: "Língua Espanhola",
      vacancies: 600,
      destinations: ["Argentina", "Espanha"],
    },
  ],
  application: {
    deadline: "2026-06-16T23:59:00-03:00",
    note:
      "Inscrição por idioma; o país informado é preferência indicativa e não gera direito adquirido ao destino.",
  },
  requirements: {
    birthDateStart: "2009-05-01",
    birthDateEnd: "2012-10-01",
    schoolYears: ["1º ano do Ensino Médio", "2º ano do Ensino Médio"],
    minimumAttendancePercent: 85,
    minimumAverage: 7,
    excludedSchools: [
      "Escolas da Polícia Militar",
      "Escolas de Aplicação da UPE",
      "Escolas indígenas",
      "Escolas quilombolas",
    ],
  },
  exam: {
    date: "2026-07-05",
    durationHours: 4,
    objective: {
      questions: 30,
      alternatives: 5,
      pointsPerQuestion: 2,
      maxScore: 60,
      character: "Eliminatório e classificatório",
    },
    subjective: {
      questions: 5,
      minWords: 90,
      maxWords: 150,
      pointsPerQuestion: 8,
      maxScore: 40,
      minimumApprovalScore: 16,
      character: "Eliminatório e classificatório",
      correctionCriteria: [
        "Correção gramatical",
        "Precisão vocabular",
        "Estrutura sintática",
        "Coesão e clareza linguística",
      ],
    },
    globalMinimumScore: 70,
  },
  psychosocialInterview: {
    character: "Eliminatório",
    format: "Telepresencial",
    result: "APTO ou INAPTO",
    criteria: [
      "Clareza e objetividade na comunicação",
      "Equilíbrio emocional",
      "Postura, ética e responsabilidade",
      "Capacidade de convivência e respeito à diversidade cultural",
      "Motivação para participação no intercâmbio",
    ],
    preparationAxes: [
      "Maturidade emocional e autonomia",
      "Adaptação a contextos socioculturais distintos",
      "Comunicação interpessoal",
      "Responsabilidade e comprometimento",
      "Compatibilidade com as exigências do programa",
    ],
  },
  timeline: [
    {
      label: "Inscrições",
      value: "Até 16/06/2026, 23h59",
      source: "Notícia SEE e edital 01/2026",
    },
    {
      label: "Prova objetiva e subjetiva",
      value: "05/07/2026",
      source: "Cronograma do edital 01/2026",
    },
    {
      label: "Gabarito preliminar e padrão preliminar de resposta",
      value: "05/07/2026, após a realização das provas",
      source: "Cronograma do edital 01/2026",
    },
    {
      label: "Gabarito definitivo e resultado preliminar da objetiva",
      value: "16/07/2026",
      source: "Cronograma do edital 01/2026",
    },
    {
      label: "Resultado definitivo da objetiva",
      value: "Até 24/07/2026",
      source: "Cronograma do edital 01/2026",
    },
    {
      label: "Entrevista psicossocial",
      value: "De 28/07/2026 até 10/08/2026",
      source: "Cronograma do edital 01/2026",
    },
    {
      label: "Resultado definitivo do programa",
      value: "Até 31/08/2026",
      source: "Cronograma do edital 01/2026",
    },
  ],
  programContent: {
    english: {
      grammar: [
        "Saudações do dia a dia",
        "Pronomes subjetivos, possessivos, demonstrativos, indefinidos e objetivos",
        "Verbo to be no presente e passado",
        "Presente contínuo, presente simples, passado simples, passado contínuo e futuro simples",
        "Números cardinais e ordinais",
        "Artigos definidos e indefinidos",
        "Substantivos contáveis e não contáveis",
        "Question words",
        "Advérbios de frequência",
        "Preposições de tempo e lugar",
        "Expressões de direção",
        "Adjetivos, comparativo e superlativo",
        "Verb to have e verb can",
        "Singular e plural",
        "Present perfect x simple past",
        "Conjunções",
        "Imperativo, infinitivo e gerúndio",
      ],
      vocabulary: [
        "Perguntas pessoais",
        "Apresentação pessoal",
        "Família",
        "Comida e bebida",
        "Transportes",
        "Clima e estações do ano",
        "Lugares",
        "Roupas, tamanhos e cores",
        "Dias da semana e meses do ano",
      ],
      text: [
        "Leitura, compreensão e interpretação",
        "Textos curtos, mensagens, anúncios, horários e folhetos",
        "Expressões frequentes de interesse pessoal",
        "Informações concretas em textos simples de uso corrente",
      ],
    },
    spanish: {
      grammar: [
        "Função e classificação das palavras",
        "Artigos determinados e indeterminados",
        "Pronomes pessoais, definidos, indefinidos, átonos e tônicos",
        "Verbos no presente, passado imperfeito, indefinido, imperativo e particípio",
        "Uso de muy e mucho",
        "Preposições e advérbios de lugar e tempo",
        "Verbos reflexivos",
        "Formas pronominais neutras",
      ],
      vocabulary: [
        "Apresentação pessoal e rotina",
        "Família",
        "Escola e cidade",
        "Transportes",
        "Alimentos",
        "Clima",
        "Viagem",
        "Convivência e comunicação cotidiana",
      ],
      text: [
        "Compreensão leitora",
        "Textos simples de uso cotidiano",
        "Vocabulário em contexto",
        "Informações explícitas e inferências simples",
      ],
    },
  },
  institutionalNotice:
    "A PGM Academy é uma plataforma independente de preparação. Não possui vínculo oficial com o Governo de Pernambuco, com a SEE, com o Instituto IGEDUC ou com o Programa Ganhe o Mundo. Regras, prazos, resultados, documentos e convocações devem ser confirmados nos canais oficiais.",
} as const;

export type Pgm2026OfficialSnapshot = typeof pgm2026OfficialSnapshot;

export function formatVacancySummary() {
  const [english, spanish] = pgm2026OfficialSnapshot.languages;

  return `${pgm2026OfficialSnapshot.totalVacancies.toLocaleString("pt-BR")} vagas: ${english.vacancies.toLocaleString("pt-BR")} para inglês e ${spanish.vacancies.toLocaleString("pt-BR")} para espanhol.`;
}

export function formatDestinationSummary() {
  return pgm2026OfficialSnapshot.languages
    .map((language) => `${language.name}: ${language.destinations.join(", ")}`)
    .join(" | ");
}
