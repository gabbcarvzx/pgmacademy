"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpenCheck,
  BookText,
  Brain,
  CreditCard,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  Menu,
  MessageSquareText,
  PenLine,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { signOutAction } from "@/app/(app)/actions";
import { MobileDrawer, StatusBadge } from "@/components/design-system";
import type { DesignSystemTone } from "@/components/design-system";
import { cx } from "@/lib/design-system/utils";

type NavigationItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const navigationGroups = [
  {
    label: "Hoje",
    items: [
      { label: "Missão", href: "/dashboard", Icon: LayoutDashboard },
      { label: "Academia PGM", href: "/premium", Icon: BookOpenCheck },
      { label: "Onboarding", href: "/onboarding", Icon: Sparkles },
    ],
  },
  {
    label: "Estudar",
    items: [
      { label: "Estudos", href: "/estudos", Icon: BookText },
      { label: "Trilhas", href: "/trilhas", Icon: GraduationCap },
      { label: "Flashcards", href: "/flashcards", Icon: Brain },
    ],
  },
  {
    label: "Praticar",
    items: [
      { label: "Simulados", href: "/simulados", Icon: ListChecks },
      { label: "Subjetivas", href: "/subjetivas", Icon: PenLine },
      { label: "Entrevista", href: "/entrevista", Icon: MessageSquareText },
    ],
  },
  {
    label: "Evolução",
    items: [
      { label: "Analytics", href: "/analytics", Icon: BarChart3 },
      { label: "Diagnóstico", href: "/diagnostico", Icon: Gauge },
    ],
  },
  {
    label: "Ajuda",
    items: [
      { label: "Central de Sucesso", href: "/sucesso", Icon: LifeBuoy },
      { label: "Mentor IA", href: "/mentor", Icon: Sparkles },
    ],
  },
  {
    label: "Conta",
    items: [{ label: "Planos", href: "/planos", Icon: CreditCard }],
  },
] satisfies NavigationGroup[];

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

const accessStatusTone = {
  free: "neutral",
  paid: "premium",
  blocked: "error",
  refunded: "warning",
} satisfies Record<AppSidebarProps["accessStatus"], DesignSystemTone>;

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-ds-16 bg-accent-gold text-background-primary shadow-premium">
        <GraduationCap className="size-5" aria-hidden="true" />
      </span>
      <div className="leading-none">
        <p className="text-sm font-semibold text-text-primary">PGM</p>
        <p className="mt-1 text-xs font-medium uppercase text-text-muted">
          Academy
        </p>
      </div>
    </div>
  );
}

function NavigationList({
  groups,
  pathname,
  onNavigate,
}: {
  groups: NavigationGroup[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="grid gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase text-text-muted">
            {group.label}
          </p>
          <div className="grid gap-1.5">
            {group.items.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "inline-flex min-h-10 items-center gap-3 rounded-ds-12 border px-3 py-2 text-sm font-semibold transition",
                    active
                      ? "border-accent-gold/50 bg-accent-gold-soft text-text-primary"
                      : "border-transparent text-text-muted hover:border-border-soft hover:bg-white/[0.04] hover:text-text-primary",
                  )}
                >
                  <item.Icon
                    className={cx(
                      "size-4 shrink-0",
                      active ? "text-accent-gold" : "text-text-muted",
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function UserCard({
  userName,
  userEmail,
  accessStatus,
}: Pick<AppSidebarProps, "userName" | "userEmail" | "accessStatus">) {
  return (
    <div className="rounded-ds-16 border border-border-soft bg-background-primary/72 p-3">
      <p className="truncate text-sm font-semibold text-text-primary">
        {userName ?? "Aluno PGM"}
      </p>
      <p className="mt-1 truncate text-xs text-text-muted">{userEmail}</p>
      <div className="mt-3">
        <StatusBadge tone={accessStatusTone[accessStatus]}>
          {accessStatusLabel[accessStatus]}
        </StatusBadge>
      </div>
    </div>
  );
}

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-ds-12 border border-border-soft bg-background-primary/50 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:bg-white/[0.04] hover:text-text-primary"
      >
        Sair
        <LogOut className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export function AppSidebar({
  userName,
  userEmail,
  accessStatus,
  userRole,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const groups =
    userRole === "admin"
      ? [
          ...navigationGroups,
          {
            label: "Admin",
            items: [{ label: "Admin", href: "/admin", Icon: ShieldCheck }],
          },
        ]
      : navigationGroups;

  return (
    <aside className="sticky top-0 z-30 border-b border-border-soft bg-surface/95 backdrop-blur lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-5">
        <LogoMark />
        {drawerOpen ? null : (
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-ds-12 border border-border-soft px-3 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary lg:hidden"
            aria-label="Abrir navegação"
            aria-controls="app-mobile-navigation"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="size-4" aria-hidden="true" />
            Menu
          </button>
        )}
      </div>

      <div className="hidden lg:block">
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-5 pb-5">
          <NavigationList groups={groups} pathname={pathname} />

          <div className="mt-6 border-t border-border-soft pt-4">
            <UserCard
              userName={userName}
              userEmail={userEmail}
              accessStatus={accessStatus}
            />
            <div className="mt-3">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>

      <MobileDrawer
        open={drawerOpen}
        title="Navegação"
        onClose={() => setDrawerOpen(false)}
        footer={
          <div className="grid gap-3">
            <UserCard
              userName={userName}
              userEmail={userEmail}
              accessStatus={accessStatus}
            />
            <SignOutButton />
          </div>
        }
      >
        <NavigationList
          groups={groups}
          pathname={pathname}
          onNavigate={() => setDrawerOpen(false)}
        />
      </MobileDrawer>
    </aside>
  );
}
