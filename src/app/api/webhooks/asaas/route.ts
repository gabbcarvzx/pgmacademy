import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import { getAsaasWebhookToken } from "@/lib/asaas/config";
import { processAsaasWebhook } from "@/lib/billing/asaas";
import type { AsaasWebhookPayload } from "@/lib/asaas/types";

export const runtime = "nodejs";

function timingSafeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: NextRequest) {
  const expectedToken = getAsaasWebhookToken();
  const receivedToken = request.headers.get("asaas-access-token");

  if (!receivedToken || !timingSafeCompare(receivedToken, expectedToken)) {
    return NextResponse.json(
      { error: "Token de webhook inválido." },
      { status: 401 },
    );
  }

  const rawBody = await request.text();
  let payload: AsaasWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as AsaasWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: "Payload JSON inválido." },
      { status: 400 },
    );
  }

  try {
    const result = await processAsaasWebhook(payload, rawBody);

    return NextResponse.json({
      received: true,
      ...result,
    });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível processar o webhook." },
      { status: 500 },
    );
  }
}
