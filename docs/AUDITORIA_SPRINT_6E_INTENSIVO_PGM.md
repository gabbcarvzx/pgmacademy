# Auditoria Sprint 6E - Simulados Intensivos PGM 2026

Data: 13/06/2026  
Objetivo: verificar a arquitetura atual antes da criacao dos simulados intensivos de Ingles e Espanhol.

## Escopo Auditado

- Prova PGM 2024 fornecida como referencia editorial.
- Templates e catalogo de simulados.
- Criacao e recuperacao de tentativas.
- Runner objetivo, cronometro e navegacao.
- Finalizacao, scoring e resultado.
- Protecao do gabarito.
- Separacao por idioma e fonte editorial.
- Controle premium e isolamento por tenant/usuario.
- Pipeline editorial e validadores do acervo.

## Referencia PGM 2024

O PDF analisado possui 6 paginas, 30 questoes objetivas de Ingles e duracao de 3 horas. A composicao observada concentra fundamentos de uso da lingua, como pronomes, artigos, tempos verbais, preposicoes, comparativos e superlativos, e encerra com textos curtos de interpretacao.

A prova foi usada somente como referencia de formato, duracao, amplitude de assuntos e nivel esperado. Nenhum enunciado, alternativa ou texto foi copiado. O novo acervo e autoral e aumenta a exigencia por meio de:

- Contextos escolares, familiares, de viagem e intercambio.
- Distratores gramaticalmente proximos.
- Leitura com localizacao, ideia principal, inferencia e vocabulario em contexto.
- Dez questoes de dificuldade alta ou muito alta por idioma.
- Oito questoes de interpretacao por idioma, acima das tres observadas no PDF de 2024.

## Templates e Catalogo

O catalogo e carregado por `getSimulationOverview`, usando `simulation_templates` e o banco objetivo ativo. O bloqueio visual e operacional ja considera:

- Acesso premium.
- Ausencia de questoes.
- Quantidade insuficiente para o template.
- Idioma do template.
- `source_reference` do acervo.

Conclusao: os dois novos templates podem usar a estrutura existente. Nao ha necessidade de migration ou nova API.

## Criacao de Tentativa

`startSimulationAttempt`:

- Revalida o perfil e o acesso do usuario no servidor.
- Bloqueia template premium para conta sem acesso pago.
- Impede inicio com banco vazio ou insuficiente.
- Reutiliza tentativa ativa do mesmo template.
- Persiste `tenant_id`, `user_id` e `template_id`.
- Vincula apenas questoes elegiveis ao template.

`getAttemptForUser` consulta a tentativa por `id`, `tenant_id` e `user_id`. Isso impede acesso cruzado entre usuarios ou tenants mesmo com uso administrativo do service role dentro do servico.

## Separacao Editorial e por Idioma

`questionMatchesTemplate` exige:

- `type === objective`.
- Idioma igual ao template, exceto templates mistos.
- `source_reference` igual quando o template define uma fonte.

Essa regra permite isolar o acervo Sprint 6E dos simulados antigos. Ingles e Espanhol nao se misturam, e os templates existentes continuam usando suas fontes atuais.

## Runner e Protecao do Gabarito

`getSimulationRunner` retorna ao cliente somente:

- ID, categoria, dificuldade, idioma e enunciado.
- ID, rotulo e texto das alternativas.
- Alternativa previamente selecionada pelo aluno.

O campo `is_correct`, a resposta correta e a explicacao nao sao enviados ao runner. Ao salvar uma resposta, o servidor confirma que a alternativa pertence a questao vinculada a tentativa.

O gabarito e as explicacoes aparecem apenas em `getSimulationResult`, que exige tentativa com status `completed`. O score continua comparando IDs de alternativas, nao letras visuais.

## Finalizacao e Resultado

O fluxo atual ja calcula:

- Acertos e erros.
- Nota e percentual.
- Tempo gasto.
- Desempenho por categoria.
- Competencias fortes e fracas.
- Trilhas recomendadas.

Para a Sprint 6E, a extensao segura e adicionar uma classificacao de preparacao e um plano de recuperacao apenas quando o `editorial_id` identificar um template intensivo. O scoring existente nao precisa ser alterado.

## Pipeline Editorial

O pipeline existente oferece:

- Parser estruturado.
- Validacao de taxonomy, competencia, dificuldade, opcoes e resposta correta.
- Deteccao por `editorial_id`.
- Dry-run.
- Importacao idempotente com opcao de update.
- Relatorio por item.

Foi adotado um `source_reference` exclusivo: `Autoral PGM Academy - Sprint 6E Intensivo`.

## Tabelas Reutilizadas

- `simulation_templates`
- `question_banks`
- `questions`
- `question_options`
- `simulation_attempts`
- `simulation_answers`
- `question_categories`
- `competencies`
- `learning_paths`

Nenhuma tabela, coluna, indice ou politica foi alterada.

## Riscos Identificados

1. Qualidade linguistica final.
   - Mitigacao: conteudo autoral, validacao automatizada e recomendacao de revisao humana por professor de cada idioma antes de campanhas de grande alcance.

2. Mistura de acervos.
   - Mitigacao: templates e questoes compartilham o mesmo `source_reference` exclusivo.

3. Gabarito previsivel.
   - Mitigacao: distribuicao exata de seis respostas A, B, C, D e E em cada idioma, verificada no codigo e no banco.

4. Regressao em simulados antigos.
   - Mitigacao: IDs e fonte novos, preservacao dos templates anteriores e execucao dos testes oficiais e de scoring.

5. Uso operacional do service role no importador.
   - Mitigacao: uso restrito ao script editorial, sem exposicao ao cliente. O acesso do produto continua revalidado por usuario e tenant no servidor.

## Decisao Arquitetural

A Sprint 6E deve ser implementada sobre o pipeline, os services e as tabelas existentes. A arquitetura atual suporta os dois simulados sem migration, sem nova API e sem alteracao de RLS, autenticacao, pagamentos, regras premium ou historico de tentativas.
