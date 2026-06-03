import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CheckCircle2,
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
import { SiteHeader } from "@/components/marketing/site-header";
import {
  hasPremiumAccess,
  type PremiumAccessProfile,
} from "@/lib/access/premium";
import { siteConfig } from "@/lib/site-config";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Planos Premium",
  description:
    "Planos da PGM Academy para preparação independente do Programa Ganhe o Mundo.",
};

const heroImage =
  "/images/canada/WhatsApp Image 2026-06-02 at 11.26.50 AM.jpeg";

const premiumBenefits = [
  {
    title: "Materiais exclusivos",
    description: "Conteúdos autorais organizados por idioma, categoria e nível.",
    Icon: BookOpenCheck,
  },
  {
    title: "Simulados realistas",
    description: "Templates completos com correção automática e desempenho por categoria.",
    Icon: Target,
  },
  {
    title: "Flashcards inteligentes",
    description: "Revisão rápida por frente e verso para fixar vocabulário e conceitos.",
    Icon: Brain,
  },
  {
    title: "Questões subjetivas",
    description: "Treino de escrita com envio premium para feedback manual.",
    Icon: FileText,
  },
  {
    title: "Entrevista psicossocial",
    description: "Perguntas autorais para maturidade, adaptação cultural e responsabilidade.",
    Icon: MessageSquareText,
  },
  {
    title: "Analytics avançado",
    description: "Metas, evolução, streak e recomendações baseadas em regras.",
    Icon: BarChart3,
  },
  {
    title: "Plano de evolução",
    description: "Trilhas completas para conectar estudo, revisão, simulados e feedback.",
    Icon: Trophy,
  },
];

const comparisonRows = [
  ["Materiais de estudo", "Limitado", "Completo"],
  ["Flashcards", "Alguns conjuntos", "Ilimitado"],
  ["Trilhas", "Visualização parcial", "Sequência completa"],
  ["Simulados", "Bloqueados ou limitados", "Completos"],
  ["Correção detalhada", "Não disponível", "Disponível"],
  ["Subjetivas", "Visualiza sem enviar", "Envio e feedback manual"],
  ["Entrevista psicossocial", "Visualiza sem enviar", "Treino com feedback"],
  ["Analytics", "Resumo", "Diagnóstico completo"],
];

const journeySteps = [
  "Você decide participar do Ganhe o Mundo.",
  "Você estuda com a PGM Academy.",
  "Você domina os conteúdos.",
  "Você chega preparado para a seleção.",
  "Você vive seu intercâmbio internacional, se for convocado oficialmente.",
];

const faqItems = [
  {
    question: "Como funciona a plataforma?",
    answer:
      "Você cria uma conta, acessa conteúdos gratuitos e pode desbloquear o premium para estudar com materiais, flashcards, simulados, trilhas, subjetivas, entrevista e analytics.",
  },
  {
    question: "A PGM Academy tem vínculo com o Governo?",
    answer:
      "Não. A plataforma é independente de preparação e não substitui o Governo de Pernambuco, o Programa Ganhe o Mundo, editais ou canais oficiais.",
  },
  {
    question: "O conteúdo segue os editais?",
    answer:
      "O conteúdo autoral usa editais anteriores como referência de estrutura, habilidades e etapas, mas regras vigentes devem ser confirmadas sempre nos canais oficiais.",
  },
  {
    question: "O Premium vale a pena?",
    answer:
      "O premium concentra a experiência completa: simulados, trilhas, materiais, flashcards, feedback manual, entrevista e analytics. Ele foi pensado para quem quer estudar com rotina e clareza.",
  },
  {
    question: "Como funciona a assinatura?",
    answer:
      "Nesta fase, o produto usa pagamento único processado pelo Asaas. A liberação premium acontece após confirmação de pagamento.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Políticas financeiras devem seguir os termos do checkout, do meio de pagamento e da PGM Academy. Em caso de dúvida, confira os canais de atendimento antes de comprar.",
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

  const accessStatus = (profile?.access_status ?? null) as AccessStatus | null;
  const isPaid = hasPremiumAccess(profile);
  const isBlocked = accessStatus === "blocked";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[82vh] overflow-hidden">
        <Image
          src={heroImage}
          alt="Escola no Canadá representando uma experiência internacional de estudo."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/74" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl py-12">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-background/45 px-3 py-2 text-sm font-medium text-white backdrop-blur">
              <Sparkles className="size-4 text-pgm-yellow" aria-hidden="true" />
              Acesso premium PGM Academy
            </div>

            <h1 className="mt-8 max-w-5xl text-balance text-4xl font-semibold text-white sm:text-6xl lg:text-7xl">
              Seu sonho sempre foi estudar no exterior?
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82 sm:text-xl">
              Imagine embarcar para outro país, conhecer uma nova cultura,
              desenvolver seu idioma e viver uma experiência que pode
              transformar sua vida. A PGM Academy ajuda você a chegar preparado
              para cada etapa da seleção.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#checkout"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                Quero me preparar agora
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
              Todos os anos milhares de estudantes sonham com uma vaga. Poucos
              constroem uma rotina de preparação antes da pressão chegar.
            </p>
          </div>
        </div>
      </section>

      <section id="checkout" className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_390px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Conversão premium
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
              O Premium não é apenas mais conteúdo. É uma rotina completa de
              preparação.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
              Acesso aos recursos que aumentam clareza, consistência e
              confiança: simulados, materiais, trilhas, revisão, feedback
              manual e analytics de evolução.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Simulados completos", "Feedback manual", "Analytics premium"].map(
                (item) => (
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
                ),
              )}
            </div>
          </div>

          <aside className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Plano Premium
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-semibold text-white">
                {siteConfig.price}
              </span>
              <span className="pb-2 text-sm text-muted">pagamento único</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              Processamento pelo Asaas. Liberação automática após confirmação
              do pagamento quando a conta estiver autenticada.
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
                    Seu acesso completo já está liberado.
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
                  label="Desbloquear acesso premium"
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
                    Já tenho conta
                    <LockKeyhole className="size-4" aria-hidden="true" />
                  </Link>
                  <p className="text-xs leading-5 text-muted">
                    Crie ou entre na conta antes de iniciar o pagamento para que
                    o premium seja vinculado ao seu usuário.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section id="comparacao" className="border-y border-border-soft bg-surface/60 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-pgm-yellow">
                Free vs Premium
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Compare o acesso gratuito com a experiência completa.
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
                <div className="bg-pgm-yellow/10 p-4 text-pgm-yellow">Premium</div>
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
            O que você recebe
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Tudo que sustenta uma preparação premium.
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

      <section className="border-y border-border-soft bg-white/[0.03] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              Jornada do sonho
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              A preparação conecta o hoje ao intercâmbio que você deseja viver.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted">
              Não existe promessa de vaga. Existe uma rotina melhor para chegar
              competitivo, consciente e pronto para cada fase.
            </p>
          </div>

          <div className="grid gap-3">
            {journeySteps.map((step, index) => (
              <div
                key={step}
                className="grid grid-cols-[44px_1fr] gap-4 rounded-md border border-border-soft bg-background p-4"
              >
                <span className="flex size-11 items-center justify-center rounded-md bg-pgm-yellow text-sm font-semibold text-background">
                  {index + 1}
                </span>
                <p className="self-center text-sm font-semibold text-white">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
            <GraduationCap className="size-6 text-pgm-yellow" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">
              Estrutura para futuras histórias reais
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              A área de avaliações está pronta para receber depoimentos
              autorizados quando houver alunos reais. Nenhum depoimento foi
              inventado nesta etapa.
            </p>
            <Link
              href="/avaliacoes"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
            >
              Ver avaliações
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

      <section id="faq" className="border-t border-border-soft bg-surface/60 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-pgm-yellow">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Dúvidas antes de desbloquear o premium.
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
              Comece antes da pressão.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Preparação antecipada cria repertório, rotina e confiança sem
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
