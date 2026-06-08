# Especificação de Importação Editorial PGM

Data: 04/06/2026  
Sprint: 6A  
Escopo: preparar contratos para Sprints 6B, 6C e 6D sem importar conteúdo nesta etapa.

## Campos Comuns

Todo item importado futuramente deve possuir:

- `editorial_id`
- `category`
- `subcategory`
- `primary_competency_code`
- `language`, exceto psicossociais
- `editorial_difficulty_level`
- `tags`
- `editorial_version_code`
- `source_reference`

## Sprint 6B - 400 Questões Objetivas

Cada questão objetiva deve suportar:

- ID único
- categoria
- subcategoria
- competência
- idioma
- dificuldade editorial 1 a 4
- enunciado
- alternativas
- gabarito único
- explicação
- tags
- versão editorial
- fonte

Regras de bloqueio do importador:

- não aceitar `editorial_id` duplicado;
- não aceitar questão sem competência;
- não aceitar questão sem alternativa correta;
- não aceitar mais de uma alternativa correta;
- não aceitar questão sem explicação;
- não aceitar item sem versão editorial ativa.

## Sprint 6C - Materiais Premium

Cada material premium deve suportar:

- introdução
- teoria
- exemplos
- erros comuns
- questões resolvidas
- flashcards
- checklist
- categoria, subcategoria e competência
- tags e versão editorial

Estrutura recomendada em `material_structure`:

```json
{
  "introduction": [],
  "theory": [],
  "examples": [],
  "common_mistakes": [],
  "solved_questions": [],
  "flashcards": [],
  "checklist": []
}
```

O campo `content_md` continua preservado para renderização atual.

## Sprint 6D - 50 Subjetivas

Cada subjetiva deve suportar:

- enunciado
- idioma esperado
- limite de 90 a 150 palavras
- categoria
- subcategoria
- competência
- dificuldade editorial
- tags
- versão editorial
- rubrica de correção

Critérios de rubrica:

- Correção gramatical
- Precisão vocabular
- Estrutura sintática
- Coesão
- Clareza

## Sprint 6D - 80 Psicossociais

Cada pergunta psicossocial deve suportar:

- categoria
- subcategoria
- competência
- dificuldade editorial
- pergunta situacional
- diretrizes de resposta ideal
- erros comuns
- tags
- versão editorial
- fonte

Categorias prioritárias:

- Comunicação
- Adaptabilidade
- Autonomia
- Responsabilidade
- Diversidade Cultural
- Resolução de Conflitos

## Segurança e Multi-tenant

Importadores futuros devem:

- manter `tenant_id = null` para conteúdo global;
- usar `tenant_id` apenas quando houver conteúdo específico de tenant;
- nunca inserir tentativa ou progresso de usuário durante importação editorial;
- preservar premium access existente;
- gerar logs de importação em camada administrativa futura;
- falhar com relatório detalhado em caso de inconsistência.

## Critério de Aceite dos Importadores

Cada importador futuro deve entregar:

- validação em memória antes de gravar;
- transação por lote;
- relatório de itens criados, atualizados, ignorados e rejeitados;
- teste automatizado de schema editorial;
- rollback seguro em caso de falha crítica.
