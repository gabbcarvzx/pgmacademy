import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, LockKeyhole, Route } from "lucide-react";

import { ProgressBar, StatusBadge } from "@/components/design-system";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { languageLabel } from "@/lib/learning/labels";
import { getLearningPathsPage } from "@/lib/learning/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Trilhas",
  description: "Trilhas de aprendizagem da PGM Academy.",
};

export default async function TrilhasPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getLearningPathsPage(user.id);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-5 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Trilhas de aprendizagem
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Sequencias para estudar com direção
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            As trilhas combinam materiais, flashcards, questões e preparação
            psicossocial em uma ordem pedagógica simples de seguir.
          </p>
        </div>
        {data.hasPaidAccess ? <InstitutionalNotice /> : <PremiumUpgradeCard />}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {data.paths.map((path) => (
          <article
            key={path.id}
            className="rounded-md border border-border-soft bg-surface p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-pgm-yellow">
                  {languageLabel[path.language]}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  {path.title}
                </h2>
              </div>
              {path.canAccess ? (
                <Route className="size-5 text-pgm-yellow" aria-hidden="true" />
              ) : (
                <LockKeyhole className="size-5 text-pgm-yellow" aria-hidden="true" />
              )}
            </div>

            <p className="mt-4 text-sm leading-6 text-muted">
              {path.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                {path.itemCount} itens
              </span>
              <span className="rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-semibold text-muted">
                {path.completedItemCount} concluídos
              </span>
              <StatusBadge tone={path.isPremium ? "premium" : "neutral"} size="md">
                {path.isPremium ? "Premium" : "Gratuita"}
              </StatusBadge>
            </div>

            <div className="mt-5">
              <ProgressBar
                value={path.progressPercent}
                label="Progresso"
                showValue
              />
            </div>

            <Link
              href={`/trilhas/${path.slug}`}
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
            >
              {path.canAccess ? "Abrir trilha" : "Ver trilha"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
