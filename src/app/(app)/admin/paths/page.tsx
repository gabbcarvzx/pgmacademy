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
import {
  learningLanguages,
  listAdminPaths,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Trilhas",
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    language?: string;
    status?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function AdminPathsPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const paths = await listAdminPaths({
    search: params?.q,
    language: params?.language,
    status: params?.status,
  });

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Trilhas de aprendizagem"
        description="Crie trilhas, controle premium/free e organize a sequencia pedagogica de materiais, flashcards, questoes e psicossocial."
        action={
          <Link
            href="/admin/paths/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Nova trilha
          </Link>
        }
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <form className="mt-6 grid gap-3 rounded-md border border-border-soft bg-surface p-4 lg:grid-cols-[1fr_180px_180px_auto]">
        <input
          name="q"
          placeholder="Buscar por titulo ou descricao"
          defaultValue={params?.q ?? ""}
          className={inputClassName}
        />
        <select
          name="language"
          defaultValue={params?.language ?? ""}
          className={inputClassName}
        >
          <option value="">Todos idiomas</option>
          {learningLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
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
        {paths.length === 0 ? (
          <EmptyState>Nenhuma trilha encontrada.</EmptyState>
        ) : (
          paths.map((path) => (
            <article
              key={path.id}
              className="grid gap-4 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_220px_180px]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge tone={path.is_active ? "green" : "red"}>
                    {path.is_active ? "Ativa" : "Inativa"}
                  </AdminBadge>
                  <AdminBadge tone={path.is_premium ? "yellow" : "muted"}>
                    {path.is_premium ? "Premium" : "Gratuita"}
                  </AdminBadge>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-white">
                  {path.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {path.description ?? "Sem descricao."}
                </p>
              </div>
              <div className="text-sm leading-6 text-muted">
                <p>Idioma: {path.language}</p>
                <p>Slug: {path.slug ?? "sem slug"}</p>
                <p className="truncate">
                  Source: {path.source_reference ?? "sem referencia"}
                </p>
              </div>
              <div className="grid gap-2">
                <Link
                  href={`/admin/paths/${path.id}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  Editar
                </Link>
                {path.is_active ? (
                  <form action={deactivateContentAction}>
                    <input type="hidden" name="returnTo" value="/admin/paths" />
                    <input type="hidden" name="entity" value="path" />
                    <input type="hidden" name="id" value={path.id} />
                    <ConfirmSubmitButton message="Desativar esta trilha?">
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
