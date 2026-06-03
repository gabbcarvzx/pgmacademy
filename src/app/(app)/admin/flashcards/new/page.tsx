import type { Metadata } from "next";

import { AdminHeader, AdminNav, StatusMessages } from "@/components/admin/admin-ui";
import { FlashcardForm } from "@/components/admin/flashcard-form";
import { getAdminSelectOptions } from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Novo flashcard",
};

type PageProps = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function NewFlashcardPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const options = await getAdminSelectOptions();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Novo flashcard"
        description="Crie um card de revisao rapida para os alunos."
        backHref="/admin/flashcards"
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <FlashcardForm options={options} returnTo="/admin/flashcards/new" />
      </section>
    </main>
  );
}
