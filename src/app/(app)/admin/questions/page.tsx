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
  listAdminQuestions,
  questionTypes,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Questões",
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    language?: string;
    category?: string;
    bank?: string;
    status?: string;
    type?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function AdminQuestionsPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const [questions, options] = await Promise.all([
    listAdminQuestions({
      search: params?.q,
      language: params?.language,
      categoryId: params?.category,
      bankId: params?.bank,
      status: params?.status,
      type: params?.type,
    }),
    getAdminSelectOptions(),
  ]);
  const categoryById = new Map(
    options.categories.map((category) => [category.id, category]),
  );
  const bankById = new Map(options.banks.map((bank) => [bank.id, bank]));

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Questões"
        description="Gerencie questões objetivas e subjetivas. Objetivas exigem 5 alternativas e exatamente uma correta."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/questions/new?type=objective"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
            >
              <PlusCircle className="size-4" aria-hidden="true" />
              Objetiva
            </Link>
            <Link
              href="/admin/questions/new?type=subjective"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
            >
              <PlusCircle className="size-4" aria-hidden="true" />
              Subjetiva
            </Link>
          </div>
        }
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <form className="mt-6 grid gap-3 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_150px_160px_190px_190px_140px_auto]">
        <input
          name="q"
          placeholder="Buscar enunciado ou ID editorial"
          defaultValue={params?.q ?? ""}
          className={inputClassName}
        />
        <select name="type" defaultValue={params?.type ?? ""} className={inputClassName}>
          <option value="">Tipos</option>
          {questionTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select name="language" defaultValue={params?.language ?? ""} className={inputClassName}>
          <option value="">Idiomas</option>
          {learningLanguages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
        <select name="bank" defaultValue={params?.bank ?? ""} className={inputClassName}>
          <option value="">Bancos</option>
          {options.banks.map((bank) => (
            <option key={bank.id} value={bank.id}>
              {bank.title}
            </option>
          ))}
        </select>
        <select name="category" defaultValue={params?.category ?? ""} className={inputClassName}>
          <option value="">Categorias</option>
          {options.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={params?.status ?? ""} className={inputClassName}>
          <option value="">Status</option>
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
          <EmptyState>Nenhuma questão encontrada.</EmptyState>
        ) : (
          questions.map((question) => (
            <article
              key={question.id}
              className="grid gap-4 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_260px_180px]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge tone={question.is_active ? "green" : "red"}>
                    {question.is_active ? "Ativa" : "Inativa"}
                  </AdminBadge>
                  <AdminBadge tone={question.type === "objective" ? "yellow" : "muted"}>
                    {question.type}
                  </AdminBadge>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-white">
                  {question.editorial_id ?? question.statement.slice(0, 100)}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {categoryById.get(question.category_id ?? "")?.name ?? "Sem categoria"} /{" "}
                  {question.language} / {question.difficulty}
                </p>
              </div>
              <div className="text-sm leading-6 text-muted">
                <p>{bankById.get(question.bank_id)?.title ?? "Banco removido"}</p>
                <p className="mt-1 line-clamp-2">{question.statement}</p>
              </div>
              <div className="grid gap-2">
                <Link
                  href={`/admin/questions/${question.id}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  Editar
                </Link>
                {question.is_active ? (
                  <form action={deactivateContentAction}>
                    <input type="hidden" name="returnTo" value="/admin/questions" />
                    <input type="hidden" name="entity" value="question" />
                    <input type="hidden" name="id" value={question.id} />
                    <ConfirmSubmitButton message="Desativar está questão?">
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
