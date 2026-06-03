import type { Metadata } from "next";

import {
  AdminHeader,
  AdminNav,
  StatusMessages,
} from "@/components/admin/admin-ui";
import { PsychosocialForm } from "@/components/admin/psychosocial-form";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Nova pergunta psicossocial",
};

type PageProps = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function NewPsychosocialPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Nova pergunta psicossocial"
        description="Cadastre uma pergunta de entrevista com orientacao e erros comuns."
        backHref="/admin/psychosocial"
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <PsychosocialForm returnTo="/admin/psychosocial/new" />
      </section>
    </main>
  );
}
