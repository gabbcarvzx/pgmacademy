import {
  formatDestinationSummary,
  formatVacancySummary,
  pgm2026OfficialSnapshot,
} from "@/lib/official/pgm-2026";

function bulletList(items: readonly string[]) {
  return items.map((item) => `  - ${item}`).join("\n");
}

function languageVacancyList() {
  return pgm2026OfficialSnapshot.languages
    .map(
      (language) =>
        `  - ${language.name}: ${language.vacancies.toLocaleString("pt-BR")} vagas; destinos: ${language.destinations.join(", ")}.`,
    )
    .join("\n");
}

function timelineList() {
  return pgm2026OfficialSnapshot.timeline
    .map((item) => `  - ${item.label}: ${item.value}.`)
    .join("\n");
}

export const mentorKnowledgeBase = `
BASE DE CONHECIMENTO OFICIALMENTE REFERENCIADA - MENTOR PGM

Produto:
- A PGM Academy é uma plataforma independente de preparação.
- A PGM Academy não possui vínculo oficial com o Governo de Pernambuco, com a Secretaria de Educação e Esportes de Pernambuco, com o Instituto IGEDUC ou com o Programa Ganhe o Mundo.
- O objetivo do Mentor PGM é ajudar o aluno a estudar, organizar a rotina, entender etapas, treinar respostas, revisar requisitos e se preparar com responsabilidade.
- O Mentor PGM não decide elegibilidade, convocação, destino, nota, entrevista, documento, recurso ou embarque.

Fontes oficiais usadas:
- ${pgm2026OfficialSnapshot.editalTitle}: ${pgm2026OfficialSnapshot.editalUrl}
- Notícia da Secretaria de Educação e Esportes de Pernambuco sobre a oferta de vagas: ${pgm2026OfficialSnapshot.seeNewsUrl}
- Página do Instituto IGEDUC informada no edital: ${pgm2026OfficialSnapshot.igeducUrl}
- Data interna da última atualização desta base: ${pgm2026OfficialSnapshot.sourceUpdatedAt}

Dados centrais do PGM ${pgm2026OfficialSnapshot.selectionYear}:
- ${formatVacancySummary()}
- Destinos por idioma: ${formatDestinationSummary()}.
- A inscrição é feita por idioma. A indicação de país é preferência e não garante destino.
- O intercâmbio tem duração média de 18 semanas, equivalente a um semestre letivo.
- A classificação gera expectativa de direito, não garantia automática de viagem.
- A concretização da viagem depende de condições oficiais, como passaporte válido, vistos consulares e demais etapas indicadas nos canais oficiais.

Distribuição por idioma:
${languageVacancyList()}

Requisitos trabalhados no diagnóstico da plataforma:
- Data de nascimento entre 01/05/2009 e 01/10/2012.
- Matrícula no 1º ou 2º ano do Ensino Médio em 2026.
- Matrícula em escola pública da rede estadual de Pernambuco.
- Cadastro ativo e enturmação no SIEPE.
- Escola fora das categorias excluídas pelo edital: ${pgm2026OfficialSnapshot.requirements.excludedSchools.join(", ")}.
- Frequência mínima de ${pgm2026OfficialSnapshot.requirements.minimumAttendancePercent}%.
- Média mínima de ${pgm2026OfficialSnapshot.requirements.minimumAverage.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} em Língua Portuguesa.
- Média mínima de ${pgm2026OfficialSnapshot.requirements.minimumAverage.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} em Matemática.
- Média mínima de ${pgm2026OfficialSnapshot.requirements.minimumAverage.toLocaleString("pt-BR", { minimumFractionDigits: 1 })} na média aritmética de Ciências Humanas.
- Não estar em regime de progressão parcial no ano letivo de 2026.
- Não ter sido anteriormente convocado para intercâmbio no âmbito do Programa Ganhe o Mundo.

Estrutura do processo seletivo:
- Verificação dos requisitos: caráter eliminatório, com resultado apto ou inapto.
- Prova objetiva: ${pgm2026OfficialSnapshot.exam.objective.questions} questões de múltipla escolha, ${pgm2026OfficialSnapshot.exam.objective.alternatives} alternativas, ${pgm2026OfficialSnapshot.exam.objective.pointsPerQuestion} pontos por questão, pontuação máxima de ${pgm2026OfficialSnapshot.exam.objective.maxScore} pontos.
- Prova subjetiva: ${pgm2026OfficialSnapshot.exam.subjective.questions} questões, ${pgm2026OfficialSnapshot.exam.subjective.pointsPerQuestion} pontos por questão, pontuação máxima de ${pgm2026OfficialSnapshot.exam.subjective.maxScore} pontos.
- Cada resposta subjetiva deve ter entre ${pgm2026OfficialSnapshot.exam.subjective.minWords} e ${pgm2026OfficialSnapshot.exam.subjective.maxWords} palavras e ser escrita no idioma escolhido na inscrição.
- Nota global mínima informada no edital para não eliminação: ${pgm2026OfficialSnapshot.exam.globalMinimumScore} pontos no somatório da objetiva e subjetiva.
- Entrevista psicossocial: caráter eliminatório, formato telepresencial, resultado APTO ou INAPTO.

Cronograma de referência:
${timelineList()}

Critérios da prova subjetiva:
${bulletList(pgm2026OfficialSnapshot.exam.subjective.correctionCriteria)}

Eixos da entrevista psicossocial:
${bulletList(pgm2026OfficialSnapshot.psychosocialInterview.preparationAxes)}

Critérios de avaliação psicossocial:
${bulletList(pgm2026OfficialSnapshot.psychosocialInterview.criteria)}

Conteúdo programático - Língua Inglesa:
- Gramática: ${pgm2026OfficialSnapshot.programContent.english.grammar.join("; ")}.
- Vocabulário: ${pgm2026OfficialSnapshot.programContent.english.vocabulary.join("; ")}.
- Texto: ${pgm2026OfficialSnapshot.programContent.english.text.join("; ")}.

Conteúdo programático - Língua Espanhola:
- Gramática: ${pgm2026OfficialSnapshot.programContent.spanish.grammar.join("; ")}.
- Vocabulário: ${pgm2026OfficialSnapshot.programContent.spanish.vocabulary.join("; ")}.
- Texto: ${pgm2026OfficialSnapshot.programContent.spanish.text.join("; ")}.

Orientação obrigatória ao aluno:
- Sempre diferencie preparação da PGM Academy de decisão oficial.
- Para inscrição, prazos, resultados, recursos, documentos, convocações, destinos, entrevistas, passaporte, visto e embarque, oriente o aluno a conferir o edital vigente, a página do IGEDUC e os canais oficiais.
- Se o aluno perguntar algo que possa ter sido retificado, responda com cautela e recomende confirmação oficial.
- Nunca prometa aprovação, vaga, destino, correção favorável, aptidão psicossocial, convocação ou embarque.
- Nunca use dados de editais anteriores quando houver dado de 2026 nesta base.
`;
