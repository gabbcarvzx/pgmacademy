import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Circle,
  Layers3,
  LockKeyhole,
} from "lucide-react";

import { completePathGroupAction } from "@/app/(app)/learning-actions";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { itemTypeLabel, languageLabel } from "@/lib/learning/labels";
import { getLearningPathDetail } from "@/lib/learning/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Trilha - ${slug}`,
  };
}

export default async function TrilhaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const path = await getLearningPathDetail(user.id, slug);
  if (!path) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/trilhas"
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
                {languageLabel[path.language]}
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                {path.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
                {path.description}
              </p>
            </div>
            {path.canAccess ? (
              <BookOpenCheck className="size-6 text-pgm-yellow" aria-hidden="true" />
            ) : (
              <LockKeyhole className="size-6 text-pgm-yellow" aria-hidden="true" />
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm font-semibold text-muted">
              <span>{path.completedItemCount} de {path.itemCount} itens</span>
              <span>{path.progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-background">
              <div
                className="h-2 rounded-full bg-pgm-yellow"
                style={{ width: `${path.progressPercent}%` }}
              />
            </div>
          </div>

          {!path.canAccess ? (
            <div className="mt-6">
              <PremiumUpgradeCard description="As trilhas do lote autoral aprovado sao premium. Faca upgrade para acessar a sequencia completa." />
            </div>
          ) : null}
        </article>

        <aside className="grid content-start gap-4">
          <InstitutionalNotice />
          <div className="rounded-md border border-border-soft bg-surface p-5">
            <Layers3 className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-white">
              Sequencia pedagogica
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Siga os blocos em ordem para combinar leitura, revisao e pratica.
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-6">
        <div className="grid gap-3">
          {path.groups.map((group, index) => {
            const completed = group.completedItems === group.totalItems;
            return (
              <article
                key={group.groupId}
                className="grid gap-4 rounded-md border border-border-soft bg-surface p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="flex size-10 items-center justify-center rounded-md bg-background text-sm font-semibold text-white">
                  {index + 1}
                </span>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {completed ? (
                      <CheckCircle2 className="size-4 text-pgm-green" aria-hidden="true" />
                    ) : (
                      <Circle className="size-4 text-muted" aria-hidden="true" />
                    )}
                    <p className="text-sm font-semibold text-white">
                      {group.title}
                    </p>
                    <span className="rounded-md border border-border-soft bg-background px-2 py-1 text-xs font-semibold text-pgm-yellow">
                      {itemTypeLabel[group.itemType]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {group.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:w-48">
                  {group.href ? (
                    <Link
                      href={group.href}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft px-3 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                    >
                      Abrir
                    </Link>
                  ) : null}

                  {path.canAccess ? (
                    <form action={completePathGroupAction}>
                      <input type="hidden" name="pathId" value={path.id} />
                      <input type="hidden" name="pathSlug" value={path.slug} />
                      <input type="hidden" name="itemType" value={group.itemType} />
                      <input type="hidden" name="itemIds" value={group.itemIds.join(",")} />
                      <button
                        type="submit"
                        disabled={completed}
                        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-pgm-yellow px-3 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {completed ? "Concluido" : "Concluir"}
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
