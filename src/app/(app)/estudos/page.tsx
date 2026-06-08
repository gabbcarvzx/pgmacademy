import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Clock3, LockKeyhole, Search } from "lucide-react";

import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { difficultyLabel, languageLabel } from "@/lib/learning/labels";
import { getStudyMaterialsPage } from "@/lib/learning/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Central de Estudos",
  description: "Materiais de estudo da PGM Academy.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildPageHref(params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params);
  next.set("page", String(page));
  return `/estudos?${next.toString()}`;
}

export default async function EstudosPage({ searchParams }: PageProps) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const query = {
    search: firstParam(params?.q),
    language: firstParam(params?.idioma),
    category: firstParam(params?.categoria),
    difficulty: firstParam(params?.dificuldade),
    page: firstParam(params?.page),
  };
  const data = await getStudyMaterialsPage(user.id, query);
  const currentParams = new URLSearchParams();
  if (data.filters.search) currentParams.set("q", data.filters.search);
  if (data.filters.language) currentParams.set("idioma", data.filters.language);
  if (data.filters.category) currentParams.set("categoria", data.filters.category);
  if (data.filters.difficulty) currentParams.set("dificuldade", data.filters.difficulty);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Central de estudos
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Materiais autorais para preparar sua jornada
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Leia materiais por idioma, categoria e dificuldade. Conteúdos
            premium aparecem bloqueados para contas gratuitas sem expor o corpo
            do material.
          </p>
        </div>
        {!data.hasPaidAccess ? <PremiumUpgradeCard /> : <InstitutionalNotice />}
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-4 sm:p-5">
        <form className="grid gap-3 lg:grid-cols-[1.4fr_repeat(3,1fr)_auto]" action="/estudos">
          <label className="relative">
            <span className="sr-only">Buscar material</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              name="q"
              defaultValue={data.filters.search}
              placeholder="Buscar por título"
              className="h-11 w-full rounded-md border border-border-soft bg-background pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-muted focus:border-pgm-yellow"
            />
          </label>

          <select
            name="idioma"
            defaultValue={data.filters.language}
            className="h-11 rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition focus:border-pgm-yellow"
          >
            <option value="">Todos os idiomas</option>
            {data.filterOptions.languages.map((language) => (
              <option key={language} value={language}>
                {languageLabel[language]}
              </option>
            ))}
          </select>

          <select
            name="categoria"
            defaultValue={data.filters.category}
            className="h-11 rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition focus:border-pgm-yellow"
          >
            <option value="">Todas as categorias</option>
            {data.filterOptions.categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="dificuldade"
            defaultValue={data.filters.difficulty}
            className="h-11 rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition focus:border-pgm-yellow"
          >
            <option value="">Todas as dificuldades</option>
            {data.filterOptions.difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficultyLabel[difficulty]}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            Filtrar
          </button>
        </form>
      </section>

      <section className="mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Materiais disponíveis
            </h2>
            <p className="mt-2 text-sm text-muted">
              Ordenados por relevância e título.
            </p>
          </div>
          <span className="font-mono text-sm text-muted">
            {data.pagination.totalItems} resultados
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {data.materials.map((material) => (
            <article
              key={material.id}
              className="flex min-h-[292px] flex-col rounded-md border border-border-soft bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="break-words text-xs font-semibold uppercase text-pgm-yellow">
                    {material.categoryName}
                  </p>
                  <h3 className="mt-3 break-words text-lg font-semibold leading-7 text-white">
                    {material.title}
                  </h3>
                </div>
                {material.canAccess ? null : (
                  <LockKeyhole
                    className="size-4 shrink-0 text-pgm-yellow"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold text-muted">
                <span className="rounded-md border border-border-soft bg-background px-3 py-2">
                  {languageLabel[material.language]}
                </span>
                <span className="rounded-md border border-border-soft bg-background px-3 py-2">
                  {difficultyLabel[material.difficulty]}
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 py-2">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {material.estimatedTime} min
                </span>
                <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-pgm-yellow">
                  {material.isPremium ? "Premium" : "Gratuito"}
                </span>
              </div>

              <div className="mt-auto pt-5">
                <Link
                  href={`/estudos/${material.slug}`}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  {material.canAccess ? "Abrir material" : "Ver detalhes"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {data.materials.length === 0 ? (
          <div className="mt-5 rounded-md border border-border-soft bg-surface p-5">
            <p className="text-sm font-semibold text-white">
              Nenhum material encontrado
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ajuste os filtros ou limpe a busca para ver todos os materiais.
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={buildPageHref(currentParams, Math.max(data.pagination.page - 1, 1))}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
          >
            Anterior
          </Link>
          <span className="text-sm text-muted">
            Pagina {data.pagination.page} de {data.pagination.totalPages}
          </span>
          <Link
            href={buildPageHref(
              currentParams,
              Math.min(data.pagination.page + 1, data.pagination.totalPages),
            )}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
          >
            Próxima
          </Link>
        </div>
      </section>
    </main>
  );
}
