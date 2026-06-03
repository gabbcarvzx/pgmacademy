import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminHeader, AdminNav, StatusMessages } from "@/components/admin/admin-ui";
import { FlashcardForm } from "@/components/admin/flashcard-form";
import {
  getAdminFlashcard,
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
    title: `Admin - Editar flashcard ${id}`,
  };
}

export default async function EditFlashcardPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminPage();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [flashcard, options] = await Promise.all([
    getAdminFlashcard(id),
    getAdminSelectOptions(),
  ]);

  if (!flashcard) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Editar flashcard"
        description="Atualize frente, verso, categoria e status do card."
        backHref="/admin/flashcards"
      />
      <AdminNav />
      <StatusMessages success={query?.success} error={query?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <FlashcardForm
          flashcard={flashcard}
          options={options}
          returnTo={`/admin/flashcards/${flashcard.id}/edit`}
        />
      </section>
    </main>
  );
}
