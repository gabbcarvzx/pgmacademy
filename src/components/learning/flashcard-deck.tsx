"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

import { reviewFlashcardAction } from "@/app/(app)/learning-actions";
import { EmptyState, ProgressBar } from "@/components/design-system";
import type { FlashcardItem } from "@/lib/learning/service";

export function FlashcardDeck({
  cards,
  categorySlug,
}: {
  cards: FlashcardItem[];
  categorySlug: string | null;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [reviewedIds, setReviewedIds] = useState(
    () => new Set(cards.filter((card) => card.isReviewed).map((card) => card.id)),
  );
  const [isPending, startTransition] = useTransition();
  const currentCard = cards[currentIndex] ?? null;
  const reviewedCount = useMemo(() => reviewedIds.size, [reviewedIds]);

  if (!currentCard) {
    return (
      <EmptyState
        title="Nenhum flashcard disponível"
        description="Escolha outra categoria ou libere o acesso premium."
        compact
      />
    );
  }

  function goTo(index: number) {
    setCurrentIndex(Math.min(Math.max(index, 0), cards.length - 1));
    setShowBack(false);
  }

  function markReviewed() {
    if (!currentCard) return;

    startTransition(async () => {
      await reviewFlashcardAction({
        categorySlug,
        flashcardId: currentCard.id,
      });
      setReviewedIds((current) => new Set(current).add(currentCard.id));
    });
  }

  return (
    <section className="rounded-md border border-border-soft bg-surface p-5 max-sm:p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            Card {currentIndex + 1} de {cards.length}
          </p>
          <p className="mt-1 text-sm text-muted">
            {reviewedCount} revisados neste conjunto
          </p>
        </div>
        <ProgressBar
          value={Math.round(((currentIndex + 1) / cards.length) * 100)}
          label="Progresso do baralho"
          className="w-full sm:max-w-xs"
        />
      </div>

      <button
        type="button"
        onClick={() => setShowBack((value) => !value)}
        className="mt-5 flex min-h-[220px] w-full items-center justify-center rounded-md border border-border-soft bg-background p-6 text-center transition hover:border-white/35 max-sm:p-4 sm:min-h-[260px]"
      >
        <span className="max-w-2xl whitespace-pre-line break-words text-lg font-semibold leading-7 text-white sm:text-xl sm:leading-8">
          {showBack ? currentCard.backContent : currentCard.frontContent}
        </span>
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-2 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 max-sm:text-xs"
          title="Card anterior"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setShowBack((value) => !value)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-2 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white max-sm:text-xs"
          title="Virar card"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Virar
        </button>
        <button
          type="button"
          onClick={markReviewed}
          disabled={isPending || reviewedIds.has(currentCard.id)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 max-sm:px-2 max-sm:text-xs"
          title="Marcar como revisado"
        >
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {reviewedIds.has(currentCard.id) ? "Revisado" : "Marcar revisado"}
        </button>
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === cards.length - 1}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-2 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-45 max-sm:text-xs"
          title="Próximo card"
        >
          Próximo
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
