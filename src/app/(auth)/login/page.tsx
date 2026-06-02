import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LogIn } from "lucide-react";

import { signInWithPasswordAction } from "@/app/(auth)/actions";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Login da PGM Academy por email e senha.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
            Entrar na conta
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Use email e senha para acessar o dashboard e salvar seu diagnostico.
          </p>

          {params.error ? (
            <p className="mt-5 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-4 py-3 text-sm text-pgm-red">
              {params.error}
            </p>
          ) : null}

          {params.message ? (
            <p className="mt-5 rounded-md border border-pgm-green/40 bg-pgm-green/10 px-4 py-3 text-sm text-pgm-green">
              {params.message}
            </p>
          ) : null}

          <form action={signInWithPasswordAction} className="mt-6 grid gap-4">
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
                autoComplete="current-password"
                required
                className={inputClassName}
                placeholder="Sua senha"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white"
            >
              Entrar
              <LogIn className="size-4" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-5 text-sm leading-6 text-muted">
            Ainda nao tem conta?{" "}
            <Link href="/cadastro" className="font-semibold text-white">
              Criar cadastro
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

const inputClassName =
  "h-12 w-full rounded-md border border-border-soft bg-background px-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow";
