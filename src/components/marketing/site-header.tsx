import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

import { navigationItems } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/82 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-pgm-yellow text-background shadow-[0_18px_48px_rgba(246,201,69,0.22)]">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-white">
              PGM
            </span>
            <span className="mt-1 text-xs font-medium uppercase text-muted">
              Academy
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 transition hover:bg-white/6 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-md border border-border-soft bg-white/[0.02] px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8 sm:inline-flex"
          >
            Entrar
          </Link>
          <Link
            href="/planos"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background shadow-[0_14px_34px_rgba(246,201,69,0.18)] transition hover:bg-white"
          >
            Ver planos
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
