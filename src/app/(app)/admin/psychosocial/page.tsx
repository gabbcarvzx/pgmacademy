import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { deactivateContentAction } from "@/app/(app)/admin/actions";
import {
  AdminBadge,
  AdminHeader,
  AdminNav,
  EmptyState,
  inputClassName,
  StatusMessages,
} from "@/components/admin/admin-ui";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { listAdminPsychosocial } from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Psicossocial",
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function AdminPsychosocialPage({
  searchParams,
}: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const questions = await listAdminPsychosocial({
    search: params?.q,
    status: params?.status,
  });

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Perguntas psicossociais"
        description="Gerencie perguntas de entrevista, orientações de resposta e erros comuns sem automatizar correção."
        action={
          <Link
            href="/admin/psychosocial/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Nova pergunta
          </Link>
        }
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <form className="mt-6 grid gap-3 rounded-md border border-border-soft bg-surface p-4 lg:grid-cols-[1fr_180px_auto]">
        <input
          name="q"
          placeholder="Buscar por categoria ou pergunta"
          defaultValue={params?.q ?? ""}
          className={inputClassName}
        />
        <select
          name="status"
          defaultValue={params?.status ?? ""}
          className={inputClassName}
        >
          <option value="">Todos status</option>
          <option value="active">Ativas</option>
          <option value="inactive">Inativas</option>
        </select>
        <button
          type="submit"
          className="h-11 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
        >
          Filtrar
        </button>
      </form>

      <section className="mt-6 grid gap-3">
        {questions.length === 0 ? (
          <EmptyState>Nenhuma pergunta psicossocial encontrada.</EmptyState>
        ) : (
          questions.map((question) => (
            <article
              key={question.id}
              className="grid gap-4 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_220px_180px]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge tone={question.is_active ? "green" : "red"}>
                    {question.is_active ? "Ativa" : "Inativa"}
                  </AdminBadge>
                  <AdminBadge tone={question.is_premium ? "yellow" : "muted"}>
                    {question.is_premium ? "Premium" : "Gratuita"}
                  </AdminBadge>
                </div>
                <p className="mt-3 text-sm font-semibold uppercase text-pgm-yellow">
                  {question.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">
                  {question.question}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                  {question.ideal_answer_guidelines ?? "Sem orientação cadastrada."}
                </p>
              </div>
              <div className="text-sm leading-6 text-muted">
                <p className="truncate">
                  Fonte: {question.source_reference ?? "sem referência"}
                </p>
                <p className="mt-1">Atualizada em {question.updated_at}</p>
              </div>
              <div className="grid gap-2">
                <Link
                  href={`/admin/psychosocial/${question.id}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  Editar
                </Link>
                {question.is_active ? (
                  <form action={deactivateContentAction}>
                    <input
                      type="hidden"
                      name="returnTo"
                      value="/admin/psychosocial"
                    />
                    <input type="hidden" name="entity" value="psychosocial" />
                    <input type="hidden" name="id" value={question.id} />
                    <ConfirmSubmitButton message="Desativar está pergunta psicossocial?">
                      Desativar
                    </ConfirmSubmitButton>
                  </form>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
