import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  DatabaseZap,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  learningFoundationItems,
  seededCategoryGroups,
  simulationModes,
} from "@/lib/simulations/content";
import { getSimulationOverview } from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Simulados",
  description: "Fundacao dos simulados inteligentes da PGM Academy.",
};

const accessLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

const statusLabel = {
  started: "Em andamento",
  completed: "Concluido",
  abandoned: "Abandonado",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

type SimulationAttemptRow = {
  id: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  percentage: number | null;
  status: keyof typeof statusLabel;
};

export default async function SimuladosPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const overview = user ? await getSimulationOverview(user.id) : null;
  const accessStatus = overview?.accessStatus ?? "free";
  const isPremium = overview?.hasPaidAccess ?? false;
  const attempts = (overview?.attempts ?? []) as SimulationAttemptRow[];
  const historySummary = overview?.historySummary ?? {
    totalAttempts: 0,
    completedAttempts: 0,
    averagePercentage: 0,
    bestPercentage: 0,
    lastPercentage: null,
  };
  const categoriesCount = overview?.schema.categoriesCount ?? 0;
  const templatesCount = overview?.schema.templatesCount ?? 0;
  const activeObjectiveQuestionsCount =
    overview?.schema.activeObjectiveQuestionsCount ?? 0;
  const templates = overview?.templates ?? [];
  const isLearningSchemaReady = categoriesCount > 0;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <div className="grid gap-6 xl:grid-cols-[1fr_360px] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Simulados inteligentes
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
              Fundacao de aprendizagem para prova, escrita e entrevista
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
              Estrutura pronta para receber banco de questoes, materiais,
              flashcards, trilhas e preparacao psicossocial. Nenhuma questao
              real foi criada nesta etapa. O fluxo backend ja lista modelos,
              inicia tentativa e prepara correcao objetiva server-side quando
              houver banco de questoes.
            </p>
          </div>

          <div className="rounded-md border border-border-soft bg-background p-4">
            <ShieldCheck className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">
              Status de acesso
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {accessLabel[accessStatus]}
            </p>
            <p className="mt-3 text-xs leading-5 text-muted">
              Simulado rapido fica preparado para acesso limitado. Simulado
              completo e estatisticas avancadas exigem premium.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-4">
        {simulationModes.map((mode) => {
          const locked = mode.access === "premium" && !isPremium;

          return (
            <article
              key={mode.title}
              className="rounded-md border border-border-soft bg-surface p-5"
            >
              <mode.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {mode.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {mode.description}
                  </p>
                </div>
                {locked ? (
                  <LockKeyhole
                    className="size-4 shrink-0 text-pgm-yellow"
                    aria-hidden="true"
                  />
                ) : null}
              </div>

              <button
                type="button"
                disabled
                className="mt-5 inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted/70"
              >
                Aguardando banco de questoes
              </button>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_360px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
                Historico
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Tentativas do aluno
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                A leitura ja esta preparada para `simulation_attempts` com RLS
                por tenant e usuario.
              </p>
            </div>

            <span className="inline-flex rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted">
              {historySummary.totalAttempts} tentativas
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            {attempts.length === 0 ? (
              <div className="rounded-md border border-border-soft bg-background p-4">
                <p className="text-sm font-semibold text-white">
                  Nenhuma tentativa registrada
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  O historico sera preenchido quando a proxima etapa criar o
                  fluxo de execucao dos simulados.
                </p>
              </div>
            ) : (
              attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="grid gap-3 rounded-md border border-border-soft bg-background p-4 sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {statusLabel[attempt.status]}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Iniciado em{" "}
                      {dateFormatter.format(new Date(attempt.started_at))}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-white">
                      {attempt.percentage === null
                        ? "--"
                        : `${attempt.percentage}%`}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Nota {attempt.score ?? "--"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <aside className="grid gap-4">
          <article className="rounded-md border border-border-soft bg-surface p-5">
            <DatabaseZap
              className="size-5 text-pgm-yellow"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-medium text-muted">
              Schema de aprendizagem
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {isLearningSchemaReady ? "Pronto" : "Migration pendente"}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {categoriesCount} categorias estruturais detectadas.
            </p>
          </article>

          <article className="rounded-md border border-border-soft bg-surface p-5">
            <p className="text-sm font-semibold text-white">Estatisticas</p>
            <div className="mt-4 grid gap-3">
              {[
                ["Completos", historySummary.completedAttempts.toString()],
                ["Media", `${historySummary.averagePercentage}%`],
                ["Melhor", `${historySummary.bestPercentage}%`],
                [
                  "Ultimo",
                  historySummary.lastPercentage === null
                    ? "--"
                    : `${historySummary.lastPercentage}%`,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border border-border-soft bg-background px-3 py-2"
                >
                  <span className="text-sm text-muted">{label}</span>
                  <span className="font-mono text-sm font-semibold text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {!isPremium ? (
              <Link
                href="/dashboard#premium"
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
              >
                Liberar estatisticas
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </article>
        </aside>
      </section>

      <section className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Modelos reais
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Templates disponiveis
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Esta lista vem de `simulation_templates`. Como ainda nao criamos
              questoes nem templates reais, o estado esperado pode ser vazio.
            </p>
          </div>

          <span className="inline-flex rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
            {templatesCount} templates
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {templates.length === 0 ? (
            <article className="rounded-md border border-border-soft bg-surface p-5">
              <p className="text-sm font-semibold text-white">
                Nenhum template cadastrado
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                A rota `GET /api/simulations/templates` ja esta pronta, mas o
                painel administrativo ainda nao alimentou modelos de simulado.
              </p>
            </article>
          ) : (
            templates.map((template) => (
              <article
                key={template.id}
                className="rounded-md border border-border-soft bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {template.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {template.description ??
                        "Template preparado para simulado objetivo."}
                    </p>
                  </div>
                  {template.lockedReason === "premium_required" ? (
                    <LockKeyhole
                      className="size-4 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-xs font-semibold text-muted">
                    {template.type === "full" ? "Completo" : "Rapido"}
                  </span>
                  <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-xs font-semibold text-muted">
                    {template.language}
                  </span>
                  <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-xs font-semibold text-muted">
                    {template.availableQuestionCount} questoes
                  </span>
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-5 inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted/70"
                >
                  {template.lockedReason === "premium_required"
                    ? "Premium necessario"
                    : template.lockedReason === "no_questions"
                      ? "Sem questoes cadastradas"
                      : "Fluxo pronto para proxima etapa"}
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
          Fundacao pronta
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-white">
          Ecossistema de aprendizagem
        </h2>

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {learningFoundationItems.map((item) => (
            <article
              key={item.title}
              className="rounded-md border border-border-soft bg-background p-4"
            >
              <item.Icon
                className="size-5 text-pgm-yellow"
                aria-hidden="true"
              />
              <p className="mt-4 text-sm font-semibold text-white">
                {item.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-md border border-border-soft bg-surface p-5">
          <p className="text-sm font-semibold text-white">
            Banco objetivo ativo
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {activeObjectiveQuestionsCount} questoes objetivas visiveis para o
            usuario atual. A Etapa 8B nao insere questoes no banco real.
          </p>
        </div>
      </section>

      <section className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
          Seeds estruturais
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {seededCategoryGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-md border border-border-soft bg-background p-4"
            >
              <h2 className="text-lg font-semibold text-white">
                {group.title}
              </h2>
              <ul className="mt-4 grid gap-2">
                {group.categories.map((category) => (
                  <li
                    key={category}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <CheckCircle2
                      className="size-4 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                    {category}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
