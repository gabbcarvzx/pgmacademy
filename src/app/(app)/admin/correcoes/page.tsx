import type { Metadata } from "next";
import Link from "next/link";

import { CorrectionForm } from "@/components/admin/correction-form";
import {
  AdminBadge,
  AdminHeader,
  AdminNav,
  EmptyState,
  StatusMessages,
} from "@/components/admin/admin-ui";
import { StatusBadge } from "@/components/manual-review/status-badge";
import { requireAdminPage } from "@/lib/admin/guard";
import { getAdminManualReviewQueue } from "@/lib/manual-review/service";

export const metadata: Metadata = {
  title: "Admin - Correcoes manuais",
};

type PageProps = {
  searchParams?: Promise<{
    tab?: string;
    success?: string;
    error?: string;
  }>;
};

const tabs = [
  { value: "subjective-pending", label: "Subjetivas pendentes" },
  { value: "psychosocial-pending", label: "Psicossociais pendentes" },
  { value: "reviewed", label: "Corrigidas" },
  { value: "all", label: "Todas" },
];

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminCorrectionsPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const tab = params?.tab ?? "subjective-pending";
  const data = await getAdminManualReviewQueue(tab);
  const returnTo = `/admin/correcoes?tab=${encodeURIComponent(tab)}`;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Correcoes manuais"
        description="Revise respostas subjetivas e psicossociais, atribua nota e devolva feedback ao aluno. Nenhuma IA participa deste fluxo."
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <section className="mt-6 grid gap-4 sm:grid-cols-4">
        <article className="rounded-md border border-border-soft bg-background p-4">
          <AdminBadge tone="yellow">Subjetivas pendentes</AdminBadge>
          <p className="mt-3 text-3xl font-semibold text-white">
            {data.stats.subjectivePending}
          </p>
        </article>
        <article className="rounded-md border border-border-soft bg-background p-4">
          <AdminBadge tone="yellow">Psicossociais pendentes</AdminBadge>
          <p className="mt-3 text-3xl font-semibold text-white">
            {data.stats.psychosocialPending}
          </p>
        </article>
        <article className="rounded-md border border-border-soft bg-background p-4">
          <AdminBadge tone="green">Corrigidas</AdminBadge>
          <p className="mt-3 text-3xl font-semibold text-white">
            {data.stats.reviewed}
          </p>
        </article>
        <article className="rounded-md border border-border-soft bg-background p-4">
          <AdminBadge>Total visivel</AdminBadge>
          <p className="mt-3 text-3xl font-semibold text-white">
            {data.stats.total}
          </p>
        </article>
      </section>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((item) => (
          <Link
            key={item.value}
            href={`/admin/correcoes?tab=${item.value}`}
            className={`inline-flex h-10 shrink-0 items-center rounded-md border px-4 text-sm font-semibold transition ${
              tab === item.value
                ? "border-pgm-yellow bg-pgm-yellow text-background"
                : "border-border-soft bg-surface text-muted hover:border-white/35 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="mt-6 grid gap-4">
        {data.items.length === 0 ? (
          <EmptyState>Nenhuma resposta encontrada para esta aba.</EmptyState>
        ) : (
          data.items.map((item) => (
            <article
              key={`${item.kind}:${item.id}`}
              className="rounded-md border border-border-soft bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pgm-yellow">
                    {item.kind === "subjective" ? "Subjetiva" : "Psicossocial"} /{" "}
                    {item.categoryName}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {item.studentName}
                    {item.studentEmail ? ` / ${item.studentEmail}` : ""}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <div className="rounded-md border border-border-soft bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Resposta do aluno
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white">
                    {item.answerText}
                  </p>
                  <p className="mt-4 text-xs text-muted">
                    Enviada em {dateFormatter.format(new Date(item.createdAt))}
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-md border border-border-soft bg-background p-4">
                    <p className="text-sm font-semibold text-white">
                      Rubrica ou orientacao
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                      {item.guidance ?? "Sem orientacao cadastrada."}
                    </p>
                  </div>
                  <div className="rounded-md border border-border-soft bg-background p-4">
                    <p className="text-sm font-semibold text-white">
                      Erros comuns / criterios
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                      {item.commonMistakes ?? "Sem criterios adicionais."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-md border border-border-soft bg-background p-4">
                <CorrectionForm item={item} returnTo={returnTo} />
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
