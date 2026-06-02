import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";

import { signUpWithPasswordAction } from "@/app/(auth)/actions";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Cadastro da PGM Academy por email e senha.",
};

type CadastroPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function CadastroPage({ searchParams }: CadastroPageProps) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para inicio
        </Link>

        <section className="mt-10 rounded-md border border-border-soft bg-surface p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pgm-yellow">
            PGM Academy
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Criar conta
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Cadastre-se com email e senha para salvar diagnosticos e acompanhar
            sua trilha.
          </p>

          {params.error ? (
            <p className="mt-5 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
              {params.error}
            </p>
          ) : null}

          <form action={signUpWithPasswordAction} className="mt-6 grid gap-4">
            <label className="grid gap-2" htmlFor="fullName">
              <span className="text-sm font-medium text-white">Nome</span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className={inputClassName}
                placeholder="Seu nome"
              />
            </label>

            <label className="grid gap-2" htmlFor="email">
              <span className="text-sm font-medium text-white">Email</span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClassName}
                placeholder="voce@email.com"
              />
            </label>

            <label className="grid gap-2" htmlFor="password">
              <span className="text-sm font-medium text-white">Senha</span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClassName}
                placeholder="Minimo de 8 caracteres"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
            >
              Criar conta
              <UserPlus className="size-4" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-5 text-sm leading-6 text-muted">
            Ja tem conta?{" "}
            <Link href="/login" className="font-semibold text-white">
              Entrar
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

const inputClassName =
  "h-12 w-full rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow";
