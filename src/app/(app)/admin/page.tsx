import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenCheck,
  Brain,
  DatabaseZap,
  FileQuestion,
  HelpCircle,
  LockKeyhole,
  PlusCircle,
  Route,
  ShieldCheck,
} from "lucide-react";

import {
  createQuestionBankAction,
  createSimulationTemplateAction,
} from "@/app/(app)/admin/actions";
import {
  AdminBadge,
  AdminHeader,
  AdminNav,
  checkboxClassName,
  FieldLabel,
  inputClassName,
  StatusMessages,
  textAreaClassName,
} from "@/components/admin/admin-ui";
import {
  getAdminLearningDashboard,
  learningLanguages,
  templateTypes,
} from "@/lib/admin/learning-content";
import { getAdminProfile } from "@/lib/admin/guard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Painel administrativo de conteudo da PGM Academy.",
};

type AdminPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

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
  const profile = await getAdminProfile();

  if (profile.role !== "admin") {
    return <AdminBlocked />;
  }

  const dashboard = await getAdminLearningDashboard();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <AdminHeader
        title="Painel administrativo de conteudo"
        description="Gerencie materiais, flashcards, questoes, trilhas, simulados e perguntas psicossociais sem scripts manuais. Todas as alteracoes passam por permissoes server-side."
        action={
          <div className="rounded-md border border-border-soft bg-surface p-4">
            <ShieldCheck className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">
              Administrador
            </p>
            <p className="mt-2 truncate text-lg font-semibold text-white">
              {profile.email ?? "Admin"}
            </p>
          </div>
        }
      />
      <AdminNav />
      <StatusMessages success={params?.success} error={params?.error} />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {[
          {
            title: "Materiais",
            value: dashboard.stats.materials,
            href: "/admin/materials",
            Icon: BookOpenCheck,
          },
          {
            title: "Flashcards",
            value: dashboard.stats.flashcards,
            href: "/admin/flashcards",
            Icon: Brain,
          },
          {
            title: "Questoes",
            value: dashboard.stats.questions,
            href: "/admin/questions",
            Icon: FileQuestion,
          },
          {
            title: "Trilhas",
            value: dashboard.stats.paths,
            href: "/admin/paths",
            Icon: Route,
          },
          {
            title: "Templates",
            value: dashboard.stats.templates,
            href: "/admin/templates",
            Icon: DatabaseZap,
          },
          {
            title: "Psicossocial",
            value: dashboard.stats.psychosocialQuestions,
            href: "/admin/psychosocial",
            Icon: HelpCircle,
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-md border border-border-soft bg-surface p-5 transition hover:border-white/35"
          >
            <item.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-5 text-sm font-medium text-muted">{item.title}</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {item.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Ativos",
            value: dashboard.stats.activeContent,
            tone: "green" as const,
          },
          {
            label: "Inativos",
            value: dashboard.stats.inactiveContent,
            tone: "red" as const,
          },
          {
            label: "Premium",
            value: dashboard.stats.premiumContent,
            tone: "yellow" as const,
          },
          {
            label: "Gratuitos",
            value: dashboard.stats.freeContent,
            tone: "muted" as const,
          },
        ].map(({ label, value, tone }) => (
          <article
            key={label}
            className="rounded-md border border-border-soft bg-background p-4"
          >
            <AdminBadge tone={tone}>{label}</AdminBadge>
            <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <PlusCircle className="mt-1 size-5 text-pgm-yellow" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Novo banco de questoes
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Banco controla o pacote premium/free das questoes vinculadas.
              </p>
            </div>
          </div>

          <form action={createQuestionBankAction} className="mt-6 grid gap-4">
            <input type="hidden" name="returnTo" value="/admin" />
            <div className="grid gap-2">
              <FieldLabel htmlFor="bank-title">Titulo</FieldLabel>
              <input
                id="bank-title"
                name="title"
                required
                minLength={3}
                maxLength={160}
                className={inputClassName}
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel htmlFor="bank-description">Descricao</FieldLabel>
              <textarea
                id="bank-description"
                name="description"
                maxLength={800}
                className={textAreaClassName}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <select name="language" className={inputClassName} defaultValue="mixed">
                {learningLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <label className={checkboxClassName}>
                <input name="is_premium" type="checkbox" defaultChecked />
                Premium
              </label>
              <label className={checkboxClassName}>
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
              <h2 className="text-xl font-semibold text-white">
                Novo template de simulado
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Template aparece em `/simulados` quando ativo e com questoes suficientes.
              </p>
            </div>
          </div>

          <form
            action={createSimulationTemplateAction}
            className="mt-6 grid gap-4"
          >
            <input type="hidden" name="returnTo" value="/admin" />
            <div className="grid gap-2">
              <FieldLabel htmlFor="template-title">Titulo</FieldLabel>
              <input
                id="template-title"
                name="title"
                required
                minLength={3}
                maxLength={160}
                className={inputClassName}
              />
            </div>
            <div className="grid gap-2">
              <FieldLabel htmlFor="template-description">Descricao</FieldLabel>
              <textarea
                id="template-description"
                name="description"
                maxLength={800}
                className={textAreaClassName}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <select name="type" className={inputClassName} defaultValue="quick">
                {templateTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select name="language" className={inputClassName} defaultValue="mixed">
                {learningLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <input
                name="total_questions"
                type="number"
                min={0}
                defaultValue={10}
                className={inputClassName}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                name="source_reference"
                placeholder="source_reference"
                className={inputClassName}
              />
              <label className={checkboxClassName}>
                <input name="is_premium" type="checkbox" defaultChecked />
                Premium
              </label>
              <label className={checkboxClassName}>
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Bancos recentes</h2>
            <AdminBadge>{dashboard.stats.banks} total</AdminBadge>
          </div>
          <div className="mt-4 grid gap-3">
            {dashboard.banks.map((bank) => (
              <div
                key={bank.id}
                className="rounded-md border border-border-soft bg-background p-4"
              >
                <p className="text-sm font-semibold text-white">{bank.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {bank.language} / {bank.is_premium ? "premium" : "free"} /{" "}
                  {bank.is_active ? "ativo" : "inativo"}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-border-soft bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Templates recentes
            </h2>
            <AdminBadge>{dashboard.stats.activeTemplates} ativos</AdminBadge>
          </div>
          <div className="mt-4 grid gap-3">
            {dashboard.templates.map((template) => (
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
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Categorias estruturais
          </h2>
          <AdminBadge>{dashboard.stats.categories} categorias</AdminBadge>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.categories.map((category) => (
            <span
              key={category.id}
              className="rounded-md border border-border-soft bg-surface px-3 py-2 text-sm text-muted"
            >
              {category.language} / {category.name}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
