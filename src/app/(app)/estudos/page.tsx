import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";

import {
  AppPageHeader,
  ContentCard,
  EmptyState,
  SectionHeader,
  StatusBadge,
} from "@/components/design-system";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { difficultyLabel, languageLabel } from "@/lib/learning/labels";
import { getMaterialPresentation } from "@/lib/learning/material-presentation";
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
  const recommendedMaterial =
    data.materials.find((material) => material.canAccess) ?? data.materials[0];
  const currentParams = new URLSearchParams();
  if (data.filters.search) currentParams.set("q", data.filters.search);
  if (data.filters.language) currentParams.set("idioma", data.filters.language);
  if (data.filters.category) currentParams.set("categoria", data.filters.category);
  if (data.filters.difficulty) currentParams.set("dificuldade", data.filters.difficulty);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AppPageHeader
        eyebrow="Central de estudos"
        title="Materiais para transformar revisão em domínio"
        description="Encontre conteúdos por idioma, competência e dificuldade. A biblioteca prioriza materiais ainda não concluídos e preserva o conteúdo premium para contas com acesso."
        density="compact"
        aside={data.hasPaidAccess ? <InstitutionalNotice /> : <PremiumUpgradeCard />}
      />

      <section className="mt-6 rounded-ds-16 border border-border-soft bg-surface p-4 shadow-card sm:p-5">
        <form className="grid gap-3 lg:grid-cols-[1.4fr_repeat(3,1fr)_auto]" action="/estudos">
          <label className="relative">
            <span className="sr-only">Buscar material</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              name="q"
              defaultValue={data.filters.search}
              placeholder="Buscar por título"
              className="h-11 w-full rounded-ds-12 border border-border-soft bg-background-primary pl-10 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-gold"
            />
          </label>

          <select
            name="idioma"
            defaultValue={data.filters.language}
            className="h-11 rounded-ds-12 border border-border-soft bg-background-primary px-3 text-sm text-text-primary outline-none transition focus:border-accent-gold"
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
            className="h-11 rounded-ds-12 border border-border-soft bg-background-primary px-3 text-sm text-text-primary outline-none transition focus:border-accent-gold"
          >
            <option value="">Todas as competências</option>
            {data.filterOptions.categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="dificuldade"
            defaultValue={data.filters.difficulty}
            className="h-11 rounded-ds-12 border border-border-soft bg-background-primary px-3 text-sm text-text-primary outline-none transition focus:border-accent-gold"
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
            className="inline-flex h-11 items-center justify-center rounded-ds-12 bg-accent-gold px-4 text-sm font-semibold text-background-primary transition hover:bg-white"
          >
            Filtrar
          </button>
        </form>
      </section>

      {recommendedMaterial ? (
        <section className="mt-8">
          <SectionHeader
            eyebrow="Recomendado para você"
            title="Continue por um material prioritário"
            description="A recomendação respeita seus filtros atuais e a ordenação por progresso da biblioteca."
            density="compact"
          />
          <ContentCard
            className="mt-4 border-accent-gold/35 bg-accent-gold-soft"
            eyebrow={recommendedMaterial.categoryName}
            title={recommendedMaterial.title}
            description={`Competência: ${getMaterialPresentation(recommendedMaterial.slug, recommendedMaterial.categoryName).competence}`}
            href={`/estudos/${recommendedMaterial.slug}`}
            Icon={Sparkles}
            tone="premium"
            badge={recommendedMaterial.canAccess ? "Próximo estudo" : "Premium"}
            metadata={
              <div className="flex flex-wrap gap-2">
                <StatusBadge>{languageLabel[recommendedMaterial.language]}</StatusBadge>
                <StatusBadge>{difficultyLabel[recommendedMaterial.difficulty]}</StatusBadge>
                <StatusBadge>{recommendedMaterial.estimatedTime} min</StatusBadge>
              </div>
            }
            action={
              <Link
                href={`/estudos/${recommendedMaterial.slug}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-4 text-sm font-semibold text-background-primary transition hover:bg-white"
              >
                {recommendedMaterial.canAccess ? "Continuar estudo" : "Ver detalhes"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
          />
        </section>
      ) : null}

      <section className="mt-8">
        <SectionHeader
          eyebrow="Biblioteca"
          title="Materiais disponíveis"
          description="Use competência, idioma e nível para encontrar o melhor ponto de revisão."
          density="compact"
          action={
            <span className="font-mono text-sm text-text-muted">
              {data.pagination.totalItems} resultados
            </span>
          }
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {data.materials.map((material) => {
            const presentation = getMaterialPresentation(
              material.slug,
              material.categoryName,
            );

            return (
              <ContentCard
                key={material.id}
                className="flex min-h-[310px] flex-col [&>div:last-child]:mt-auto"
                eyebrow={material.categoryName}
                title={material.title}
                description={`Competência: ${presentation.competence}`}
                href={`/estudos/${material.slug}`}
                Icon={BookOpenCheck}
                tone={material.isPremium ? "premium" : "success"}
                badge={
                  <div className="flex flex-wrap justify-end gap-2">
                    {presentation.isRetaFinal ? (
                      <StatusBadge tone="warning">Reta final</StatusBadge>
                    ) : null}
                    <StatusBadge tone={material.isPremium ? "premium" : "success"}>
                      {material.isPremium ? "Premium" : "Gratuito"}
                    </StatusBadge>
                  </div>
                }
                metadata={
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <span className="rounded-ds-12 border border-border-soft bg-background-primary px-3 py-2 font-semibold text-text-muted">
                      {languageLabel[material.language]}
                    </span>
                    <span className="rounded-ds-12 border border-border-soft bg-background-primary px-3 py-2 font-semibold text-text-muted">
                      {difficultyLabel[material.difficulty]}
                    </span>
                    <span className="col-span-2 inline-flex items-center gap-2 rounded-ds-12 border border-border-soft bg-background-primary px-3 py-2 font-semibold text-text-muted">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {material.estimatedTime} minutos de estudo
                    </span>
                  </div>
                }
                action={
                  <Link
                    href={`/estudos/${material.slug}`}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-ds-12 border border-border-soft px-4 text-sm font-semibold text-text-secondary transition hover:border-border-strong hover:text-text-primary sm:w-auto"
                  >
                    {material.canAccess ? "Abrir material" : "Ver detalhes"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                }
              />
            );
          })}
        </div>

        {data.materials.length === 0 ? (
          <EmptyState
            className="mt-5"
            Icon={BookOpenCheck}
            title="Nenhum material encontrado"
            description="Ajuste os filtros ou limpe a busca para ver todos os materiais."
          />
        ) : null}

        <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Paginação de materiais">
          <Link
            href={buildPageHref(currentParams, Math.max(data.pagination.page - 1, 1))}
            aria-disabled={data.pagination.page <= 1}
            className="inline-flex h-10 items-center justify-center rounded-ds-12 border border-border-soft px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary aria-disabled:pointer-events-none aria-disabled:opacity-45"
          >
            Anterior
          </Link>
          <span className="text-center text-sm text-text-muted">
            Página {data.pagination.page} de {data.pagination.totalPages}
          </span>
          <Link
            href={buildPageHref(
              currentParams,
              Math.min(data.pagination.page + 1, data.pagination.totalPages),
            )}
            aria-disabled={data.pagination.page >= data.pagination.totalPages}
            className="inline-flex h-10 items-center justify-center rounded-ds-12 border border-border-soft px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary aria-disabled:pointer-events-none aria-disabled:opacity-45"
          >
            Próxima
          </Link>
        </nav>
      </section>
    </main>
  );
}
