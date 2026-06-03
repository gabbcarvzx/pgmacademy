import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  GraduationCap,
  MessageSquareQuote,
  ShieldCheck,
  Star,
} from "lucide-react";

import { SiteHeader } from "@/components/marketing/site-header";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Avaliações",
  description:
    "Estrutura de prova social da PGM Academy para futuros depoimentos autorizados.",
};

const heroImage =
  "/images/canada/WhatsApp Image 2026-06-02 at 11.26.49 AM (20).jpeg";

const futureProofSlots = [
  {
    title: "Aluno premium",
    description:
      "Espaco reservado para relato autorizado de aluno que usou a plataforma.",
  },
  {
    title: "Família responsável",
    description:
      "Espaco reservado para percepcao de família sobre rotina e organização.",
  },
  {
    title: "Equipe pedagógica",
    description:
      "Espaco reservado para avaliação institucional interna, quando houver autorização.",
  },
];

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative min-h-[70vh] overflow-hidden">
        <Image
          src={heroImage}
          alt="Trilha no Canadá representando a jornada de preparação."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/72" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-background/45 px-3 py-2 text-sm font-medium text-white backdrop-blur">
              <MessageSquareQuote
                className="size-4 text-pgm-yellow"
                aria-hidden="true"
              />
              Prova social em construcao
            </div>
            <h1 className="mt-8 max-w-5xl text-balance text-4xl font-semibold text-white sm:text-6xl">
              Histórias reais precisam de alunos reais e autorização real.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82">
              Esta pagina prepara a estrutura de avaliações da PGM Academy sem
              inventar depoimentos. Quando houver relatos autorizados, eles
              poderao entrar aqui com revisão e consentimento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planos"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
              >
                Ver planos
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/cadastro"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-background/35 px-5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/50 hover:bg-white/10"
              >
                Começar gratuitamente
                <GraduationCap className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase text-pgm-yellow">
            Estrutura preparada
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Depoimentos so entram quando forem verificaveis.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
            Para preservar confiança comercial, nenhum resultado, historia ou
            frase de aluno será publicado sem autorização e revisão editorial.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {futureProofSlots.map((slot) => (
              <article
                key={slot.title}
                className="rounded-md border border-border-soft bg-surface p-5"
              >
                <Star className="size-5 text-pgm-yellow" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {slot.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {slot.description}
                </p>
                <p className="mt-5 inline-flex rounded-md border border-border-soft px-3 py-2 text-xs font-semibold text-muted">
                  Aguardando depoimento real
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border-soft bg-surface/60 py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-md border border-border-soft bg-background p-5 sm:p-6">
            <BadgeCheck className="size-6 text-pgm-yellow" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">
              Política de prova social
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Depoimentos futuros devem indicar consentimento, evitar promessas
              de aprovação garantida e separar resultado pessoal de regra
              oficial do programa.
            </p>
          </article>

          <article className="rounded-md border border-pgm-yellow/35 bg-pgm-yellow/10 p-5 sm:p-6">
            <ShieldCheck className="size-6 text-pgm-yellow" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-white">
              Aviso institucional
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {siteConfig.institutionalNotice}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
