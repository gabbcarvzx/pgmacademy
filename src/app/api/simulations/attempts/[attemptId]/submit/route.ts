import { NextResponse } from "next/server";

import {
  SimulationServiceError,
  submitSimulationAttempt,
} from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type SubmitAttemptBody = {
  selectedOptions?: unknown;
};

type RouteContext = {
  params: Promise<{
    attemptId: string;
  }>;
};

function normalizeSelectedOptions(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const questionId =
        typeof record.questionId === "string" ? record.questionId : "";
      const selectedOptionId =
        typeof record.selectedOptionId === "string"
          ? record.selectedOptionId
          : null;

      if (!questionId) {
        return null;
      }

      return {
        questionId,
        selectedOptionId,
      };
    })
    .filter(
      (
        item,
      ): item is { questionId: string; selectedOptionId: string | null } =>
        Boolean(item),
    );
}

export async function POST(request: Request, context: RouteContext) {
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

  const { attemptId } = await context.params;
  const body = (await request.json().catch(() => null)) as SubmitAttemptBody | null;

  try {
    const result = await submitSimulationAttempt(user.id, attemptId, {
      selectedOptions: normalizeSelectedOptions(body?.selectedOptions),
    });

    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof SimulationServiceError ? error.status : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel corrigir a tentativa.";

    console.error(`simulation submit failed status=${status} message=${message}`);

    return NextResponse.json({ error: message }, { status });
  }
}
