import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Layers3,
  Route,
} from "lucide-react";

import { completeStudyMaterialAction } from "@/app/(app)/learning-actions";
import { StatusBadge } from "@/components/design-system";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { MarkdownContent } from "@/components/learning/markdown-content";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { difficultyLabel, languageLabel } from "@/lib/learning/labels";
import { getMaterialPresentation } from "@/lib/learning/material-presentation";
import { getStudyMaterialDetail } from "@/lib/learning/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Material - ${slug}`,
  };
}

export default async function StudyMaterialPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const material = await getStudyMaterialDetail(user.id, slug);
  if (!material) {
    notFound();
  }

  const presentation = getMaterialPresentation(material.slug, material.categoryName);
  const firstRelatedPath = material.relatedPaths[0];

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/estudos"
        className="inline-flex h-10 items-center gap-2 rounded-ds-12 border border-border-soft px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar à biblioteca
      </Link>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0 overflow-hidden rounded-ds-20 border border-border-soft bg-surface shadow-card">
          <header className="border-b border-border-soft p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-caption font-semibold uppercase text-accent-gold">
                  {material.categoryName}
                </p>
                <h1 className="mt-3 break-words text-heading-1 font-semibold text-text-primary max-sm:text-3xl">
                  {material.title}
                </h1>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {presentation.isRetaFinal ? (
                  <StatusBadge tone="warning">Reta final</StatusBadge>
                ) : null}
                <StatusBadge tone={material.isPremium ? "premium" : "success"}>
                  {material.isPremium ? "Premium" : "Gratuito"}
                </StatusBadge>
              </div>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <span className="rounded-ds-12 border border-border-soft bg-background-primary px-3 py-2 text-sm font-semibold text-text-muted">
                {languageLabel[material.language]}
              </span>
              <span className="rounded-ds-12 border border-border-soft bg-background-primary px-3 py-2 text-sm font-semibold text-text-muted">
                {difficultyLabel[material.difficulty]}
              </span>
              <span className="inline-flex items-center gap-2 rounded-ds-12 border border-border-soft bg-background-primary px-3 py-2 text-sm font-semibold text-text-muted">
                <Clock3 className="size-4" aria-hidden="true" />
                {material.estimatedTime} min
              </span>
              <span className="inline-flex items-center gap-2 rounded-ds-12 border border-border-soft bg-background-primary px-3 py-2 text-sm font-semibold text-text-muted">
                <Layers3 className="size-4" aria-hidden="true" />
                {presentation.competence}
              </span>
            </div>
          </header>

          <div className="border-b border-border-soft bg-background-secondary/45 p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <BookOpenCheck className="size-5 text-accent-gold" aria-hidden="true" />
              <h2 className="text-heading-3 font-semibold text-text-primary">
                Antes de começar
              </h2>
            </div>
            <p className="mt-3 text-sm font-semibold text-text-secondary">
              Você aprenderá a:
            </p>
            <ul className="mt-3 grid gap-2 pl-5 text-sm leading-6 text-text-muted">
              <li className="list-disc">Reconhecer os conceitos centrais deste conteúdo.</li>
              <li className="list-disc">Aplicar a competência em exemplos contextualizados.</li>
              <li className="list-disc">Levar a revisão para flashcards e simulados.</li>
            </ul>
          </div>

          <div className="p-5 sm:p-7">
            {material.canAccess ? (
              material.contentMd ? (
                <MarkdownContent content={material.contentMd} />
              ) : (
                <div className="border-l-2 border-warning bg-warning/10 px-5 py-4">
                  <p className="text-sm font-semibold text-text-primary">
                    Conteúdo em preparação
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    Seu acesso está liberado, mas este material ainda não possui
                    conteúdo publicado.
                  </p>
                </div>
              )
            ) : (
              <PremiumUpgradeCard description="Faça upgrade para ler o conteúdo completo deste material." />
            )}

            {material.canAccess ? (
              <form action={completeStudyMaterialAction} className="mt-8 border-t border-border-soft pt-6">
                <input type="hidden" name="materialId" value={material.id} />
                <input type="hidden" name="slug" value={material.slug} />
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white sm:w-auto"
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {material.isCompleted ? "Concluído" : "Marcar como concluído"}
                </button>
              </form>
            ) : null}
          </div>
        </article>

        <aside className="grid min-w-0 content-start gap-4">
          <InstitutionalNotice />

          <section className="rounded-ds-16 border border-border-soft bg-surface p-5 shadow-card">
            <Route className="size-5 text-accent-gold" aria-hidden="true" />
            <h2 className="mt-4 text-heading-3 font-semibold text-text-primary">
              Trilhas relacionadas
            </h2>
            <div className="mt-4 grid gap-3">
              {material.relatedPaths.length === 0 ? (
                <p className="text-sm leading-6 text-text-muted">
                  Este material ainda não está vinculado a uma trilha visível.
                </p>
              ) : (
                material.relatedPaths.map((path) => (
                  <Link
                    key={path.id}
                    href={`/trilhas/${path.slug}`}
                    className="rounded-ds-12 border border-border-soft bg-background-primary p-3 transition hover:border-border-strong"
                  >
                    <p className="text-sm font-semibold text-text-primary">
                      {path.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-muted">
                      {path.description}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-ds-16 border border-border-soft bg-surface p-5 shadow-card">
            <h2 className="text-heading-3 font-semibold text-text-primary">
              Materiais relacionados
            </h2>
            <div className="mt-4 grid gap-3">
              {material.relatedMaterials.length === 0 ? (
                <p className="text-sm leading-6 text-text-muted">
                  Nenhum material relacionado nesta categoria.
                </p>
              ) : (
                material.relatedMaterials.map((item) => (
                  <Link
                    key={item.id}
                    href={`/estudos/${item.slug}`}
                    className="rounded-ds-12 border border-border-soft bg-background-primary p-3 transition hover:border-border-strong"
                  >
                    <p className="text-sm font-semibold text-text-primary">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs text-text-muted">
                      {item.isPremium ? "Premium" : "Gratuito"} · {item.estimatedTime} min
                    </p>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-ds-16 border border-accent-gold/35 bg-accent-gold-soft p-5 shadow-premium">
            <p className="text-caption font-semibold uppercase text-accent-gold">
              Após concluir
            </p>
            <h2 className="mt-3 text-heading-3 font-semibold text-text-primary">
              Transforme leitura em prática
            </h2>
            <div className="mt-4 grid gap-2">
              <Link
                href={`/flashcards?categoria=${material.categorySlug}`}
                className="inline-flex items-center justify-between rounded-ds-12 border border-border-soft bg-background-primary px-3 py-3 text-sm font-semibold text-text-secondary transition hover:border-border-strong hover:text-text-primary"
              >
                Flashcards relacionados
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href={firstRelatedPath ? `/trilhas/${firstRelatedPath.slug}` : "/trilhas"}
                className="inline-flex items-center justify-between rounded-ds-12 border border-border-soft bg-background-primary px-3 py-3 text-sm font-semibold text-text-secondary transition hover:border-border-strong hover:text-text-primary"
              >
                Trilha relacionada
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/simulados"
                className="inline-flex items-center justify-between rounded-ds-12 border border-border-soft bg-background-primary px-3 py-3 text-sm font-semibold text-text-secondary transition hover:border-border-strong hover:text-text-primary"
              >
                Simulado relacionado
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
