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
  "Base editorial inicial: Edital de Abertura PGM 2026. Regras oficiais devem ser confirmadas no edital vigente, no IGEDUC e nos canais oficiais.";

export const premiumModules: PremiumModule[] = [
  {
    slug: "guia-do-intercambista",
    title: "Guia do intercambista",
    category: "Preparação geral",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (18).jpeg",
    imageAlt: "Paisagem urbana no Canadá ao entardecer.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "Organize a jornada como um processo de prontidão: requisitos, documentos, comportamento, rotina de estudos e acompanhamento constante das comunicacoes oficiais.",
    officialBasis: [
      "A classificação no processo seletivo gera expectativa de direito, não garantia automática de intercâmbio.",
      "A efetivação depende de etapas e condições como vagas, passaporte válido, visto consular, formulário medico, entrevista psicossocial e processo de contratação.",
      "O estudante deve permanecer matriculado, frequentando aulas e cumprindo as etapas de preparação até o embarque.",
      "Candidato e responsáveis devem acompanhar publicacoes, reunioes e comunicados oficiais.",
    ],
    reusableGuidance: [
      "Mantenha uma pasta fisica e digital com documentos pessoais, escolares e autorizações familiares.",
      "Crie rotina semanal para acompanhar editais, comunicados, prazos e pendencias.",
      "Continue estudando idioma, comportamento intercultural e autonomia mesmo depois da aprovação.",
      "Prepare a família para mudanças possiveis de destino, período de embarque e orientações operacionais.",
    ],
    confirmOfficially: [
      "Cronograma vigente, chamadas, prazos e listas de convocação.",
      "País, cidade, período de embarque e empresa responsável pelo intercâmbio.",
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
      "O passaporte é uma etapa crítica porque a viagem depende de documento válido e dados consistentes entre escola, família, governo e processo consular.",
    officialBasis: [
      "Os editais analisados condicionam a realizacao do intercâmbio a apresentacao de passaporte válido.",
      "Responsáveis legais devem providenciar documentos solicitados e manter dados de contato atualizados.",
      "Termos de compromisso, autorizações e formulários podem ser exigidos em fases posteriores.",
    ],
    reusableGuidance: [
      "Confira nome completo, filiacao, data de nascimento e CPF antes de iniciar qualquer processo documental.",
      "Separe RG, CPF, comprovantes escolares, autorizações e contatos dos responsáveis em uma pasta unica.",
      "Não deixe a organização documental para depois da convocação final, porque prazos podem ser curtos.",
      "Guarde copias digitais em local seguro e acessivel aos responsáveis.",
    ],
    confirmOfficially: [
      "Quem será responsável por custos, agendamento e entrega do passaporte no edital vigente.",
      "Validade mínima aceita para o país de destino.",
      "Lista oficial de documentos aceitos e prazos operacionais.",
    ],
  },
  {
    slug: "visto",
    title: "Visto",
    category: "Documentacao",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (4).jpeg",
    imageAlt: "Farol vermelho e branco com cidade ao fundo no Canadá.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "O visto deve ser tratado como uma etapa consular sensivel: depende do país, do perfil do estudante, da documentacao correta e das orientações oficiais do programa.",
    officialBasis: [
      "Os editais analisados indicam que a efetivação do intercâmbio depende de visto consular quando aplicavel.",
      "O país de destino pode sofrer alteracao antes do embarque, o que impacta exigencias consulares.",
      "Formulário medico, passaporte, entrevistas e contratação também fazem parte das condições para a viagem.",
    ],
    reusableGuidance: [
      "Mantenha documentos escolares, autorizações dos responsáveis e passaporte prontos para envio quando solicitado.",
      "Responda formulários consulares com informações verdadeiras e consistentes com os documentos.",
      "Acompanhe instruções do programa antes de buscar orientações paralelas ou pagar serviços externos.",
      "Avise imediatamente a família e a coordenação sobre erro documental, perda de prazo ou mudança de dados.",
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
    imageAlt: "Pôr do sol visto de uma trilha no Canadá.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "A mala deve equilibrar clima, escola, documentos, limites da companhia aerea e responsabilidade financeira da família em caso de excesso ou descuido.",
    officialBasis: [
      "Os termos analisados orientam o estudante a observar limites de peso e quantidade de bagagem.",
      "Excesso de bagagem, perda de voo ou alteracao de itinerario causada por negligencia pode gerar custo para estudante e responsáveis.",
      "O estudante deve usar recursos financeiros do programa de forma responsável, quando houver bolsas previstas no edital.",
      "O embarque e o retorno podem exigir uniforme ou padrao definido pela organização.",
    ],
    reusableGuidance: [
      "Leve documentos, itens essenciais e uma muda de roupa na bagagem de mão.",
      "Planeje roupas por camadas, considerando frio, chuva, rotina escolar e atividades externas.",
      "Evite objetos proibidos, alimentos restritos, liquidos fora do padrao e itens que possam atrasar a fiscalizacao.",
      "Pese a mala antes de sair de casa e deixe espaço para materiais recebidos durante o intercâmbio.",
    ],
    confirmOfficially: [
      "Franquia de bagagem da companhia aerea e voos contratados.",
      "Lista oficial de itens proibidos e documentos que devem ir com o estudante.",
      "Clima do destino, codigo de vestimenta escolar e orientações de uniforme.",
    ],
  },
  {
    slug: "aeroporto",
    title: "Aeroporto",
    category: "Viagem",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (19).jpeg",
    imageAlt: "Área portuaria iluminada no Canadá durante a noite.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "O deslocamento exige disciplina de grupo: documentos acessiveis, atenção aos horários, comunicação clara e cumprimento das orientações da equipe responsável.",
    officialBasis: [
      "Os editais e termos analisados indicam que embarque e retorno devem seguir datas, orientações e organização do programa.",
      "Viagens desacompanhadas durante o intercâmbio são vedadas, salvo situações autorizadas com host family, escola ou pessoa indicada.",
      "Mudanças de país, semestre, host family ou período de embarque podem ocorrer antes da viagem.",
    ],
    reusableGuidance: [
      "Chegue cedo ao ponto de encontro com documentos, passaporte e contatos de emergencia em maos.",
      "Permaneça com o grupo, siga a coordenação e evite deslocamentos sem autorização.",
      "Mantenha celular carregado, mas priorize comunicação oficial em situações de problema.",
      "Informe imediatamente extravio de documento, mala, atraso, mal-estar ou dificuldade de comunicação.",
    ],
    confirmOfficially: [
      "Horario e local de apresentacao para embarque.",
      "Regras de acompanhante, uniforme, check-in e conexoes.",
      "Canais oficiais para comunicação durante viagem e chegada.",
    ],
  },
  {
    slug: "host-family",
    title: "Host family",
    category: "Adaptação",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.50 AM (1).jpeg",
    imageAlt: "Jardim com vista para montanhas e agua no Canadá.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "A convivência com host family é parte central da experiência intercultural e exige respeito a rotina da casa, comunicação madura e pedido de ajuda no momento certo.",
    officialBasis: [
      "Os editais analisados preveem acomodacao preferencialmente em host family, conforme disponibilidade e regras do destino.",
      "A escola no exterior pode ser definida conforme residência da host family e regras locais.",
      "Mudanças de host family podem ocorrer por necessidade operacional, saúde, segurança, permanência ou adaptação.",
      "O estudante deve respeitar regras da família anfitria, da escola, do programa e do país de destino.",
    ],
    reusableGuidance: [
      "Pergunte sobre horários, alimentacao, tarefas, transporte, banho, lavanderia e uso de internet nos primeiros dias.",
      "Evite comparar tudo com a rotina do Brasil; observe, agradeca e se adapte com respeito.",
      "Comunique desconfortos com maturidade e registre problemas recorrentes para pedir apoio.",
      "Mantenha contato com a família no Brasil sem abandonar a convivência local.",
    ],
    confirmOfficially: [
      "Dados da host family, endereco, contatos e regras especificas da casa.",
      "Procedimento oficial para troca de família ou relato de problema.",
      "Papel da escola, coordenação local e empresa de intercâmbio no suporte ao estudante.",
    ],
  },
  {
    slug: "adaptacao-cultural",
    title: "Adaptação cultural",
    category: "Adaptação",
    imageSrc:
      "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (20).jpeg",
    imageAlt: "Trilha em floresta no Canadá com luz entre as arvores.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "Adaptação cultural não e improviso: envolve maturidade, cumprimento de regras, cuidado emocional, respeito a diferenças e comunicação preventiva.",
    officialBasis: [
      "Os termos analisados exigem comunicação de dificuldades emocionais, psicologicas, de adaptação ou de convivência.",
      "São proibidos condutas como consumo de álcool, drogas ilícitas, atos criminosos, esportes radicais, viagens não autorizadas e descumprimento de regras locais.",
      "Descumprimentos podem levar a cancelamento da participação, retorno antecipado e responsabilizacao por danos.",
      "Responsáveis devem permitir a experiência intercultural e evitar visitas durante o período do intercâmbio, conforme regras dos termos analisados.",
    ],
    reusableGuidance: [
      "Espere sentir saudade e estranhamento; isso faz parte da curva de adaptação.",
      "Procure apoio antes que um problema pequeno vire crise.",
      "Pratique escuta, pontualidade, comunicação clara e respeito a combinados.",
      "Evite decisoes impulsivas quando estiver cansado, frustrado ou com dificuldade no idioma.",
    ],
    confirmOfficially: [
      "Canais de apoio psicossocial e emergencia no país de destino.",
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
    imageAlt: "Escola no Canadá com playground em primeiro plano.",
    editorialStatus: "initial",
    sourceTag,
    summary:
      "A vida escolar fora do Brasil deve ser encarada como compromisso acadêmico real, não apenas como experiência turística.",
    officialBasis: [
      "Os editais analisados indicam que a matrícula no exterior segue regras locais e a residência da host family.",
      "O estudante deve cumprir frequência, participar das aulas e ser aprovado nas disciplinas cursadas no exterior para validação posterior.",
      "Ao retornar, pode ser necessário cumprir complementação curricular, compartilhar experiência e produzir relatórios, portfolio ou trabalho de conclusão.",
      "A experiência também envolve protagonismo juvenil, voluntariado e compromisso de retorno a rede estadual.",
    ],
    reusableGuidance: [
      "Chegue pontualmente, acompanhe tarefas, salve comprovantes e peca feedback aos professores.",
      "Anote diferenças entre métodos de avaliação, prazos, participação em aula e comunicação com docentes.",
      "Use a escola para praticar idioma e criar rotina social saudável.",
      "Guarde certificados, boletins, horários e materiais que possam ajudar na validação no Brasil.",
    ],
    confirmOfficially: [
      "Calendario e regras da escola anfitria.",
      "Modelo de validação de disciplinas e complementação curricular no retorno.",
      "Formato exigido para relatorio, portfolio, TCI ou atividade de compartilhamento.",
    ],
  },
];

export const premiumModuleCount = premiumModules.length;
export const premiumPublishedModuleCount = premiumModules.filter(
  (module) => module.editorialStatus === "initial",
).length;
