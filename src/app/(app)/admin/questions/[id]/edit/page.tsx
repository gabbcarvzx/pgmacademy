import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminHeader, AdminNav, StatusMessages } from "@/components/admin/admin-ui";
import { QuestionForm } from "@/components/admin/question-form";
import {
  getAdminQuestion,
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
    title: `Admin - Editar questao ${id}`,
  };
}

export default async function EditQuestionPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminPage();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [data, options] = await Promise.all([
    getAdminQuestion(id),
    getAdminSelectOptions(),
  ]);

  if (!data) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Editar questao"
        description="Atualize enunciado, alternativas, explicacao e status. O tipo da questao e preservado."
        backHref="/admin/questions"
      />
      <AdminNav />
      <StatusMessages success={query?.success} error={query?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <QuestionForm
          question={data.question}
          questionOptions={data.options}
          options={options}
          returnTo={`/admin/questions/${data.question.id}/edit`}
          type={data.question.type}
        />
      </section>
    </main>
  );
}
