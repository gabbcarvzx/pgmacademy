import type { Metadata } from "next";

import { AdminHeader, AdminNav, StatusMessages } from "@/components/admin/admin-ui";
import { MaterialForm } from "@/components/admin/material-form";
import { getAdminSelectOptions } from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Novo material",
};

type PageProps = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function NewMaterialPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const options = await getAdminSelectOptions();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Novo material"
        description="Crie um material Markdown autoral para a Central de Estudos."
        backHref="/admin/materials"
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <MaterialForm options={options} returnTo="/admin/materials/new" />
      </section>
    </main>
  );
}
