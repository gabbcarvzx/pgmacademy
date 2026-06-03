import type { Metadata } from "next";

import { AttemptCard } from "@/components/manual-review/attempt-card";
import { requireUserId } from "@/lib/auth/require-user";
import { getStudentManualAttempts } from "@/lib/manual-review/service";

export const metadata: Metadata = {
  title: "Meus treinos psicossociais",
};

type PageProps = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function InterviewHistoryPage({ searchParams }: PageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const data = await getStudentManualAttempts(userId);
  const attempts = data.attempts.filter((attempt) => attempt.kind === "psychosocial");

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
          Historico
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          Meus treinos psicossociais
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Veja respostas enviadas, notas e feedbacks recebidos.
        </p>
      </section>
      {params?.success ? (
        <p className="mt-5 rounded-md border border-pgm-green/40 bg-pgm-green/10 px-4 py-3 text-sm text-pgm-green">
          {params.success}
        </p>
      ) : null}
      {params?.error ? (
        <p className="mt-5 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
          {params.error}
        </p>
      ) : null}
      <section className="mt-6 grid gap-4">
        {attempts.length === 0 ? (
          <p className="rounded-md border border-border-soft bg-surface p-5 text-sm text-muted">
            Voce ainda nao enviou treinos psicossociais.
          </p>
        ) : (
          attempts.map((attempt) => <AttemptCard key={attempt.id} attempt={attempt} />)
        )}
      </section>
    </main>
  );
}
