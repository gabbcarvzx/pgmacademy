import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { PaymentButton } from "@/components/billing/payment-button";
import { AnswerForm } from "@/components/manual-review/answer-form";
import { AttemptCard } from "@/components/manual-review/attempt-card";
import { StatusBadge } from "@/components/manual-review/status-badge";
import { requireUserId } from "@/lib/auth/require-user";
import { getPsychosocialQuestionDetail } from "@/lib/manual-review/service";

export const metadata: Metadata = {
  title: "Treino psicossocial",
};

type PageProps = {
  params: Promise<{ questionId: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function InterviewQuestionPage({
  params,
  searchParams,
}: PageProps) {
  const userId = await requireUserId();
  const [{ questionId }, query] = await Promise.all([params, searchParams]);
  const data = await getPsychosocialQuestionDetail(userId, questionId);

  if (!data) notFound();

  const hasPending = data.question.attempts.some(
    (attempt) => attempt.status === "pending",
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/entrevista"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Link>

      {query?.success ? (
        <p className="mt-5 rounded-md border border-pgm-green/40 bg-pgm-green/10 px-4 py-3 text-sm text-pgm-green">
          {query.success}
        </p>
      ) : null}
      {query?.error ? (
        <p className="mt-5 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
          {query.error}
        </p>
      ) : null}

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              {data.question.categoryName}
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              {data.question.title}
            </h1>
          </div>
          <StatusBadge status={data.question.latestStatus} />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-border-soft bg-background p-4">
            <p className="text-sm font-semibold text-white">
              Orientação de resposta
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {data.question.idealAnswerGuidelines ?? "Sem orientação cadastrada."}
            </p>
          </div>
          <div className="rounded-md border border-border-soft bg-background p-4">
            <p className="text-sm font-semibold text-white">Erros comuns</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {data.question.commonMistakes ?? "Sem erros comuns cadastrados."}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-white">Enviar resposta</h2>
        {data.question.canSubmit && !hasPending ? (
          <div className="mt-5">
            <AnswerForm kind="psychosocial" questionId={data.question.id} />
          </div>
        ) : data.question.canSubmit && hasPending ? (
          <p className="mt-4 rounded-md border border-pgm-yellow/40 bg-pgm-yellow/10 p-4 text-sm leading-6 text-pgm-yellow">
            Você já possui uma resposta pendente para está pergunta. Aguarde o
            feedback manual antes de reenviar.
          </p>
        ) : (
          <div className="mt-4 rounded-md border border-pgm-yellow/35 bg-background p-4">
            <LockKeyhole className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-white">
              Envio premium
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              O treino com feedback manual exige acesso premium.
            </p>
            <div className="mt-4 max-w-sm">
              <PaymentButton />
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-4">
        <h2 className="text-xl font-semibold text-white">Histórico</h2>
        {data.question.attempts.length === 0 ? (
          <p className="rounded-md border border-border-soft bg-surface p-5 text-sm text-muted">
            Nenhum treino enviado ainda.
          </p>
        ) : (
          data.question.attempts.map((attempt) => (
            <AttemptCard key={attempt.id} attempt={attempt} />
          ))
        )}
      </section>
    </main>
  );
}
