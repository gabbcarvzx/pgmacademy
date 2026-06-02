import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CreditCard,
  DatabaseZap,
  FileCheck2,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { HeroVisual } from "@/components/marketing/hero-visual";
import { ModuleCard } from "@/components/marketing/module-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  architecturePillars,
  platformModules,
  siteConfig,
} from "@/lib/site-config";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <SiteHeader />

      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(8,102,216,0.22),transparent_30%),linear-gradient(240deg,rgba(231,56,61,0.18),transparent_35%)]" />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
          <div className="pb-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-border-soft bg-white/5 px-3 py-2 text-sm font-medium text-muted">
              <ShieldCheck className="size-4 text-pgm-green" aria-hidden="true" />
              {siteConfig.disclaimer}
            </div>

            <h1 className="mt-8 max-w-4xl text-balance text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
              PGM Academy
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Uma plataforma para transformar preparação em estratégia:
              diagnóstico, trilha de aprovação, simulados, IA e conteúdo
              premium para candidatos ao Ganhe o Mundo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/diagnostico"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                Conhecer diagnóstico
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href={siteConfig.editalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border-soft px-5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/8"
              >
                Edital oficial
                <FileCheck2 className="size-4" aria-hidden="true" />
              </a>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["Foco", "PGM 2026"],
                ["Acesso", siteConfig.price],
                ["Pagamento", "Asaas"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-border-soft bg-white/[0.04] p-4"
                >
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-white sm:text-base">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section
        id="diagnostico"
        className="border-y border-border-soft bg-surface/45 py-16 sm:py-20"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <SectionHeading
            eyebrow="Preparação guiada"
            title="O primeiro passo é saber onde o estudante está."
            description="A jornada começa com um diagnóstico claro de elegibilidade e segue para uma trilha de progresso alinhada às etapas do processo seletivo."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Diagnóstico guiado",
                description:
                  "Entrada de idade, série, frequência e médias escolares com resultado interpretável.",
                icon: BadgeCheck,
              },
              {
                title: "Trilha de aprovação",
                description:
                  "Etapas do processo seletivo organizadas como progresso claro para o aluno.",
                icon: Trophy,
              },
              {
                title: "IA no backend",
                description:
                  "Estrutura preparada para avaliação escrita, entrevistas e mentor especializado.",
                icon: Bot,
              },
              {
                title: "Pagamento único",
                description:
                  "Acesso premium planejado com pagamento via Asaas.",
                icon: CreditCard,
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-md border border-border-soft bg-background p-5"
              >
                <item.icon className="size-5 text-pgm-yellow" aria-hidden="true" />
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

      <section id="trilha" className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Módulos"
            title="Uma jornada completa para competir melhor."
            description="A plataforma organiza os principais pontos de preparação: requisitos, provas, escrita, entrevista, mentoria e conteúdo premium."
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

      <section id="ia" className="border-y border-border-soft bg-white/[0.03] py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-md border border-border-soft bg-surface p-6 sm:p-8">
            <DatabaseZap className="size-6 text-pgm-green" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-semibold text-white">
              Segurança e privacidade desde o primeiro acesso.
            </h2>
            <p className="mt-5 text-base leading-7 text-muted">
              A PGM Academy foi planejada para proteger dados do estudante,
              controlar acesso premium e crescer para turmas, escolas e
              parceiros sem comprometer isolamento.
            </p>
          </div>

          <div className="grid gap-3">
            {architecturePillars.map((pillar) => (
              <div
                key={pillar}
                className="flex items-center gap-3 rounded-md border border-border-soft bg-background px-4 py-4"
              >
                <ShieldCheck className="size-5 text-pgm-green" aria-hidden="true" />
                <span className="text-sm font-medium text-white">{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="premium" className="py-16 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeading
            eyebrow="Acesso premium"
            title="Entrada simples para começar a preparação."
            description="O pagamento único reduz fricção para o estudante e mantém a plataforma pronta para novos pacotes, turmas e mentorias no futuro."
          />

          <div className="rounded-md border border-border-soft bg-[linear-gradient(135deg,rgba(8,102,216,0.24),rgba(8,166,90,0.14),rgba(255,210,60,0.1))] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
              {siteConfig.paymentModel}
            </p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-semibold text-white">
                {siteConfig.price}
              </span>
              <span className="pb-2 text-sm text-muted">acesso inicial</span>
            </div>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              O acesso premium será liberado com controle financeiro, histórico
              de pagamento e bloqueio seguro quando necessário.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Diagnóstico", "Dashboard", "Trilha", "Premium"].map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-white/12 bg-background/60 px-3 py-2 text-sm font-medium text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
