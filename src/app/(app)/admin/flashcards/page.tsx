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
  getAdminSelectOptions,
  learningLanguages,
  listAdminFlashcards,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Flashcards",
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    language?: string;
    category?: string;
    status?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function AdminFlashcardsPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const [flashcards, options] = await Promise.all([
    listAdminFlashcards({
      search: params?.q,
      language: params?.language,
      categoryId: params?.category,
      status: params?.status,
    }),
    getAdminSelectOptions(),
  ]);
  const categoryById = new Map(
    options.categories.map((category) => [category.id, category]),
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Flashcards"
        description="Gerencie cards de revisao rapida por categoria, idioma e dificuldade."
        action={
          <Link
            href="/admin/flashcards/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Novo flashcard
          </Link>
        }
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <form className="mt-6 grid gap-3 rounded-md border border-border-soft bg-surface p-4 lg:grid-cols-[1fr_180px_220px_160px_auto]">
        <input
          name="q"
          placeholder="Buscar frente ou verso"
          defaultValue={params?.q ?? ""}
          className={inputClassName}
        />
        <select name="language" defaultValue={params?.language ?? ""} className={inputClassName}>
          <option value="">Todos idiomas</option>
          {learningLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <select name="category" defaultValue={params?.category ?? ""} className={inputClassName}>
          <option value="">Todas categorias</option>
          {options.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.language} / {category.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={params?.status ?? ""} className={inputClassName}>
          <option value="">Todos status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        <button
          type="submit"
          className="h-11 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
        >
          Filtrar
        </button>
      </form>

      <section className="mt-6 grid gap-3">
        {flashcards.length === 0 ? (
          <EmptyState>Nenhum flashcard encontrado.</EmptyState>
        ) : (
          flashcards.map((flashcard) => (
            <article
              key={flashcard.id}
              className="grid gap-4 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_1fr_180px]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge tone={flashcard.is_active ? "green" : "red"}>
                    {flashcard.is_active ? "Ativo" : "Inativo"}
                  </AdminBadge>
                  <AdminBadge tone={flashcard.is_premium ? "yellow" : "muted"}>
                    {flashcard.is_premium ? "Premium" : "Gratuito"}
                  </AdminBadge>
                </div>
                <p className="mt-3 text-sm font-semibold text-white">
                  {flashcard.front_content}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {categoryById.get(flashcard.category_id ?? "")?.name ?? "Sem categoria"} /{" "}
                  {flashcard.language} / {flashcard.difficulty}
                </p>
              </div>
              <p className="text-sm leading-6 text-muted">
                {flashcard.back_content}
              </p>
              <div className="grid gap-2">
                <Link
                  href={`/admin/flashcards/${flashcard.id}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  Editar
                </Link>
                {flashcard.is_active ? (
                  <form action={deactivateContentAction}>
                    <input type="hidden" name="returnTo" value="/admin/flashcards" />
                    <input type="hidden" name="entity" value="flashcard" />
                    <input type="hidden" name="id" value={flashcard.id} />
                    <ConfirmSubmitButton message="Desativar este flashcard?">
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
