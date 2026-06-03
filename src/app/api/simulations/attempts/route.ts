import { NextResponse } from "next/server";

import {
  getSimulationOverview,
  SimulationServiceError,
  startSimulationAttempt,
} from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type StartAttemptBody = {
  templateId?: unknown;
};

async function getAuthenticatedUser() {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 },
    );
  }

  try {
    const overview = await getSimulationOverview(user.id);

    return NextResponse.json({
      attempts: overview.attempts,
      historySummary: overview.historySummary,
    });
  } catch (error) {
    const status = error instanceof SimulationServiceError ? error.status : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível consultar tentativas.";

    console.error(`simulation attempts get failed status=${status} message=${message}`);

    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as StartAttemptBody | null;
  const templateId = typeof body?.templateId === "string" ? body.templateId : "";

  if (!templateId) {
    return NextResponse.json(
      { error: "Informe o modelo de simulado." },
      { status: 400 },
    );
  }

  try {
    const attempt = await startSimulationAttempt(user.id, templateId);

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    const status = error instanceof SimulationServiceError ? error.status : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível iniciar tentativa.";

    console.error(`simulation attempts post failed status=${status} message=${message}`);

    return NextResponse.json({ error: message }, { status });
  }
}
