import { NextResponse } from "next/server";

import { hasPremiumAccess } from "@/lib/access/premium";
import { buildMentorSystemPrompt } from "@/lib/mentor/system-prompt";
import { getOpenAIConfig } from "@/lib/openai/config";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type MentorMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const maxMessageLength = 1200;
const maxHistoryMessages = 8;
const rateLimitWindowMs = 60_000;
const maxRequestsPerWindow = 8;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function normalizeMessage(value: unknown): MentorMessage | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const role = record.role;
  const content = String(record.content ?? "").trim();

  if ((role !== "user" && role !== "assistant") || !content) {
    return null;
  }

  return {
    role,
    content: content.slice(0, maxMessageLength),
  };
}

function applyRateLimit(userId: string) {
  const now = Date.now();
  const bucket = requestBuckets.get(userId);

  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(userId, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return true;
  }

  if (bucket.count >= maxRequestsPerWindow) {
    return false;
  }

  bucket.count += 1;
  return true;
}

function extractText(response: OpenAIResponse) {
  if (response.output_text) {
    return response.output_text.trim();
  }

  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && content.text)
    .map((content) => content.text)
    .join("\n")
    .trim();

  return text || null;
}

function buildConversationTranscript(messages: MentorMessage[]) {
  return messages
    .map((message) => {
      const speaker = message.role === "user" ? "Aluno" : "Mentor PGM";
      return `${speaker}: ${message.content}`;
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  const supabase = await getServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("access_status, role")
    .eq("id", user.id)
    .single();

  if (!hasPremiumAccess(profile)) {
    return NextResponse.json(
      { error: "O Mentor PGM está disponível apenas para usuários premium." },
      { status: 403 },
    );
  }

  if (!applyRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Limite temporário atingido. Tente novamente em instantes." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    messages?: unknown[];
  } | null;
  const messages =
    body?.messages
      ?.map(normalizeMessage)
      .filter((message): message is MentorMessage => Boolean(message))
      .slice(-maxHistoryMessages) ?? [];
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");

  if (!lastUserMessage) {
    return NextResponse.json(
      { error: "Envie uma pergunta para o Mentor PGM." },
      { status: 400 },
    );
  }

  try {
    const { apiKey, model } = getOpenAIConfig();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions: buildMentorSystemPrompt(),
        input: `Conversa atual:\n\n${buildConversationTranscript(messages)}\n\nResponda à última mensagem do aluno.`,
        max_output_tokens: 700,
        temperature: 0.4,
      }),
    });

    const payload = (await response.json()) as OpenAIResponse & {
      error?: { message?: string };
    };

    if (!response.ok) {
      console.error(
        `mentor openai failed status=${response.status} message=${payload.error?.message ?? "unknown"}`,
      );
      return NextResponse.json(
        { error: "Não foi possível responder agora." },
        { status: 502 },
      );
    }

    const answer = extractText(payload);

    if (!answer) {
      return NextResponse.json(
        { error: "O Mentor PGM não retornou uma resposta válida." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error(
      `mentor route failed message=${error instanceof Error ? error.message : "unknown"}`,
    );
    return NextResponse.json(
      { error: "Não foi possível responder agora." },
      { status: 500 },
    );
  }
}
