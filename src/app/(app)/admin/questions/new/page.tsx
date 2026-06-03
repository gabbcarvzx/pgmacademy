import type { Metadata } from "next";

import { AdminHeader, AdminNav, StatusMessages } from "@/components/admin/admin-ui";
import { QuestionForm } from "@/components/admin/question-form";
import {
  getAdminSelectOptions,
  parseQuestionType,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Nova questão",
};

type PageProps = {
  searchParams?: Promise<{ type?: string; error?: string; success?: string }>;
};

export default async function NewQuestionPage({ searchParams }: PageProps) {
  await requireAdminPage();
  const params = await searchParams;
  const type = parseQuestionType(params?.type === "subjective" ? "subjective" : "objective");
  const options = await getAdminSelectOptions();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title={type === "objective" ? "Nova questão objetiva" : "Nova questão subjetiva"}
        description="Crie questões autorais para bancos de conteúdo. Gabarito objetivo continua protegido nas telas públicas até a finalização do simulado."
        backHref="/admin/questions"
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />
      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <QuestionForm options={options} returnTo={`/admin/questions/new?type=${type}`} type={type} />
      </section>
    </main>
  );
}
