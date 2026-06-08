# Auditoria Executiva PGM Academy

Data da auditoria: 03/06/2026  
Escopo: frontend, backend, banco de dados, conteudo, trilhas, simulados, Mentor IA, area premium, landing page, checkout, onboarding, suporte, conversao, retencao e roadmap SaaS.

## Fontes e Base de Analise

- Codigo local analisado: `src/`, `supabase/migrations/`, `scripts/content/approved-content.ts`, `docs/CONTENT_SCALE_REVIEW.md`, `docs/CONTENT_REVIEW.md`.
- Fonte oficial SEE, noticia 12/05/2026: https://portal.educacao.pe.gov.br/governo-de-pernambuco-oferta-duas-mil-vagas-para-o-programa-ganhe-o-mundo/
- Edital oficial PGM 2026, Edital de Abertura no. 01/2026: https://portal.educacao.pe.gov.br/wp-content/uploads/2026/05/0d68cd50-48a7-492c-88f7-0c7b9af530c0.pdf
- Curso preparatorio oficial SEE, noticia 04/10/2025: https://portal.educacao.pe.gov.br/see-oferece-curso-preparatorio-para-o-programa-ganhe-o-mundo/

Observacao critica: o edital 2026 analisado informa 2.000 vagas, sendo 1.400 para lingua inglesa e 600 para lingua espanhola. Tambem informa destinos Canada, Estados Unidos, Reino Unido, Argentina e Espanha, prova subjetiva com 5 questoes de 90 a 150 palavras e entrevista psicossocial eliminatoria. Parte da base local do Mentor IA ainda cita 700 vagas e destinos antigos. Isso precisa ser corrigido antes de escalar uso real.

## Diagnostico Executivo

A PGM Academy ja saiu do estagio de prototipo simples. O produto tem uma base tecnica real: Next.js, Supabase, RLS, multi-tenant inicial, controle de acesso premium, checkout Asaas, banco de conteudo, simulados, feedback manual, analytics e Mentor IA.

O problema principal nao e "falta de sistema". O problema e maturidade de produto. A plataforma ainda se comunica como um MVP tecnico com conteudo limitado, nao como uma experiencia EdTech premium, guiada, atualizada pelo edital e desenhada para conversao, retencao e autoridade.

Pontuacao atual estimada:

| Area | Nota atual | Diagnostico |
|---|---:|---|
| Backend e banco | 7,4/10 | Boa base multi-tenant e RLS, mas faltam entitlements, observabilidade, lifecycle de plano e versionamento editorial por edital. |
| Frontend visual | 7,0/10 | Visual consistente e sobrio, mas ainda com cara de painel tecnico. Falta hierarquia aspiracional e jornadas guiadas. |
| UX do aluno | 6,1/10 | Navegacao completa, porem fragmentada. Falta onboarding, missao diaria e proximo passo claro. |
| Pedagogia | 5,8/10 | Existe acervo autoral validado, mas pequeno para promessa premium. Falta matriz por competencia do edital. |
| Simulados | 5,7/10 | Funcionais, mas ainda nao espelham com precisao a estrutura oficial 2026. |
| Mentor IA | 5,2/10 | Boa ideia e bons limites, mas base oficial desatualizada torna o recurso arriscado. |
| Conversao | 5,5/10 | Tem landing e planos, mas falta prova, urgencia contextual, pos-compra e checkout trust. |
| Suporte | 2,5/10 | Nao ha Central de Sucesso estruturada. Isso vira gargalo comercial. |
| Monetizacao SaaS | 4,8/10 | Pagamento unico funciona para MVP, mas nao cria negocio recorrente previsivel. |
| Produto premium | 5,9/10 | Ha recursos premium, mas o valor percebido ainda depende de aumento de acervo, feedback e personalizacao. |

Meta realista: chegar a 8/10 em 30 dias e 9,2/10 em 90 dias. Chegar a 10/10 exige escala editorial, dados reais de desempenho, suporte profissional e modelo recorrente.

## 1. Auditoria de Nomenclatura

A nomenclatura atual e funcional, mas generica. Termos como "Dashboard", "Analytics", "Estudos", "Trilhas", "Subjetivas" e "Area Premium" descrevem funcionalidades, nao uma jornada premium de aprovacao, desempenho e intercambio.

| Nome atual | Problema | Nome recomendado | Justificativa estrategica |
|---|---|---|---|
| PGM Academy | Bom, mas pode parecer oficial se isolado. | PGM Academy - Preparacao Independente | Mantem marca, reduz risco institucional e reforca posicionamento seguro. |
| Dashboard | Generico e tecnico. | Painel de Missao | Orienta acao diaria e aumenta engajamento. |
| Analytics | Termo frio para aluno jovem. | Meu Desempenho | Mais claro, emocional e direto. |
| Estudos | Muito amplo. | Biblioteca de Preparacao | Passa curadoria e organizacao. |
| Trilhas | Bom, mas generico. | Rota de Aprovacao | Sugere caminho, progresso e foco em resultado sem prometer vaga. |
| Flashcards | Termo aceitavel, mas pouco premium. | Revisao Inteligente | Comunica memorizacao ativa e metodo. |
| Subjetivas | Frio e pouco claro. | Escrita Internacional | Conecta com idioma, prova subjetiva e sonho do intercambio. |
| Entrevista | Incompleto. | Treino Psicossocial | Aderente ao edital e mais profissional. |
| Diagnostico | Bom, mas pode ser mais especifico. | Diagnostico de Elegibilidade | Explica valor e reduz duvida. |
| Simulados | Bom. | Simulados PGM | Conecta com prova e posicionamento. |
| Planos | Generico comercial. | Premium | Mais direto para conversao. |
| Area Premium | Parece pasta de conteudos. | Academia PGM | Cria ambiente exclusivo e aspiracional. |
| Mentor PGM | Bom, mas pode evoluir. | Mentor Internacional PGM | Reforca intercambio, preparacao e exclusividade. |
| Plano Premium | Basico. | Passaporte Premium | Forte para imaginario internacional, mas usar com aviso: nao e documento oficial. |

Recomendacao: manter "PGM Academy" como marca principal e criar "Academia PGM" como area premium interna. Evitar qualquer frase que soe como "garantia de aprovacao". O produto deve vender preparacao, vantagem competitiva e clareza, nao promessa de resultado oficial.

## 2. Auditoria Pedagogica

### Estado atual do acervo

Conteudo validado localmente:

| Tipo | Quantidade atual |
|---|---:|
| Categorias | 20 |
| Bancos de questoes | 5 |
| Templates de simulado | 5 |
| Materiais | 12 |
| Flashcards | 60 |
| Questoes objetivas | 100 |
| Questoes subjetivas | 20 |
| Perguntas psicossociais | 30 |
| Trilhas | 6 |

Distribuicao objetiva atual:

| Frente | Atual |
|---|---:|
| Ingles | 35 |
| Espanhol | 25 |
| Portugues/regras/preparacao | 20 |
| Mixed | 10 |
| Psicossocial | 10 |

Distribuicao por dificuldade:

| Dificuldade atual | Quantidade |
|---|---:|
| Beginner | 47 |
| Intermediate | 45 |
| Advanced | 8 |

Diagnostico pedagogico: a plataforma tem uma boa semente, mas ainda nao tem densidade suficiente para ser percebida como preparacao completa. O edital 2026 traz conteudo programatico amplo de gramatica, vocabulario, leitura e comunicacao. O acervo atual cobre algumas areas, mas ainda deixa lacunas relevantes.

### Ingles

Existe: leitura contextual, vocabulario escolar/viagem, gramatica funcional e cotidiano.

Falta:

- Cobertura granular dos 34 topicos de gramatica do edital.
- Mais interpretacao com textos curtos, avisos, mensagens, horarios, formularios, comunicados e situacoes escolares.
- Distratores mais sofisticados, com falsos cognatos, tempo verbal, conectores e inferencia.
- Questoes nivel 4 com interpretacao de edital/comunicado em ingles.
- Escrita em ingles alinhada aos 4 criterios oficiais: correcao gramatical, precisao vocabular, estrutura sintatica, coesao e clareza.

Recomendacao: transformar ingles em matriz de competencias, nao apenas categorias soltas. Cada topico do edital precisa ter teoria, exemplos, flashcards, questoes nivel 1-4 e itens de revisao.

### Espanhol

Existe: compreensao leitora, gramatica basica e cognatos.

Falta:

- Cobertura ampla de conteudos lexicos: rotina, casa, transporte, alimentos, saude, profissao, cidade/campo, esportes.
- Falsos cognatos, acentuacao, heterotonicos, pronomes, tempos verbais, conectores e expressoes idiomaticas.
- Mais leitura com anuncios, mensagens, folhetos e situacoes praticas.
- Subjetivas em espanhol com rubrica e controle de 90 a 150 palavras.

Recomendacao: espanhol nao pode parecer "segunda prioridade" porque ha 600 vagas oficiais. A plataforma deve tratar ingles e espanhol como rotas paralelas premium.

### Gramatica

Existe: itens funcionais de ingles e espanhol.

Falta:

- Mapa de topicos do edital.
- Explicacoes curtas com exemplo, erro comum e treino.
- Questoes por microcompetencia.
- Revisao espacada por erro.

Recomendacao: criar "Mapa de Gramatica PGM" com 60 a 80 microaulas. O aluno deve saber exatamente o que ja dominou e o que falta.

### Interpretacao

Existe: leitura e interpretacao basica em contexto PGM.

Falta:

- Textos multimodais: cronogramas, e-mails, quadros, regras, anuncios, bilhetes, formularios.
- Questoes de inferencia, objetivo do texto, informacao explicita, detalhe, vocabulario contextual e intencao comunicativa.

Recomendacao: a prova objetiva deve ser tratada como prova de leitura aplicada, nao apenas vocabulario solto.

### Atualidades e Cultura Internacional

Existe: modulos premium iniciais sobre guia do intercambista, passaporte, visto, mala, aeroporto, host family, adaptacao cultural e vida escolar.

Falta:

- Trilhas por destino: Canada, Estados Unidos, Reino Unido, Argentina e Espanha.
- Cultura escolar, rotina, pontualidade, convivio, diversidade, regras, saude emocional e comunicacao com familia anfitria.
- Conteudo para responsaveis legais.

Recomendacao: criar "Vida Internacional" como diferencial premium. Isso aumenta valor percebido mesmo fora da prova objetiva.

### Escrita/Subjetiva

Existe: 20 questoes subjetivas e fluxo de feedback manual.

Falta:

- Simulador oficial de 5 questoes.
- Contador de palavras 90-150.
- Rubrica por criterio oficial.
- Historico de erros por aluno.
- Biblioteca de frases seguras por idioma.
- Correcoes modelo antes/depois.

Recomendacao: essa deve virar uma das maiores promessas premium. O edital torna a subjetiva decisiva para os melhores classificados.

### Psicossocial/Entrevista

Existe: 30 perguntas psicossociais, feedback manual e Mentor IA com limites.

Falta:

- Simulacao de entrevista telepresencial.
- Treino com responsavel legal.
- Criterios oficiais transformados em rubrica: clareza, equilibrio emocional, postura, convivencia, motivacao.
- Registro de respostas em video/audio, mesmo que inicialmente opcional.

Recomendacao: transformar "Entrevista" em "Treino Psicossocial". E uma etapa eliminatoria e tem alto valor emocional para pais e alunos.

## 3. Reformulacao do Banco de Questoes

### Problema atual

O banco atual e pequeno e com pouca profundidade competitiva. Ha 100 questoes objetivas, mas a prova oficial 2026 envolve 30 questoes objetivas e pode filtrar milhares de candidatos antes da correcao subjetiva. Para um produto premium, o aluno precisa treinar volume, variedade e dificuldade progressiva.

### Nova estrutura de niveis

| Nivel | Nome | Objetivo | Exemplo de uso |
|---|---|---|---|
| 1 | Fundacao | Reconhecer vocabulario, regra ou informacao explicita. | Identificar o sentido de uma palavra. |
| 2 | Aplicacao | Usar regra em frase ou contexto simples. | Escolher tempo verbal correto. |
| 3 | Prova | Interpretar texto e eliminar alternativas plausiveis. | Achar informacao em comunicado. |
| 4 | Competitivo | Resolver item com distrator forte, inferencia ou combinacao de habilidades. | Separar regra oficial, orientacao e expectativa de direito. |

Recomendacao tecnica: criar campo `level` de 1 a 4, campo `skill_code`, campo `exam_axis`, campo `estimated_seconds`, campo `quality_status` e campo `version`. Isso permite analytics adaptativo e curadoria editorial.

### Quantidade ideal

| Frente | Atual | Ideal MVP premium | Precisa adicionar |
|---|---:|---:|---:|
| Ingles - leitura e interpretacao | 10 | 120 | 110 |
| Ingles - vocabulario | 10 | 100 | 90 |
| Ingles - gramatica | 10 | 140 | 130 |
| Ingles - comunicacao cotidiana | 5 | 60 | 55 |
| Espanhol - leitura e interpretacao | 12 | 100 | 88 |
| Espanhol - gramatica | 13 | 120 | 107 |
| Espanhol - vocabulario e comunicacao | 0 | 80 | 80 |
| Edital, regras e preparacao segura | 20 | 80 | 60 |
| Escrita/subjetiva como treino objetivo | 10 | 40 | 30 |
| Psicossocial objetivo | 10 | 50 | 40 |
| Total de objetivas | 100 | 750 | 650 |
| Questoes subjetivas | 20 | 150 | 130 |
| Perguntas psicossociais | 30 | 120 | 90 |
| Flashcards | 60 | 350 | 290 |
| Materiais | 12 | 80 | 68 |
| Simulados completos 30 questoes | 0 alinhados exatamente ao edital 2026 | 20 | 20 |
| Simulados subjetivos 5 questoes | 0 completos | 12 | 12 |

Distribuicao recomendada por nivel para objetivas:

| Nivel | Percentual | Quantidade em 750 |
|---|---:|---:|
| Nivel 1 | 25% | 188 |
| Nivel 2 | 35% | 263 |
| Nivel 3 | 30% | 225 |
| Nivel 4 | 10% | 74 |

O nivel 4 nao deve dominar o banco. Ele deve diferenciar aluno forte e evitar que a plataforma pareca facil demais.

## 4. Experiencia do Aluno, Retencao e Gamificacao

### Pontos de abandono provaveis

- Cadastro leva direto ao dashboard, sem escolher idioma, meta, disponibilidade ou etapa atual.
- Dashboard mostra muitas metricas, mas nao responde claramente: "o que devo fazer hoje?".
- Menu lateral tem muitos modulos no mesmo peso visual.
- Areas bloqueadas exibem upgrade, mas nem sempre mostram uma amostra forte do valor premium.
- "Area Premium" parece deposito de guias, nao academia exclusiva.
- Nao ha suporte visivel para duvidas de pagamento, acesso premium ou uso da plataforma.
- Nao ha rotina pos-compra: o aluno paga e precisa descobrir sozinho o caminho.

### Jornada recomendada

1. Diagnostico gratuito.
2. Escolha do idioma: ingles ou espanhol.
3. Mini-simulado inicial.
4. Plano semanal gerado automaticamente.
5. Primeira trilha recomendada.
6. Primeira missao premium.
7. Feedback ou checkpoint em 7 dias.

### Gamificacao recomendada

XP sugerido:

| Acao | XP |
|---|---:|
| Concluir material | 20 |
| Revisar flashcard | 2 |
| Finalizar simulado rapido | 40 |
| Finalizar simulado oficial 30 questoes | 80 |
| Enviar subjetiva | 60 |
| Receber feedback e revisar resposta | 40 |
| Treinar psicossocial | 50 |
| Cumprir missao semanal | 120 |
| Manter streak diario | 10 |

Niveis recomendados:

| Nivel | Nome | Criterio |
|---|---|---|
| 1 | Explorador PGM | Cadastro e diagnostico. |
| 2 | Candidato em Preparacao | Primeiros estudos e flashcards. |
| 3 | Competidor PGM | Simulados e trilhas recorrentes. |
| 4 | Finalista em Treino | Subjetiva e entrevista ativas. |
| 5 | Embaixador em Formacao | Consistencia alta e prontidao internacional. |

Medalhas recomendadas:

- Primeiro Diagnostico
- Primeira Rota Concluida
- 7 Dias de Consistencia
- 30 Dias de Preparacao
- Redacao 90-150
- Simulado Oficial Concluido
- Pronto para Entrevista
- Evolucao de 20 Pontos
- Foco em Ingles
- Foco em Espanhol

Ranking recomendado:

- Ranking privado por turma/coorte, nao ranking publico aberto.
- Ranking por consistencia, nao apenas nota.
- Ranking municipal apenas com opt-in e cuidado de LGPD.

## 5. Conversao, Landing Page, Checkout e Vendas

### Problemas atuais de conversao

- A landing tem boa imagem e promessa, mas ainda e generica.
- Ha texto interno de negocio na landing: "preparacao vendavel e recorrente". Isso nao deve aparecer para aluno ou responsavel.
- A frase "quando o edital abrir" esta temporalmente fraca, porque o edital 2026 ja foi publicado.
- Falta urgencia baseada em cronograma real.
- Falta autoridade: fontes oficiais, comparativo com edital, metodo e matriz pedagogica.
- Falta prova social real ou substituto honesto: amostra de aula, prints, demo de simulado, garantia editorial.
- Checkout nao explica claramente o que acontece apos o pagamento.
- Nao ha recuperacao de checkout abandonado.
- Nao ha promessa de suporte premium.

### Headline recomendada para landing

"Sua preparacao para o Ganhe o Mundo, etapa por etapa."

Subheadline:

"Treine prova objetiva, subjetiva e entrevista psicossocial com trilhas, simulados, feedback e plano de estudo baseado no edital vigente."

CTAs:

- "Fazer diagnostico gratuito"
- "Ver preparacao premium"
- "Treinar simulado agora"

### Headline recomendada para planos

"Desbloqueie a preparacao completa antes da prova."

Subheadline:

"Acesso premium com simulados, escrita 90-150 palavras, treino psicossocial, flashcards, trilhas e desempenho por categoria."

CTAs:

- "Desbloquear Premium"
- "Ver o que esta incluso"
- "Entrar na Academia PGM"

### Gatilhos honestos e profissionais

- Urgencia: cronograma oficial e data de prova.
- Autoridade: matriz baseada no edital, sem dizer que e oficial.
- Clareza: "o premium libera X, Y e Z".
- Prova: prints de telas, questoes exemplo, simulado demo.
- Seguranca: Asaas, status do pagamento, suporte, politica de reembolso.
- Exclusividade: "Academia PGM" e "Rota de Aprovacao".

### Checkout ideal

O checkout precisa responder:

1. O que recebo imediatamente?
2. Como o acesso e liberado?
3. O que acontece se o pagamento nao liberar?
4. Como falo com suporte?
5. A plataforma e oficial?
6. Existe garantia ou reembolso?
7. Qual e o proximo passo apos pagar?

## 6. Recursos Premium que Faltam

| Recurso | Impacto | Complexidade | Prioridade |
|---|---:|---:|---:|
| Onboarding premium pos-pagamento | Alto | Baixa | P0 |
| Atualizacao da base oficial 2026 no Mentor IA | Alto | Baixa | P0 |
| Simulado oficial 30 questoes | Alto | Media | P0 |
| Simulado subjetivo com 5 questoes e 90-150 palavras | Alto | Media | P0 |
| Contador de palavras e rubrica oficial | Alto | Media | P0 |
| Central de Sucesso do Aluno | Alto | Media | P1 |
| Missao diaria no dashboard | Alto | Media | P1 |
| XP, niveis e medalhas persistentes | Medio/alto | Media | P1 |
| Recomendacao adaptativa por erro | Alto | Alta | P1 |
| Relatorio para responsaveis | Medio/alto | Media | P2 |
| Notificacoes por email/WhatsApp | Alto | Media/alta | P2 |
| Recuperacao de checkout abandonado | Alto | Media | P2 |
| Cupons, afiliados e embaixadores | Medio | Media | P2 |
| Planos recorrentes e upgrades | Alto | Alta | P2 |
| Area de coortes/turmas | Medio | Alta | P3 |
| Video simulado de entrevista | Alto | Alta | P3 |

P0 significa risco direto para credibilidade, conversao ou alinhamento com edital.

## 7. Central de Sucesso do Aluno

### Categorias recomendadas

1. Conta e acesso
2. Pagamento e liberacao premium
3. Diagnostico de elegibilidade
4. Simulados e gabaritos
5. Escrita subjetiva
6. Treino psicossocial
7. Mentor IA
8. Edital e fontes oficiais
9. Documentos, passaporte e viagem
10. Responsaveis legais
11. Privacidade e seguranca
12. Problemas tecnicos

### FAQ recomendado

| Categoria | Pergunta | Resposta recomendada |
|---|---|---|
| Institucional | A PGM Academy e oficial? | Nao. A PGM Academy e uma plataforma independente de preparacao e nao substitui o Governo de Pernambuco, a SEE, o Instituto IGEDUC ou os canais oficiais. |
| Premium | O que o Premium libera? | Libera simulados, trilhas completas, materiais, flashcards, escrita subjetiva, treino psicossocial, analytics e Mentor IA conforme disponibilidade do plano. |
| Pagamento | Paguei e nao liberou. O que faco? | Aguarde a confirmacao do meio de pagamento. Se o acesso nao liberar, envie e-mail/WhatsApp com o e-mail da conta e comprovante para verificacao. |
| Conta | O Premium fica vinculado a qual usuario? | Ao usuario autenticado no momento da compra. Por isso e importante criar conta ou entrar antes de pagar. |
| Simulados | O gabarito aparece antes de finalizar? | Nao. O gabarito e as explicacoes devem aparecer apenas apos a finalizacao para preservar o treino. |
| Subjetiva | Como funciona a escrita? | O aluno responde no idioma escolhido, idealmente entre 90 e 150 palavras nos simulados oficiais, e recebe analise conforme rubrica do produto. |
| Entrevista | A plataforma garante aptidao psicossocial? | Nao. A plataforma treina comunicacao, postura e clareza. A decisao oficial e da banca avaliadora. |
| Mentor IA | O Mentor pode informar datas oficiais? | O Mentor deve orientar a confirmar datas e resultados nos canais oficiais. Ele nao deve inventar prazos nem substituir o edital. |
| Edital | Onde confirmo regras oficiais? | No edital vigente, no portal da SEE e na area do candidato do Instituto IGEDUC. |
| Responsaveis | Pais ou responsaveis podem acompanhar? | Recomendado criar uma area futura para responsaveis com orientacoes, progresso e alertas. |
| Suporte | Qual canal devo usar? | Base de ajuda para duvidas comuns, ticket/e-mail para problemas de conta e WhatsApp para situacoes premium urgentes. |
| Privacidade | Meus dados ficam seguros? | A plataforma deve explicar coleta, uso, protecao e direitos do usuario conforme LGPD. |

### Modelo de suporte recomendado

| Canal | Vantagens | Riscos/custos | Recomendacao |
|---|---|---|---|
| Help Center | Escala barato, reduz duvidas repetidas. | Precisa manutencao editorial. | Criar primeiro. |
| Ticket/e-mail | Auditavel, organizado, bom para pagamento. | Resposta mais lenta. | Usar como canal principal formal. |
| WhatsApp | Alta adesao, forte para conversao. | Pode virar gargalo manual e misturar dados sensiveis. | Usar para premium e checkout, com horarios e templates. |
| Chat in-app | Boa experiencia e contexto. | Custo de ferramenta e operacao. | Implementar depois do Help Center. |
| Mentor IA | Disponivel 24/7 e escalavel. | Risco de resposta errada se base estiver desatualizada. | Usar como triagem com limites fortes. |

Arquitetura recomendada: Help Center estatico + formulario de ticket + WhatsApp comercial + Mentor IA com base versionada. Todo atendimento premium deve gerar registro interno.

## 8. Academia PGM

A atual "Area Premium" deve virar "Academia PGM", com modulos claros e progresso. Sugestao de 7 modulos:

| Modulo | Nome | Conteudo | Impacto |
|---|---|---|---|
| 1 | Rota de Aprovacao PGM 2026 | Etapas, cronograma, requisitos, estrategia. | Reduz ansiedade e organiza o aluno. |
| 2 | Ingles para Prova Objetiva | Gramatica, vocabulario, leitura e simulados. | Aumenta desempenho no maior bloco de vagas. |
| 3 | Espanhol para Prova Objetiva | Leitura, gramatica, vocabulario e comunicacao. | Valoriza 600 vagas e diferencia produto. |
| 4 | Escrita Internacional | Subjetivas de 90-150 palavras, rubrica e modelos. | Alto valor premium e alinhamento oficial. |
| 5 | Treino Psicossocial | Autonomia, maturidade, comunicacao, diversidade e motivacao. | Prepara etapa eliminatoria. |
| 6 | Vida Internacional | Cultura, host family, escola, rotina, responsaveis e adaptacao. | Aumenta aspiracao e confianca familiar. |
| 7 | Documentos e Embarque | Passaporte, visto, mala, aeroporto, compromissos e pos-intercambio. | Cria valor apos aprovacao e retencao. |

## 9. Onboarding Premium em 9 Passos

1. Confirmacao: "Premium ativo. Bem-vindo a Academia PGM."
2. Escolha de idioma: ingles ou espanhol.
3. Preferencia de destino: apenas indicativa, com aviso oficial.
4. Diagnostico de elegibilidade: requisitos e pendencias.
5. Disponibilidade semanal: dias e minutos de estudo.
6. Mini-simulado inicial: medir ponto de partida.
7. Primeira subjetiva: medir escrita.
8. Autoavaliacao psicossocial: maturidade, comunicacao e adaptacao.
9. Plano de 7 dias: primeira missao, primeira trilha e primeiro simulado recomendado.

Ao final, o aluno deve cair no Painel de Missao, nao em uma lista fria de modulos.

## 10. Diferenciacao de Mercado

| Tipo de concorrente | O que entrega | Onde a PGM Academy pode vencer |
|---|---|---|
| Cursos online genericos | Aulas e materiais. | Preparacao especifica para PGM, etapas e edital. |
| Plataformas de idioma | Ingles/espanhol amplo. | Idioma aplicado ao processo seletivo e intercambio. |
| Plataformas de concurso | Banco de questoes e ranking. | Jornada emocional, psicossocial e internacional. |
| Vestibulares/ENEM | Simulados e desempenho. | Nicho PGM, elegibilidade, subjetiva e entrevista. |
| Preparacao oficial gratuita | Acesso aberto e institucional. | Personalizacao, rotina, analytics, feedback e suporte premium. |

Features exclusivas recomendadas:

- Diagnostico de Elegibilidade PGM.
- Rota de Aprovacao por etapa oficial.
- Simulado Objetivo PGM 30 questoes.
- Simulado Subjetivo 5 respostas de 90-150 palavras.
- Treino Psicossocial com rubrica.
- Mentor Internacional PGM com base versionada.
- Academia PGM com vida internacional e responsaveis.
- Analytics por competencia do edital.
- Relatorio de prontidao internacional.
- Central de Sucesso do Aluno.

## 11. Roadmap Executivo

### Problemas criticos

1. Base do Mentor IA desatualizada sobre vagas e destinos de 2026.
2. Simulados ainda nao espelham com precisao a prova oficial 2026.
3. Acervo premium pequeno para a promessa comercial.
4. Falta onboarding premium pos-pagamento.
5. Falta Central de Sucesso e processo de suporte.
6. Landing contem linguagem interna de negocio e frase temporalmente fraca.
7. Modelo de pagamento unico limita recorrencia SaaS.
8. Gamificacao existe apenas como calculo basico, nao como sistema de retencao.
9. Falta rastreamento de funil: visita, cadastro, diagnostico, checkout, pagamento, ativacao e retencao.
10. Falta versionamento editorial por edital.

### Plano de 7 dias

| Acao | Impacto |
|---|---|
| Corrigir base do Mentor IA para edital 2026 atual. | Reduz risco de informacao errada. |
| Corrigir textos da landing que soam internos ou desatualizados. | Melhora profissionalismo e conversao. |
| Renomear navegacao principal para termos mais orientados a jornada. | Melhora clareza e valor percebido. |
| Criar bloco "Missao de Hoje" no dashboard. | Aumenta ativacao e retencao. |
| Criar pagina simples de Central de Ajuda. | Reduz atrito de pagamento e suporte. |
| Criar checklist pos-pagamento premium. | Evita aluno perdido apos compra. |
| Ajustar templates de simulado para 30 questoes objetivas. | Alinha ao edital. |
| Criar subjetiva oficial com 5 perguntas e contador de palavras. | Aumenta valor premium imediato. |

### Plano de 30 dias

| Acao | Impacto |
|---|---|
| Expandir banco para 300 objetivas. | Produto premium mais robusto. |
| Criar 50 subjetivas com rubrica. | Diferencial forte. |
| Criar 80 perguntas psicossociais. | Preparacao eliminatoria mais profunda. |
| Implementar onboarding completo de 9 passos. | Melhora ativacao. |
| Persistir XP, niveis, medalhas e missoes. | Melhora retencao. |
| Criar eventos de analytics de funil. | Permite gestao de crescimento. |
| Implementar ticket/e-mail de suporte. | Profissionaliza operacao. |
| Criar checkout recovery. | Recupera receita perdida. |
| Criar painel admin de alunos premium e pagamentos. | Melhora operacao SaaS. |

### Plano de 90 dias

| Acao | Impacto |
|---|---|
| Expandir banco para 750 objetivas. | Preparo competitivo real. |
| Criar 20 simulados oficiais completos. | Produto vendavel com escala. |
| Criar planos recorrentes ou upsells. | Receita previsivel. |
| Criar area para responsaveis. | Aumenta confianca familiar. |
| Criar notificacoes email/WhatsApp. | Melhora retorno e pagamento. |
| Mentor IA personalizado por progresso. | Diferenciacao EdTech. |
| Sistema de coortes/turmas. | Base para B2B e escolas. |
| Observabilidade e logs estruturados. | Producao profissional. |
| Versionamento de edital e conteudo. | Menos risco juridico/editorial. |
| Programa de indicacao/afiliados. | Crescimento comercial. |

## Decisoes Arquiteturais Recomendadas

### Banco e multi-tenant

Pontos positivos:

- Existe tabela `tenants`.
- Entidades principais carregam `tenant_id`.
- RLS esta habilitado nas tabelas sensiveis.
- Conteudo global com `tenant_id` nulo permite catalogo compartilhado.
- `user_learning_progress`, `simulation_attempts`, `manual_review_attempts` e `payment_events` possuem isolamento por tenant.

Melhorias:

- Criar tabela `plan_entitlements` para controlar limites por plano.
- Criar `content_versions` e `official_source_versions`.
- Criar `student_onboarding`.
- Criar `student_missions`, `student_xp_events`, `student_badges`.
- Criar `support_tickets`.
- Criar `checkout_events` e `funnel_events`.
- Criar indices compostos por `tenant_id`, `user_id`, `created_at` nas tabelas de eventos.

### Billing

O pagamento unico e simples, mas nao sustenta o objetivo declarado de SaaS recorrente. Recomendacao de evolucao:

| Plano | Modelo | Preco sugerido | Conteudo |
|---|---|---:|---|
| Free | Gratuito | R$ 0 | Diagnostico, amostras, 1 simulado curto. |
| Premium Mensal | Recorrente | R$ 19,90 a R$ 29,90/mes | Conteudo, simulados, analytics, Mentor IA limitado. |
| Premium Temporada | Pagamento unico | R$ 49,90 a R$ 79,90 | Acesso ate fim do ciclo do edital. |
| Premium Plus | Recorrente ou pacote | R$ 99 a R$ 149 | Correcoes humanas, prioridade e suporte. |

Se quiser manter R$ 29,90, posicionar como oferta de lancamento, nao como preco permanente.

### Seguranca e LGPD

Riscos a enderecar:

- Dados de menor de idade exigem linguagem clara para responsaveis.
- Mentor IA nao deve processar dados sensiveis sem limites e aviso.
- WhatsApp deve evitar coleta excessiva de documentos.
- Ranking publico pode expor menor de idade.
- Feedback manual precisa trilha de auditoria e controle de acesso admin.

Recomendacoes:

- Politica de privacidade visivel.
- Termos de uso com independencia institucional.
- Consentimento/aviso para responsaveis.
- Logs de acesso admin.
- Mascaramento de dados sensiveis em suporte.
- Auditoria de prompts e respostas do Mentor IA.

## Nota Final e Caminho para 10/10

Nota atual consolidada: 6,2/10.

O produto e promissor porque ja tem infraestrutura e escopo certo. O que falta e transformar funcionalidades em uma jornada guiada, alinhada ao edital 2026 e vendida com clareza premium.

Para chegar a 8/10:

- Corrigir base oficial.
- Alinhar simulados ao edital.
- Criar onboarding premium.
- Melhorar copy de conversao.
- Criar Central de Sucesso.
- Aumentar banco para 300 questoes.

Para chegar a 9/10:

- Persistir gamificacao.
- Criar rubrica real de subjetiva.
- Expandir psicossocial.
- Criar analytics de funil.
- Implementar suporte profissional.
- Criar plano de monetizacao recorrente.

Para chegar a 10/10:

- Banco robusto por competencia.
- IA personalizada e segura.
- Dados reais de resultado e progresso.
- Operacao de suporte com SLA.
- Produto recorrente.
- Versionamento editorial por edital.
- Experiencia de aluno e responsavel madura o suficiente para escala nacional.

Conclusao: a PGM Academy nao precisa de uma mudanca cosmetica. Ela precisa de uma elevacao de produto: de "plataforma com modulos" para "sistema de preparacao PGM com rota, missao, desempenho, suporte, premium real e atualizacao oficial versionada".
