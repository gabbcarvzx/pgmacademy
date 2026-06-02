import type { Metadata } from "next";
import {
  BookOpenCheck,
  DatabaseZap,
  FileQuestion,
  LockKeyhole,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";

import {
  createQuestionBankAction,
  createSimulationTemplateAction,
} from "@/app/(app)/admin/actions";
import { getAdminLearningDashboard } from "@/lib/admin/learning-content";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  description: "Painel administrativo minimo da PGM Academy.",
};

type AdminPageProps = {
  searchParams?: Promise<{
    created?: string;
    error?: string;
  }>;
};

const languageOptions = [
  { value: "english", label: "Ingles" },
  { value: "spanish", label: "Espanhol" },
  { value: "portuguese", label: "Portugues" },
  { value: "mixed", label: "Misto" },
  { value: "psychosocial", label: "Psicossocial" },
];

const templateTypeOptions = [
  { value: "quick", label: "Rapido" },
  { value: "full", label: "Completo" },
];

const inputClassName =
  "h-11 w-full rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow";
const textAreaClassName =
  "min-h-24 w-full resize-none rounded-md border border-border-soft bg-background px-3 py-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow";

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor: string;
}) {
  return (
    <label className="text-sm font-semibold text-white" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

function AdminBlocked() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <LockKeyhole className="size-6 text-pgm-yellow" aria-hidden="true" />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
          Admin
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white">
          Acesso administrativo bloqueado
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
          Esta area e exclusiva para usuarios com{" "}
          <code className="rounded bg-background px-1.5 py-0.5 text-pgm-yellow">
            profiles.role = admin
          </code>
          . Nenhum formulario administrativo foi carregado para esta sessao.
        </p>
      </section>
    </main>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (profile?.role !== "admin") {
    return <AdminBlocked />;
  }

  const dashboard = await getAdminLearningDashboard();
  const successMessage =
    params?.created === "bank"
      ? "Banco de questoes criado."
      : params?.created === "template"
        ? "Template de simulado criado."
        : null;

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
          Admin
        </p>
        <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_360px] xl:items-end">
          <div>
            <h1 className="max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
              Gestao inicial dos simulados
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
              Cadastre a estrutura comercial e pedagogica dos simulados sem
              inserir questoes reais. Questoes, materiais e IA ficam para
              etapas futuras aprovadas separadamente.
            </p>
          </div>

          <div className="rounded-md border border-border-soft bg-surface p-4">
            <ShieldCheck className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">
              Administrador
            </p>
            <p className="mt-2 truncate text-lg font-semibold text-white">
              {profile.email ?? user?.email ?? "Admin"}
            </p>
          </div>
        </div>
      </section>

      {successMessage ? (
        <p className="mt-6 rounded-md border border-pgm-green/40 bg-pgm-green/10 px-4 py-3 text-sm text-pgm-green">
          {successMessage}
        </p>
      ) : null}

      {params?.error ? (
        <p className="mt-6 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
          {params.error}
        </p>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Bancos",
            value: dashboard.stats.banks,
            Icon: DatabaseZap,
          },
          {
            title: "Categorias",
            value: dashboard.stats.categories,
            Icon: BookOpenCheck,
          },
          {
            title: "Templates",
            value: dashboard.stats.templates,
            Icon: FileQuestion,
          },
          {
            title: "Templates ativos",
            value: dashboard.stats.activeTemplates,
            Icon: ShieldCheck,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-md border border-border-soft bg-surface p-5"
          >
            <item.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-5 text-sm font-medium text-muted">{item.title}</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <PlusCircle className="mt-1 size-5 text-pgm-yellow" aria-hidden="true" />
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Novo banco de questoes
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Cria apenas a estrutura do banco. Nenhuma questao real sera
                criada por este formulario.
              </p>
            </div>
          </div>

          <form action={createQuestionBankAction} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <FieldLabel htmlFor="bank-title">Titulo</FieldLabel>
              <input
                id="bank-title"
                name="title"
                required
                minLength={3}
                maxLength={140}
                placeholder="Ex: Banco de Ingles - Nivel inicial"
                className={inputClassName}
              />
            </div>

            <div className="grid gap-2">
              <FieldLabel htmlFor="bank-description">Descricao</FieldLabel>
              <textarea
                id="bank-description"
                name="description"
                maxLength={500}
                placeholder="Uso interno do banco de questoes."
                className={textAreaClassName}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2 sm:col-span-1">
                <FieldLabel htmlFor="bank-language">Idioma</FieldLabel>
                <select
                  id="bank-language"
                  name="language"
                  className={inputClassName}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 text-sm font-semibold text-muted">
                <input name="is_premium" type="checkbox" defaultChecked />
                Premium
              </label>

              <label className="flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 text-sm font-semibold text-muted">
                <input name="is_active" type="checkbox" defaultChecked />
                Ativo
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
            >
              Criar banco
            </button>
          </form>
        </article>

        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <PlusCircle className="mt-1 size-5 text-pgm-yellow" aria-hidden="true" />
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Novo template de simulado
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Define a experiencia que os alunos visualizam em `/simulados`.
                O template so inicia tentativa quando houver questoes.
              </p>
            </div>
          </div>

          <form
            action={createSimulationTemplateAction}
            className="mt-6 grid gap-4"
          >
            <div className="grid gap-2">
              <FieldLabel htmlFor="template-title">Titulo</FieldLabel>
              <input
                id="template-title"
                name="title"
                required
                minLength={3}
                maxLength={140}
                placeholder="Ex: Simulado rapido de Ingles"
                className={inputClassName}
              />
            </div>

            <div className="grid gap-2">
              <FieldLabel htmlFor="template-description">Descricao</FieldLabel>
              <textarea
                id="template-description"
                name="description"
                maxLength={500}
                placeholder="Resumo exibido para alunos."
                className={textAreaClassName}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <FieldLabel htmlFor="template-type">Tipo</FieldLabel>
                <select
                  id="template-type"
                  name="type"
                  className={inputClassName}
                >
                  {templateTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <FieldLabel htmlFor="template-language">Idioma</FieldLabel>
                <select
                  id="template-language"
                  name="language"
                  className={inputClassName}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <FieldLabel htmlFor="template-total">Total</FieldLabel>
                <input
                  id="template-total"
                  name="total_questions"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className={inputClassName}
                />
              </div>

              <label className="flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 text-sm font-semibold text-muted">
                <input name="is_premium" type="checkbox" defaultChecked />
                Premium
              </label>

              <label className="flex items-center gap-2 rounded-md border border-border-soft bg-background px-3 text-sm font-semibold text-muted">
                <input name="is_active" type="checkbox" defaultChecked />
                Ativo
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
            >
              Criar template
            </button>
          </form>
        </article>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-md border border-border-soft bg-surface p-5">
          <h2 className="text-lg font-semibold text-white">
            Bancos recentes
          </h2>
          <div className="mt-4 grid gap-3">
            {dashboard.banks.length === 0 ? (
              <p className="text-sm leading-6 text-muted">
                Nenhum banco de questoes cadastrado.
              </p>
            ) : (
              dashboard.banks.map((bank) => (
                <div
                  key={bank.id}
                  className="rounded-md border border-border-soft bg-background p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {bank.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {bank.language} / {bank.is_premium ? "premium" : "free"} /{" "}
                    {bank.is_active ? "ativo" : "inativo"}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-md border border-border-soft bg-surface p-5">
          <h2 className="text-lg font-semibold text-white">
            Templates recentes
          </h2>
          <div className="mt-4 grid gap-3">
            {dashboard.templates.length === 0 ? (
              <p className="text-sm leading-6 text-muted">
                Nenhum template de simulado cadastrado.
              </p>
            ) : (
              dashboard.templates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-md border border-border-soft bg-background p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {template.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {template.type} / {template.language} /{" "}
                    {template.total_questions} questoes /{" "}
                    {template.is_premium ? "premium" : "free"}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-white">
          Categorias estruturais
        </h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.categories.map((category) => (
            <span
              key={category.id}
              className="rounded-md border border-border-soft bg-surface px-3 py-2 text-sm text-muted"
            >
              {category.name}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
