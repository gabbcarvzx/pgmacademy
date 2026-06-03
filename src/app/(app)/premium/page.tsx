import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";

import { PremiumContentList } from "@/components/premium/premium-content-list";
import {
  premiumModuleCount,
  premiumModules,
  premiumPublishedModuleCount,
} from "@/lib/premium/content";
import { hasPremiumAccess } from "@/lib/access/premium";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Área Premium",
  description: "Conteúdos premium da PGM Academy para preparação do aluno.",
};

export default async function PremiumPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("access_status, role")
    .eq("id", user?.id ?? "")
    .single();

  if (!hasPremiumAccess(profile)) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <LockKeyhole className="size-6 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-5 text-sm font-semibold uppercase text-pgm-yellow">
            Área premium
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Conteúdos premium bloqueados
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            Esta área é exclusiva para alunos com acesso premium ativo. Libere
            o plano único para acessar os guias iniciais da jornada premium.
            A PGM Academy organiza orientações de preparação, sem substituir
            edital vigente ou canais oficiais.
          </p>
          <Link
            href="/planos"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
          >
            Desbloquear acesso premium
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-md border border-border-soft bg-surface">
        <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1fr_360px] xl:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Área premium
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
              Guias exclusivos para transformar preparação em prontidão
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
              Conteúdo inicial produzido a partir da análise editorial dos
              editais PGM 2024 e 2026. Cada módulo separa base oficial,
              orientação reaproveitável e pontos que devem ser confirmados no
              edital vigente.
            </p>
          </div>

          <div className="rounded-md border border-border-soft bg-background p-4">
            <Sparkles className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-medium text-muted">
              Progresso editorial
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {premiumPublishedModuleCount}/{premiumModuleCount}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-pgm-yellow"
                style={{
                  width: `${(premiumPublishedModuleCount / premiumModuleCount) * 100}%`,
                }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              Módulos com conteúdo inicial publicado. Regras oficiais seguem
              dependentes do edital vigente e dos comunicados oficiais.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <PremiumContentList modules={premiumModules} />
      </section>
    </main>
  );
}
