import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, MessageSquareText } from "lucide-react";

import { PaymentButton } from "@/components/billing/payment-button";
import { StatusBadge } from "@/components/manual-review/status-badge";
import { requireUserId } from "@/lib/auth/require-user";
import { getPsychosocialQuestionList } from "@/lib/manual-review/service";

export const metadata: Metadata = {
  title: "Entrevista psicossocial",
  description: "Treino escrito de entrevista psicossocial com feedback manual.",
};

export default async function InterviewPage() {
  const userId = await requireUserId();
  const data = await getPsychosocialQuestionList(userId);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Treino de entrevista
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Entrevista psicossocial
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Pratique respostas com maturidade, exemplos concretos e
              responsabilidade. A avaliação é feita manualmente pelo admin.
            </p>
          </div>
          {data.hasPaidAccess ? (
            <Link
              href="/entrevista/minhas-respostas"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
            >
              Meus treinos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <div className="rounded-md border border-pgm-yellow/35 bg-background p-4">
              <LockKeyhole className="size-5 text-pgm-yellow" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-white">
                Feedback premium
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Usuários gratuitos visualizam a área, mas envio para feedback manual
                exige acesso premium.
              </p>
              <div className="mt-4">
                <PaymentButton label="Desbloquear acesso premium" />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-6">
        {data.groups.map((group) => (
          <div key={group.category} className="grid gap-3">
            <h2 className="text-xl font-semibold text-white">{group.category}</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {group.questions.map((question) => (
                <article
                  key={question.id}
                  className="rounded-md border border-border-soft bg-surface p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 px-2 py-1 text-xs font-semibold text-pgm-yellow">
                      {question.isPremium ? "Premium" : "Gratuita"}
                    </span>
                    <StatusBadge status={question.latestStatus} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {question.title}
                  </h3>
                  <Link
                    href={`/entrevista/${question.id}`}
                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
                  >
                    <MessageSquareText className="size-4" aria-hidden="true" />
                    Treinar resposta
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
