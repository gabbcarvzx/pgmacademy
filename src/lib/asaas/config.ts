import type { AsaasEnvironment } from "@/lib/asaas/types";

const DEFAULT_SANDBOX_BASE_URL = "https://api-sandbox.asaas.com/v3";
const DEFAULT_PRODUCTION_BASE_URL = "https://api.asaas.com/v3";

export type AsaasConfig = {
  apiBaseUrl: string;
  apiKey: string;
  appUrl: string;
  environment: AsaasEnvironment;
  webhookToken: string;
};

export function getAsaasEnvironment(): AsaasEnvironment {
  return process.env.ASAAS_ENVIRONMENT === "production"
    ? "production"
    : "sandbox";
}

export function getAsaasWebhookToken() {
  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!webhookToken) {
    throw new Error("Missing ASAAS_WEBHOOK_TOKEN.");
  }

  return webhookToken;
}

export function getAsaasConfig(): AsaasConfig {
  const apiKey = process.env.ASAAS_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const environment = getAsaasEnvironment();
  const apiBaseUrl =
    process.env.ASAAS_API_BASE_URL ??
    (environment === "production"
      ? DEFAULT_PRODUCTION_BASE_URL
      : DEFAULT_SANDBOX_BASE_URL);

  if (!apiKey) {
    throw new Error("Missing ASAAS_API_KEY.");
  }

  if (!appUrl) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL.");
  }

  return {
    apiBaseUrl,
    apiKey,
    appUrl,
    environment,
    webhookToken: getAsaasWebhookToken(),
  };
}
