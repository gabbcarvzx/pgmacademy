import { NextResponse } from "next/server";

import {
  getSimulationOverview,
  SimulationServiceError,
} from "@/lib/simulations/service";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
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
    const overview = await getSimulationOverview(user.id);

    return NextResponse.json({
      accessStatus: overview.accessStatus,
      hasPaidAccess: overview.hasPaidAccess,
      schema: overview.schema,
      templates: overview.templates,
    });
  } catch (error) {
    const status = error instanceof SimulationServiceError ? error.status : 500;
    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel listar simulados.";

    console.error(`simulation templates failed status=${status} message=${message}`);

    return NextResponse.json({ error: message }, { status });
  }
}
