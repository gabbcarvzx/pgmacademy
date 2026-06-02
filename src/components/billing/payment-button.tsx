"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

type PaymentButtonProps = {
  disabled?: boolean;
};

export function PaymentButton({ disabled = false }: PaymentButtonProps) {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/billing/asaas/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpfCnpj }),
      });
      const payload = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Nao foi possivel iniciar o pagamento.");
      }

      window.location.assign(payload.checkoutUrl);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Nao foi possivel iniciar o pagamento.",
      );
      setIsLoading(false);
    }
  }

  const normalizedCpfCnpj = cpfCnpj.replace(/\D/g, "");
  const isDocumentValid =
    normalizedCpfCnpj.length === 11 || normalizedCpfCnpj.length === 14;

  return (
    <div className="grid gap-3">
      <label className="grid gap-2" htmlFor="billing-document">
        <span className="text-sm font-medium text-white">
          CPF ou CNPJ do pagador
        </span>
        <input
          id="billing-document"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={cpfCnpj}
          onChange={(event) => setCpfCnpj(event.target.value)}
          placeholder="Somente numeros"
          className="h-12 w-full rounded-md border border-border-soft bg-surface px-3 text-sm text-white outline-none transition placeholder:text-muted/60 focus:border-pgm-yellow"
        />
      </label>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || isLoading || !isDocumentValid}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-pgm-yellow px-5 text-sm font-semibold text-background transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <CreditCard className="size-4" aria-hidden="true" />
        )}
        {isLoading ? "Abrindo pagamento" : "Comprar acesso premium"}
      </button>

      {errorMessage ? (
        <p className="text-sm leading-6 text-red-200">{errorMessage}</p>
      ) : null}
    </div>
  );
}
