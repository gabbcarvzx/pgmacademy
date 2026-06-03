import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminHeader, AdminNav, StatusMessages } from "@/components/admin/admin-ui";
import { MaterialForm } from "@/components/admin/material-form";
import {
  getAdminMaterial,
  getAdminSelectOptions,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Admin - Editar material ${id}`,
  };
}

export default async function EditMaterialPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminPage();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [material, options] = await Promise.all([
    getAdminMaterial(id),
    getAdminSelectOptions(),
  ]);

  if (!material) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Editar material"
        description="Atualize conteudo, categoria, status e controle premium do material."
        backHref="/admin/materials"
      />
      <AdminNav />
      <StatusMessages success={query?.success} error={query?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <MaterialForm
          material={material}
          options={options}
          returnTo={`/admin/materials/${material.id}/edit`}
        />
      </section>
    </main>
  );
}
