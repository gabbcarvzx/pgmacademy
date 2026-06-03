import { ArrowUpRight } from "lucide-react";

type ModuleCardProps = {
  title: string;
  description: string;
  index: number;
};

export function ModuleCard({ title, description, index }: ModuleCardProps) {
  return (
    <article className="group rounded-md border border-border-soft bg-surface/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-pgm-yellow/35 hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-md border border-pgm-yellow/30 bg-pgm-yellow/10 px-2 py-1 font-mono text-xs font-semibold text-pgm-yellow">
          M{String(index + 1).padStart(2, "0")}
        </span>
        <ArrowUpRight
          className="size-4 text-muted transition group-hover:text-white"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
