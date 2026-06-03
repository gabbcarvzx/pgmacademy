"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";

const minimumPasswordLength = 8;

export async function signInWithPasswordAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = normalizeText(formData.get("password"));

  if (!email || !password) {
    redirect(withMessage("/login", "error", "Informe email e senha."));
  }

  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      withMessage(
        "/login",
        "error",
        "Credenciais inválidas ou usuário não confirmado.",
      ),
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpWithPasswordAction(formData: FormData) {
  const fullName = normalizeText(formData.get("fullName"));
  const email = normalizeEmail(formData.get("email"));
  const password = normalizeText(formData.get("password"));

  if (!fullName || !email || !password) {
    redirect(withMessage("/cadastro", "error", "Preencha nome, email e senha."));
  }

  if (password.length < minimumPasswordLength) {
    redirect(
      withMessage(
        "/cadastro",
        "error",
        "A senha precisa ter pelo menos 8 caracteres.",
      ),
    );
  }

  const supabase = await getServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(
      withMessage(
        "/cadastro",
        "error",
        "Não foi possível criar a conta agora.",
      ),
    );
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/dashboard");
  }

  redirect(
    withMessage(
      "/login",
      "message",
      "Cadastro criado. Verifique seu email ou entre com sua senha.",
    ),
  );
}

function normalizeEmail(value: FormDataEntryValue | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function normalizeText(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

function withMessage(path: string, key: "error" | "message", message: string) {
  return `${path}?${key}=${encodeURIComponent(message)}`;
}
