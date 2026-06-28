import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  Target,
} from "lucide-react";

import {
  AppPageHeader,
  ContentCard,
  FeatureHighlight,
  MetricCard,
  MobileActionBar,
  SectionHeader,
  StatusBadge,
  UpgradeCard,
} from "@/components/design-system";
import { ReviewFinalModuleNav } from "@/components/premium/review-final-module-nav";
import { ReviewFinalModuleSection } from "@/components/premium/review-final-module-section";
import { requireUserId } from "@/lib/auth/require-user";
import { getReviewFinalPageData } from "@/lib/review-final/service";

export const metadata: Metadata = {
  title: "Revisao Final PGM",
  description:
    "Central premium para a reta final da prova com revisao, estrategia, entrevista e simulados recomendados.",
};

const accessLabel = {
  free: "Gratuito",
  paid: "Premium",
  blocked: "Bloqueado",
  refunded: "Reembolsado",
} as const;

export default async function ReviewFinalPage() {
  const userId = await requireUserId();
  const data = await getReviewFinalPageData(userId);
  const primaryHref = data.hasPaidAccess ? "/simulados" : "/planos";
  const primaryLabel = data.hasPaidAccess
    ? "Abrir simulados recomendados"
    : "Desbloquear Revisao Final";

  return (
    <main className="px-4 pb-28 pt-5 max-sm:px-3 max-sm:pb-36 max-sm:pt-3 sm:px-6 lg:px-8 lg:pb-8">
      <AppPageHeader
        eyebrow="Revisao Final PGM"
        title="Central premium para organizar sua preparacao final"
        description="Revise os pontos mais importantes, evite erros comuns, alinhe estrategia de prova e chegue mais confiante para a fase decisiva."
        density="compact"
        aside={
          <div className="rounded-ds-16 border border-border-soft bg-background-primary p-4">
            <div className="flex items-center justify-between gap-4">
              <Target className="size-5 text-accent-gold" aria-hidden="true" />
              <StatusBadge tone={data.hasPaidAccess ? "premium" : "warning"}>
                {accessLabel[data.accessStatus]}
              </StatusBadge>
            </div>
            <p className="mt-4 text-caption font-semibold uppercase text-text-muted">
              Foco da reta final
            </p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">
              Revisao
            </p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Conteudo premium conectado a simulados, entrevista e checklist final.
            </p>
          </div>
        }
      />

      <section className="mt-5 grid gap-4 max-sm:mt-4 max-sm:gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Fase"
          value="Reta final"
          description="Material pensado para consolidacao, nao para dispersao."
          Icon={Target}
          tone="premium"
        />
        <MetricCard
          title="Prova"
          value="Revisao"
          description="Assuntos prioritarios e pontos que merecem mais atencao."
          Icon={BookOpenCheck}
        />
        <MetricCard
          title="Entrevista"
          value="Orientacao"
          description="Postura, clareza e erros a evitar na resposta."
          Icon={MessageSquareText}
        />
        <MetricCard
          title="Checklist"
          value="Final"
          description="Ultimos lembretes para fechar a preparacao com seguranca."
          Icon={ShieldCheck}
          tone="success"
        />
      </section>

      <ReviewFinalModuleNav items={data.navigation} />

      {!data.hasPaidAccess ? (
        <section className="mt-6 max-sm:mt-4">
          <UpgradeCard
            title="Revisao Final PGM exclusiva para alunos premium"
            description="A descoberta da central permanece aberta dentro da plataforma, mas o conteudo completo, os blocos de revisao e a conexao priorizada com simulados fazem parte do acesso premium."
            benefits={[
              "Apostila digital com modulos guiados por assunto.",
              "Questoes comentadas, alertas e resumos por unidade.",
              "Conexao direta com simulados finais reais da plataforma.",
            ]}
            href="/planos"
            ctaLabel="Assinar Premium"
          />
        </section>
      ) : null}

      {data.hasPaidAccess ? (
        <>
          <section className="mt-6 rounded-ds-20 border border-accent-gold/35 bg-[radial-gradient(circle_at_top_left,rgba(245,197,24,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-card max-sm:mt-4 max-sm:p-4 sm:p-6">
            <SectionHeader
              eyebrow="Comece por aqui"
              title="Revisao Inteligente para dominar os assuntos prioritarios"
              description="A ideia aqui nao e apenas listar topicos. Cada modulo explica, exemplifica, aponta erros comuns, resume o essencial e fecha com questao comentada."
              density="compact"
              action={<StatusBadge tone="premium">Apostila premium online</StatusBadge>}
            />
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <FeatureHighlight
                title="Ultimo passo antes da prova"
                description="Organize sua preparacao final em um roteiro claro, sem excesso de conteudo novo e com foco no que merece mais atencao."
                metric="Clareza"
                tone="premium"
              />
              <FeatureHighlight
                title="Revise com estrategia"
                description="Passe por gramatica, vocabulario, interpretacao, espanhol, entrevista e checklist final sem sair da plataforma."
                metric="Foco"
                tone="success"
              />
              <FeatureHighlight
                title="Pratique com criterio"
                description="Feche cada bloco entendendo o conteudo e depois conecte a revisao aos simulados recomendados."
                metric="Aplicacao"
                tone="info"
              />
            </div>
          </section>

          <section className="mt-6 grid gap-6 max-sm:mt-4">
            {data.modules.map((module) => (
              <ReviewFinalModuleSection key={module.id} module={module} />
            ))}
          </section>
        </>
      ) : null}

      <section id="simulados" className="mt-6 max-sm:mt-4">
        <SectionHeader
          eyebrow="Simulados recomendados"
          title="Feche a revisao com pratica dirigida"
          description="Use os simulados abaixo para transformar revisao em tomada de decisao sob tempo."
          density="compact"
          action={
            <Link
              href="/simulados"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-ds-12 border border-border-soft px-4 text-sm font-semibold text-text-muted transition hover:border-border-strong hover:text-text-primary"
            >
              Ver central de simulados
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {data.simulationLinks.map((item) => (
            <ContentCard
              key={item.key}
              title={item.title}
              description={item.description}
              badge={item.key === "others" ? "Banco completo" : "Recomendado"}
              tone={item.tone}
              action={
                <Link
                  href={item.href}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-4 text-sm font-semibold text-background-primary transition hover:bg-white max-sm:w-full"
                >
                  {item.ctaLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
              footer={
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted">
                  <CheckCircle2 className="size-4 text-accent-gold" aria-hidden="true" />
                  Revisao conectada
                </span>
              }
            />
          ))}
        </div>
      </section>

      <MobileActionBar label="Acesso rapido da Revisao Final">
        <Link
          href={primaryHref}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-ds-12 bg-accent-gold px-5 text-sm font-semibold text-background-primary transition hover:bg-white max-sm:w-full max-sm:px-3"
        >
          {primaryLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </MobileActionBar>
    </main>
  );
}
