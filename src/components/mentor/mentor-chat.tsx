"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, Loader2, Send, UserRound } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Oi, eu sou o Mentor PGM. Posso te ajudar com requisitos do edital 2026, prova objetiva, subjetiva, entrevista psicossocial e planejamento para o intercâmbio. A PGM Academy é independente e não substitui os canais oficiais.",
  },
];

const quickPrompts = [
  "Estou elegível para o edital?",
  "Como devo estudar para a prova objetiva?",
  "Me ajude a treinar entrevista psicossocial.",
  "O que preciso confirmar nos canais oficiais?",
];

export function MentorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiMessages = useMemo(
    () =>
      messages
        .filter((message) => message.id !== "welcome")
        .map(({ role, content }) => ({ role, content })),
    [messages],
  );

  async function sendMessage(content: string) {
    const trimmedContent = content.trim();

    if (!trimmedContent || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedContent,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft("");
    setErrorMessage(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...apiMessages,
            { role: userMessage.role, content: userMessage.content },
          ],
        }),
      });
      const payload = (await response.json()) as {
        answer?: string;
        error?: string;
      };

      if (!response.ok || !payload.answer) {
        throw new Error(payload.error ?? "Não foi possível responder agora.");
      }

      const answer = payload.answer;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível responder agora.",
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  return (
    <div className="grid min-h-[calc(100vh-3rem)] grid-rows-[auto_1fr_auto] gap-4">
      <section className="rounded-md border border-border-soft bg-surface p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase text-pgm-yellow">
          Mentor PGM
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Tire dúvidas com um mentor especializado
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
          Use o chat para organizar sua preparação, revisar requisitos,
          praticar respostas e entender os próximos passos com base no edital
          autorizado.
        </p>
      </section>

      <section className="min-h-[420px] overflow-hidden rounded-md border border-border-soft bg-surface">
        <div className="flex h-full max-h-[58vh] min-h-[420px] flex-col gap-4 overflow-y-auto p-4 sm:p-5">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            const Icon = isAssistant ? Bot : UserRound;

            return (
              <article
                key={message.id}
                className={`flex gap-3 ${isAssistant ? "" : "justify-end"}`}
              >
                {isAssistant ? (
                  <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-pgm-yellow text-background">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                ) : null}

                <div
                  className={`max-w-[820px] rounded-md border px-4 py-3 ${
                    isAssistant
                      ? "border-border-soft bg-background text-muted"
                      : "border-pgm-yellow/40 bg-pgm-yellow text-background"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.content}
                  </p>
                </div>

                {!isAssistant ? (
                  <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-background">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
              </article>
            );
          })}

          {isSending ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Mentor PGM está pensando...
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-md border border-border-soft bg-surface p-4 sm:p-5">
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setDraft(prompt)}
              className="h-10 shrink-0 rounded-md border border-border-soft px-3 text-sm font-medium text-muted transition hover:border-white/35 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="mentor-message">
            Mensagem para o Mentor PGM
          </label>
          <textarea
            id="mentor-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            maxLength={1200}
            placeholder="Escreva sua dúvida..."
            className="min-h-24 w-full resize-none rounded-md border border-border-soft bg-background px-3 py-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:self-end"
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
            Enviar
          </button>
        </form>

        {errorMessage ? (
          <p className="mt-3 rounded-md border border-pgm-red/40 bg-pgm-red/10 px-3 py-2 text-sm text-pgm-red">
            {errorMessage}
          </p>
        ) : null}
      </section>
    </div>
  );
}
