import Image from "next/image";
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import type { PremiumModule } from "@/lib/premium/content";

type PremiumContentListProps = {
  modules: PremiumModule[];
};

type ModuleSectionProps = {
  title: string;
  items: string[];
  icon: "official" | "guidance" | "confirm";
};

const sectionIcon = {
  official: ShieldCheck,
  guidance: ClipboardCheck,
  confirm: AlertTriangle,
};

const sectionIconColor = {
  official: "text-pgm-green",
  guidance: "text-pgm-yellow",
  confirm: "text-pgm-red",
};

function ModuleSection({ title, items, icon }: ModuleSectionProps) {
  const Icon = sectionIcon[icon];

  return (
    <section className="border-t border-border-soft pt-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon
          className={`size-4 ${sectionIconColor[icon]}`}
          aria-hidden="true"
        />
        {title}
      </p>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-muted">
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-pgm-yellow"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PremiumContentList({ modules }: PremiumContentListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {modules.map((module, index) => (
        <article
          key={module.slug}
          id={module.slug}
          className="overflow-hidden rounded-md border border-border-soft bg-surface"
        >
          <div className="relative aspect-[16/9] bg-background">
            <Image
              src={module.imageSrc}
              alt={module.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pgm-yellow">
                Modulo {index + 1}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {module.title}
              </h2>
            </div>
          </div>

          <div className="grid gap-5 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-border-soft px-2 py-1 text-xs font-semibold text-muted">
                <BookOpenCheck className="size-3.5" aria-hidden="true" />
                {module.category}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-pgm-yellow/35 px-2 py-1 text-xs font-semibold text-pgm-yellow">
                <LockKeyhole className="size-3.5" aria-hidden="true" />
                Premium
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-pgm-green/35 px-2 py-1 text-xs font-semibold text-pgm-green">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Conteudo inicial
              </span>
            </div>

            <div>
              <p className="text-sm leading-6 text-white">{module.summary}</p>
              <p className="mt-3 text-xs leading-5 text-muted">
                {module.sourceTag}
              </p>
            </div>

            <ModuleSection
              title="Base oficial extraida"
              items={module.officialBasis}
              icon="official"
            />
            <ModuleSection
              title="Orientacao reaproveitavel"
              items={module.reusableGuidance}
              icon="guidance"
            />
            <ModuleSection
              title="Confirmar nos canais oficiais"
              items={module.confirmOfficially}
              icon="confirm"
            />
          </div>
        </article>
      ))}
    </div>
  );
}
