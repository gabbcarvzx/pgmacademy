import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  BookText,
  Brain,
  CreditCard,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquareText,
  PenLine,
  ShieldCheck,
} from "lucide-react";

import { signOutAction } from "@/app/(app)/actions";

const appNavigation = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", Icon: BarChart3 },
  { label: "Estudos", href: "/estudos", Icon: BookText },
  { label: "Trilhas", href: "/trilhas", Icon: GraduationCap },
  { label: "Flashcards", href: "/flashcards", Icon: Brain },
  { label: "Subjetivas", href: "/subjetivas", Icon: PenLine },
  { label: "Entrevista", href: "/entrevista", Icon: MessageSquareText },
  { label: "Diagnóstico", href: "/diagnostico", Icon: Gauge },
  { label: "Simulados", href: "/simulados", Icon: ListChecks },
  { label: "Planos", href: "/planos", Icon: CreditCard },
  { label: "Área Premium", href: "/premium", Icon: BookOpenCheck },
];

type AppSidebarProps = {
  userName: string | null;
  userEmail: string;
  accessStatus: "free" | "paid" | "blocked" | "refunded";
  userRole: "student" | "mentor" | "admin";
};

const accessStatusLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} satisfies Record<AppSidebarProps["accessStatus"], string>;

export function AppSidebar({
  userName,
  userEmail,
  accessStatus,
  userRole,
}: AppSidebarProps) {
  const navigation =
    userRole === "admin"
      ? [
          ...appNavigation,
          { label: "Admin", href: "/admin", Icon: ShieldCheck },
        ]
      : appNavigation;

  return (
    <aside className="border-b border-border-soft bg-surface/92 backdrop-blur lg:sticky lg:top-0 lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-5">
        <span className="flex size-10 items-center justify-center rounded-md bg-pgm-yellow text-background shadow-[0_14px_34px_rgba(246,201,69,0.18)]">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <div className="leading-none">
          <p className="text-sm font-semibold text-white">
            PGM
          </p>
          <p className="mt-1 text-xs font-medium uppercase text-muted">
            Academy
          </p>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6 lg:grid lg:px-5">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex h-11 shrink-0 items-center gap-3 rounded-md border border-border-soft bg-background/72 px-4 text-sm font-semibold text-muted transition hover:border-pgm-yellow/45 hover:bg-white/[0.04] hover:text-white lg:w-full"
          >
            <item.Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border-soft px-4 py-4 sm:px-6 lg:mx-5 lg:mt-2 lg:px-0">
        <div className="rounded-md border border-border-soft bg-background/72 p-3">
          <p className="truncate text-sm font-semibold text-white">
            {userName ?? "Aluno PGM"}
          </p>
          <p className="mt-1 truncate text-xs text-muted">{userEmail}</p>
          <p className="mt-3 inline-flex rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 px-2 py-1 text-xs font-semibold text-pgm-yellow">
            {accessStatusLabel[accessStatus]}
          </p>
        </div>

        <form action={signOutAction} className="mt-3">
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border-soft bg-background/50 text-sm font-semibold text-muted transition hover:border-white/35 hover:bg-white/[0.04] hover:text-white"
          >
            Sair
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  );
}
