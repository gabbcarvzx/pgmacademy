import { NextResponse } from "next/server";

import { AsaasApiError } from "@/lib/asaas/client";
import { createPremiumCheckout } from "@/lib/billing/asaas";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Usuario nao autenticado." },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      cpfCnpj?: string;
    } | null;
    const checkout = await createPremiumCheckout(user.id, {
      cpfCnpj: body?.cpfCnpj ?? "",
    });

    return NextResponse.json(checkout);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStatus = error instanceof AsaasApiError ? error.status : null;

    console.error(
      `asaas checkout failed name=${errorName} status=${errorStatus ?? "n/a"} message=${errorMessage}`,
    );

    const message =
      error instanceof AsaasApiError
        ? error.message
        : "Nao foi possivel iniciar o pagamento.";

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
