import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SuccessCenterSearch } from "@/components/success-center/success-center-search";
import { getMissionDashboard } from "@/lib/mission/service";
import {
  buildSuccessSearchIndex,
  firstStepsGuide,
  futureSupportArchitecture,
  professionalFaqs,
  successCenterCategories,
  successCenterGuides,
  supportChannels,
  usefulResources,
} from "@/lib/success-center/content";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Central de Sucesso",
  description: "Help Center da PGM Academy para alunos e usuários premium.",
};

function buildContextLinks(data: Awaited<ReturnType<typeof getMissionDashboard>>) {
  const links = [
    {
      title: "Como usar o Painel de Missão",
      description: "Entenda próxima ação, missão diária e preparação geral.",
      href: "/dashboard",
    },
  ];

  if (data.requiresOnboarding) {
    links.unshift({
      title: "Guia do Plano de Aprovação",
      description: "Conclua o onboarding para gerar seu plano automático.",
      href: "/onboarding",
    });
  }

  if (!data.latestAssessment) {
    links.push({
      title: "Como fazer o diagnóstico inicial",
      description: "Use o diagnóstico para calibrar sua rotina de preparação.",
      href: "/diagnostico",
    });
  }

  if (data.stats.completedSimulations === 0) {
    links.push({
      title: "Como realizar seu primeiro Simulado Oficial",
      description: "Abra instruções, responda com cronômetro e leia o relatório.",
      href: "/simulados",
    });
  }

  if (data.stats.subjectiveSubmitted === 0) {
    links.push({
      title: "Como enviar a primeira subjetiva",
      description: "Treine escrita entre 90 e 150 palavras no fluxo oficial.",
      href: "/simulados/subjetivo-oficial",
    });
  }

  return links.slice(0, 4);
}

export default async function SuccessCenterPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const mission = await getMissionDashboard(user.id);
  const contextLinks = buildContextLinks(mission);
  const searchIndex = buildSuccessSearchIndex();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Central de Sucesso
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-4xl">
            Encontre orientação para estudar, acessar e evoluir
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Base de ajuda da PGM Academy para dúvidas de plataforma, premium,
            simulados, subjetivas, Mentor IA e preparação PGM.
          </p>
        </article>

        <aside className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5">
          <LifeBuoy className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-white">
            Atendimento orientado por contexto
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Os guias abaixo consideram seu uso atual para reduzir dúvidas
            repetitivas e acelerar o próximo passo.
          </p>
        </aside>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <SuccessCenterSearch searchIndex={searchIndex} />

        <aside className="rounded-md border border-border-soft bg-surface p-5">
          <Sparkles className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-white">
            Recomendações para você
          </p>
          <div className="mt-4 grid gap-3">
            {contextLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-md border border-border-soft bg-background p-3 transition hover:border-white/35"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Primeiros Passos
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {firstStepsGuide.title}
            </h2>
          </div>
          <Link
            href={firstStepsGuide.href}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
          >
            Abrir missão
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {firstStepsGuide.steps.map((step, index) => (
            <div
              key={step}
              className="rounded-md border border-border-soft bg-background p-4"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-pgm-yellow text-sm font-semibold text-background">
                {index + 1}
              </span>
              <p className="mt-4 text-sm leading-6 text-white">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6" id="categorias">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Categorias
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Base organizada por tema
            </h2>
          </div>
          <span className="rounded-md border border-border-soft px-3 py-2 font-mono text-sm font-semibold text-muted">
            {successCenterCategories.length} categorias
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {successCenterCategories.map((category) => (
            <article
              key={category.slug}
              id={category.slug}
              className="rounded-md border border-border-soft bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {category.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {category.description}
                  </p>
                </div>
                <BookOpenCheck
                  className="size-5 shrink-0 text-pgm-yellow"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-4 grid gap-2">
                {category.articles.slice(0, 2).map((articleItem) => (
                  <Link
                    key={articleItem.id}
                    href={articleItem.href}
                    className="inline-flex min-h-10 items-center justify-between gap-3 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                  >
                    {articleItem.title}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="size-5 text-pgm-yellow" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white">
              FAQ profissional
            </h2>
          </div>

          <div className="mt-5 grid gap-3">
            {professionalFaqs.slice(0, 12).map((item) => (
              <details
                key={item.id}
                className="rounded-md border border-border-soft bg-background p-4"
              >
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </article>

        <aside className="grid content-start gap-4">
          <article className="rounded-md border border-border-soft bg-surface p-5">
            <Search className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-white">Guias rápidos</p>
            <div className="mt-4 grid gap-3">
              {successCenterGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={guide.href}
                  className="rounded-md border border-border-soft bg-background p-3 transition hover:border-white/35"
                >
                  <p className="text-sm font-semibold text-white">
                    {guide.title}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-border-soft bg-surface p-5">
            <ShieldCheck className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-white">
              Independência institucional
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              A PGM Academy é independente e não substitui edital, Secretaria de
              Educação, banca, resultados, convocações ou canais oficiais.
            </p>
          </article>
        </aside>
      </section>

      <section
        id="contato"
        className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Falar com suporte
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Canais de contato
            </h2>
          </div>
          <span className="rounded-md border border-border-soft px-3 py-2 text-sm font-semibold text-muted">
            Tickets em preparação
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {supportChannels.map((channel) => {
            const Icon = channel.id === "email" ? Mail : channel.id === "whatsapp" ? MessageCircle : LifeBuoy;
            return (
              <article
                key={channel.id}
                className="rounded-md border border-border-soft bg-background p-4"
              >
                <Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold text-white">
                  {channel.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {channel.description}
                </p>
                <p className="mt-3 text-xs leading-5 text-muted">
                  {channel.responseNote}
                </p>
                <Link
                  href={channel.href}
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  {channel.cta}
                  {channel.id === "tickets" ? (
                    <ArrowRight className="size-4" aria-hidden="true" />
                  ) : (
                    <ExternalLink className="size-4" aria-hidden="true" />
                  )}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-pgm-yellow" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white">
              Recursos úteis
            </h2>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {usefulResources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="rounded-md border border-border-soft bg-background p-4 transition hover:border-white/35"
              >
                <p className="text-sm font-semibold text-white">
                  {resource.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </article>

        <aside className="rounded-md border border-border-soft bg-surface p-5">
          <LifeBuoy className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-white">
            Arquitetura preparada
          </p>
          <div className="mt-4 grid gap-2">
            {futureSupportArchitecture.map((item) => (
              <div
                key={item}
                className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
