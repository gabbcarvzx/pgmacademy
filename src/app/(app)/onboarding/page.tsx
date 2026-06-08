import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Route, Sparkles } from "lucide-react";

import { PremiumUpgradeCard } from "@/components/learning/premium-upgrade-card";
import { PremiumOnboardingForm } from "@/components/onboarding/premium-onboarding-form";
import { getOnboardingStatus } from "@/lib/mission/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "Onboarding Premium",
  description: "Fluxo inicial para gerar o plano automático da PGM Academy.",
};

export default async function OnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const status = await getOnboardingStatus(user.id);

  if (status.hasPaidAccess && status.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex h-10 items-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-muted transition hover:border-white/35 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Dashboard
      </Link>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_340px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Onboarding premium
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold text-white sm:text-4xl">
            Gere seu Plano de Aprovação PGM
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            O painel de missão usa estas respostas para priorizar estudo,
            simulados, escrita e entrevista psicossocial.
          </p>
        </div>
        <aside className="rounded-md border border-border-soft bg-surface p-5">
          <Sparkles className="size-5 text-pgm-yellow" aria-hidden="true" />
          <p className="mt-4 text-sm font-semibold text-white">
            Personalização inicial
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            As recomendações são determinísticas e usam apenas conteúdo já
            existente na plataforma.
          </p>
        </aside>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        {status.hasPaidAccess ? (
          <PremiumOnboardingForm
            errorMessage={typeof params?.error === "string" ? params.error : null}
          />
        ) : (
          <PremiumUpgradeCard description="O onboarding premium é liberado quando o acesso premium estiver ativo." />
        )}

        <aside className="grid content-start gap-4">
          {[
            "Idioma de foco",
            "Ano escolar",
            "Tempo disponível",
            "Histórico no PGM",
            "Objetivo principal",
          ].map((item, index) => (
            <div
              key={item}
              className="rounded-md border border-border-soft bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-pgm-yellow text-sm font-semibold text-background">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold text-white">{item}</p>
              </div>
            </div>
          ))}

          <div className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5">
            <Route className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-white">
              Plano automático
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ao concluir, o dashboard passa a exibir missão diária, próxima
              ação e preparação geral.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
