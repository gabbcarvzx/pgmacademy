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
  listAdminTemplates,
  templateTypes,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Templates de simulado",
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    language?: string;
    type?: string;
    status?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function AdminTemplatesPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const templates = await listAdminTemplates({
    search: params?.q,
    language: params?.language,
    type: params?.type,
    status: params?.status,
  });

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Templates de simulado"
        description="Gerencie modelos de simulado usados em /simulados. A edicao nao altera tentativas ja finalizadas."
        action={
          <Link
            href="/admin/templates/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Novo template
          </Link>
        }
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <form className="mt-6 grid gap-3 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_160px_160px_160px_auto]">
        <input
          name="q"
          placeholder="Buscar por titulo ou descricao"
          defaultValue={params?.q ?? ""}
          className={inputClassName}
        />
        <select
          name="type"
          defaultValue={params?.type ?? ""}
          className={inputClassName}
        >
          <option value="">Tipos</option>
          {templateTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          name="language"
          defaultValue={params?.language ?? ""}
          className={inputClassName}
        >
          <option value="">Idiomas</option>
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
          <option value="">Status</option>
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
        {templates.length === 0 ? (
          <EmptyState>Nenhum template encontrado.</EmptyState>
        ) : (
          templates.map((template) => (
            <article
              key={template.id}
              className="grid gap-4 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_220px_180px]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge tone={template.is_active ? "green" : "red"}>
                    {template.is_active ? "Ativo" : "Inativo"}
                  </AdminBadge>
                  <AdminBadge tone={template.is_premium ? "yellow" : "muted"}>
                    {template.is_premium ? "Premium" : "Gratuito"}
                  </AdminBadge>
                  <AdminBadge>{template.type}</AdminBadge>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-white">
                  {template.title}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {template.description ?? "Sem descricao."}
                </p>
              </div>
              <div className="text-sm leading-6 text-muted">
                <p>{template.language}</p>
                <p>{template.total_questions} questoes</p>
                <p className="truncate">
                  Source: {template.source_reference ?? "sem referencia"}
                </p>
              </div>
              <div className="grid gap-2">
                <Link
                  href={`/admin/templates/${template.id}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  Editar
                </Link>
                {template.is_active ? (
                  <form action={deactivateContentAction}>
                    <input
                      type="hidden"
                      name="returnTo"
                      value="/admin/templates"
                    />
                    <input type="hidden" name="entity" value="template" />
                    <input type="hidden" name="id" value={template.id} />
                    <ConfirmSubmitButton message="Desativar este template?">
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
