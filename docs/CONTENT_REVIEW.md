# PGM Academy - Content Review

Status: rascunho editorial para revisao
Etapa: 8E
Destino futuro: seeds, painel admin ou migrations apos aprovacao

## Politica Editorial

Este pacote e autoral da PGM Academy. O Edital de Abertura PGM 2026 e a noticia oficial da SEE foram usados como referencia principal de estrutura, competencias, habilidades cobradas, etapas do processo seletivo e cuidados gerais de preparacao.

Regras deste documento:

- Nao copiar questoes oficiais.
- Nao copiar apostilas pagas, materiais protegidos ou conteudo de terceiros.
- Nao afirmar regra oficial sem validacao no edital vigente.
- Separar preparacao pedagogica de regra oficial.
- Manter linguagem de plataforma independente, sem vinculo oficial com o Governo de Pernambuco.
- Revisar e aprovar antes de inserir qualquer item no banco.

## Modelo de Importacao Futuro

Campos planejados para importacao:

- `question_categories`: categorias e subcategorias.
- `study_materials`: materiais em Markdown.
- `flashcards`: revisao rapida.
- `questions`: questoes objetivas e subjetivas.
- `question_options`: alternativas objetivas.
- `psychosocial_questions`: banco de entrevista.
- `learning_paths` e `learning_path_items`: trilhas.

IDs deste documento sao internos e podem virar slugs ou metadados em importacao futura.

## 1. Categorias Refinadas

### CAT-001

- name: Reading Comprehension - PGM Context
- slug: reading-comprehension-pgm-context
- language: english
- parent_slug: reading-comprehension
- uso: leitura de textos curtos sobre escola, viagem, rotina e preparacao.

### CAT-002

- name: Vocabulary - School and Travel
- slug: vocabulary-school-travel
- language: english
- parent_slug: vocabulary
- uso: vocabulario funcional para escola, documentos, aeroporto, familia anfitria e rotina.

### CAT-003

- name: Grammar - Functional Accuracy
- slug: grammar-functional-accuracy
- language: english
- parent_slug: grammar
- uso: estruturas gramaticais aplicadas a comunicacao clara.

### CAT-004

- name: Comprension Lectora - Vida Escolar
- slug: comprension-lectora-vida-escolar
- language: spanish
- parent_slug: comprension-lectora
- uso: interpretacao de textos sobre escola, convivencia e viagem.

### CAT-005

- name: Gramatica Espanhola - Uso Basico
- slug: gramatica-espanhola-uso-basico
- language: spanish
- parent_slug: gramatica
- uso: tempos verbais, conectores, pronomes e estruturas frequentes.

### CAT-006

- name: Conhecimentos do Programa
- slug: conhecimentos-do-programa
- language: portuguese
- parent_slug: null
- uso: compreensao de etapas, cuidados, limites e responsabilidades do candidato.

### CAT-007

- name: Estrategia de Resposta Escrita
- slug: estrategia-resposta-escrita
- language: mixed
- parent_slug: writing
- uso: organizacao de respostas subjetivas em ingles e espanhol.

### CAT-008

- name: Entrevista - Autoconhecimento
- slug: entrevista-autoconhecimento
- language: psychosocial
- parent_slug: autoconhecimento
- uso: motivacao, maturidade, pontos fortes, limites e historia pessoal.

### CAT-009

- name: Entrevista - Adaptacao Cultural
- slug: entrevista-adaptacao-cultural
- language: psychosocial
- parent_slug: adaptabilidade
- uso: convivencia, saudade, diferencas culturais e pedido de ajuda.

### CAT-010

- name: Entrevista - Responsabilidade e Equipe
- slug: entrevista-responsabilidade-equipe
- language: psychosocial
- parent_slug: responsabilidade
- uso: compromissos, regras, trabalho em equipe e postura durante o intercambio.

## 2. Materiais de Estudo Iniciais

### MAT-001

- title: Como Ler Enunciados em Ingles Sem Travar
- slug: como-ler-enunciados-em-ingles
- category_slug: reading-comprehension-pgm-context
- language: english
- difficulty: beginner
- estimated_time: 12
- is_premium: false

```md
Objetivo: treinar leitura funcional para questoes de prova objetiva.

1. Leia primeiro o comando da questao.
2. Identifique palavras-chave: who, where, when, why, how, main idea, according to.
3. Volte ao texto procurando pistas, nao traducao palavra por palavra.
4. Separe informacao explicita de inferencia.
5. Elimine alternativas que exageram, mudam o sentido ou trazem informacao que nao aparece no texto.

Treino sugerido: antes de responder, escreva em portugues uma frase dizendo "o texto fala principalmente sobre...".
```

### MAT-002

- title: Vocabulario Essencial de Escola, Viagem e Intercambio
- slug: vocabulario-escola-viagem-intercambio
- category_slug: vocabulary-school-travel
- language: english
- difficulty: beginner
- estimated_time: 15
- is_premium: true

```md
Objetivo: construir repertorio de palavras frequentes em contextos de preparacao.

Grupos de vocabulario:

- Escola: class, subject, teacher, schedule, assignment, attendance.
- Documentos: passport, visa, form, signature, deadline, copy.
- Viagem: flight, airport, luggage, gate, boarding pass, arrival.
- Casa: host family, room, meal, rules, chores, curfew.
- Comportamento: respect, responsibility, teamwork, adaptation, maturity.

Atividade: escolha 10 palavras e crie frases sobre sua rotina de preparacao.
```

### MAT-003

- title: Leitura em Espanhol Para Textos Curtos
- slug: leitura-espanhol-textos-curtos
- category_slug: comprension-lectora-vida-escolar
- language: spanish
- difficulty: beginner
- estimated_time: 12
- is_premium: false

```md
Objetivo: interpretar textos simples em espanhol usando cognatos, contexto e conectores.

Passos:

1. Marque cognatos confiaveis, como escuela, familia, documento, responsabilidad.
2. Cuidado com falsos amigos, como embarazada, exquisito e largo.
3. Observe conectores: pero, aunque, porque, por eso, entonces.
4. Procure o tema central antes dos detalhes.
5. Responda apenas com base no texto.

Treino: reescreva a ideia principal em uma frase curta em portugues.
```

### MAT-004

- title: Regras Oficiais e Orientacoes de Preparacao
- slug: regras-oficiais-orientacoes-preparacao
- category_slug: conhecimentos-do-programa
- language: portuguese
- difficulty: intermediate
- estimated_time: 18
- is_premium: true

```md
Objetivo: evitar confusao entre regra oficial e conselho de preparacao.

Regra oficial e aquilo que aparece no edital vigente, comunicados oficiais ou documentos assinados pelo candidato e responsaveis.

Orientacao de preparacao e uma recomendacao pratica para o aluno se organizar melhor. Ela ajuda, mas nao substitui o edital.

Exemplos de orientacoes seguras:

- Conferir sempre o edital vigente.
- Manter documentos organizados.
- Acompanhar canais oficiais.
- Preparar rotina de estudos.
- Desenvolver maturidade para entrevista e intercambio.

Principio central: nunca trate aprovacao, destino, embarque ou beneficio como garantidos sem confirmacao oficial.
```

### MAT-005

- title: Estrutura de Resposta Subjetiva em Idioma Estrangeiro
- slug: estrutura-resposta-subjetiva-idioma
- category_slug: estrategia-resposta-escrita
- language: mixed
- difficulty: intermediate
- estimated_time: 20
- is_premium: true

```md
Objetivo: responder com clareza, organizacao e vocabulario adequado.

Estrutura recomendada:

1. Frase inicial: responda diretamente ao tema.
2. Desenvolvimento: explique com um exemplo pessoal ou situacao concreta.
3. Fechamento: mostre aprendizado, responsabilidade ou proximo passo.

Evite:

- Respostas vagas.
- Frases muito longas.
- Traducao literal do portugues.
- Repetir a mesma ideia com outras palavras.

Checklist antes de enviar: a resposta tem inicio, meio e fim? O leitor entende sua ideia sem adivinhar?
```

### MAT-006

- title: Preparacao Para Entrevista Psicossocial
- slug: preparacao-entrevista-psicossocial
- category_slug: entrevista-autoconhecimento
- language: psychosocial
- difficulty: intermediate
- estimated_time: 22
- is_premium: true

```md
Objetivo: preparar o estudante para conversar com maturidade sobre motivacao, responsabilidade, adaptacao e convivencia.

A entrevista nao deve ser decorada. Ela avalia postura, coerencia e capacidade de refletir sobre situacoes reais.

Pratique responder:

- Por que voce quer participar?
- Como voce reage a regras diferentes das suas?
- O que voce faria se sentisse saudade?
- Como voce pede ajuda?
- Que responsabilidade voce assume ao representar sua escola e sua familia?

Resposta madura combina sinceridade, exemplo concreto e consciencia dos limites.
```

## 3. Flashcards

### Flashcards de Ingles

1. FLA-001 | vocabulary-school-travel | Front: What does "deadline" mean? | Back: Prazo final para entregar algo. | language: english | difficulty: beginner
2. FLA-002 | vocabulary-school-travel | Front: What is a "boarding pass"? | Back: Cartao de embarque usado para entrar no voo. | language: english | difficulty: beginner
3. FLA-003 | vocabulary-school-travel | Front: Translate the idea: "familia anfitria". | Back: Host family. | language: english | difficulty: beginner
4. FLA-004 | reading-comprehension-pgm-context | Front: What does "main idea" ask for? | Back: A ideia principal do texto, nao um detalhe isolado. | language: english | difficulty: beginner
5. FLA-005 | grammar-functional-accuracy | Front: When do we use "should"? | Back: To give advice or recommendation. | language: english | difficulty: beginner
6. FLA-006 | grammar-functional-accuracy | Front: "I must bring my passport" expresses what? | Back: Obligation. | language: english | difficulty: beginner
7. FLA-007 | grammar-functional-accuracy | Front: Complete: If I study every week, I ____ improve. | Back: will. | language: english | difficulty: intermediate
8. FLA-008 | vocabulary-school-travel | Front: What does "attendance" mean? | Back: Frequencia ou presenca nas aulas. | language: english | difficulty: beginner
9. FLA-009 | vocabulary-school-travel | Front: What is a "schedule"? | Back: Horario ou agenda. | language: english | difficulty: beginner
10. FLA-010 | reading-comprehension-pgm-context | Front: What is an inference? | Back: Uma conclusao baseada em pistas do texto. | language: english | difficulty: intermediate

### Flashcards de Espanhol

11. FLA-011 | comprension-lectora-vida-escolar | Front: O que significa "horario"? | Back: Agenda ou distribuicao de aulas/atividades. | language: spanish | difficulty: beginner
12. FLA-012 | gramatica-espanhola-uso-basico | Front: "Estoy nervioso" usa ser ou estar? | Back: Estar, porque indica estado momentaneo. | language: spanish | difficulty: beginner
13. FLA-013 | gramatica-espanhola-uso-basico | Front: "Soy estudiante" usa ser ou estar? | Back: Ser, porque indica identidade/condicao. | language: spanish | difficulty: beginner
14. FLA-014 | comprension-lectora-vida-escolar | Front: O que indica "aunque"? | Back: Concessao, ideia parecida com "embora". | language: spanish | difficulty: intermediate
15. FLA-015 | gramatica-espanhola-uso-basico | Front: Traduza a ideia: "eu estudo". | Back: Yo estudio. | language: spanish | difficulty: beginner
16. FLA-016 | comprension-lectora-vida-escolar | Front: O que significa "convivencia"? | Back: Convivio, forma de viver com outras pessoas. | language: spanish | difficulty: beginner
17. FLA-017 | gramatica-espanhola-uso-basico | Front: "Responsabilidad" e cognato de qual palavra? | Back: Responsabilidade. | language: spanish | difficulty: beginner
18. FLA-018 | comprension-lectora-vida-escolar | Front: O que indica "por eso"? | Back: Consequencia; parecido com "por isso". | language: spanish | difficulty: beginner

### Flashcards de Programa e Escrita

19. FLA-019 | conhecimentos-do-programa | Front: A classificacao garante automaticamente o intercambio? | Back: Nao. Deve-se confirmar condicoes, etapas e comunicados oficiais. | language: portuguese | difficulty: beginner
20. FLA-020 | conhecimentos-do-programa | Front: Qual fonte confirma regra vigente? | Back: Edital vigente e canais oficiais. | language: portuguese | difficulty: beginner
21. FLA-021 | conhecimentos-do-programa | Front: O que deve ser evitado ao estudar regras? | Back: Tratar dica de preparacao como regra oficial. | language: portuguese | difficulty: intermediate
22. FLA-022 | estrategia-resposta-escrita | Front: Qual estrutura basica para resposta subjetiva? | Back: Ideia inicial, desenvolvimento com exemplo e fechamento. | language: mixed | difficulty: beginner
23. FLA-023 | estrategia-resposta-escrita | Front: O que torna uma resposta vaga? | Back: Falta de exemplo, objetivo ou relacao clara com o tema. | language: mixed | difficulty: intermediate
24. FLA-024 | estrategia-resposta-escrita | Front: Por que evitar frases muito longas? | Back: Elas aumentam risco de erro e dificultam clareza. | language: mixed | difficulty: beginner

### Flashcards Psicossociais

25. FLA-025 | entrevista-autoconhecimento | Front: O que e autoconhecimento na entrevista? | Back: Saber explicar motivacoes, limites, qualidades e pontos a melhorar. | language: psychosocial | difficulty: beginner
26. FLA-026 | entrevista-adaptacao-cultural | Front: Como lidar com saudade no intercambio? | Back: Reconhecer o sentimento, manter rotina e pedir apoio quando necessario. | language: psychosocial | difficulty: beginner
27. FLA-027 | entrevista-responsabilidade-equipe | Front: O que e responsabilidade em grupo? | Back: Cumprir combinados e considerar o impacto das suas acoes nos outros. | language: psychosocial | difficulty: intermediate
28. FLA-028 | entrevista-adaptacao-cultural | Front: O que fazer diante de regra cultural diferente? | Back: Observar, perguntar com respeito e adaptar-se sem confronto desnecessario. | language: psychosocial | difficulty: intermediate
29. FLA-029 | entrevista-autoconhecimento | Front: Uma boa resposta de motivacao deve conter o que? | Back: Motivo real, exemplo concreto e consciencia de compromisso. | language: psychosocial | difficulty: intermediate
30. FLA-030 | entrevista-responsabilidade-equipe | Front: Qual erro comum na entrevista? | Back: Decorar frases prontas sem demonstrar reflexao pessoal. | language: psychosocial | difficulty: beginner

## 4. Questoes Objetivas Autorais

### OBJ-001

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: reading-comprehension-pgm-context
- type: objective
- difficulty: beginner
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Read the text:

Marina created a weekly plan to prepare for an exchange selection process. On Mondays, she reviews vocabulary. On Wednesdays, she practices reading short texts. On Fridays, she checks her documents with her family.

What is the main idea of the text?
```

Options:

- A: Marina wants to change schools.
- B: Marina organizes her preparation during the week.
- C: Marina travels every Friday.
- D: Marina studies only with her family.
- E: Marina does not like reading.

Correct: B

Explanation: O texto mostra uma rotina semanal de preparacao, nao uma viagem ou mudanca de escola.

### OBJ-002

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: reading-comprehension-pgm-context
- type: objective
- difficulty: intermediate
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Read the sentence:

Lucas felt nervous before the interview, but he prepared examples about his school life, family routine and personal goals.

What can we infer about Lucas?
```

Options:

- A: He ignored the interview.
- B: He was nervous and decided not to participate.
- C: He prepared himself despite feeling nervous.
- D: He did not have any personal goals.
- E: He only wanted to talk about travel.

Correct: C

Explanation: A frase diz que Lucas estava nervoso, mas preparou exemplos; isso indica preparacao apesar da ansiedade.

### OBJ-003

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: vocabulary-school-travel
- type: objective
- difficulty: beginner
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
In the sentence "Students must respect the host family's rules", what does "rules" mean?
```

Options:

- A: Presentes
- B: Regras
- C: Lugares
- D: Passagens
- E: Horarios de voo

Correct: B

Explanation: "Rules" significa regras.

### OBJ-004

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: grammar-functional-accuracy
- type: objective
- difficulty: beginner
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Choose the best option:

You ____ keep your documents in a safe place.
```

Options:

- A: should
- B: are
- C: did
- D: were
- E: has

Correct: A

Explanation: "Should" e usado para recomendacao ou conselho.

### OBJ-005

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: grammar-functional-accuracy
- type: objective
- difficulty: intermediate
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Choose the correct sentence:
```

Options:

- A: I has a passport.
- B: She study every day.
- C: They are preparing for the interview.
- D: We was at school yesterday.
- E: He don't read the instructions.

Correct: C

Explanation: A alternativa C esta correta: sujeito plural "they" com "are preparing".

### OBJ-006

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: grammar-functional-accuracy
- type: objective
- difficulty: intermediate
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Complete the sentence:

If Ana studies consistently, she ____ feel more confident.
```

Options:

- A: was
- B: will
- C: did
- D: were
- E: have

Correct: B

Explanation: Em uma condicional real no futuro, usa-se "will" na consequencia.

### OBJ-007

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: vocabulary-school-travel
- type: objective
- difficulty: intermediate
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
What is the best meaning of "keep up with" in this sentence?

Students need to keep up with school activities during preparation.
```

Options:

- A: Abandonar as atividades.
- B: Acompanhar as atividades.
- C: Esconder as atividades.
- D: Traduzir as atividades.
- E: Adiar todas as atividades.

Correct: B

Explanation: "Keep up with" significa acompanhar ou manter-se em dia.

### OBJ-008

- bank_suggestion: Ingles - Prova Objetiva Inicial
- category_slug: grammar-functional-accuracy
- type: objective
- difficulty: beginner
- language: english
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Choose the most polite request:
```

Options:

- A: Repeat now.
- B: You repeat.
- C: Could you repeat, please?
- D: I repeat you.
- E: Repeating please you.

Correct: C

Explanation: "Could you repeat, please?" e uma forma educada de pedir repeticao.

### OBJ-009

- bank_suggestion: Espanhol - Prova Objetiva Inicial
- category_slug: comprension-lectora-vida-escolar
- type: objective
- difficulty: beginner
- language: spanish
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Lee el texto:

Carla prepara sus documentos por la noche y estudia vocabulario tres veces por semana. Ella quiere sentirse mas segura durante la seleccion.

Segun el texto, Carla:
```

Options:

- A: no estudia vocabulario.
- B: organiza documentos y estudia vocabulario.
- C: viaja todas las noches.
- D: no quiere participar en la seleccion.
- E: solo estudia los domingos.

Correct: B

Explanation: O texto afirma que Carla organiza documentos e estuda vocabulario durante a semana.

### OBJ-010

- bank_suggestion: Espanhol - Prova Objetiva Inicial
- category_slug: comprension-lectora-vida-escolar
- type: objective
- difficulty: beginner
- language: spanish
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
En el contexto escolar, la palabra "horario" significa:
```

Options:

- A: una comida.
- B: una agenda de clases o actividades.
- C: un documento de viaje.
- D: una entrevista.
- E: una familia anfitriona.

Correct: B

Explanation: "Horario" significa agenda ou distribuicao de atividades.

### OBJ-011

- bank_suggestion: Espanhol - Prova Objetiva Inicial
- category_slug: gramatica-espanhola-uso-basico
- type: objective
- difficulty: beginner
- language: spanish
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Elige la opcion correcta:

Yo ____ estudiante.
```

Options:

- A: estoy
- B: eres
- C: soy
- D: estan
- E: somos

Correct: C

Explanation: Usa-se "soy" para identidade: "Yo soy estudiante".

### OBJ-012

- bank_suggestion: Espanhol - Prova Objetiva Inicial
- category_slug: gramatica-espanhola-uso-basico
- type: objective
- difficulty: intermediate
- language: spanish
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Elige la opcion correcta:

Hoy estoy nervioso, pero preparado.
```

Options:

- A: "Estoy" indica un estado momentaneo.
- B: "Estoy" indica nacionalidad.
- C: "Estoy" indica profesion.
- D: "Estoy" siempre significa pasado.
- E: "Estoy" no es un verbo.

Correct: A

Explanation: "Estoy nervioso" indica estado momentaneo.

### OBJ-013

- bank_suggestion: Espanhol - Prova Objetiva Inicial
- category_slug: comprension-lectora-vida-escolar
- type: objective
- difficulty: intermediate
- language: spanish
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Lee la frase:

Aunque Pedro extrana a su familia, habla con su coordinador y mantiene su rutina escolar.

La palabra "aunque" indica:
```

Options:

- A: causa
- B: concesion
- C: lugar
- D: cantidad
- E: posesion

Correct: B

Explanation: "Aunque" indica concessao, semelhante a "embora".

### OBJ-014

- bank_suggestion: Conhecimentos do Programa - Base
- category_slug: conhecimentos-do-programa
- type: objective
- difficulty: beginner
- language: portuguese
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Durante a preparacao, qual atitude e mais segura?
```

Options:

- A: Considerar qualquer postagem informal como regra oficial.
- B: Confirmar regras no edital vigente e canais oficiais.
- C: Ignorar comunicados depois de fazer inscricao.
- D: Tratar dicas de estudo como garantia de aprovacao.
- E: Aguardar todos os prazos terminarem para organizar documentos.

Correct: B

Explanation: Regras devem ser confirmadas em fontes oficiais vigentes.

### OBJ-015

- bank_suggestion: Conhecimentos do Programa - Base
- category_slug: conhecimentos-do-programa
- type: objective
- difficulty: beginner
- language: portuguese
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Uma plataforma independente de preparacao deve deixar claro que:
```

Options:

- A: substitui os canais oficiais.
- B: garante vaga ao estudante.
- C: nao possui vinculo oficial com o Governo de Pernambuco.
- D: decide destinos de intercambio.
- E: publica o cronograma oficial.

Correct: C

Explanation: A PGM Academy e independente e nao substitui canais oficiais.

### OBJ-016

- bank_suggestion: Conhecimentos do Programa - Base
- category_slug: conhecimentos-do-programa
- type: objective
- difficulty: intermediate
- language: portuguese
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Qual e um exemplo de orientacao de preparacao, e nao de regra oficial?
```

Options:

- A: O aluno deve acompanhar o edital vigente.
- B: Criar uma pasta digital para organizar documentos.
- C: Conferir comunicados oficiais.
- D: Respeitar prazos publicados oficialmente.
- E: Ler documentos assinados com responsaveis.

Correct: B

Explanation: Organizar pasta digital e uma recomendacao pratica; regras oficiais dependem de documentos oficiais.

### OBJ-017

- bank_suggestion: Conhecimentos do Programa - Base
- category_slug: conhecimentos-do-programa
- type: objective
- difficulty: intermediate
- language: portuguese
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Na preparacao para uma experiencia internacional, maturidade significa:
```

Options:

- A: Nunca sentir saudade.
- B: Esconder problemas para parecer forte.
- C: Reconhecer dificuldades, cumprir regras e pedir ajuda quando necessario.
- D: Evitar convivencia com pessoas diferentes.
- E: Focar apenas na viagem e esquecer a escola.

Correct: C

Explanation: Maturidade envolve responsabilidade, comunicacao e adaptacao.

### OBJ-018

- bank_suggestion: Escrita - Estrategia Inicial
- category_slug: estrategia-resposta-escrita
- type: objective
- difficulty: beginner
- language: mixed
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Qual estrutura tende a deixar uma resposta subjetiva mais clara?
```

Options:

- A: Uma frase solta sem exemplo.
- B: Introducao da ideia, explicacao com exemplo e fechamento.
- C: Muitas frases repetidas.
- D: Apenas palavras-chave.
- E: Copiar o enunciado inteiro.

Correct: B

Explanation: Respostas subjetivas claras costumam ter organizacao e exemplo concreto.

### OBJ-019

- bank_suggestion: Escrita - Estrategia Inicial
- category_slug: estrategia-resposta-escrita
- type: objective
- difficulty: intermediate
- language: mixed
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Em uma resposta escrita, qual conector ajuda a apresentar uma razao?
```

Options:

- A: because
- B: chair
- C: passport
- D: airport
- E: teacher

Correct: A

Explanation: "Because" introduz razao ou justificativa.

### OBJ-020

- bank_suggestion: Entrevista - Preparacao Inicial
- category_slug: entrevista-responsabilidade-equipe
- type: objective
- difficulty: intermediate
- language: psychosocial
- source_reference: Autoral PGM Academy - Etapa 8E

Statement:

```txt
Qual resposta demonstra postura mais madura em uma entrevista?
```

Options:

- A: "Quero viajar porque vai ser divertido e nao tenho mais nada a dizer."
- B: "Nunca vou ter dificuldade, porque eu me adapto a qualquer coisa."
- C: "Quero participar para crescer, estudar melhor o idioma e representar minha escola com responsabilidade."
- D: "Se eu nao gostar das regras, vou fazer do meu jeito."
- E: "Nao pensei sobre convivencia ainda."

Correct: C

Explanation: A alternativa C combina motivacao, estudo e responsabilidade.

## 5. Questoes Subjetivas Autorais

### SUB-001

- category_slug: estrategia-resposta-escrita
- type: subjective
- language: english
- difficulty: beginner
- source_reference: Autoral PGM Academy - Etapa 8E

Prompt:

```txt
Write 4 to 6 sentences in English explaining why you want to participate in an exchange preparation program.
```

Competencias avaliadas:

- Clareza da motivacao.
- Uso de frases simples corretas.
- Vocabulario de escola, estudo e responsabilidade.
- Coesao entre ideias.

Rubrica inicial:

- 0-2: resposta muito curta, sem ideia clara.
- 3-5: motivacao compreensivel, com erros que nao impedem entendimento.
- 6-8: resposta organizada, com exemplo ou objetivo concreto.
- 9-10: resposta clara, pessoal, coesa e linguisticamente consistente.

### SUB-002

- category_slug: estrategia-resposta-escrita
- type: subjective
- language: english
- difficulty: intermediate
- source_reference: Autoral PGM Academy - Etapa 8E

Prompt:

```txt
Describe a challenge you may face while living with a host family and explain how you would handle it responsibly.
```

Competencias avaliadas:

- Capacidade de prever desafio realista.
- Comunicacao respeitosa.
- Uso de condicionais ou futuro.
- Maturidade na solucao.

Rubrica inicial:

- 0-2: nao apresenta desafio ou solucao.
- 3-5: apresenta desafio, mas solucao vaga.
- 6-8: explica desafio e acao responsavel.
- 9-10: resposta madura, especifica e bem estruturada.

### SUB-003

- category_slug: estrategia-resposta-escrita
- type: subjective
- language: spanish
- difficulty: beginner
- source_reference: Autoral PGM Academy - Etapa 8E

Prompt:

```txt
Escribe 4 a 6 frases en espanol sobre tu rutina de preparacion para estudiar mejor.
```

Competencias avaliadas:

- Vocabulario de rotina e escola.
- Uso basico de presente.
- Sequencia logica.
- Clareza.

Rubrica inicial:

- 0-2: resposta incompleta ou incompreensivel.
- 3-5: rotina compreensivel com muitos erros.
- 6-8: rotina organizada com vocabulario adequado.
- 9-10: resposta clara, coerente e bem conectada.

### SUB-004

- category_slug: estrategia-resposta-escrita
- type: subjective
- language: spanish
- difficulty: intermediate
- source_reference: Autoral PGM Academy - Etapa 8E

Prompt:

```txt
Explica como puedes mostrar responsabilidad en una escuela de otro pais.
```

Competencias avaliadas:

- Compreensao de responsabilidade.
- Exemplos de comportamento escolar.
- Uso de conectores.
- Coerencia.

Rubrica inicial:

- 0-2: resposta sem relacao com o tema.
- 3-5: menciona responsabilidade sem exemplo concreto.
- 6-8: inclui exemplo e explicacao.
- 9-10: resposta reflexiva, clara e bem organizada.

### SUB-005

- category_slug: estrategia-resposta-escrita
- type: subjective
- language: english
- difficulty: intermediate
- source_reference: Autoral PGM Academy - Etapa 8E

Prompt:

```txt
Write a short message to a teacher asking for help because you did not understand an assignment.
```

Competencias avaliadas:

- Polidez.
- Clareza do pedido.
- Vocabulario escolar.
- Adequacao ao contexto.

Rubrica inicial:

- 0-2: pedido ausente ou inadequado.
- 3-5: pedido compreensivel, mas pouco claro.
- 6-8: mensagem educada e objetiva.
- 9-10: mensagem clara, respeitosa e completa.

## 6. Perguntas Psicossociais Autorais

### PSY-001

- category: autoconhecimento
- question: Por que voce quer participar de uma experiencia internacional de estudo?
- ideal_answer_guidelines: Deve apresentar motivacao real, relacao com aprendizado, responsabilidade e crescimento pessoal.
- common_mistakes: Responder apenas "porque quero viajar"; prometer perfeicao; nao conectar a experiencia com estudo.

### PSY-002

- category: autoconhecimento
- question: Quais sao dois pontos fortes seus e um ponto que voce ainda precisa melhorar?
- ideal_answer_guidelines: Deve demonstrar autopercepcao, exemplo concreto e disposicao para melhorar.
- common_mistakes: Dizer que nao tem defeitos; listar qualidades sem exemplos; exagerar.

### PSY-003

- category: adaptabilidade
- question: Como voce reagiria se a rotina da familia anfitria fosse muito diferente da sua?
- ideal_answer_guidelines: Deve mostrar respeito, comunicacao, observacao e capacidade de adaptar-se.
- common_mistakes: Dizer que tentaria impor sua rotina; evitar dialogo; julgar a cultura local.

### PSY-004

- category: inteligencia_emocional
- question: O que voce faria se sentisse muita saudade de casa?
- ideal_answer_guidelines: Deve reconhecer o sentimento, manter rotina, conversar com pessoas de apoio e pedir ajuda se necessario.
- common_mistakes: Dizer que nunca sentiria saudade; isolar-se; abandonar atividades.

### PSY-005

- category: responsabilidade
- question: Como voce demonstraria responsabilidade com documentos, horarios e regras?
- ideal_answer_guidelines: Deve citar organizacao, pontualidade, cuidado com documentos e respeito aos combinados.
- common_mistakes: Tratar responsabilidade como algo apenas dos adultos; nao mencionar acoes praticas.

### PSY-006

- category: trabalho_em_equipe
- question: Conte uma situacao em que voce precisou colaborar com colegas.
- ideal_answer_guidelines: Deve apresentar contexto, acao pessoal, resultado e aprendizado.
- common_mistakes: Falar apenas do grupo sem explicar sua contribuicao; culpar colegas.

### PSY-007

- category: diversidade_cultural
- question: Como voce lidaria com costumes que parecem estranhos para voce?
- ideal_answer_guidelines: Deve mostrar curiosidade respeitosa, escuta e cuidado para nao ofender.
- common_mistakes: Fazer piada; comparar de forma negativa; rejeitar o diferente.

### PSY-008

- category: lideranca
- question: Lideranca para voce e mandar nos outros ou ajudar o grupo a avancar? Explique.
- ideal_answer_guidelines: Deve diferenciar lideranca de autoritarismo e valorizar exemplo, escuta e organizacao.
- common_mistakes: Associar lideranca apenas a controle; nao reconhecer responsabilidade coletiva.

### PSY-009

- category: adaptabilidade
- question: Se voce tivesse dificuldade no idioma, que atitudes tomaria?
- ideal_answer_guidelines: Deve citar pratica, pedido de ajuda, comunicacao simples e persistencia.
- common_mistakes: Desistir de falar; fingir entendimento; depender sempre de outra pessoa.

### PSY-010

- category: responsabilidade
- question: O que significa representar sua escola, sua familia e seu estado em outra cultura?
- ideal_answer_guidelines: Deve demonstrar consciencia de imagem, respeito, cumprimento de regras e compromisso com aprendizado.
- common_mistakes: Responder de forma vaga; focar apenas em turismo; ignorar comportamento.

## 7. Trilhas de Aprendizagem

### PATH-001

- title: Base Linguistica Inicial
- slug: base-linguistica-inicial
- language: mixed
- description: Trilha para comecar leitura, vocabulario e gramatica funcional em ingles e espanhol.

Items:

1. study_material: MAT-001
2. flashcard_set: FLA-001 a FLA-010
3. objective_questions: OBJ-001 a OBJ-008
4. study_material: MAT-003
5. flashcard_set: FLA-011 a FLA-018
6. objective_questions: OBJ-009 a OBJ-013

### PATH-002

- title: Prova Objetiva - Estrategia e Regras
- slug: prova-objetiva-estrategia-regras
- language: mixed
- description: Trilha para unir interpretacao, estrategia de resposta e conhecimento seguro sobre regras e orientacoes.

Items:

1. study_material: MAT-004
2. flashcard_set: FLA-019 a FLA-024
3. objective_questions: OBJ-014 a OBJ-019
4. study_material: MAT-005
5. subjective_questions: SUB-001, SUB-003, SUB-005

### PATH-003

- title: Entrevista e Adaptacao Intercultural
- slug: entrevista-adaptacao-intercultural
- language: psychosocial
- description: Trilha para preparar maturidade, autoconhecimento, convivencia e responsabilidade.

Items:

1. study_material: MAT-006
2. flashcard_set: FLA-025 a FLA-030
3. psychosocial_questions: PSY-001 a PSY-010
4. objective_questions: OBJ-020
5. subjective_questions: SUB-002, SUB-004

## 8. Observacoes Para o Mentor IA

Este pacote pode alimentar futuramente o Mentor PGM como base pedagogica, desde que o sistema diferencie:

- Conteudo autoral PGM Academy.
- Regras oficiais que dependem do edital vigente.
- Orientacoes praticas reaproveitaveis.
- Respostas que exigem consulta a fonte oficial atualizada.

Recomendacao de comportamento do Mentor IA:

- Responder como mentor de preparacao, nao como orgao oficial.
- Incentivar confirmacao de prazos e regras no edital vigente.
- Nao prometer aprovacao, destino, embarque ou beneficio.
- Explicar erros de forma construtiva.
- Sugerir proximos passos de estudo.

## 9. Checklist de Revisao do Fundador

Antes de aprovar importacao:

- [ ] Categorias fazem sentido para o produto.
- [ ] Materiais estao claros e vendaveis.
- [ ] Flashcards estao curtos e uteis.
- [ ] Questoes objetivas estao autorais.
- [ ] Gabaritos e explicacoes estao corretos.
- [ ] Subjetivas estao adequadas para futura correcao por IA.
- [ ] Perguntas psicossociais estao maduras e respeitosas.
- [ ] Trilhas ajudam o aluno a evoluir.
- [ ] Nada copia questao oficial ou material protegido.
- [ ] Nada promete regra oficial permanente.

## 10. Decisao Pendente

Este documento ainda nao deve ser inserido no banco.

Proximo passo apos revisao:

1. Fundador aprova, ajusta ou rejeita itens.
2. Conteudo aprovado vira seed/importacao controlada.
3. Sistema registra conteudo como autoral PGM Academy.
4. Admin passa a gerenciar revisoes futuras.
