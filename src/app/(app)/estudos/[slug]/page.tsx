import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Route } from "lucide-react";

import { completeStudyMaterialAction } from "@/app/(app)/learning-actions";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { MarkdownContent } from "@/components/learning/markdown-content";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { difficultyLabel, languageLabel } from "@/lib/learning/labels";
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

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/estudos"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Link>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
                {material.categoryName}
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                {material.title}
              </h1>
            </div>
            <span className="inline-flex rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-pgm-yellow">
              {material.isPremium ? "Premium" : "Gratuito"}
            </span>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
              {languageLabel[material.language]}
            </span>
            <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
              {difficultyLabel[material.difficulty]}
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
              <Clock3 className="size-4" aria-hidden="true" />
              {material.estimatedTime} min
            </span>
          </div>

          <div className="mt-6">
            {material.contentMd ? (
              <MarkdownContent content={material.contentMd} />
            ) : (
              <PremiumUpgradeCard description="Faca upgrade para ler o conteudo completo deste material." />
            )}
          </div>

          {material.canAccess ? (
            <form action={completeStudyMaterialAction} className="mt-6">
              <input type="hidden" name="materialId" value={material.id} />
              <input type="hidden" name="slug" value={material.slug} />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                {material.isCompleted ? "Concluido" : "Marcar como concluido"}
              </button>
            </form>
          ) : null}
        </article>

        <aside className="grid content-start gap-4">
          <InstitutionalNotice />

          <div className="rounded-md border border-border-soft bg-surface p-5">
            <Route className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-white">
              Trilhas relacionadas
            </p>
            <div className="mt-4 grid gap-3">
              {material.relatedPaths.length === 0 ? (
                <p className="text-sm leading-6 text-muted">
                  Este material ainda nao esta vinculado a uma trilha visivel.
                </p>
              ) : (
                material.relatedPaths.map((path) => (
                  <Link
                    key={path.id}
                    href={`/trilhas/${path.slug}`}
                    className="rounded-md border border-border-soft bg-background p-3 transition hover:border-white/35"
                  >
                    <p className="text-sm font-semibold text-white">
                      {path.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">
                      {path.description}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-md border border-border-soft bg-surface p-5">
            <p className="text-sm font-semibold text-white">
              Materiais relacionados
            </p>
            <div className="mt-4 grid gap-3">
              {material.relatedMaterials.length === 0 ? (
                <p className="text-sm leading-6 text-muted">
                  Nenhum material relacionado nesta categoria.
                </p>
              ) : (
                material.relatedMaterials.map((item) => (
                  <Link
                    key={item.id}
                    href={`/estudos/${item.slug}`}
                    className="rounded-md border border-border-soft bg-background p-3 transition hover:border-white/35"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {item.isPremium ? "Premium" : "Gratuito"} ·{" "}
                      {item.estimatedTime} min
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
