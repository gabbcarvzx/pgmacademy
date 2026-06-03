import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AdminHeader,
  AdminNav,
  StatusMessages,
} from "@/components/admin/admin-ui";
import { PathForm } from "@/components/admin/path-form";
import { PathItemsForm } from "@/components/admin/path-items-form";
import {
  getAdminPath,
  getAdminSelectOptions,
} from "@/lib/admin/learning-content";
import { requireAdminPage } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin - Editar trilha",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function EditPathPage({
  params,
  searchParams,
}: PageProps) {
  await requireAdminPage();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [pathBundle, options] = await Promise.all([
    getAdminPath(id),
    getAdminSelectOptions(),
  ]);

  if (!pathBundle) {
    notFound();
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Editar trilha"
        description="Atualize dados da trilha e organize os itens em uma sequencia pedagogica clara."
        backHref="/admin/paths"
      />
      <AdminNav />
      <StatusMessages success={query?.success} error={query?.error} />

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Dados da trilha</h2>
        <div className="mt-5">
          <PathForm
            path={pathBundle.path}
            returnTo={`/admin/paths/${pathBundle.path.id}/edit`}
          />
        </div>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white">Itens da trilha</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Reordene, remova ou adicione itens. Esta tela nao altera tentativas,
          respostas ou progresso historico de alunos.
        </p>
        <div className="mt-5">
          <PathItemsForm
            pathId={pathBundle.path.id}
            items={pathBundle.items}
            options={options}
          />
        </div>
      </section>
    </main>
  );
}
