import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, PenLine } from "lucide-react";

import { PaymentButton } from "@/components/billing/payment-button";
import { StatusBadge } from "@/components/manual-review/status-badge";
import { requireUserId } from "@/lib/auth/require-user";
import { getSubjectiveQuestionList } from "@/lib/manual-review/service";

export const metadata: Metadata = {
  title: "Subjetivas",
  description: "Questões subjetivas com correção manual pela PGM Academy.",
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    language?: string;
    category?: string;
    difficulty?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function SubjectiveQuestionsPage({
  searchParams,
}: PageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const data = await getSubjectiveQuestionList(userId, {
    search: params?.q,
    language: params?.language,
    category: params?.category,
    difficulty: params?.difficulty,
  });

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Correção manual
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Questões subjetivas
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Escreva respostas em texto, envie para revisão humana e acompanhe
              nota, feedback e status. Sem IA e sem correção automática.
            </p>
          </div>
          {data.hasPaidAccess ? (
            <Link
              href="/subjetivas/minhas-respostas"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
            >
              Minhas respostas
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <div className="rounded-md border border-pgm-yellow/35 bg-background p-4">
              <LockKeyhole className="size-5 text-pgm-yellow" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-white">
                Envio premium
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Usuários gratuitos visualizam a área, mas envio e correção manual
                exigem acesso premium.
              </p>
              <div className="mt-4">
                <PaymentButton label="Desbloquear acesso premium" />
              </div>
            </div>
          )}
        </div>
      </section>

      {params?.success ? (
        <p className="mt-5 rounded-md border border-pgm-green/40 bg-pgm-green/10 px-4 py-3 text-sm text-pgm-green">
          {params.success}
        </p>
      ) : null}
      {params?.error ? (
        <p className="mt-5 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
          {params.error}
        </p>
      ) : null}

      <form className="mt-6 grid gap-3 rounded-md border border-border-soft bg-surface p-4 lg:grid-cols-[1fr_160px_220px_160px_auto]">
        <input
          name="q"
          placeholder="Buscar questão ou categoria"
          defaultValue={params?.q ?? ""}
          className="h-11 rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow"
        />
        <select
          name="language"
          defaultValue={params?.language ?? ""}
          className="h-11 rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition focus:border-pgm-yellow"
        >
          <option value="">Idiomas</option>
          {data.filterOptions.languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={params?.category ?? ""}
          className="h-11 rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition focus:border-pgm-yellow"
        >
          <option value="">Categorias</option>
          {data.filterOptions.categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          name="difficulty"
          defaultValue={params?.difficulty ?? ""}
          className="h-11 rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition focus:border-pgm-yellow"
        >
          <option value="">Dificuldades</option>
          {data.filterOptions.difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
        >
          Filtrar
        </button>
      </form>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {data.questions.length === 0 ? (
          <div className="rounded-md border border-border-soft bg-surface p-5 text-sm text-muted">
            Nenhuma questão subjetiva encontrada.
          </div>
        ) : (
          data.questions.map((question) => (
            <article
              key={question.id}
              className="rounded-md border border-border-soft bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md border border-border-soft bg-background px-2 py-1 text-xs font-semibold text-muted">
                    {question.language}
                  </span>
                  <span className="rounded-md border border-border-soft bg-background px-2 py-1 text-xs font-semibold text-muted">
                    {question.difficulty}
                  </span>
                  <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-2 py-1 text-xs font-semibold text-pgm-yellow">
                    {question.isPremium ? "Premium" : "Gratuita"}
                  </span>
                </div>
                <StatusBadge status={question.latestStatus} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">
                {question.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {question.categoryName}
              </p>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
                {question.prompt}
              </p>
              <Link
                href={`/subjetivas/${question.id}`}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
              >
                <PenLine className="size-4" aria-hidden="true" />
                Abrir questão
              </Link>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
