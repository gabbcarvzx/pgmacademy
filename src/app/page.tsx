import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  FileCheck2,
  Globe2,
  GraduationCap,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ModuleCard } from "@/components/marketing/module-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SiteHeader } from "@/components/marketing/site-header";
import { platformModules, siteConfig } from "@/lib/site-config";

const heroImage =
  "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (18).jpeg";

const benefitCards = [
  {
    title: "Estude com direcao",
    description:
      "Materiais, trilhas e flashcards ajudam o aluno a sair do improviso e estudar com foco.",
    Icon: BookOpenCheck,
  },
  {
    title: "Treine como prova real",
    description:
      "Simulados autorais protegem o gabarito ate a finalizacao e mostram desempenho por categoria.",
    Icon: ListChecks,
  },
  {
    title: "Evolua com clareza",
    description:
      "Analytics, metas e recomendacoes baseadas em regras mostram onde reforcar antes da selecao.",
    Icon: BarChart3,
  },
  {
    title: "Prepare sua postura",
    description:
      "Subjetivas e entrevista psicossocial ajudam a treinar comunicacao, maturidade e responsabilidade.",
    Icon: MessageSquareText,
  },
];

const dreamSteps = [
  "Voce decide participar do Ganhe o Mundo.",
  "Voce estuda com a PGM Academy.",
  "Voce domina os conteudos essenciais.",
  "Voce chega mais preparado para a selecao.",
  "Voce se aproxima da experiencia internacional.",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[82vh] overflow-hidden">
        <Image
          src={heroImage}
          alt="Vista de cidade no Canada representando o sonho de estudar fora."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/72" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl py-12">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-background/45 px-3 py-2 text-sm font-medium text-white backdrop-blur">
              <ShieldCheck className="size-4 text-pgm-yellow" aria-hidden="true" />
              Plataforma independente de preparacao
            </div>

            <h1 className="mt-8 max-w-5xl text-balance text-4xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
              Prepare-se para conquistar sua vaga no Programa Ganhe o Mundo.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82 sm:text-xl">
              Materiais, simulados, trilhas de aprendizagem e preparacao
              completa para chegar com mais confianca em cada etapa do processo
              seletivo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                Comecar gratuitamente
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/planos"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-background/35 px-5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
              >
                Ver planos
                <Sparkles className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/70">
              Cada etapa do processo seletivo exige preparacao. Quanto antes
              voce comecar, mais preparado estara quando o edital abrir.
            </p>
          </div>
        </div>
      </section>

      <section id="plataforma" className="border-y border-border-soft bg-surface/60 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Produto educacional"
            title="A PGM Academy organiza o caminho entre sonho e preparacao."
            description="O aluno nao precisa estudar no escuro. A plataforma mostra conteudo, treino, feedback e progresso com controle premium seguro."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {benefitCards.map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-border-soft bg-background p-5"
              >
                <item.Icon className="size-5 text-pgm-yellow" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Modulos"
            title="Uma plataforma completa para o aluno competir melhor."
            description="O foco e preparacao vendavel e recorrente: conteudo autoral, progresso, simulados, feedback manual e analytics sem expor dados entre usuarios."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platformModules.map((module, index) => (
              <ModuleCard
                key={module.title}
                title={module.title}
                description={module.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border-soft bg-white/[0.03] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeading
            eyebrow="Jornada do sonho"
            title="Do primeiro interesse ao preparo para uma experiencia internacional."
            description="A comunicacao e emocional, mas a plataforma continua responsavel: prepara o aluno, nao promete vaga, destino ou embarque."
          />

          <div className="grid gap-3">
            {dreamSteps.map((step, index) => (
              <div
                key={step}
                className="grid grid-cols-[44px_1fr] gap-4 rounded-md border border-border-soft bg-background p-4"
              >
                <span className="flex size-11 items-center justify-center rounded-md bg-pgm-yellow text-sm font-semibold text-background">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{step}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {index === dreamSteps.length - 1
                      ? "Sempre com confirmacao no edital vigente e canais oficiais."
                      : "Uma etapa por vez, com foco e consistencia."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              Plano premium
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
              Poucos se preparam da forma correta. Voce pode comecar agora.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
              O premium desbloqueia simulados completos, trilhas completas,
              flashcards, subjetivas, entrevista psicossocial, feedback manual e
              analytics avancado.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planos"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                Quero me preparar agora
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/avaliacoes"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border-soft px-5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/8"
              >
                Ver estrutura de avaliacoes
                <Globe2 className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-6">
            <GraduationCap className="size-6 text-pgm-yellow" aria-hidden="true" />
            <p className="mt-5 text-sm font-semibold text-white">
              Aviso institucional
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {siteConfig.institutionalNotice}
            </p>
            <a
              href={siteConfig.editalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-soft px-4 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
            >
              Edital oficial
              <FileCheck2 className="size-4" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </section>

      <section className="border-t border-border-soft bg-surface/60 py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-white">
              Pronto para transformar vontade em rotina de preparacao?
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Crie sua conta, conheca o gratuito e desbloqueie o premium quando
              quiser acessar a experiencia completa.
            </p>
          </div>
          <Link
            href="/planos"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
          >
            Quero continuar evoluindo
            <CheckCircle2 className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
