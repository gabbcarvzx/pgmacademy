import { intensiveSimulationTemplateIds } from "@/lib/simulations/intensive-pgm";
import type { SimulationTemplateAccess } from "@/lib/simulations/catalog";

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

export type ReviewFinalExample = {
  label: string;
  content: string;
  translation?: string;
};

export type ReviewFinalAttentionBox = {
  title: string;
  description: string;
};

export type ReviewFinalCommentedOption = {
  label: string;
  text: string;
  isCorrect: boolean;
  commentary: string;
};

export type ReviewFinalCommentedQuestion = {
  prompt: string;
  supportText?: string;
  options: ReviewFinalCommentedOption[];
  takeaway: string;
};

export type ReviewFinalUnit = {
  title: string;
  introduction: string;
  whyItMatters: string;
  explanation: string[];
  examples: ReviewFinalExample[];
  commonMistakes: string[];
  practicalTips: string[];
  attention: ReviewFinalAttentionBox;
  quickSummary: string;
  commentedQuestion: ReviewFinalCommentedQuestion;
};

export type ReviewFinalModule = {
  id: string;
  navTitle: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: "compass" | "languages" | "book" | "target" | "message" | "shield" | "sparkles";
  purpose: string;
  whenToUse: string;
  whyItDeservesAttention: string;
  units: ReviewFinalUnit[];
};

export type ReviewFinalNavigationItem = {
  id: string;
  title: string;
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

export function buildReviewFinalNavigation(
  modules: ReviewFinalModule[],
): ReviewFinalNavigationItem[] {
  const items = modules.map((module) => ({
    id: module.id,
    title: module.navTitle,
  }));

  return items.some((item) => item.id === "simulados")
    ? items
    : [
        ...items,
        {
          id: "simulados",
          title: "Simulados",
        },
      ];
}

export const reviewFinalModules: ReviewFinalModule[] = [
  {
    id: "introducao",
    navTitle: "Introducao",
    eyebrow: "Comece por aqui",
    title: "Ultimo passo antes da prova",
    description:
      "Use esta central como uma apostila digital de reta final: menos dispersao, mais clareza e revisao com estrategia.",
    icon: "compass",
    purpose:
      "Organizar a preparacao final em um fluxo curto, util e conectado ao restante da plataforma.",
    whenToUse:
      "Quando voce ja estudou os conteudos principais e precisa consolidar o que mais merece atencao.",
    whyItDeservesAttention:
      "Na reta final, o ganho costuma vir de revisao dirigida, leitura cuidadosa e pratica com criterio, nao de abrir muitas frentes novas.",
    units: [
      {
        title: "Como usar a Central de Revisao Inteligente",
        introduction:
          "Esta pagina foi pensada para funcionar como um curso resumido dos pontos mais importantes da prova.",
        whyItMatters:
          "Sem um roteiro claro, o aluno tende a revisar de forma passiva e perder tempo em detalhes de menor impacto.",
        explanation: [
          "Comece pelos modulos em que voce costuma errar mais. Se sua principal dificuldade estiver em leitura, va primeiro para interpretacao e estrategias de prova.",
          "Use cada modulo para revisar, nao para decorar. O objetivo aqui e reativar conhecimento, reconhecer armadilhas e ganhar seguranca para decidir melhor no dia da prova.",
        ],
        examples: [
          {
            label: "Aplicacao pratica",
            content:
              "Se voce erra vocabulario em contexto, revise o modulo de vocabulario, faca a questao comentada e depois abra um simulado para validar a leitura.",
          },
          {
            label: "Rotina curta",
            content:
              "30 minutos de revisao + 20 minutos de questoes + 10 minutos de anotacoes costumam render mais do que duas horas de leitura sem foco.",
          },
        ],
        commonMistakes: [
          "Ler tudo de uma vez sem selecionar prioridades.",
          "Usar a revisao apenas como leitura passiva.",
          "Abrir conteudos novos quando ainda ha erros basicos para corrigir.",
        ],
        practicalTips: [
          "Antes de seguir para o proximo modulo, registre o que ainda gera duvida.",
          "Depois de um modulo, aplique a revisao em pelo menos uma questao ou simulado.",
          "Se o cansaco aumentar, troque leitura longa por questoes comentadas e descanso curto.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Reta final nao combina com excesso de material novo. Priorize clareza, repeticao inteligente e boa leitura das alternativas.",
        },
        quickSummary:
          "Use a central como guia de consolidacao: revise, pratique, anote erros e volte apenas ao que ainda pede reforco.",
        commentedQuestion: {
          prompt:
            "Qual atitude tende a gerar mais valor em uma revisao final bem organizada?",
          options: [
            {
              label: "A",
              text: "Abrir varios conteudos novos para ampliar o repertorio rapidamente.",
              isCorrect: false,
              commentary:
                "Abrir muitas frentes novas perto da prova costuma aumentar dispersao e ansiedade.",
            },
            {
              label: "B",
              text: "Revisar de forma dirigida os pontos em que o aluno mais erra e validar com pratica.",
              isCorrect: true,
              commentary:
                "Essa alternativa esta correta porque combina foco, revisao ativa e aplicacao imediata.",
            },
            {
              label: "C",
              text: "Trocar simulados por leitura passiva para evitar cansaco.",
              isCorrect: false,
              commentary:
                "Leitura passiva sozinha nao mostra se a revisao esta sendo transferida para a prova.",
            },
            {
              label: "D",
              text: "Memorizar respostas prontas sem analisar os erros recorrentes.",
              isCorrect: false,
              commentary:
                "Memorizacao sem entendimento nao ajuda a corrigir falhas de leitura e decisao.",
            },
          ],
          takeaway:
            "Revisao forte na reta final costuma combinar prioridade, pratica e correcao de erros reais.",
        },
      },
    ],
  },
  {
    id: "gramatica-inglesa",
    navTitle: "Gramatica Inglesa",
    eyebrow: "Ingles",
    title: "Domine os assuntos prioritarios de gramatica inglesa",
    description:
      "Revise os tempos verbais e estruturas que costumam aparecer em textos, comandos, dialogos e alternativas de prova.",
    icon: "languages",
    purpose:
      "Reforcar leitura gramatical em contexto, sem transformar revisao em lista solta de regras.",
    whenToUse:
      "Quando voce sente que reconhece a ideia geral do texto, mas ainda se perde em detalhes de estrutura.",
    whyItDeservesAttention:
      "Muitos erros surgem nao por falta de traducao, mas por interpretar mal tempo verbal, referencia pronominal ou relacao entre frases.",
    units: [
      {
        title: "Present Simple e Present Continuous",
        introduction:
          "Esses dois tempos aparecem muito em frases de rotina, fatos gerais e acoes em andamento.",
        whyItMatters:
          "Na prova, a troca entre rotina e acao momentanea muda completamente o sentido da frase.",
        explanation: [
          "Use Present Simple para habitos, rotinas e fatos gerais: I study every afternoon. She lives in Recife.",
          "Use Present Continuous para acoes em progresso agora ou em periodo temporario: I am studying now. They are staying with relatives this month.",
        ],
        examples: [
          {
            label: "Routine",
            content: "She studies English every day.",
            translation: "Ela estuda ingles todos os dias.",
          },
          {
            label: "Action now",
            content: "She is studying for the interview right now.",
            translation: "Ela esta estudando para a entrevista neste exato momento.",
          },
        ],
        commonMistakes: [
          "Usar continuous com expressoes de rotina como every day.",
          "Ignorar marcadores de tempo como now, at the moment e currently.",
          "Traduzir is studying como presente simples.",
        ],
        practicalTips: [
          "Antes de responder, procure marcadores de frequencia ou de momento.",
          "Leia o verbo junto do contexto, nao isolado.",
          "Se a frase falar de rotina, o simple costuma fazer mais sentido.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Nem toda frase com acao usa continuous. A pergunta principal e: isso e habito ou esta acontecendo agora?",
        },
        quickSummary:
          "Present Simple aponta rotina e fato geral; Present Continuous mostra acao em andamento ou situacao temporaria.",
        commentedQuestion: {
          prompt: "Choose the best option: Maria ___ to school by bus every morning.",
          options: [
            {
              label: "A",
              text: "is going",
              isCorrect: false,
              commentary:
                "A frase indica rotina com every morning, nao uma acao momentanea.",
            },
            {
              label: "B",
              text: "go",
              isCorrect: false,
              commentary:
                "Com he/she/it no presente simples, o verbo precisa de -s.",
            },
            {
              label: "C",
              text: "goes",
              isCorrect: true,
              commentary:
                "Correta. Maria e terceira pessoa do singular e a frase descreve habito.",
            },
            {
              label: "D",
              text: "going",
              isCorrect: false,
              commentary:
                "Falta um auxiliar e a estrutura nao completa a ideia verbal.",
            },
          ],
          takeaway:
            "Quando aparecer frequencia clara, confirme se a estrutura pede Present Simple.",
        },
      },
      {
        title: "Past Simple, Present Perfect e Future",
        introduction:
          "Esses tempos ajudam a diferenciar passado concluido, experiencia ligada ao presente e planos ou previsoes.",
        whyItMatters:
          "A banca pode testar sua leitura sobre quando algo aconteceu e se o efeito ainda importa agora.",
        explanation: [
          "Past Simple fala de acao concluida em um momento definido: She visited London last year.",
          "Present Perfect conecta passado e presente: She has visited London three times, indicando experiencia acumulada.",
          "Future aparece com will para decisao, previsao ou promessa e com going to para plano mais claro.",
        ],
        examples: [
          {
            label: "Past Simple",
            content: "They traveled to Chile in 2024.",
            translation: "Eles viajaram para o Chile em 2024.",
          },
          {
            label: "Present Perfect",
            content: "They have traveled to Chile before.",
            translation: "Eles ja viajaram para o Chile antes.",
          },
        ],
        commonMistakes: [
          "Misturar last year com Present Perfect.",
          "Traduzir have/has como verbo principal sempre.",
          "Nao perceber que going to sugere planejamento.",
        ],
        practicalTips: [
          "Procure marcadores como yesterday, last, already, yet, since e tomorrow.",
          "Se o momento e definido, Past Simple tende a ser mais forte.",
          "Se a ideia e experiencia acumulada, Present Perfect merece atencao.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Present Perfect nao depende apenas de traducao. Ele indica ligacao com o presente, experiencia ou resultado atual.",
        },
        quickSummary:
          "Past Simple fecha o passado; Present Perfect liga passado e presente; Future aponta previsao, plano ou decisao.",
        commentedQuestion: {
          prompt:
            "Choose the sentence that best expresses an experience connected to the present.",
          options: [
            {
              label: "A",
              text: "I visited Canada in July 2023.",
              isCorrect: false,
              commentary:
                "A frase fala de um momento definido no passado, nao de experiencia ligada ao presente.",
            },
            {
              label: "B",
              text: "I have visited Canada twice.",
              isCorrect: true,
              commentary:
                "Correta. O foco e a experiencia acumulada, nao a data exata.",
            },
            {
              label: "C",
              text: "I am visiting Canada tomorrow.",
              isCorrect: false,
              commentary:
                "A frase aponta futuro planejado, nao experiencia passada.",
            },
            {
              label: "D",
              text: "I will visited Canada next year.",
              isCorrect: false,
              commentary:
                "A estrutura esta gramaticalmente incorreta com will + verbo no passado.",
            },
          ],
          takeaway:
            "Se o objetivo e mostrar experiencia, pense em Present Perfect antes de procurar datas.",
        },
      },
      {
        title: "Modal Verbs, Articles, Pronouns, Prepositions e Conjunctions",
        introduction:
          "Esses elementos pequenos parecem simples, mas mudam muito a precisao da leitura e da resposta.",
        whyItMatters:
          "Questoes de prova adoram explorar nuance: possibilidade, obrigacao, referencia, localizacao e relacao logica.",
        explanation: [
          "Modal verbs como can, should, must e might ajudam a interpretar permissao, conselho, obrigacao e possibilidade.",
          "Articles, pronouns, prepositions e conjunctions mostram referencia e conexao. Sem eles, o aluno entende palavras soltas, mas perde o sentido fino da frase.",
        ],
        examples: [
          {
            label: "Modal",
            content: "Students should review the instructions carefully.",
            translation: "Os estudantes devem revisar as instrucoes com cuidado.",
          },
          {
            label: "Conjunction",
            content: "She was tired, but she finished the task.",
            translation: "Ela estava cansada, mas terminou a tarefa.",
          },
        ],
        commonMistakes: [
          "Confundir must com simple suggestion.",
          "Ignorar a referencia de he, she, they, it e this.",
          "Responder sem perceber o valor de but, although, because ou however.",
        ],
        practicalTips: [
          "Leia conectivos antes de concluir o sentido da frase.",
          "Quando um pronome aparecer, volte uma linha e identifique o referente.",
          "Observe se a preposicao muda a relacao espacial, temporal ou de direcao.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Muita gente perde ponto por pular palavras pequenas. Em prova, elas costumam carregar a logica central da frase.",
        },
        quickSummary:
          "Modals e conectores ajudam a entender intencao, obrigacao, contraste, causa e referencia dentro do texto.",
        commentedQuestion: {
          prompt:
            "In the sentence 'You should arrive early because the gates close at 8 a.m.', the word 'should' expresses:",
          options: [
            {
              label: "A",
              text: "a strict legal obligation",
              isCorrect: false,
              commentary:
                "Should tende a expressar conselho ou recomendacao, nao obrigacao legal forte.",
            },
            {
              label: "B",
              text: "a recommendation",
              isCorrect: true,
              commentary:
                "Correta. O falante recomenda chegar cedo com base em uma consequencia pratica.",
            },
            {
              label: "C",
              text: "an impossible action",
              isCorrect: false,
              commentary: "Nada na frase indica impossibilidade.",
            },
            {
              label: "D",
              text: "a completed action",
              isCorrect: false,
              commentary: "A frase fala de orientacao futura, nao de acao concluida.",
            },
          ],
          takeaway:
            "Modal verbs pedem leitura de nuance. Nem sempre a traducao literal resolve a interpretacao.",
        },
      },
      {
        title: "Passive Voice, Reported Speech e Question Tags",
        introduction:
          "Essas estruturas costumam aparecer em textos informativos, noticias, entrevistas e dialogos curtos.",
        whyItMatters:
          "Elas alteram foco, distancia de fala e intencao comunicativa, pontos que podem mudar a resposta correta.",
        explanation: [
          "Passive Voice destaca a acao ou o resultado: The documents were sent yesterday.",
          "Reported Speech reconta o que alguem disse: She said she was ready. Question Tags buscam confirmacao: You studied, didn't you?",
        ],
        examples: [
          {
            label: "Passive",
            content: "The application was approved last week.",
            translation: "A candidatura foi aprovada na semana passada.",
          },
          {
            label: "Reported Speech",
            content: "He said he had prepared for the exam.",
            translation: "Ele disse que tinha se preparado para a prova.",
          },
        ],
        commonMistakes: [
          "Achar que voz passiva sempre deixa a frase mais dificil do que ela realmente e.",
          "Perder a mudanca de tempo verbal no discurso indireto.",
          "Errar a question tag por nao observar o auxiliar principal da frase.",
        ],
        practicalTips: [
          "Na passiva, procure be + participle.",
          "No reported speech, compare o verbo original com a versao relatada.",
          "Em question tags, verifique polaridade: afirmacao pede tag negativa e vice-versa.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Question tags nao servem apenas para decorar formula. Elas ajudam a interpretar tom, confirmacao e expectativa do falante.",
        },
        quickSummary:
          "Passive voice muda o foco; reported speech reconta a fala; question tags confirmam ou testam acordo do interlocutor.",
        commentedQuestion: {
          prompt:
            "Choose the option that best completes the sentence: 'The results ___ yesterday.'",
          options: [
            {
              label: "A",
              text: "announced",
              isCorrect: false,
              commentary:
                "Falta o auxiliar para formar a voz passiva corretamente.",
            },
            {
              label: "B",
              text: "were announced",
              isCorrect: true,
              commentary:
                "Correta. A estrutura be + past participle forma a passiva no passado.",
            },
            {
              label: "C",
              text: "was announce",
              isCorrect: false,
              commentary:
                "Ha erro de concordancia e de forma verbal do particpio.",
            },
            {
              label: "D",
              text: "have announcing",
              isCorrect: false,
              commentary:
                "A estrutura nao corresponde a uma forma verbal valida para esse contexto.",
            },
          ],
          takeaway:
            "Se o foco estiver no resultado e nao em quem pratica a acao, verifique se a voz passiva faz mais sentido.",
        },
      },
    ],
  },
  {
    id: "vocabulario-ingles",
    navTitle: "Vocabulario",
    eyebrow: "Ingles",
    title: "Vocabulario que ajuda a ler melhor e decidir com mais seguranca",
    description:
      "Aqui a revisao foca em palavras de uso recorrente, temas frequentes e expressoes que ajudam a interpretar o texto em contexto.",
    icon: "book",
    purpose:
      "Fortalecer reconhecimento de sentido sem depender de traducao palavra por palavra.",
    whenToUse:
      "Quando o aluno entende a estrutura da frase, mas perde a alternativa por falta de vocabulario funcional.",
    whyItDeservesAttention:
      "Vocabulário em prova nao e lista solta. Ele aparece dentro de situacoes como escola, viagem, rotina, tecnologia e educacao.",
    units: [
      {
        title: "Travel, School, Countries e Daily Routine",
        introduction:
          "Esses temas aparecem com frequencia em textos curtos, avisos, relatos pessoais e instrucoes.",
        whyItMatters:
          "Saber esse vocabulario acelera a leitura e evita travar em palavras simples que sustentam a cena do texto.",
        explanation: [
          "No campo de travel, espere airport, luggage, boarding pass, schedule e exchange program.",
          "Em school e daily routine, aparecem classroom, assignment, break, wake up, attend, study group e timetable.",
        ],
        examples: [
          {
            label: "Travel",
            content: "Please keep your boarding pass with you until the gate opens.",
            translation:
              "Mantenha seu cartao de embarque com voce ate o portao abrir.",
          },
          {
            label: "School",
            content: "She joined a study group after class.",
            translation: "Ela entrou em um grupo de estudos depois da aula.",
          },
        ],
        commonMistakes: [
          "Traduzir schedule como horario escolar fixo em qualquer contexto.",
          "Confundir attend com wait.",
          "Ignorar que routine words costumam indicar habito e contexto escolar.",
        ],
        practicalTips: [
          "Leia o bloco de palavras dentro do tema do texto.",
          "Se aparecer viagem, pense em deslocamento, documentos e horarios.",
          "Se aparecer escola, observe tarefas, horarios, participacao e desempenho.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Palavras conhecidas mudam de peso conforme o contexto. Nao traduza isoladamente sem olhar a situacao descrita.",
        },
        quickSummary:
          "Temas recorrentes como viagem, escola e rotina servem de base para leitura rapida e interpretacao mais segura.",
        commentedQuestion: {
          prompt:
            "In the sentence 'Students must check the timetable before the morning class', the word 'timetable' is closest to:",
          options: [
            {
              label: "A",
              text: "grade",
              isCorrect: false,
              commentary:
                "Grade escolar e resultado, nao cronograma ou horario.",
            },
            {
              label: "B",
              text: "schedule",
              isCorrect: true,
              commentary:
                "Correta. Timetable se relaciona a horarios e organizacao do periodo escolar.",
            },
            {
              label: "C",
              text: "library",
              isCorrect: false,
              commentary:
                "A palavra nao descreve local fisico de estudo.",
            },
            {
              label: "D",
              text: "uniform",
              isCorrect: false,
              commentary: "Nao ha relacao semantica entre os termos.",
            },
          ],
          takeaway:
            "Em prova, reconhecer o campo tematico ajuda muito a decidir o significado mais plausivel.",
        },
      },
      {
        title: "Family, Food, Environment, Technology e Education",
        introduction:
          "Esses temas ampliam a cobertura de textos informativos e opinativos, comuns em provas escolares e de intercambio.",
        whyItMatters:
          "Quanto mais familiaridade com esses campos, menor o desgaste cognitivo para interpretar a pergunta.",
        explanation: [
          "Family e food aparecem em relatos pessoais, cultura e rotina. Environment e technology surgem em textos de opiniao, cidadania e atualidades. Education costuma cruzar todos esses temas.",
          "Palavras como relatives, meal, waste, recycle, device, improve e learning environment ajudam a identificar tema e posicionamento do autor.",
        ],
        examples: [
          {
            label: "Environment",
            content: "Recycling programs can reduce waste at school.",
            translation:
              "Programas de reciclagem podem reduzir residuos na escola.",
          },
          {
            label: "Technology",
            content: "Digital tools can improve the learning experience.",
            translation:
              "Ferramentas digitais podem melhorar a experiencia de aprendizagem.",
          },
        ],
        commonMistakes: [
          "Responder pelo tema geral sem notar a opiniao do autor.",
          "Confundir device com development ou advice.",
          "Ignorar palavras que mostram impacto, causa ou resultado.",
        ],
        practicalTips: [
          "Marque palavras que revelem tema e posicionamento do texto.",
          "Em education e technology, observe se o autor apresenta beneficio, limite ou comparacao.",
          "Quando uma palavra for desconhecida, use o restante da frase para inferir.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Nem sempre a palavra central do tema responde a questao. Muitas vezes o que vale e a atitude do autor diante do tema.",
        },
        quickSummary:
          "Tema e contexto caminham juntos: identifique o assunto e depois observe a intencao do texto.",
        commentedQuestion: {
          prompt:
            "In the sentence 'The project reduced waste and encouraged students to recycle', the word 'waste' refers to:",
          options: [
            {
              label: "A",
              text: "free time",
              isCorrect: false,
              commentary:
                "Aqui o contexto e ambiental, nao de tempo desperdicado.",
            },
            {
              label: "B",
              text: "garbage or discarded material",
              isCorrect: true,
              commentary:
                "Correta. O verbo recycle confirma o campo semantico ambiental.",
            },
            {
              label: "C",
              text: "school grades",
              isCorrect: false,
              commentary: "Nao ha conexao com desempenho escolar.",
            },
            {
              label: "D",
              text: "transportation",
              isCorrect: false,
              commentary: "O contexto nao remete a deslocamento.",
            },
          ],
          takeaway:
            "Use palavras vizinhas do texto para definir o sentido mais adequado do termo-chave.",
        },
      },
      {
        title: "Common Expressions, Idioms e palavras confundidas",
        introduction:
          "Expressoes comuns e palavras parecidas costumam aparecer para testar leitura contextual, nao memorizacao cega.",
        whyItMatters:
          "O aluno pode conhecer as palavras separadas, mas errar quando elas aparecem como bloco de sentido.",
        explanation: [
          "Common expressions como take part, get ready, look for e make sure aparecem em instrucoes, avisos e relatos.",
          "Idioms mais conhecidos e palavras frequentemente confundidas pedem leitura de contexto. A traducao literal pode atrapalhar.",
        ],
        examples: [
          {
            label: "Expression",
            content: "Make sure you arrive on time.",
            translation: "Certifique-se de chegar no horario.",
          },
          {
            label: "Idiom",
            content: "She felt under the weather before the interview.",
            translation:
              "Ela nao estava se sentindo bem antes da entrevista.",
          },
        ],
        commonMistakes: [
          "Traduzir idiom literalmente.",
          "Confundir sensible com sensitive ou library com bookstore.",
          "Escolher alternativa pela semelhanca visual da palavra.",
        ],
        practicalTips: [
          "Leia a expressao inteira antes de decidir o significado.",
          "Quando uma palavra parecer familiar demais, confirme se nao e um falso amigo.",
          "Em duvida, volte ao tom geral do texto e ao efeito da frase.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Palavras frequentemente confundidas derrubam candidatos porque parecem faceis. Justamente por isso, pedem leitura mais cuidadosa.",
        },
        quickSummary:
          "Expressoes e idioms exigem contexto. Nao responda por semelhanca visual ou traducao automatica.",
        commentedQuestion: {
          prompt:
            "In the instruction 'Make sure your name is on every page', the expression 'make sure' means:",
          options: [
            {
              label: "A",
              text: "invent",
              isCorrect: false,
              commentary: "A expressao nao significa criar ou inventar.",
            },
            {
              label: "B",
              text: "confirm",
              isCorrect: true,
              commentary:
                "Correta. A ideia e verificar ou garantir que algo esteja certo.",
            },
            {
              label: "C",
              text: "change",
              isCorrect: false,
              commentary: "Nao ha sentido de alterar a informacao.",
            },
            {
              label: "D",
              text: "hide",
              isCorrect: false,
              commentary: "A frase nao indica esconder nada.",
            },
          ],
          takeaway:
            "Expressoes fixas devem ser lidas como unidade de sentido, nao palavra por palavra.",
        },
      },
    ],
  },
  {
    id: "false-friends",
    navTitle: "False Friends",
    eyebrow: "Ingles",
    title: "False Friends, True Cognates e cognatos que pedem leitura cuidadosa",
    description:
      "Aqui voce revisa palavras que ajudam e palavras que enganam, sempre com foco em contexto de prova.",
    icon: "sparkles",
    purpose:
      "Reduzir erros de interpretacao por semelhanca visual entre ingles e portugues.",
    whenToUse:
      "Quando voce percebe que caiu em alternativas atraentes por parecerem familiares demais.",
    whyItDeservesAttention:
      "Cognatos ajudam a leitura, mas o excesso de confianca com eles tambem gera armadilhas comuns.",
    units: [
      {
        title: "True Cognates e False Cognates em contexto",
        introduction:
          "Nem toda palavra parecida com o portugues esta te ajudando. Algumas facilitam; outras desviam sua leitura.",
        whyItMatters:
          "A banca pode explorar exatamente essa sensacao de familiaridade para induzir o erro.",
        explanation: [
          "True cognates costumam manter sentido proximo, como information, hospital e different.",
          "False cognates mudam bastante, como parents, pretended, college, sensible e actually.",
        ],
        examples: [
          {
            label: "True cognate",
            content: "The information was available online.",
            translation: "A informacao estava disponivel online.",
          },
          {
            label: "False cognate",
            content: "My parents support my decision.",
            translation: "Meus pais apoiam minha decisao.",
          },
        ],
        commonMistakes: [
          "Traduzir parents como parentes.",
          "Entender pretended como pretendeu.",
          "Responder pela aparencia da palavra sem ler a frase completa.",
        ],
        practicalTips: [
          "Se a palavra parecer muito facil, confirme o contexto antes de marcar.",
          "Cruze a palavra com o resto da frase e com o tema do texto.",
          "Monte um pequeno repertorio mental dos falsos cognatos mais comuns.",
        ],
        attention: {
          title: "Atencao",
          description:
            "False friend costuma derrubar por excesso de confianca. O perigo esta justamente na semelhanca.",
        },
        quickSummary:
          "Cognato ajuda, mas nao substitui leitura contextual. Em prova, contexto sempre vem primeiro.",
        commentedQuestion: {
          prompt:
            "In the sentence 'Actually, the program starts next month', the word 'actually' means:",
          options: [
            {
              label: "A",
              text: "atualmente",
              isCorrect: false,
              commentary:
                "Esse e um erro comum. Actually geralmente significa 'na verdade'.",
            },
            {
              label: "B",
              text: "na verdade",
              isCorrect: true,
              commentary:
                "Correta. A frase corrige ou esclarece uma informacao.",
            },
            {
              label: "C",
              text: "agora mesmo",
              isCorrect: false,
              commentary: "A palavra nao indica instante presente.",
            },
            {
              label: "D",
              text: "atrasado",
              isCorrect: false,
              commentary: "Nao ha relacao semantica com atraso.",
            },
          ],
          takeaway:
            "Quando um falso cognato aparecer, force a leitura do contexto antes de confiar na intuicao.",
        },
      },
    ],
  },
  {
    id: "interpretacao",
    navTitle: "Interpretacao",
    eyebrow: "Leitura",
    title: "Reading Strategies e interpretacao de texto",
    description:
      "Esse modulo ajuda a ler com estrategia, identificar palavras-chave e responder textos longos sem ansiedade desnecessaria.",
    icon: "book",
    purpose:
      "Transformar leitura em processo de decisao: localizar, inferir, comparar e eliminar com criterio.",
    whenToUse:
      "Quando o texto parece grande demais ou quando as alternativas parecem proximas.",
    whyItDeservesAttention:
      "Muitas questoes sao vencidas mais por boa estrategia de leitura do que por traducao completa.",
    units: [
      {
        title: "Reading Strategies e palavras-chave",
        introduction:
          "Ler estrategicamente nao e correr: e saber o que procurar antes de se perder em detalhes.",
        whyItMatters:
          "Quem localiza a ideia principal e as palavras-chave tende a gastar menos energia com releituras desnecessarias.",
        explanation: [
          "Comece pelo comando. Ele diz se a questao quer ideia principal, inferencia, detalhe especifico ou significado de palavra em contexto.",
          "Depois, localize palavras-chave no enunciado e retorne ao trecho do texto que conversa com elas. Isso ajuda a filtrar alternativas atraentes, mas incompletas.",
        ],
        examples: [
          {
            label: "Idea first",
            content:
              "Se a pergunta pedir main idea, nao mergulhe em um detalhe isolado. Procure o eixo central repetido ao longo do texto.",
          },
          {
            label: "Keyword",
            content:
              "Se o enunciado citar sustainable schools, volte ao paragrafo em que esse termo aparece e leia o contexto imediato.",
          },
        ],
        commonMistakes: [
          "Ler o texto inteiro antes de entender o que a pergunta quer.",
          "Escolher alternativa por conter palavras iguais ao texto, mas com sentido distorcido.",
          "Confundir detalhe com ideia central.",
        ],
        practicalTips: [
          "Leia primeiro a pergunta e marque o tipo de tarefa.",
          "Volte ao trecho certo antes de olhar as alternativas pela segunda vez.",
          "Se duas opcoes parecerem boas, elimine a que exagera, generaliza ou muda o foco.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Alternativa com palavras do texto nao e automaticamente correta. O importante e manter o mesmo sentido.",
        },
        quickSummary:
          "Interpretar bem depende de localizar a pergunta certa, voltar ao trecho certo e comparar sentido, nao apenas vocabulario.",
        commentedQuestion: {
          prompt:
            "What is the best first step when facing a long reading question?",
          options: [
            {
              label: "A",
              text: "Translate every word of the text before reading the question.",
              isCorrect: false,
              commentary:
                "Esse caminho consome tempo e nem sempre ajuda a entender o objetivo da questao.",
            },
            {
              label: "B",
              text: "Read the question first and identify what it wants from the text.",
              isCorrect: true,
              commentary:
                "Correta. Isso orienta a leitura e reduz o risco de buscar informacao irrelevante.",
            },
            {
              label: "C",
              text: "Ignore the text and answer only by the topic.",
              isCorrect: false,
              commentary:
                "Tema geral sem evidencias do texto costuma levar ao erro.",
            },
            {
              label: "D",
              text: "Choose the longest alternative.",
              isCorrect: false,
              commentary:
                "Comprimento da alternativa nao e criterio de correcao.",
            },
          ],
          takeaway:
            "Pergunta primeiro, leitura orientada depois. Isso melhora tempo e qualidade da decisao.",
        },
      },
      {
        title: "Text Interpretation e textos longos",
        introduction:
          "Textos maiores pedem controle de foco e calma para nao transformar leitura em ansiedade.",
        whyItMatters:
          "Em textos longos, o aluno costuma errar por cansaco, pressa ou perda da linha argumentativa.",
        explanation: [
          "Quebre o texto mentalmente em blocos: introducao do tema, desenvolvimento e conclusao ou opiniao final.",
          "Observe pronomes, conectivos e retomadas. Eles mostram como as ideias se organizam e impedem que voce leia os paragrafos como frases soltas.",
        ],
        examples: [
          {
            label: "Contrast marker",
            content:
              "If a paragraph begins with however, the author is probably changing direction or presenting a contrast.",
          },
          {
            label: "Inference",
            content:
              "When the text does not say something directly, compare clues from two or more sentences before inferring.",
          },
        ],
        commonMistakes: [
          "Pular conectivos e perder a mudanca de argumento.",
          "Achar que inferencia e imaginacao livre.",
          "Revisar a resposta sem voltar ao texto.",
        ],
        practicalTips: [
          "Se a ansiedade subir, volte ao trecho exato da pergunta.",
          "Marque mentalmente contraste, causa, consequencia e exemplificacao.",
          "Na revisao final, releia apenas as questoes em que voce nao encontrou evidencia clara.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Inferir nao e inventar. Toda boa inferencia precisa caber no texto e ser sustentada por pistas reais.",
        },
        quickSummary:
          "Em textos longos, organize a leitura por estrutura e evidencias. Isso reduz a pressa e melhora a interpretacao.",
        commentedQuestion: {
          prompt:
            "When a text uses 'however' at the start of a sentence, the reader should expect:",
          options: [
            {
              label: "A",
              text: "a repetition of the previous idea with the same meaning",
              isCorrect: false,
              commentary:
                "However costuma indicar contraste, nao simples repeticao.",
            },
            {
              label: "B",
              text: "an example that confirms the previous statement",
              isCorrect: false,
              commentary:
                "Exemplos podem aparecer com other markers; however normalmente muda a direcao.",
            },
            {
              label: "C",
              text: "a contrasting or limiting idea",
              isCorrect: true,
              commentary:
                "Correta. O conectivo sinaliza mudanca, contraste ou restricao ao que vinha antes.",
            },
            {
              label: "D",
              text: "a conclusion with no relation to the previous sentence",
              isCorrect: false,
              commentary:
                "Ainda existe relacao; o ponto e justamente a oposicao ou limite.",
            },
          ],
          takeaway:
            "Conectivos guiam a interpretacao. Ignora-los e perder a logica do texto.",
        },
      },
    ],
  },
  {
    id: "espanhol",
    navTitle: "Espanhol",
    eyebrow: "Espanhol",
    title: "Revisao essencial de espanhol para leitura, estrutura e vocabulario",
    description:
      "O foco aqui e revisar a base que mais ajuda na interpretacao, nos conectores e nos erros comuns de semelhanca com o portugues.",
    icon: "languages",
    purpose:
      "Consolidar o espanhol funcional de prova, com menos decoreba e mais leitura orientada por contexto.",
    whenToUse:
      "Quando voce precisa revisar estrutura e vocabulário sem se perder em regras excessivamente longas.",
    whyItDeservesAttention:
      "A proximidade com o portugues ajuda, mas tambem aumenta o risco de falso sentido e leitura apressada.",
    units: [
      {
        title: "Presente, Preterito, articulos e pronombres",
        introduction:
          "Esses pontos formam a base da leitura em espanhol e ajudam a localizar tempo, referencia e sentido geral.",
        whyItMatters:
          "Quem domina essa base consegue interpretar textos mais rapido e com menos ruído.",
        explanation: [
          "El presente se usa para hechos habituales, descripcion y valor actual. El preterito marca acciones concluidas o narracion.",
          "Articulos y pronombres ayudan a localizar a quien o a que se refiere cada parte del texto, algo essencial em perguntas de interpretacao.",
        ],
        examples: [
          {
            label: "Presente",
            content: "Ella estudia todos los dias.",
            translation: "Ela estuda todos os dias.",
          },
          {
            label: "Preterito",
            content: "Ayer visitaron el museo.",
            translation: "Ontem eles visitaram o museu.",
          },
        ],
        commonMistakes: [
          "Confundir pronomes por leitura apressada.",
          "Ignorar o valor temporal do verbo.",
          "Assumir que uma forma parecida com o portugues tem exatamente o mesmo uso.",
        ],
        practicalTips: [
          "Observe adverbios de tempo para decidir o valor do verbo.",
          "Quando um pronombre aparecer, volte ao referente no texto.",
          "Leia artigos e determinantes junto do substantivo.",
        ],
        attention: {
          title: "Atencao",
          description:
            "A semelhanca com o portugues acelera, mas tambem pode enganar. Confirme sempre o contexto real da frase.",
        },
        quickSummary:
          "Presente, preterito, articulos e pronombres sustentam a leitura basica e ajudam a evitar interpretacao frouxa.",
        commentedQuestion: {
          prompt:
            "En la frase 'Los estudiantes llegaron temprano porque tenian una actividad especial', 'llegaron' expresa:",
          options: [
            {
              label: "A",
              text: "una accion habitual",
              isCorrect: false,
              commentary: "La frase narra un hecho ocurrido, no una rutina.",
            },
            {
              label: "B",
              text: "una accion futura",
              isCorrect: false,
              commentary: "No hay marca de futuro en la estructura.",
            },
            {
              label: "C",
              text: "una accion concluida en el pasado",
              isCorrect: true,
              commentary:
                "Correcta. Llegaron marca una accion ya ocurrida y terminada.",
            },
            {
              label: "D",
              text: "una posibilidad",
              isCorrect: false,
              commentary: "No se trata de hipotesis o posibilidad.",
            },
          ],
          takeaway:
            "En espanhol, reconhecer o tempo verbal ajuda a organizar a cronologia do texto.",
        },
      },
      {
        title: "Conectores, falsos cognatos e interpretacion",
        introduction:
          "Conectores e heterosemanticos sao decisivos para entender o rumo do texto e nao cair em semelhancas enganosas.",
        whyItMatters:
          "No espanhol, um conector bem lido ou um falso cognato bem identificado pode decidir a alternativa correta.",
        explanation: [
          "Conectores como pero, aunque, por eso, sin embargo e ademas organizam contraste, causa, consequencia e adicao.",
          "Falsos cognatos e heterosemanticos pedem muito cuidado: embarazada, exquisito, oficina, apellido e rato nao devem ser lidos por intuicao automatica.",
        ],
        examples: [
          {
            label: "Conector",
            content: "Queria salir; sin embargo, tuvo que quedarse.",
            translation: "Ela queria sair; no entanto, precisou ficar.",
          },
          {
            label: "Falso cognato",
            content: "Ella esta embarazada.",
            translation: "Ela esta gravida.",
          },
        ],
        commonMistakes: [
          "Traduzir heterosemanticos literalmente.",
          "Nao perceber oposicao marcada por pero ou sin embargo.",
          "Responder pelo sentido global sem confirmar palavra-chave.",
        ],
        practicalTips: [
          "Se houver conector de contraste, reavalie a ideia central da frase.",
          "Monte um repertorio dos heterosemanticos mais perigosos.",
          "Em duvida, use a relacao entre as frases para definir o melhor sentido.",
        ],
        attention: {
          title: "Atencao",
          description:
            "No espanhol, a proximidade com o portugues e uma faca de dois gumes: ajuda no arranque, mas cobra leitura mais rigorosa.",
        },
        quickSummary:
          "Conectores revelam a logica do texto; heterosemanticos exigem cautela redobrada na interpretacao.",
        commentedQuestion: {
          prompt:
            "En la frase 'El examen era dificil; sin embargo, ella se mantuvo tranquila', 'sin embargo' indica:",
          options: [
            {
              label: "A",
              text: "adicion",
              isCorrect: false,
              commentary: "No suma ideas; cambia la direccion del enunciado.",
            },
            {
              label: "B",
              text: "contraste",
              isCorrect: true,
              commentary:
                "Correcta. La segunda parte contrasta con la dificultad del examen.",
            },
            {
              label: "C",
              text: "explicacion",
              isCorrect: false,
              commentary: "No explica la causa, sino opone dos informaciones.",
            },
            {
              label: "D",
              text: "conclusion final",
              isCorrect: false,
              commentary: "No es un cierre, sino una oposicion.",
            },
          ],
          takeaway:
            "Conectores bem lidos simplificam a interpretacao e ajudam a eliminar alternativas incoerentes.",
        },
      },
      {
        title: "Vocabulario, expresiones comunes y temas frecuentes",
        introduction:
          "A prova costuma circular por escola, convivencia, viajes, medio ambiente, tecnologia e rotina.",
        whyItMatters:
          "Conhecer vocabulario funcional desses temas permite responder com mais agilidade e menos desgaste.",
        explanation: [
          "Palavras como horario, viaje, convivencia, aprendizaje, recursos, costumbre e cuidado ambiental aparecem em textos informativos e opinativos.",
          "Expresiones comunes como darse cuenta, tener ganas, llevar a cabo e estar de acuerdo ajudam a interpretar intenções e atitudes.",
        ],
        examples: [
          {
            label: "Expression",
            content: "Los estudiantes se dieron cuenta del cambio.",
            translation: "Os estudantes perceberam a mudanca.",
          },
          {
            label: "Theme",
            content: "La tecnologia puede ampliar el acceso a la educacion.",
            translation: "A tecnologia pode ampliar o acesso a educacao.",
          },
        ],
        commonMistakes: [
          "Traduzir uma expressao como se fosse soma literal das palavras.",
          "Confundir tema do texto com opiniao do autor.",
          "Ignorar o verbo que acompanha o substantivo-chave.",
        ],
        practicalTips: [
          "Relembre temas frequentes e associe palavras tipicas a cada um.",
          "Leia expressoes comuns como bloco de sentido.",
          "Se a palavra for desconhecida, use contexto e conectores antes de desistir.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Expressoes comuns costumam parecer transparentes, mas o sentido real aparece no uso completo da frase.",
        },
        quickSummary:
          "Vocabulário e expressões em espanhol valem mais quando ligados a temas frequentes e ao contexto do texto.",
        commentedQuestion: {
          prompt:
            "En la expresion 'darse cuenta', el sentido mas adecuado es:",
          options: [
            {
              label: "A",
              text: "decorar",
              isCorrect: false,
              commentary: "La expresion no tiene relacion con memorizacion.",
            },
            {
              label: "B",
              text: "percibir o notar",
              isCorrect: true,
              commentary:
                "Correcta. 'Darse cuenta' expresa percepcion o comprension de algo.",
            },
            {
              label: "C",
              text: "viajar",
              isCorrect: false,
              commentary: "No hay ningun sentido de desplazamiento.",
            },
            {
              label: "D",
              text: "olvidar",
              isCorrect: false,
              commentary: "La expresion no aponta esquecimento.",
            },
          ],
          takeaway:
            "Expressoes comuns devem ser aprendidas pelo uso, nao pela traducao literal de cada palavra.",
        },
      },
    ],
  },
  {
    id: "estrategias-de-prova",
    navTitle: "Estrategias de Prova",
    eyebrow: "Execucao",
    title: "Revise com estrategia e reduza erros de ansiedade",
    description:
      "Esse modulo organiza tempo, eliminacao de alternativas, revisao de respostas e leitura sob pressao.",
    icon: "target",
    purpose:
      "Ajudar voce a transformar conhecimento em execucao limpa no dia da prova.",
    whenToUse:
      "Quando o aluno ja conhece o conteudo, mas perde ponto por pressa, excesso de troca ou leitura mal administrada.",
    whyItDeservesAttention:
      "Muita gente sabe mais do que consegue mostrar porque administra mal o tempo e a revisao.",
    units: [
      {
        title: "Administracao de tempo e eliminacao de alternativas",
        introduction:
          "Tempo de prova nao se controla apenas olhando o relogio; se controla decidindo melhor onde investir energia.",
        whyItMatters:
          "Sem estrategia, uma questao travada consome o tempo de varias questoes resolviveis.",
        explanation: [
          "Passe primeiro pelas questoes de leitura mais direta e marque aquelas que exigem retorno mais demorado.",
          "Na eliminacao, procure alternativas que exageram, mudam o foco do texto ou trazem certeza onde o autor foi mais cauteloso.",
        ],
        examples: [
          {
            label: "Tempo",
            content:
              "Se uma questao travar por tempo demais, marque, siga e retorne com a mente menos cansada.",
          },
          {
            label: "Eliminacao",
            content:
              "Se o texto diz often e a alternativa diz always, ha sinal de exagero.",
          },
        ],
        commonMistakes: [
          "Gastar tempo demais para resolver tudo em uma unica passada.",
          "Trocar resposta sem nova evidencia.",
          "Confiar em alternativa que parece bonita, mas muda o foco do texto.",
        ],
        practicalTips: [
          "Antes de responder, pergunte: o texto prova isso?",
          "Se duas opcoes sobrarem, compare qual respeita melhor o tom e o limite do texto.",
          "Na revisao final, priorize questoes que ficaram sem evidencia clara.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Ansiedade adora fazer o aluno reler sem criterio. Releia com objetivo especifico, nao por impulso.",
        },
        quickSummary:
          "Controle de tempo vem de prioridade, decisao e eliminacao inteligente, nao de velocidade cega.",
        commentedQuestion: {
          prompt:
            "Qual atitude costuma ser mais eficiente quando uma questao consome tempo acima do esperado?",
          options: [
            {
              label: "A",
              text: "Permanecer nela ate resolver, mesmo que comprometa o restante da prova.",
              isCorrect: false,
              commentary:
                "Esse comportamento costuma desequilibrar o restante da execucao.",
            },
            {
              label: "B",
              text: "Marcar a questao, seguir adiante e voltar depois com objetivo claro.",
              isCorrect: true,
              commentary:
                "Correta. Isso preserva o tempo das questoes mais acessiveis e reduz a pressao.",
            },
            {
              label: "C",
              text: "Escolher qualquer alternativa para nao perder ritmo.",
              isCorrect: false,
              commentary:
                "Responder sem criterio so transfere o erro para a revisao.",
            },
            {
              label: "D",
              text: "Ignorar completamente a questao ate o final sem marcar nada.",
              isCorrect: false,
              commentary:
                "Vale registrar a dificuldade para retorno posterior, nao apenas abandonar sem estrategia.",
            },
          ],
          takeaway:
            "Gestao de tempo nao e desistir; e decidir o melhor momento para resolver cada questao.",
        },
      },
      {
        title: "Interpretar perguntas, revisar respostas e evitar erros por ansiedade",
        introduction:
          "Boa parte do resultado melhora quando o aluno aprende a ler a pergunta com calma e revisar sem paranoia.",
        whyItMatters:
          "Erros de ansiedade costumam acontecer na leitura do comando, na pressa de marcar e na troca sem fundamento.",
        explanation: [
          "Verifique o que o enunciado quer: ideia central, inferencia, opiniao do autor, vocabulario em contexto ou detalhe especifico.",
          "Na revisao, mude uma resposta apenas se voce encontrar evidencia mais forte do que a usada na primeira escolha.",
        ],
        examples: [
          {
            label: "Command focus",
            content:
              "If the question asks for the best title, you need the main idea, not one supporting detail.",
          },
          {
            label: "Revision",
            content:
              "Trocar de alternativa so porque outra parece mais elegante quase sempre e mau sinal.",
          },
        ],
        commonMistakes: [
          "Responder detalhe quando a pergunta quer ideia principal.",
          "Mudar resposta por inseguranca e nao por evidencia.",
          "Confundir revisar com duvidar de tudo o tempo todo.",
        ],
        practicalTips: [
          "Circule mentalmente a tarefa do enunciado antes de ler as opcoes.",
          "Use a revisao para conferir coerencia, nao para reabrir toda a prova.",
          "Se a resposta original tinha evidencia e a nova nao tem, mantenha a primeira.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Revisar bem e diferente de alimentar ansiedade. A revisao boa confirma; a ansiedade bagunca.",
        },
        quickSummary:
          "Leia o comando com precisao, responda com evidencia e revise apenas o que realmente pede nova checagem.",
        commentedQuestion: {
          prompt:
            "Na revisao final da prova, quando faz mais sentido mudar uma resposta?",
          options: [
            {
              label: "A",
              text: "Quando outra alternativa parece mais bonita visualmente.",
              isCorrect: false,
              commentary:
                "Forma visual nao substitui evidência textual.",
            },
            {
              label: "B",
              text: "Quando o colega ao lado termina mais cedo.",
              isCorrect: false,
              commentary:
                "Ritmo de outro candidato nao e parametro de qualidade da sua resposta.",
            },
            {
              label: "C",
              text: "Quando surge uma evidencia mais consistente do que a usada na primeira escolha.",
              isCorrect: true,
              commentary:
                "Correta. Mudanca boa nasce de evidencia mais forte, nao de nervosismo.",
            },
            {
              label: "D",
              text: "Sempre que houver qualquer duvida residual.",
              isCorrect: false,
              commentary:
                "Duvida residual sem nova base costuma piorar a consistencia da prova.",
            },
          ],
          takeaway:
            "Mudar resposta pode ser bom, mas apenas quando ha motivo melhor e verificavel.",
        },
      },
    ],
  },
  {
    id: "entrevista",
    navTitle: "Entrevista",
    eyebrow: "Entrevista",
    title: "Preparacao completa para responder com naturalidade, clareza e maturidade",
    description:
      "Aqui a ideia nao e decorar falas, e sim entender como organizar respostas melhores e evitar erros comuns de postura e comunicacao.",
    icon: "message",
    purpose:
      "Ajudar o aluno a se apresentar com coerencia, autenticidade e senso de representatividade.",
    whenToUse:
      "Na reta final, para praticar respostas, alinhar postura e ganhar tranquilidade antes da entrevista.",
    whyItDeservesAttention:
      "A entrevista avalia mais do que memoria. Ela tambem revela clareza, maturidade, responsabilidade e forma de comunicacao.",
    units: [
      {
        title: "Perguntas comuns e respostas-modelo",
        introduction:
          "Ter repertorio de resposta nao significa decorar texto. Significa saber como organizar a propria fala.",
        whyItMatters:
          "Quando o aluno entende a estrutura de uma boa resposta, ele fica mais natural e menos travado.",
        explanation: [
          "Perguntas comuns costumam girar em torno de motivacao, adaptacao, responsabilidade, convivencia, planos de estudo e impacto pessoal.",
          "Uma boa resposta curta costuma seguir tres passos: contexto pessoal, acao concreta e resultado ou aprendizado.",
        ],
        examples: [
          {
            label: "Pergunta",
            content: "Why do you want to participate in the program?",
            translation: "Por que voce quer participar do programa?",
          },
          {
            label: "Resposta-modelo",
            content:
              "I want to participate because I see the program as a chance to improve my language skills, grow as a student, and represent my school with responsibility.",
            translation:
              "Quero participar porque vejo o programa como uma oportunidade de melhorar meu idioma, crescer como estudante e representar minha escola com responsabilidade.",
          },
        ],
        commonMistakes: [
          "Responder de forma vaga, sem exemplo concreto.",
          "Memorizar texto longo e soar artificial.",
          "Falar apenas de sonho pessoal sem mostrar responsabilidade.",
        ],
        practicalTips: [
          "Monte respostas em blocos curtos: quem voce e, o que busca e por que isso importa.",
          "Use exemplos reais da sua rotina escolar ou pessoal.",
          "Treine em voz alta para ouvir o ritmo e cortar excessos.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Resposta boa nao parece decorada. Ela parece clara, sincera e organizada.",
        },
        quickSummary:
          "Entenda o eixo da pergunta, responda com exemplo real e termine mostrando maturidade e responsabilidade.",
        commentedQuestion: {
          prompt:
            "Qual resposta tende a funcionar melhor em uma entrevista do programa?",
          options: [
            {
              label: "A",
              text: "Uma fala longa, cheia de frases prontas e elogios genéricos.",
              isCorrect: false,
              commentary:
                "Excesso de frase pronta costuma soar artificial e pouco pessoal.",
            },
            {
              label: "B",
              text: "Uma resposta objetiva, sincera e apoiada em exemplo concreto.",
              isCorrect: true,
              commentary:
                "Correta. Esse formato transmite autenticidade e organizacao.",
            },
            {
              label: "C",
              text: "Uma resposta curta demais, sem explicar nada.",
              isCorrect: false,
              commentary:
                "Responder sem desenvolvimento pode parecer superficial.",
            },
            {
              label: "D",
              text: "Uma resposta focada apenas em viajar e se divertir.",
              isCorrect: false,
              commentary:
                "Falta senso de responsabilidade e objetivo educacional.",
            },
          ],
          takeaway:
            "Boa resposta de entrevista equilibra autenticidade, objetivo e exemplo real.",
        },
      },
      {
        title: "Postura, comunicacao, confianca e o que evitar",
        introduction:
          "A forma como voce responde importa tanto quanto o conteudo da resposta.",
        whyItMatters:
          "Postura, tom de voz, escuta e controle emocional influenciam a percepcao de maturidade.",
        explanation: [
          "Confianca nao e falar rapido nem parecer perfeito. E responder com calma, clareza e coerencia.",
          "Representatividade tambem importa. Mostrar respeito, abertura cultural, responsabilidade e disposicao para aprender fortalece sua imagem.",
        ],
        examples: [
          {
            label: "Postura desejada",
            content:
              "Escutar a pergunta inteira, respirar, responder com calma e manter contato visual adequado.",
          },
          {
            label: "O que evitar",
            content:
              "Interromper, responder no impulso, exagerar capacidades ou parecer indiferente ao impacto do programa.",
          },
        ],
        commonMistakes: [
          "Falar rapido demais por nervosismo.",
          "Usar respostas grandiosas e pouco criveis.",
          "Confundir confianca com rigidez ou excesso de performance.",
        ],
        practicalTips: [
          "Se precisar, peça que a pergunta seja repetida. Isso mostra cuidado, nao fraqueza.",
          "Fale em blocos curtos e finalize cada ideia antes de abrir outra.",
          "Mostre curiosidade, adaptabilidade e responsabilidade com naturalidade.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Nao tente parecer outra pessoa. A melhor impressao costuma vir de clareza, respeito e consistencia.",
        },
        quickSummary:
          "Entrevista forte combina escuta, organizacao, sinceridade e postura segura sem exagero.",
        commentedQuestion: {
          prompt:
            "Qual comportamento tende a transmitir mais maturidade durante a entrevista?",
          options: [
            {
              label: "A",
              text: "Inventar experiencias para impressionar.",
              isCorrect: false,
              commentary:
                "Exagero mina credibilidade e costuma ser percebido.",
            },
            {
              label: "B",
              text: "Responder com calma, exemplos reais e abertura para aprender.",
              isCorrect: true,
              commentary:
                "Correta. Esse conjunto transmite autenticidade, equilibrio e responsabilidade.",
            },
            {
              label: "C",
              text: "Falar o tempo todo sem ouvir a pergunta completa.",
              isCorrect: false,
              commentary:
                "Falta escuta e organizacao da resposta.",
            },
            {
              label: "D",
              text: "Usar frases prontas para todas as perguntas.",
              isCorrect: false,
              commentary:
                "Padronizacao excessiva reduz naturalidade e coerencia.",
            },
          ],
          takeaway:
            "Na entrevista, autenticidade bem organizada costuma valer mais do que performance decorada.",
        },
      },
    ],
  },
  {
    id: "checklist-final",
    navTitle: "Checklist Final",
    eyebrow: "Fechamento",
    title: "Checklist final para chegar mais tranquilo no dia da prova",
    description:
      "Esse modulo organiza os cuidados praticos da vespera e do dia da prova para reduzir erros evitaveis.",
    icon: "shield",
    purpose:
      "Evitar que detalhes simples atrapalhem o desempenho construido ao longo da preparacao.",
    whenToUse:
      "Na vespera e nas horas que antecedem a prova.",
    whyItDeservesAttention:
      "Cansaco, desorganizacao e improviso podem roubar concentracao mesmo de quem estudou bem.",
    units: [
      {
        title: "Documentos, horario, local e materiais",
        introduction:
          "Parte da seguranca no dia da prova vem de nao precisar resolver problema logistico em cima da hora.",
        whyItMatters:
          "Quanto menos friccao pratica, mais energia sobra para ler e responder com calma.",
        explanation: [
          "Confira documento, caneta, local da prova e horario de saida no dia anterior.",
          "Se possivel, deixe tudo separado com antecedencia. Isso reduz ansiedade e evita esquecimentos basicos.",
        ],
        examples: [
          {
            label: "Checklist",
            content:
              "Documento, caneta, rota ate o local, horario de saida, agua e lanche leve.",
          },
          {
            label: "Organizacao",
            content:
              "Dormir sabendo onde esta cada item costuma reduzir muito a tensao da manha da prova.",
          },
        ],
        commonMistakes: [
          "Confiar que vai lembrar de tudo na hora.",
          "Sair sem margem de tempo.",
          "Descobrir o local exato da prova apenas no ultimo minuto.",
        ],
        practicalTips: [
          "Separe tudo na noite anterior.",
          "Calcule um tempo de deslocamento com folga.",
          "Leve apenas o que for necessario para evitar distração.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Ansiedade piora quando a parte pratica nao esta resolvida. Feche essa etapa cedo.",
        },
        quickSummary:
          "Organizacao pratica simples reduz tensao e preserva foco para o que realmente importa: sua prova.",
        commentedQuestion: {
          prompt:
            "Qual atitude ajuda mais a reduzir imprevistos no dia da prova?",
          options: [
            {
              label: "A",
              text: "Separar materiais e confirmar o local apenas na manha da prova.",
              isCorrect: false,
              commentary:
                "Esse timing ainda deixa margem para pressa e erro.",
            },
            {
              label: "B",
              text: "Conferir documentos, caneta, local e horario na vespera.",
              isCorrect: true,
              commentary:
                "Correta. A organizacao antecipada reduz friccao e ansiedade.",
            },
            {
              label: "C",
              text: "Levar o maximo de objetos possivel para se sentir mais seguro.",
              isCorrect: false,
              commentary:
                "Excesso de itens nao resolve e pode virar ruído.",
            },
            {
              label: "D",
              text: "Dormir tarde para revisar mais conteudo novo.",
              isCorrect: false,
              commentary:
                "Sono ruim costuma cobrar caro em atencao e leitura.",
            },
          ],
          takeaway:
            "A melhor prova comeca antes da prova: organizacao simples, clara e antecipada.",
        },
      },
      {
        title: "Sono, alimentacao, agua, descanso e ultimos lembretes",
        introduction:
          "Corpo e mente tambem entram na prova. Revisar cansado ou chegar exausto custa desempenho real.",
        whyItMatters:
          "Atenção, leitura e tomada de decisao dependem de energia regulada.",
        explanation: [
          "Na reta final, nada de conteudo novo pesado. O ganho vem de revisar leve, praticar um pouco e descansar com qualidade.",
          "Durma cedo, hidrate-se, faca uma alimentacao simples e preserve energia mental para o dia seguinte.",
        ],
        examples: [
          {
            label: "Ultimo lembrete",
            content:
              "Revise pontos-chave, pratique de forma curta e depois pare. Seu cerebro tambem precisa consolidar.",
          },
          {
            label: "No dia",
            content:
              "Chegue com tempo, respire, leia a primeira questao com calma e entre no ritmo da prova sem pressa excessiva.",
          },
        ],
        commonMistakes: [
          "Compensar inseguranca estudando conteudo novo na madrugada.",
          "Pular refeicao ou agua.",
          "Confundir revisao final com maratona de cansaco.",
        ],
        practicalTips: [
          "No ultimo dia, prefira blocos leves de revisao.",
          "Se estiver tenso, releia apenas resumos e questoes comentadas.",
          "Lembre-se: descansar tambem e parte da estrategia.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Nada de conteudo novo pesado na vespera. Consolidar vale mais do que acumular informacao cansado.",
        },
        quickSummary:
          "Ultimos lembretes: revisar com leveza, praticar sem exagero, descansar bem e chegar com energia limpa para a prova.",
        commentedQuestion: {
          prompt:
            "Na vespera da prova, qual escolha tende a ser mais inteligente?",
          options: [
            {
              label: "A",
              text: "Estudar ate muito tarde para cobrir topicos novos.",
              isCorrect: false,
              commentary:
                "Esse excesso costuma prejudicar atencao e leitura no dia seguinte.",
            },
            {
              label: "B",
              text: "Fazer revisao leve, organizar o material e dormir cedo.",
              isCorrect: true,
              commentary:
                "Correta. Esse equilibrio favorece memoria, foco e estabilidade emocional.",
            },
            {
              label: "C",
              text: "Ignorar a hidratacao para evitar interrupcoes.",
              isCorrect: false,
              commentary: "Hidratacao faz parte do bom funcionamento cognitivo.",
            },
            {
              label: "D",
              text: "Revisar apenas pelas redes sociais ou anotações soltas.",
              isCorrect: false,
              commentary:
                "Esse formato tende a ser disperso e pouco confiavel.",
            },
          ],
          takeaway:
            "Na reta final, descanso estruturado nao e perda de tempo; e preparacao de alto valor.",
        },
      },
    ],
  },
  {
    id: "pratica-final",
    navTitle: "Pratica final",
    eyebrow: "Pratica final",
    title: "Feche a revisao com simulados conectados ao que voce acabou de revisar",
    description:
      "A central termina em pratica porque revisao forte sem aplicacao imediata perde parte do impacto.",
    icon: "target",
    purpose:
      "Transformar revisao em tomada de decisao real sob tempo e com correcao posterior.",
    whenToUse:
      "Depois de revisar os modulos prioritarios ou quando quiser diagnosticar lacunas antes de repetir a leitura.",
    whyItDeservesAttention:
      "Simulados mostram o que voce realmente consegue sustentar no ritmo da prova, nao apenas o que parece ter entendido.",
    units: [
      {
        title: "Como usar os simulados depois da revisao",
        introduction:
          "O melhor uso do simulado na reta final e diagnosticar, corrigir e voltar apenas ao que ainda pede reforco.",
        whyItMatters:
          "Sem essa ponte, o aluno faz simulado como evento isolado e perde valor de aprendizagem.",
        explanation: [
          "Escolha um objetivo claro antes de abrir o simulado: validar leitura, checar vocabulario, revisar espanhol ou treinar controle emocional sob tempo.",
          "Depois do resultado, volte a este material apenas nos pontos em que a prova mostrou fragilidade real.",
        ],
        examples: [
          {
            label: "Fluxo inteligente",
            content:
              "Revisar interpretacao -> fazer simulado -> analisar erros -> retornar apenas ao modulo necessario.",
          },
          {
            label: "Erro comum",
            content:
              "Fazer varios simulados seguidos sem revisar os erros entre eles costuma reduzir o ganho pedagogico.",
          },
        ],
        commonMistakes: [
          "Usar simulado apenas para pontuacao e nao para diagnostico.",
          "Repetir tentativa sem corrigir o tipo de erro cometido.",
          "Sair do simulado sem registrar quais modulos precisam de retorno.",
        ],
        practicalTips: [
          "Ao terminar, anote dois pontos fortes e dois pontos a reforcar.",
          "Se o erro foi de leitura, volte para interpretacao ou estrategias.",
          "Se o erro foi de vocabulario ou estrutura, revise o modulo correspondente antes da proxima tentativa.",
        ],
        attention: {
          title: "Atencao",
          description:
            "Simulado serve para mostrar caminho. O valor nao esta apenas na nota, mas no que ela revela.",
        },
        quickSummary:
          "Revisao e simulado se fortalecem quando voce usa o resultado para decidir exatamente o que revisar depois.",
        commentedQuestion: {
          prompt:
            "Qual uso do simulado tende a gerar mais aprendizagem na reta final?",
          options: [
            {
              label: "A",
              text: "Fazer varias tentativas seguidas sem analisar erros.",
              isCorrect: false,
              commentary:
                "Volume sem analise reduz o aproveitamento pedagogico.",
            },
            {
              label: "B",
              text: "Usar o resultado para identificar lacunas e voltar ao modulo certo.",
              isCorrect: true,
              commentary:
                "Correta. O simulado vira diagnostico e alimenta revisao inteligente.",
            },
            {
              label: "C",
              text: "Escolher respostas apenas para terminar mais rapido.",
              isCorrect: false,
              commentary:
                "Sem criterio, o resultado perde valor como diagnostico.",
            },
            {
              label: "D",
              text: "Ignorar o historico e revisar tudo do zero sempre.",
              isCorrect: false,
              commentary:
                "Isso desperdiça dados reais de desempenho.",
            },
          ],
          takeaway:
            "Simulado bem usado encurta o caminho da revisao porque mostra onde voce deve investir energia.",
        },
      },
    ],
  },
];
