import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  HelpCircle,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { PaymentButton } from "@/components/billing/payment-button";
import { FinalPromoBanner } from "@/components/marketing/final-promo-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  hasPremiumAccess,
  type PremiumAccessProfile,
} from "@/lib/access/premium";
import { pgm2026OfficialSnapshot } from "@/lib/official/pgm-2026";
import { getActiveOffer } from "@/lib/promo-config";
import { siteConfig } from "@/lib/site-config";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Planos Premium",
  description:
    "Planos da PGM Academy para preparacao independente do Programa Ganhe o Mundo.",
};

const heroImage =
  "/images/canada/WhatsApp Image 2026-06-02 at 11.26.50 AM.jpeg";

const premiumBenefits = [
  {
    title: "Materiais exclusivos",
    description: "Conteudos autorais organizados por idioma, categoria e nivel.",
    Icon: BookOpenCheck,
  },
  {
    title: "Simulados realistas",
    description:
      "Templates completos com correcao automatica e desempenho por categoria.",
    Icon: Target,
  },
  {
    title: "Flashcards inteligentes",
    description:
      "Revisao rapida por frente e verso para fixar vocabulario e conceitos.",
    Icon: Brain,
  },
  {
    title: "Questoes subjetivas",
    description: "Treino de escrita com envio premium para feedback manual.",
    Icon: FileText,
  },
  {
    title: "Entrevista psicossocial",
    description:
      "Perguntas autorais para maturidade, adaptacao cultural e responsabilidade.",
    Icon: MessageSquareText,
  },
  {
    title: "Analytics avancado",
    description: "Metas, evolucao, streak e recomendacoes baseadas em regras.",
    Icon: BarChart3,
  },
  {
    title: "Plano de evolucao",
    description:
      "Trilhas completas para conectar estudo, revisao, simulados e feedback.",
    Icon: Trophy,
  },
];

const comparisonRows = [
  ["Materiais de estudo", "Limitado", "Completo"],
  ["Flashcards", "Alguns conjuntos", "Ilimitado"],
  ["Trilhas", "Visualizacao parcial", "Sequencia completa"],
  ["Simulados", "Bloqueados ou limitados", "Completos"],
  ["Correcao detalhada", "Nao disponivel", "Disponivel"],
  ["Subjetivas", "Visualiza sem enviar", "Envio e feedback manual"],
  ["Entrevista psicossocial", "Visualiza sem enviar", "Treino com feedback"],
  ["Analytics", "Resumo", "Diagnostico completo"],
];

const officialPlanHighlights = [
  `${pgm2026OfficialSnapshot.totalVacancies.toLocaleString("pt-BR")} vagas no edital 2026`,
  "30 questoes objetivas",
  "5 respostas subjetivas",
  "Entrevista psicossocial telepresencial",
];

const faqItems = [
  {
    question: "Como funciona a plataforma?",
    answer:
      "Voce cria uma conta, acessa conteudos gratuitos e pode desbloquear o premium para estudar com materiais, flashcards, simulados, trilhas, subjetivas, entrevista e analytics.",
  },
  {
    question: "A PGM Academy tem vinculo com o Governo?",
    answer:
      "Nao. A plataforma e independente de preparacao e nao substitui o Governo de Pernambuco, o Programa Ganhe o Mundo, editais ou canais oficiais.",
  },
  {
    question: "O conteudo segue os editais?",
    answer:
      "O conteudo autoral usa editais anteriores como referencia de estrutura, habilidades e etapas, mas regras vigentes devem ser confirmadas sempre nos canais oficiais.",
  },
  {
    question: "O Premium vale a pena?",
    answer:
      "O premium concentra a experiencia completa: simulados, trilhas, materiais, flashcards, feedback manual, entrevista e analytics. Ele foi pensado para quem quer estudar com rotina e clareza.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Nesta fase, o produto usa pagamento unico processado pelo Asaas. A liberacao premium acontece apos confirmacao do pagamento.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Politicas financeiras devem seguir os termos do checkout, do meio de pagamento e da PGM Academy. Em caso de duvida, confira os canais de atendimento antes de comprar.",
  },
];

type AccessStatus = "free" | "paid" | "blocked" | "refunded";

export default async function PlansPage() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: PremiumAccessProfile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("access_status, role")
      .eq("id", user.id)
      .maybeSingle();

    profile = data;
  }

  const activeOffer = getActiveOffer();
  const accessStatus = (profile?.access_status ?? null) as AccessStatus | null;
  const isPaid = hasPremiumAccess(profile);
  const isBlocked = accessStatus === "blocked";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <FinalPromoBanner />

      <section className="relative min-h-[82vh] overflow-hidden">
        <Image
          src={heroImage}
          alt="Escola no Canada representando uma experiencia internacional de estudo."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/74" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl py-12">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-background/45 px-3 py-2 text-sm font-medium text-white backdrop-blur">
                <Sparkles className="size-4 text-pgm-yellow" aria-hidden="true" />
                Acesso premium PGM Academy
              </div>
              {activeOffer.isPromotional ? (
                <div className="inline-flex items-center gap-2 rounded-md border border-pgm-yellow/30 bg-pgm-yellow/12 px-3 py-2 text-sm font-semibold text-pgm-yellow backdrop-blur">
                  <Clock3 className="size-4" aria-hidden="true" />
                  Ultimos dias da promocao
                </div>
              ) : null}
            </div>

            <h1 className="mt-8 max-w-5xl text-balance text-4xl font-semibold text-white sm:text-6xl lg:text-7xl">
              Plataforma premium para quem quer revisar, treinar e chegar mais
              pronto nas etapas decisivas do Ganhe o Mundo.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82 sm:text-xl">
              Concentre simulados, materiais, flashcards, subjetivas,
              entrevista e analytics em um unico ambiente para estudar com
              consistencia na reta final.
            </p>

            <div className="mt-6 grid max-w-4xl gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {officialPlanHighlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-md border border-white/16 bg-background/45 px-3 py-2 text-sm font-semibold text-white backdrop-blur"
                >
                  {highlight}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#checkout"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                Quero garantir meu acesso
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#comparacao"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-background/35 px-5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
              >
                Comparar planos
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </a>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/70">
              {activeOffer.isPromotional
                ? `Valor promocional de ${activeOffer.priceLabel} valido ate ${activeOffer.deadlineLabel}. Depois disso, o valor pode voltar para ${activeOffer.compareAtPriceLabel}.`
                : "A plataforma continua focada em preparacao responsavel, sem promessas irreais nem urgencia enganosa."}
            </p>
          </div>
        </div>
      </section>

      <section id="checkout" className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_390px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Preparacao premium
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
              O Premium organiza sua reta final para objetiva, subjetiva e
              entrevista.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
              Acesso aos recursos que aumentam clareza, consistencia e
              confianca: simulados, materiais, trilhas, revisao, feedback
              manual e analytics de evolucao.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Simulados completos",
                "Feedback manual",
                "Analytics premium",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-border-soft bg-surface p-4"
                >
                  <CheckCircle2
                    className="size-5 text-pgm-yellow"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-white">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {activeOffer.isPromotional && activeOffer.deadlineLabel ? (
              <div className="mt-6 rounded-md border border-pgm-yellow/25 bg-pgm-yellow/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pgm-yellow">
                  Promocao de reta final
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Garanta o acesso completo por {activeOffer.priceLabel}.
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  De {activeOffer.compareAtPriceLabel}. Oferta valida somente
                  ate {activeOffer.deadlineLabel}. Apos essa data, o valor pode
                  voltar ao normal.
                </p>
              </div>
            ) : null}
          </div>

          <aside className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 shadow-premium sm:p-6">
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Plano Premium
            </p>
            {activeOffer.isPromotional ? (
              <div className="mt-4">
                <p className="text-sm font-medium text-white/74 line-through">
                  {activeOffer.compareAtPriceLabel}
                </p>
                <div className="mt-1 flex items-end gap-3">
                  <span className="text-5xl font-semibold text-white">
                    {activeOffer.priceLabel}
                  </span>
                  <span className="pb-2 text-sm text-muted">pagamento unico</span>
                </div>
                <p className="mt-4 rounded-md border border-white/10 bg-background/35 px-3 py-2 text-sm text-white/78">
                  Oferta valida ate {activeOffer.deadlineLabel}.
                </p>
              </div>
            ) : (
              <div className="mt-4 flex items-end gap-3">
                <span className="text-5xl font-semibold text-white">
                  {activeOffer.priceLabel}
                </span>
                <span className="pb-2 text-sm text-muted">pagamento unico</span>
              </div>
            )}
            <p className="mt-4 text-sm leading-6 text-muted">
              Processamento pelo Asaas. Liberacao automatica apos confirmacao do
              pagamento quando a conta estiver autenticada.
            </p>

            <div className="mt-6">
              {isPaid ? (
                <div className="rounded-md border border-pgm-green/40 bg-pgm-green/10 p-4">
                  <CheckCircle2
                    className="size-5 text-pgm-green"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Premium ativo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Seu acesso completo ja esta liberado.
                  </p>
                  <Link
                    href="/dashboard"
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
                  >
                    Ir para dashboard
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : user ? (
                <PaymentButton
                  disabled={isBlocked}
                  label="Quero garantir meu acesso"
                  loadingLabel="Abrindo pagamento"
                />
              ) : (
                <div className="grid gap-3">
                  <Link
                    href="/cadastro"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
                  >
                    Criar conta gratuita
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border-soft px-5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
                  >
                    Ja tenho conta
                    <LockKeyhole className="size-4" aria-hidden="true" />
                  </Link>
                  <p className="text-xs leading-5 text-muted">
                    Crie ou entre na conta antes de iniciar o pagamento para que
                    o premium seja vinculado ao seu usuario.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {activeOffer.isPromotional && activeOffer.deadlineLabel ? (
        <section className="border-y border-border-soft bg-surface/60 py-12">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div className="rounded-md border border-border-soft bg-background p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pgm-yellow">
                Ultimos dias da oferta
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-white">
                Aproveite o valor promocional enquanto ele estiver disponivel.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Promocao valida somente ate {activeOffer.deadlineLabel}. Apos
                essa data, o preco pode voltar ao valor normal.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                "Tenha acesso imediato aos recursos premium apos confirmacao do pagamento.",
                "Revise os assuntos prioritarios com mais clareza nesta reta final.",
                "Mantenha seu checkout no fluxo atual, sem alterar autenticacao ou acesso.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-border-soft bg-white/[0.03] px-4 py-3 text-sm leading-6 text-muted"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="comparacao"
        className="border-y border-border-soft bg-surface/60 py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-pgm-yellow">
                Free vs Premium
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Compare o acesso gratuito com a experiencia completa.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted">
                O gratuito ajuda a conhecer a plataforma. O premium foi criado
                para preparar com profundidade.
              </p>
            </div>
            <Link
              href="#checkout"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-4 text-sm font-semibold text-background transition hover:bg-white"
            >
              Quero o premium
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 overflow-x-auto rounded-md border border-border-soft">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[1.1fr_0.9fr_0.9fr] bg-background text-sm font-semibold text-white">
                <div className="border-r border-border-soft p-4">Recurso</div>
                <div className="border-r border-border-soft p-4">Gratuito</div>
                <div className="bg-pgm-yellow/10 p-4 text-pgm-yellow">
                  Premium
                </div>
              </div>
              {comparisonRows.map(([feature, free, premium]) => (
                <div
                  key={feature}
                  className="grid grid-cols-[1.1fr_0.9fr_0.9fr] border-t border-border-soft text-sm"
                >
                  <div className="border-r border-border-soft bg-surface p-4 font-semibold text-white">
                    {feature}
                  </div>
                  <div className="border-r border-border-soft bg-surface p-4 text-muted">
                    {free}
                  </div>
                  <div className="bg-pgm-yellow/5 p-4 font-semibold text-white">
                    {premium}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            O que voce recebe
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Tudo que sustenta uma preparacao premium.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {premiumBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-md border border-border-soft bg-surface p-5"
              >
                <benefit.Icon
                  className="size-5 text-pgm-yellow"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
            <GraduationCap className="size-6 text-pgm-yellow" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">
              Estrutura para futuras historias reais
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              A area de avaliacoes esta pronta para receber depoimentos
              autorizados quando houver alunos reais. Nenhum depoimento foi
              inventado nesta etapa.
            </p>
            <Link
              href="/avaliacoes"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
            >
              Ver avaliacoes
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 sm:p-6">
            <ShieldCheck className="size-6 text-pgm-yellow" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">
              Posicionamento institucional
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {siteConfig.institutionalNotice}
            </p>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="border-t border-border-soft bg-surface/60 py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Duvidas antes de desbloquear o premium.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-md border border-border-soft bg-background p-5"
              >
                <HelpCircle className="size-5 text-pgm-yellow" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-white">
              Comece antes da pressao.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Preparacao antecipada cria repertorio, rotina e confianca sem
              depender de promessa falsa.
            </p>
          </div>
          <a
            href="#checkout"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
          >
            Quero continuar evoluindo
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
