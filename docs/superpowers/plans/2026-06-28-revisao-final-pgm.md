# Revisao Final PGM Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar uma central premium de Revisao Final PGM integrada ao dashboard, estudos, navegacao e simulados reais.

**Architecture:** A implementacao cria uma camada propria de dados em `src/lib/review-final`, uma rota premium protegida em `src/app/(app)/premium/revisao-final`, e componentes reutilizaveis de destaque para integrar a feature aos pontos de entrada existentes. O controle de acesso reaproveita Supabase server-side e o modelo premium atual.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Supabase, ESLint.

---

### Task 1: Modelar dados e links reais da Revisao Final

**Files:**
- Create: `src/lib/review-final/content.ts`
- Create: `src/lib/review-final/service.ts`
- Test: `tests/review-final.test.ts`

- [ ] Criar helpers puros para estruturar secoes editoriais e resolver simulados recomendados.
- [ ] Cobrir os helpers com teste `tsx` simples usando `node:assert/strict`.
- [ ] Implementar o service server-side com controle premium e reaproveitamento do catalogo de simulados.

### Task 2: Criar UI e rota premium

**Files:**
- Create: `src/components/premium/review-final-promo-banner.tsx`
- Create: `src/components/premium/review-final-study-alert.tsx`
- Create: `src/app/(app)/premium/revisao-final/page.tsx`

- [ ] Criar banner principal reutilizavel para dashboard.
- [ ] Criar aviso leve para estudos.
- [ ] Implementar a pagina premium com teaser para usuarios free e conteudo completo para `paid/admin`.

### Task 3: Integrar a feature ao fluxo autenticado

**Files:**
- Modify: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/(app)/estudos/page.tsx`
- Modify: `src/components/app-shell/app-sidebar.tsx`

- [ ] Inserir banner principal no dashboard.
- [ ] Inserir aviso/card na Central de Estudos.
- [ ] Adicionar acesso rapido no menu lateral.

### Task 4: Verificacao e entrega

**Files:**
- Modify: `package.json` (somente se necessario para novo teste)

- [ ] Rodar `npm run lint`.
- [ ] Rodar `npx tsc --noEmit`.
- [ ] Rodar `npm run build`.
- [ ] Revisar `git diff`, remover residuos e validar navegacao/rotas.
