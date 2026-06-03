import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { deactivateContentAction } from "@/app/(app)/admin/actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import {
  AdminBadge,
  AdminHeader,
  AdminNav,
  EmptyState,
  inputClassName,
  StatusMessages,
} from "@/components/admin/admin-ui";
import {
  getAdminSelectOptions,
  listAdminMaterials,
  learningLanguages,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Materiais",
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

export default async function AdminMaterialsPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const [materials, options] = await Promise.all([
    listAdminMaterials({
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
        title="Materiais de estudo"
        description="Crie, edite, publique ou desative materiais Markdown usados na Central de Estudos e nas trilhas."
        action={
          <Link
            href="/admin/materials/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Novo material
          </Link>
        }
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <form className="mt-6 grid gap-3 rounded-md border border-border-soft bg-surface p-4 lg:grid-cols-[1fr_180px_220px_160px_auto]">
        <input
          name="q"
          placeholder="Buscar por titulo"
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
        {materials.length === 0 ? (
          <EmptyState>Nenhum material encontrado.</EmptyState>
        ) : (
          materials.map((material) => (
            <article
              key={material.id}
              className="grid gap-4 rounded-md border border-border-soft bg-surface p-4 xl:grid-cols-[1fr_220px_220px]"
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <AdminBadge tone={material.is_active ? "green" : "red"}>
                    {material.is_active ? "Ativo" : "Inativo"}
                  </AdminBadge>
                  <AdminBadge tone={material.is_premium ? "yellow" : "muted"}>
                    {material.is_premium ? "Premium" : "Gratuito"}
                  </AdminBadge>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-white">
                  {material.title}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {categoryById.get(material.category_id ?? "")?.name ?? "Sem categoria"} /{" "}
                  {material.language} / {material.difficulty} /{" "}
                  {material.estimated_time} min
                </p>
              </div>
              <div className="text-sm text-muted">
                <p>Slug: {material.slug}</p>
                <p className="mt-1 truncate">
                  Source: {material.source_reference ?? "sem referencia"}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <Link
                  href={`/admin/materials/${material.id}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border-soft text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
                >
                  Editar
                </Link>
                {material.is_active ? (
                  <form action={deactivateContentAction}>
                    <input type="hidden" name="returnTo" value="/admin/materials" />
                    <input type="hidden" name="entity" value="material" />
                    <input type="hidden" name="id" value={material.id} />
                    <ConfirmSubmitButton message="Desativar este material?">
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
