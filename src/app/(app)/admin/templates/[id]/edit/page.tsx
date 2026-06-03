import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AdminHeader,
  AdminNav,
  StatusMessages,
} from "@/components/admin/admin-ui";
import { TemplateForm } from "@/components/admin/template-form";
import { getAdminTemplate } from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Editar template",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function EditTemplatePage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminPage();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const template = await getAdminTemplate(id);

  if (!template) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Editar template de simulado"
        description="Atualize tipo, idioma, quantidade, premium e status. Nao exponha gabaritos por esta area."
        backHref="/admin/templates"
      />
      <AdminNav />
      <StatusMessages success={query?.success} error={query?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <TemplateForm
          template={template}
          returnTo={`/admin/templates/${template.id}/edit`}
        />
      </section>
    </main>
  );
}
