import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  CircleDollarSign,
  LockKeyhole,
} from "lucide-react";

import { PaymentButton } from "@/components/billing/payment-button";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Area inicial do estudante na PGM Academy.",
};

const statusLabel = {
  eligible: "Elegivel",
  partial: "Parcial",
  ineligible: "Nao elegivel",
} as const;

const accessLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

const subscriptionLabel = {
  pending: "Pendente",
  paid: "Pago",
  overdue: "Vencido",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function DashboardPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profileResponse = await supabase
    .from("profiles")
    .select("access_status")
    .eq("id", user.id)
    .maybeSingle();
  const assessmentResponse = await supabase
    .from("eligibility_assessments")
    .select("status, readiness_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const subscriptionResponse = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const profile = profileResponse.data as {
    access_status: keyof typeof accessLabel;
  } | null;
  const latestAssessment = assessmentResponse.data as {
    status: keyof typeof statusLabel;
    readiness_score: number;
    created_at: string;
  } | null;
  const subscription = subscriptionResponse.data as { status: string } | null;

  const accessStatus = profile?.access_status ?? "free";
  const paymentStatus = subscription?.status;
  const paymentValue =
    paymentStatus && paymentStatus in subscriptionLabel
      ? subscriptionLabel[paymentStatus as keyof typeof subscriptionLabel]
      : "Asaas";
  const diagnosisValue = latestAssessment
    ? statusLabel[latestAssessment.status]
    : "Pendente";
  const diagnosisDescription = latestAssessment
    ? `Ultimo diagnostico salvo em ${dateFormatter.format(new Date(latestAssessment.created_at))}.`
    : "Resultado ainda nao salvo no painel.";

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Area do aluno
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Painel de preparacao
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Comece pelo diagnostico e avance pela trilha de aprovacao com
              clareza sobre requisitos, provas e preparacao premium.
            </p>
          </div>

          <Link
            href="/diagnostico"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
          >
            Fazer diagnostico
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Diagnostico",
            value: diagnosisValue,
            description: diagnosisDescription,
            Icon: BadgeCheck,
          },
          {
            title: "Aderencia",
            value: latestAssessment
              ? `${latestAssessment.readiness_score}%`
              : "--",
            description: "Pontuacao calculada pelos requisitos avaliados.",
            Icon: BookOpenCheck,
          },
          {
            title: "Premium",
            value: accessLabel[accessStatus],
            description: "Acesso sera controlado por status financeiro.",
            Icon: LockKeyhole,
          },
          {
            title: "Pagamento",
            value: paymentValue,
            description: "Modelo inicial de pagamento unico.",
            Icon: CircleDollarSign,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-md border border-border-soft bg-surface p-5"
          >
            <item.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-5 text-sm font-medium text-muted">{item.title}</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {item.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section
        id="premium"
        className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Acesso premium
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Plano unico para preparar sua aprovacao
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Pagamento unico de R$ 29,90 processado pelo Asaas. O acesso
              premium sera liberado automaticamente apos confirmacao do
              pagamento pelo webhook.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["PIX", "Cartao", "Boleto"].map((method) => (
                <div
                  key={method}
                  className="rounded-md border border-border-soft bg-background px-4 py-3"
                >
                  <CheckCircle2
                    className="size-4 text-pgm-yellow"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-sm font-semibold text-white">
                    {method}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border-soft bg-background p-4">
            <p className="text-sm font-medium text-muted">Pagamento unico</p>
            <p className="mt-2 text-4xl font-semibold text-white">R$ 29,90</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Status atual: {accessLabel[accessStatus]}
            </p>

            <div className="mt-5">
              {accessStatus === "paid" ? (
                <div className="rounded-md border border-pgm-green/40 bg-pgm-green/10 p-4">
                  <CheckCircle2
                    className="size-5 text-pgm-green"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Premium ativo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Seu acesso ja foi liberado.
                  </p>
                </div>
              ) : (
                <PaymentButton disabled={accessStatus === "blocked"} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">
              Trilha de aprovacao
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              As etapas do processo seletivo ficam organizadas para orientar a
              preparacao do aluno.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {[
            "Verificacao dos requisitos",
            "Prova objetiva",
            "Prova subjetiva",
            "Entrevista psicossocial",
          ].map((step, index) => (
            <div
              key={step}
              className="flex items-center justify-between rounded-md border border-border-soft bg-background px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-white text-sm font-semibold text-background">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-white">{step}</span>
              </div>
              <span className="size-2 rounded-full bg-white/25" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
