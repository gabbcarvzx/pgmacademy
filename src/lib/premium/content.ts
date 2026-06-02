export type PremiumModule = {
  slug: string;
  title: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  editorialStatus: "initial";
  sourceTag: string;
  summary: string;
  officialBasis: string[];
  reusableGuidance: string[];
  confirmOfficially: string[];
};

const sourceTag =
  "Base editorial inicial: editais PGM 2024 e 2026. Regras oficiais devem ser confirmadas no edital vigente e nos canais oficiais.";

export const premiumModules: PremiumModule[] = [
  {
    slug: "guia-do-intercambista",
    title: "Guia do intercambista",
    category: "Preparacao geral",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (18).jpeg",
    imageAlt: "Paisagem urbana no Canada ao entardecer.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "Organize a jornada como um processo de prontidao: requisitos, documentos, comportamento, rotina de estudos e acompanhamento constante das comunicacoes oficiais.",
    officialBasis: [
      "A classificacao no processo seletivo gera expectativa de direito, nao garantia automatica de intercambio.",
      "A efetivacao depende de etapas e condicoes como vagas, passaporte valido, visto consular, formulario medico, entrevista psicossocial e processo de contratacao.",
      "O estudante deve permanecer matriculado, frequentando aulas e cumprindo as etapas de preparacao ate o embarque.",
      "Candidato e responsaveis devem acompanhar publicacoes, reunioes e comunicados oficiais.",
    ],
    reusableGuidance: [
      "Mantenha uma pasta fisica e digital com documentos pessoais, escolares e autorizacoes familiares.",
      "Crie rotina semanal para acompanhar editais, comunicados, prazos e pendencias.",
      "Continue estudando idioma, comportamento intercultural e autonomia mesmo depois da aprovacao.",
      "Prepare a familia para mudancas possiveis de destino, periodo de embarque e orientacoes operacionais.",
    ],
    confirmOfficially: [
      "Cronograma vigente, chamadas, prazos e listas de convocacao.",
      "Pais, cidade, periodo de embarque e empresa responsavel pelo intercambio.",
      "Documentos exigidos em cada fase e forma oficial de envio.",
    ],
  },
  {
    slug: "passaporte",
    title: "Passaporte",
    category: "Documentacao",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (21).jpeg",
    imageAlt: "Vista aerea de montanhas nevadas durante voo.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "O passaporte e uma etapa critica porque a viagem depende de documento valido e dados consistentes entre escola, familia, governo e processo consular.",
    officialBasis: [
      "Os editais analisados condicionam a realizacao do intercambio a apresentacao de passaporte valido.",
      "Responsaveis legais devem providenciar documentos solicitados e manter dados de contato atualizados.",
      "Termos de compromisso, autorizacoes e formularios podem ser exigidos em fases posteriores.",
    ],
    reusableGuidance: [
      "Confira nome completo, filiacao, data de nascimento e CPF antes de iniciar qualquer processo documental.",
      "Separe RG, CPF, comprovantes escolares, autorizacoes e contatos dos responsaveis em uma pasta unica.",
      "Nao deixe a organizacao documental para depois da convocacao final, porque prazos podem ser curtos.",
      "Guarde copias digitais em local seguro e acessivel aos responsaveis.",
    ],
    confirmOfficially: [
      "Quem sera responsavel por custos, agendamento e entrega do passaporte no edital vigente.",
      "Validade minima aceita para o pais de destino.",
      "Lista oficial de documentos aceitos e prazos operacionais.",
    ],
  },
  {
    slug: "visto",
    title: "Visto",
    category: "Documentacao",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (4).jpeg",
    imageAlt: "Farol vermelho e branco com cidade ao fundo no Canada.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "O visto deve ser tratado como uma etapa consular sensivel: depende do pais, do perfil do estudante, da documentacao correta e das orientacoes oficiais do programa.",
    officialBasis: [
      "Os editais analisados indicam que a efetivacao do intercambio depende de visto consular quando aplicavel.",
      "O pais de destino pode sofrer alteracao antes do embarque, o que impacta exigencias consulares.",
      "Formulario medico, passaporte, entrevistas e contratacao tambem fazem parte das condicoes para a viagem.",
    ],
    reusableGuidance: [
      "Mantenha documentos escolares, autorizacoes dos responsaveis e passaporte prontos para envio quando solicitado.",
      "Responda formularios consulares com informacoes verdadeiras e consistentes com os documentos.",
      "Acompanhe instrucoes do programa antes de buscar orientacoes paralelas ou pagar servicos externos.",
      "Avise imediatamente a familia e a coordenacao sobre erro documental, perda de prazo ou mudanca de dados.",
    ],
    confirmOfficially: [
      "Categoria de visto exigida para o destino definido.",
      "Necessidade de biometria, entrevista, taxas ou comparecimento presencial.",
      "Responsavel operacional pelo processo consular e pelos custos.",
    ],
  },
  {
    slug: "mala",
    title: "Mala",
    category: "Viagem",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (17).jpeg",
    imageAlt: "Por do sol visto de uma trilha no Canada.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "A mala deve equilibrar clima, escola, documentos, limites da companhia aerea e responsabilidade financeira da familia em caso de excesso ou descuido.",
    officialBasis: [
      "Os termos analisados orientam o estudante a observar limites de peso e quantidade de bagagem.",
      "Excesso de bagagem, perda de voo ou alteracao de itinerario causada por negligencia pode gerar custo para estudante e responsaveis.",
      "O estudante deve usar recursos financeiros do programa de forma responsavel, quando houver bolsas previstas no edital.",
      "O embarque e o retorno podem exigir uniforme ou padrao definido pela organizacao.",
    ],
    reusableGuidance: [
      "Leve documentos, itens essenciais e uma muda de roupa na bagagem de mao.",
      "Planeje roupas por camadas, considerando frio, chuva, rotina escolar e atividades externas.",
      "Evite objetos proibidos, alimentos restritos, liquidos fora do padrao e itens que possam atrasar a fiscalizacao.",
      "Pese a mala antes de sair de casa e deixe espaco para materiais recebidos durante o intercambio.",
    ],
    confirmOfficially: [
      "Franquia de bagagem da companhia aerea e voos contratados.",
      "Lista oficial de itens proibidos e documentos que devem ir com o estudante.",
      "Clima do destino, codigo de vestimenta escolar e orientacoes de uniforme.",
    ],
  },
  {
    slug: "aeroporto",
    title: "Aeroporto",
    category: "Viagem",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (19).jpeg",
    imageAlt: "Area portuaria iluminada no Canada durante a noite.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "O deslocamento exige disciplina de grupo: documentos acessiveis, atencao aos horarios, comunicacao clara e cumprimento das orientacoes da equipe responsavel.",
    officialBasis: [
      "Os editais e termos analisados indicam que embarque e retorno devem seguir datas, orientacoes e organizacao do programa.",
      "Viagens desacompanhadas durante o intercambio sao vedadas, salvo situacoes autorizadas com host family, escola ou pessoa indicada.",
      "Mudancas de pais, semestre, host family ou periodo de embarque podem ocorrer antes da viagem.",
    ],
    reusableGuidance: [
      "Chegue cedo ao ponto de encontro com documentos, passaporte e contatos de emergencia em maos.",
      "Permaneca com o grupo, siga a coordenacao e evite deslocamentos sem autorizacao.",
      "Mantenha celular carregado, mas priorize comunicacao oficial em situacoes de problema.",
      "Informe imediatamente extravio de documento, mala, atraso, mal-estar ou dificuldade de comunicacao.",
    ],
    confirmOfficially: [
      "Horario e local de apresentacao para embarque.",
      "Regras de acompanhante, uniforme, check-in e conexoes.",
      "Canais oficiais para comunicacao durante viagem e chegada.",
    ],
  },
  {
    slug: "host-family",
    title: "Host family",
    category: "Adaptacao",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.50 AM (1).jpeg",
    imageAlt: "Jardim com vista para montanhas e agua no Canada.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "A convivencia com host family e parte central da experiencia intercultural e exige respeito a rotina da casa, comunicacao madura e pedido de ajuda no momento certo.",
    officialBasis: [
      "Os editais analisados preveem acomodacao preferencialmente em host family, conforme disponibilidade e regras do destino.",
      "A escola no exterior pode ser definida conforme residencia da host family e regras locais.",
      "Mudancas de host family podem ocorrer por necessidade operacional, saude, seguranca, permanencia ou adaptacao.",
      "O estudante deve respeitar regras da familia anfitria, da escola, do programa e do pais de destino.",
    ],
    reusableGuidance: [
      "Pergunte sobre horarios, alimentacao, tarefas, transporte, banho, lavanderia e uso de internet nos primeiros dias.",
      "Evite comparar tudo com a rotina do Brasil; observe, agradeca e se adapte com respeito.",
      "Comunique desconfortos com maturidade e registre problemas recorrentes para pedir apoio.",
      "Mantenha contato com a familia no Brasil sem abandonar a convivencia local.",
    ],
    confirmOfficially: [
      "Dados da host family, endereco, contatos e regras especificas da casa.",
      "Procedimento oficial para troca de familia ou relato de problema.",
      "Papel da escola, coordenacao local e empresa de intercambio no suporte ao estudante.",
    ],
  },
  {
    slug: "adaptacao-cultural",
    title: "Adaptacao cultural",
    category: "Adaptacao",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (20).jpeg",
    imageAlt: "Trilha em floresta no Canada com luz entre as arvores.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "Adaptacao cultural nao e improviso: envolve maturidade, cumprimento de regras, cuidado emocional, respeito a diferencas e comunicacao preventiva.",
    officialBasis: [
      "Os termos analisados exigem comunicacao de dificuldades emocionais, psicologicas, de adaptacao ou de convivencia.",
      "Sao proibidos condutas como consumo de alcool, drogas ilicitas, atos criminosos, esportes radicais, viagens nao autorizadas e descumprimento de regras locais.",
      "Descumprimentos podem levar a cancelamento da participacao, retorno antecipado e responsabilizacao por danos.",
      "Responsaveis devem permitir a experiencia intercultural e evitar visitas durante o periodo do intercambio, conforme regras dos termos analisados.",
    ],
    reusableGuidance: [
      "Espere sentir saudade e estranhamento; isso faz parte da curva de adaptacao.",
      "Procure apoio antes que um problema pequeno vire crise.",
      "Pratique escuta, pontualidade, comunicacao clara e respeito a combinados.",
      "Evite decisoes impulsivas quando estiver cansado, frustrado ou com dificuldade no idioma.",
    ],
    confirmOfficially: [
      "Canais de apoio psicossocial e emergencia no pais de destino.",
      "Regras locais da escola, host family, empresa e programa.",
      "Procedimento para relato de risco, conflito ou necessidade de retorno.",
    ],
  },
  {
    slug: "vida-escolar-no-exterior",
    title: "Vida escolar no exterior",
    category: "Escola",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.50 AM.jpeg",
    imageAlt: "Escola no Canada com playground em primeiro plano.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "A vida escolar fora do Brasil deve ser encarada como compromisso academico real, nao apenas como experiencia turistica.",
    officialBasis: [
      "Os editais analisados indicam que a matricula no exterior segue regras locais e a residencia da host family.",
      "O estudante deve cumprir frequencia, participar das aulas e ser aprovado nas disciplinas cursadas no exterior para validacao posterior.",
      "Ao retornar, pode ser necessario cumprir complementacao curricular, compartilhar experiencia e produzir relatorios, portfolio ou trabalho de conclusao.",
      "A experiencia tambem envolve protagonismo juvenil, voluntariado e compromisso de retorno a rede estadual.",
    ],
    reusableGuidance: [
      "Chegue pontualmente, acompanhe tarefas, salve comprovantes e peca feedback aos professores.",
      "Anote diferencas entre metodos de avaliacao, prazos, participacao em aula e comunicacao com docentes.",
      "Use a escola para praticar idioma e criar rotina social saudavel.",
      "Guarde certificados, boletins, horarios e materiais que possam ajudar na validacao no Brasil.",
    ],
    confirmOfficially: [
      "Calendario e regras da escola anfitria.",
      "Modelo de validacao de disciplinas e complementacao curricular no retorno.",
      "Formato exigido para relatorio, portfolio, TCI ou atividade de compartilhamento.",
    ],
  },
];

export const premiumModuleCount = premiumModules.length;
export const premiumPublishedModuleCount = premiumModules.filter(
  (module) => module.editorialStatus === "initial",
).length;
