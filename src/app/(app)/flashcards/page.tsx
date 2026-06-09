import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Layers3, LockKeyhole } from "lucide-react";

import {
  PremiumLockCard,
  ProgressBar,
  StatusBadge,
} from "@/components/design-system";
import { FlashcardDeck } from "@/components/learning/flashcard-deck";
import { InstitutionalNotice } from "@/components/learning/institutional-notice";
import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { languageLabel } from "@/lib/learning/labels";
import { getFlashcardsPage } from "@/lib/learning/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Flashcards de revisão da PGM Academy.",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function FlashcardsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getFlashcardsPage(user.id, firstParam(params?.categoria));

  return (
    <main className="px-4 py-6 max-sm:px-3 max-sm:py-4 sm:px-6 lg:px-8">
      <section className="grid gap-5 max-sm:gap-4 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Flashcards
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-white sm:text-4xl">
            Revisão rápida por categoria
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            Use frente e verso para revisar vocabulário, regras de escrita e
            preparação psicossocial. A arquitetura já está pronta para repetição
            espaçada futura.
          </p>
        </div>
        {data.hasPaidAccess ? <InstitutionalNotice /> : <PremiumUpgradeCard />}
      </section>

      <section className="mt-6 grid gap-5 max-sm:mt-4 max-sm:gap-4 xl:grid-cols-[300px_1fr]">
        <aside className="grid content-start gap-3 max-sm:order-2">
          {data.decks.map((deck) => {
            const active = deck.categorySlug === data.selectedCategorySlug;
            return (
              <Link
                key={deck.categorySlug}
                href={`/flashcards?categoria=${deck.categorySlug}`}
                className={[
                  "rounded-md border p-4 transition max-sm:p-3",
                  active
                    ? "border-pgm-yellow bg-pgm-yellow/10"
                    : "border-border-soft bg-surface hover:border-white/35",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {deck.categoryName}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-muted">
                      {languageLabel[deck.language]} · {deck.totalCards} cards
                    </p>
                  </div>
                  {deck.canAccess ? (
                    <Layers3 className="size-4 text-pgm-yellow" aria-hidden="true" />
                  ) : (
                    <LockKeyhole className="size-4 text-pgm-yellow" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-3">
                  <StatusBadge tone={deck.canAccess ? "premium" : "warning"}>
                    {deck.canAccess ? "Liberado" : "Premium"}
                  </StatusBadge>
                </div>
                <ProgressBar
                  value={
                    deck.totalCards === 0
                      ? 0
                      : Math.round((deck.reviewedCards / deck.totalCards) * 100)
                  }
                  label={deck.categoryName}
                  size="sm"
                  className="mt-3"
                />
              </Link>
            );
          })}
        </aside>

        <div className="max-sm:order-1">
          {data.selectedDeck && !data.selectedDeck.canAccess ? (
            <PremiumLockCard
              description="Flashcards do lote aprovado são premium. Faça upgrade para revisar frente e verso."
              ctaLabel="Desbloquear flashcards"
            />
          ) : (
            <FlashcardDeck
              cards={data.cards}
              categorySlug={data.selectedCategorySlug}
            />
          )}
        </div>
      </section>
    </main>
  );
}
