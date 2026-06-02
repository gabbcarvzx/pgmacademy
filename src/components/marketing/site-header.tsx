import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

import { navigationItems, siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-white text-background shadow-[0_0_40px_rgba(8,102,216,0.35)]">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-[0.18em] text-white">
              PGM
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
              Academy
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-md border border-border-soft px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8 sm:inline-flex"
          >
            Entrar
          </Link>
          <a
            href="#premium"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
          >
            {siteConfig.price}
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
