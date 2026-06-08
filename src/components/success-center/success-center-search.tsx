"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import type { SuccessSearchItem } from "@/lib/success-center/content";

type SuccessCenterSearchProps = {
  searchIndex: SuccessSearchItem[];
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function SuccessCenterSearch({ searchIndex }: SuccessCenterSearchProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    if (!normalizedQuery) {
      return [];
    }

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return searchIndex
      .map((item) => {
        const title = normalize(item.title);
        const text = normalize(item.text);
        const score = terms.reduce((sum, term) => {
          if (title.includes(term)) return sum + 4;
          if (text.includes(term)) return sum + 1;
          return sum;
        }, 0);

        return { item, score };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 8)
      .map((result) => result.item);
  }, [query, searchIndex]);

  return (
    <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <Search className="size-5 text-pgm-yellow" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-white">Busca da Central</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            Encontre artigos, perguntas, guias e recursos da plataforma.
          </p>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="sr-only">Buscar na Central de Sucesso</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por pagamento, simulado, Mentor, subjetiva..."
          className="h-12 w-full rounded-md border border-border-soft bg-background px-4 text-sm font-semibold text-white outline-none transition placeholder:text-muted/70 focus:border-pgm-yellow"
        />
      </label>

      {query.trim() ? (
        <div className="mt-5 grid gap-3">
          {results.length === 0 ? (
            <div className="rounded-md border border-border-soft bg-background p-4">
              <p className="text-sm font-semibold text-white">
                Nenhum resultado encontrado
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Tente buscar por termos como premium, pagamento, simulado,
                subjetiva, Mentor ou edital.
              </p>
            </div>
          ) : (
            results.map((result) => (
              <Link
                key={`${result.type}:${result.id}`}
                href={result.href}
                className="rounded-md border border-border-soft bg-background p-4 transition hover:border-white/35"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-md border border-border-soft px-2 py-1 text-xs font-semibold uppercase text-muted">
                        {result.type}
                      </span>
                      <span className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 px-2 py-1 text-xs font-semibold text-pgm-yellow">
                        {result.categoryTitle}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {result.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {result.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-pgm-yellow"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}
