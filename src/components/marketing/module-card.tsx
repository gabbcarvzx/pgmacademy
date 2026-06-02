import { ArrowUpRight } from "lucide-react";

type ModuleCardProps = {
  title: string;
  description: string;
  index: number;
};

export function ModuleCard({ title, description, index }: ModuleCardProps) {
  return (
    <article className="group rounded-md border border-border-soft bg-surface p-5 transition hover:border-white/25 hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs font-semibold text-pgm-yellow">
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
