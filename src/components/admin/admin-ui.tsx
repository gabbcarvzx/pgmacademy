import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BookOpenCheck,
  Brain,
  FileQuestion,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  MessageSquareCheck,
  Route,
} from "lucide-react";

export const inputClassName =
  "h-11 w-full rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow";
export const textAreaClassName =
  "min-h-32 w-full resize-y rounded-md border border-border-soft bg-background px-3 py-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow";
export const checkboxClassName =
  "flex min-h-11 items-center gap-2 rounded-md border border-border-soft bg-background px-3 text-sm font-semibold text-muted";

export const adminNavItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/materials", label: "Materiais", Icon: BookOpenCheck },
  { href: "/admin/flashcards", label: "Flashcards", Icon: Brain },
  { href: "/admin/questions", label: "Questoes", Icon: FileQuestion },
  { href: "/admin/psychosocial", label: "Psicossocial", Icon: HelpCircle },
  { href: "/admin/paths", label: "Trilhas", Icon: Route },
  { href: "/admin/templates", label: "Templates", Icon: ListChecks },
  { href: "/admin/correcoes", label: "Correcoes", Icon: MessageSquareCheck },
];

export function AdminHeader({
  title,
  description,
  eyebrow = "Admin",
  backHref,
  action,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <section>
      {backHref ? (
        <Link
          href={backHref}
          className="mb-5 inline-flex h-10 items-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar
        </Link>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            {description}
          </p>
        </div>
        {action}
      </div>
    </section>
  );
}

export function AdminNav() {
  return (
    <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-border-soft bg-surface px-3 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
        >
          <item.Icon className="size-4" aria-hidden="true" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function StatusMessages({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  return (
    <>
      {success ? (
        <p className="mt-5 rounded-md border border-pgm-green/40 bg-pgm-green/10 px-4 py-3 text-sm text-pgm-green">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="mt-5 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
          {error}
        </p>
      ) : null}
    </>
  );
}

export function FieldLabel({
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

export function AdminBadge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "yellow" | "green" | "red";
}) {
  const className =
    tone === "yellow"
      ? "border-pgm-yellow/40 bg-pgm-yellow/10 text-pgm-yellow"
      : tone === "green"
        ? "border-pgm-green/40 bg-pgm-green/10 text-pgm-green"
        : tone === "red"
          ? "border-pgm-red/40 bg-pgm-red/10 text-pgm-red"
          : "border-border-soft bg-background text-muted";

  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-border-soft bg-background p-4 text-sm leading-6 text-muted">
      {children}
    </div>
  );
}
