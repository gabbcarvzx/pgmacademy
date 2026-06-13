import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  Flame,
  Gauge,
  History,
  ListChecks,
  LockKeyhole,
  PencilLine,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { languageLabel } from "@/lib/learning/labels";
import {
  officialSubjectiveSimulation,
  simulationDurationMinutes,
} from "@/lib/simulations/official-pgm";
import { isIntensiveSimulationTemplate } from "@/lib/simulations/intensive-pgm";
import {
  getSimulationOverview,
  type SimulationBankBreakdownItem,
} from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Simulados",
  description: "Simulados oficiais objetivos e subjetivos da PGM Academy.",
};

const accessLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

const statusLabel = {
  started: "Em andamento",
  completed: "Concluído",
  abandoned: "Abandonado",
} as const;

const typeLabel = {
  quick: "Rápido",
  full: "Oficial PGM",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function lockLabel(reason: string | null) {
  if (reason === "premium_required") return "Premium bloqueado";
  if (reason === "insufficient_questions") return "Banco insuficiente";
  if (reason === "no_questions") return "Sem questões";
  return null;
}

function BreakdownPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: SimulationBankBreakdownItem[];
}) {
  return (
    <article className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4">
      <div className="flex items-start justify-between gap-4 max-sm:gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-2 text-xs leading-5 text-muted">{description}</p>
        </div>
        <span className="shrink-0 rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 px-2 py-1 font-mono text-xs font-semibold text-pgm-yellow">
          {items.reduce((total, item) => total + item.count, 0)}
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        {items.length === 0 ? (
          <p className="rounded-md border border-border-soft bg-background p-3 text-sm leading-6 text-muted">
            Nenhum item visível para a conta atual.
          </p>
        ) : (
          items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="grid min-w-0 gap-2 rounded-md border border-border-soft bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-start"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-white">
                  {item.label}
                </p>
                {item.detail ? (
                  <p className="mt-1 break-words text-xs leading-5 text-muted">
                    {item.detail}
                  </p>
                ) : null}
              </div>
              <span className="font-mono text-xs font-semibold text-pgm-yellow max-sm:justify-self-start">
                {item.count} {item.count === 1 ? "questão" : "questões"}
              </span>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

export default async function SimuladosPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const overview = await getSimulationOverview(user.id);
  const intensiveTemplates = overview.templates.filter((template) =>
    isIntensiveSimulationTemplate(template),
  );
  const officialObjectiveTemplates = overview.templates.filter(
    (template) =>
      !isIntensiveSimulationTemplate(template) &&
      (template.language === "english" || template.language === "spanish"),
  );
  const supportTemplates = overview.templates.filter(
    (template) => template.language !== "english" && template.language !== "spanish",
  );
  const subjectiveLanguages = ["english", "spanish"] as const;

  const renderTemplateCard = (template: (typeof overview.templates)[number]) => {
    const lockedMessage = lockLabel(template.lockedReason);
    const isLocked = Boolean(template.lockedReason);

    return (
      <article
        key={template.id}
        className={`rounded-md border p-5 max-sm:p-4 sm:p-6 ${
          isLocked
            ? "border-pgm-yellow/25 bg-pgm-yellow/5"
            : "border-border-soft bg-surface"
        }`}
      >
        <div className="flex items-start justify-between gap-4 max-sm:gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                {typeLabel[template.type]}
              </span>
              <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                {languageLabel[template.language]}
              </span>
              <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-1 text-xs font-semibold text-pgm-yellow">
                {template.is_premium ? "Premium" : "Gratuito"}
              </span>
            </div>
            <h3 className="mt-4 break-words text-xl font-semibold text-white">
              {template.title}
            </h3>
          </div>
          {isLocked ? (
            <LockKeyhole
              className="size-5 shrink-0 text-pgm-yellow"
              aria-hidden="true"
            />
          ) : (
            <ListChecks
              className="size-5 shrink-0 text-pgm-yellow"
              aria-hidden="true"
            />
          )}
        </div>

        <p className="mt-4 text-sm leading-6 text-muted">
          {template.description ?? "Simulado objetivo com correcao automatica."}
        </p>

        <div className="mt-5 grid gap-3 max-sm:gap-2 sm:grid-cols-3">
          <span className="min-w-0 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
            {template.total_questions} questoes
          </span>
          <span className="inline-flex min-w-0 items-center gap-2 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
            <Clock3 className="size-4" aria-hidden="true" />
            {simulationDurationMinutes(template)} min
          </span>
          <span className="min-w-0 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
            {template.availableQuestionCount} no banco
          </span>
        </div>

        {template.lockedReason === "premium_required" ? (
          <Link
            href="/planos"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            Quero continuar evoluindo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : isLocked ? (
          <button
            type="button"
            disabled
            className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted/70"
          >
            {lockedMessage}
          </button>
        ) : (
          <Link
            href={`/simulados/${template.id}`}
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
          >
            Abrir instrucoes
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </article>
    );
  };

  return (
    <main className="px-4 py-6 max-sm:px-3 max-sm:py-4 sm:px-6 lg:px-8">
      <section className="grid gap-5 max-sm:gap-4 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Simulados reais
          </p>
          <h1 className="mt-4 max-w-3xl text-2xl font-semibold text-white sm:text-4xl">
            Treine com as questões objetivas autorais já aprovadas
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Escolha um template, inicie uma tentativa e acompanhe seu resultado
            por categoria. O gabarito fica protegido até a finalização.
          </p>
        </div>
        {overview.hasPaidAccess ? (
          <InstitutionalNotice />
        ) : (
          <PremiumUpgradeCard description="Simulados premium exigem acesso pago. Você pode visualizar os modelos, mas somente usuários premium podem iniciar." />
        )}
      </section>

      <section className="mt-6 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Acesso",
            value: accessLabel[overview.accessStatus],
            description: "Controle central por profiles.access_status.",
            Icon: ShieldCheck,
          },
          {
            title: "Templates",
            value: String(overview.schema.templatesCount),
            description: "Modelos ativos disponíveis para estudo.",
            Icon: ListChecks,
          },
          {
            title: "Questões",
            value: String(overview.schema.activeObjectiveQuestionsCount),
            description: "Objetivas visíveis para seu plano atual.",
            Icon: Trophy,
          },
          {
            title: "Histórico",
            value: String(overview.historySummary.totalAttempts),
            description: `${overview.historySummary.completedAttempts} tentativas concluídas.`,
            Icon: History,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4"
          >
            <item.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-5 text-sm font-medium text-muted">{item.title}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {item.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-md border border-pgm-yellow/45 bg-surface max-sm:mt-4">
        <div className="border-b border-border-soft bg-pgm-yellow/10 p-5 max-sm:p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-pgm-yellow">
                <Flame className="size-5" aria-hidden="true" />
                <p className="text-sm font-semibold uppercase">
                  Reta Final PGM 2026
                </p>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Simulados intensivos por idioma
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                Faltam poucos dias para a prova. Treine com 30 questoes em 3
                horas e descubra quais pontos revisar antes da selecao. Esta e
                uma preparacao independente baseada em padroes observados em
                provas anteriores.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-md border border-pgm-yellow/40 bg-background px-3 py-2 text-sm font-semibold text-pgm-yellow">
              Exclusivo Premium
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 max-sm:p-4 sm:p-6 lg:grid-cols-2">
          {intensiveTemplates.length === 0 ? (
            <div className="rounded-md border border-border-soft bg-background p-4 lg:col-span-2">
              <p className="text-sm font-semibold text-white">
                Intensivos em preparacao
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Os novos modelos aparecerao aqui assim que o lote editorial da
                Sprint 6E for importado.
              </p>
            </div>
          ) : (
            intensiveTemplates.map((template) => {
              const isLocked = Boolean(template.lockedReason);

              return (
                <article
                  key={template.id}
                  className="rounded-md border border-pgm-yellow/30 bg-background p-5 max-sm:p-4 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md border border-border-soft px-3 py-1 text-xs font-semibold text-muted">
                          Objetivo
                        </span>
                        <span className="rounded-md border border-border-soft px-3 py-1 text-xs font-semibold text-muted">
                          {languageLabel[template.language]}
                        </span>
                        <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-1 text-xs font-semibold text-pgm-yellow">
                          Premium
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-white">
                        {template.title}
                      </h3>
                    </div>
                    <Gauge
                      className="size-5 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted">
                    {template.description}
                  </p>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    <span className="rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted">
                      30 questoes
                    </span>
                    <span className="rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted">
                      3 horas
                    </span>
                    <span className="rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted">
                      Diagnostico por assunto
                    </span>
                  </div>

                  {template.lockedReason === "premium_required" ? (
                    <Link
                      href="/planos"
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
                    >
                      Desbloquear Intensivo
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  ) : isLocked ? (
                    <button
                      type="button"
                      disabled
                      className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted/70"
                    >
                      {lockLabel(template.lockedReason)}
                    </button>
                  ) : (
                    <Link
                      href={`/simulados/${template.id}`}
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
                    >
                      Iniciar Intensivo
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="mt-6 max-sm:mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Banco importado
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Questões organizadas por categoria, competência e dificuldade
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              A composição abaixo usa apenas questões objetivas visíveis para o
              acesso atual. Ela ajuda a entender se o banco importado está
              distribuído de forma pedagógica antes de iniciar uma tentativa.
            </p>
          </div>
          <span className="inline-flex rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
            {overview.schema.activeObjectiveQuestionsCount} objetivas
          </span>
        </div>

        <div className="mt-5 grid gap-4 max-sm:gap-3 xl:grid-cols-3">
          <BreakdownPanel
            title="Categorias"
            description="Áreas pedagógicas usadas nos simulados."
            items={overview.schema.byCategory}
          />
          <BreakdownPanel
            title="Competências"
            description="Competências editoriais vinculadas pelo import."
            items={overview.schema.byCompetency}
          />
          <BreakdownPanel
            title="Dificuldade"
            description="Nível editorial ou classificação legada."
            items={overview.schema.byDifficulty}
          />
        </div>
      </section>

      <section className="mt-6 max-sm:mt-4">
        <div className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 max-sm:p-4 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-pgm-yellow">
                Simulado subjetivo oficial
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {officialSubjectiveSimulation.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                {officialSubjectiveSimulation.description} O envio usa a fila de
                correção manual já existente e prepara a arquitetura para
                avaliação por rubrica.
              </p>
            </div>
            <div className="grid gap-3 max-sm:gap-2 sm:grid-cols-3 lg:min-w-[430px]">
              <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                {officialSubjectiveSimulation.questionCount} questões
              </span>
              <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                {officialSubjectiveSimulation.minWords}-
                {officialSubjectiveSimulation.maxWords} palavras
              </span>
              <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-2 text-sm font-semibold text-pgm-yellow">
                Premium
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
            {subjectiveLanguages.map((language) => (
              <Link
                key={language}
                href={`/simulados/subjetivo-oficial?idioma=${language}`}
                className="inline-flex min-h-11 items-center justify-between gap-3 rounded-md bg-pgm-yellow px-5 py-3 text-sm font-semibold text-background transition hover:bg-white max-sm:w-full"
              >
                <span>Subjetivo - {languageLabel[language]}</span>
                <PencilLine className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 max-sm:mt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Simulados objetivos
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Escolha o idioma da prova objetiva
            </h2>
          </div>
          <span className="inline-flex rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
            {officialObjectiveTemplates.length} idiomas
          </span>
        </div>

        <div className="mt-5 grid gap-4 max-sm:gap-3 xl:grid-cols-2">
          {officialObjectiveTemplates.map((template) => {
            const lockedMessage = lockLabel(template.lockedReason);
            const isLocked = Boolean(template.lockedReason);

            return (
              <article
                key={template.id}
                className={`rounded-md border p-5 max-sm:p-4 sm:p-6 ${
                  isLocked
                    ? "border-pgm-yellow/25 bg-pgm-yellow/5"
                    : "border-border-soft bg-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-4 max-sm:gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                        {typeLabel[template.type]}
                      </span>
                      <span className="rounded-md border border-border-soft bg-background px-3 py-1 text-xs font-semibold text-muted">
                        {languageLabel[template.language]}
                      </span>
                      <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-3 py-1 text-xs font-semibold text-pgm-yellow">
                        {template.is_premium ? "Premium" : "Gratuito"}
                      </span>
                    </div>
                    <h3 className="mt-4 break-words text-xl font-semibold text-white">
                      {template.title}
                    </h3>
                  </div>
                  {isLocked ? (
                    <LockKeyhole
                      className="size-5 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                  ) : (
                    <ListChecks
                      className="size-5 shrink-0 text-pgm-yellow"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-muted">
                  {template.description ??
                    "Simulado objetivo com correção automática."}
                </p>

                <div className="mt-5 grid gap-3 max-sm:gap-2 sm:grid-cols-3">
                  <span className="min-w-0 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                    {template.total_questions} questões
                  </span>
                  <span className="inline-flex min-w-0 items-center gap-2 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                    <Clock3 className="size-4" aria-hidden="true" />
                    {simulationDurationMinutes(template)} min
                  </span>
                  <span className="min-w-0 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                    {template.availableQuestionCount} no banco
                  </span>
                </div>

                {template.lockedReason === "premium_required" ? (
                  <Link
                    href="/planos"
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
                  >
                    Quero continuar evoluindo
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : isLocked ? (
                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted/70"
                  >
                    {lockedMessage}
                  </button>
                ) : (
                  <Link
                    href={`/simulados/${template.id}`}
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                  >
                    Abrir instruções
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {supportTemplates.length > 0 ? (
        <section className="mt-6 max-sm:mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-pgm-yellow">
                Treinos de apoio
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Modelos gerais separados dos oficiais por idioma
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
                Estes modelos continuam disponiveis como treino complementar,
                sem confundir a prova objetiva por idioma nem o simulado
                subjetivo oficial.
              </p>
            </div>
            <span className="inline-flex rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
              {supportTemplates.length} modelos
            </span>
          </div>

          <div className="mt-5 grid gap-4 max-sm:gap-3 xl:grid-cols-3">
            {supportTemplates.map(renderTemplateCard)}
          </div>
        </section>
      ) : null}

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 max-sm:mt-4 max-sm:p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Histórico
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Tentativas anteriores
            </h2>
          </div>
          <span className="rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted">
            Melhor: {overview.historySummary.bestPercentage}%
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {overview.attempts.length === 0 ? (
            <div className="rounded-md border border-border-soft bg-background p-4 max-sm:p-3">
              <p className="text-sm font-semibold text-white">
                Nenhuma tentativa registrada
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Inicie um template disponível para acompanhar desempenho,
                acertos e evolução por categoria.
              </p>
            </div>
          ) : (
            overview.attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="grid gap-4 rounded-md border border-border-soft bg-background p-4 max-sm:p-3 lg:grid-cols-[1fr_180px_160px]"
              >
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-white">
                    {attempt.templateTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {dateFormatter.format(new Date(attempt.started_at))} ·{" "}
                    {statusLabel[attempt.status]} · {attempt.answerCount} questões
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted">
                    Pontuacao
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {attempt.percentage === null
                      ? "--"
                      : `${attempt.percentage}%`}
                  </p>
                </div>
                <Link
                  href={
                    attempt.status === "completed"
                      ? `/simulados/tentativas/${attempt.id}/resultado`
                      : `/simulados/tentativas/${attempt.id}`
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  {attempt.status === "completed" ? "Ver resultado" : "Continuar"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
