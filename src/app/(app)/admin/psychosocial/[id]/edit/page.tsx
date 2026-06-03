import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AdminHeader,
  AdminNav,
  StatusMessages,
} from "@/components/admin/admin-ui";
import { PsychosocialForm } from "@/components/admin/psychosocial-form";
import { getAdminPsychosocial } from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Editar pergunta psicossocial",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function EditPsychosocialPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminPage();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const item = await getAdminPsychosocial(id);

  if (!item) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Editar pergunta psicossocial"
        description="Atualize pergunta, categoria, orientação, erros comuns e status."
        backHref="/admin/psychosocial"
      />
      <AdminNav />
      <StatusMessages success={query?.success} error={query?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <PsychosocialForm
          item={item}
          returnTo={`/admin/psychosocial/${item.id}/edit`}
        />
      </section>
    </main>
  );
}
