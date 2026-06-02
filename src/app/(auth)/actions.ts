"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerSupabaseClient } from "@/lib/supabase/server";

const minimumPasswordLength = 8;

export async function signInWithPasswordAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const password = normalizeText(formData.get("password"));

  if (!email || !password) {
    redirect("/login?error=Informe%20email%20e%20senha.");
  }

  const supabase = await getServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=Credenciais%20invalidas%20ou%20usuario%20nao%20confirmado.");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpWithPasswordAction(formData: FormData) {
  const fullName = normalizeText(formData.get("fullName"));
  const email = normalizeEmail(formData.get("email"));
  const password = normalizeText(formData.get("password"));

  if (!fullName || !email || !password) {
    redirect("/cadastro?error=Preencha%20nome%2C%20email%20e%20senha.");
  }

  if (password.length < minimumPasswordLength) {
    redirect("/cadastro?error=A%20senha%20precisa%20ter%20pelo%20menos%208%20caracteres.");
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
    redirect("/cadastro?error=Nao%20foi%20possivel%20criar%20a%20conta%20agora.");
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/login?message=Cadastro%20criado.%20Verifique%20seu%20email%20ou%20entre%20com%20sua%20senha.");
}

function normalizeEmail(value: FormDataEntryValue | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function normalizeText(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}
