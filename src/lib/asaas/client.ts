import { getAsaasConfig } from "@/lib/asaas/config";
import type {
  AsaasCustomer,
  AsaasPayment,
  CreateAsaasCustomerInput,
  CreateAsaasPaymentInput,
  UpdateAsaasCustomerInput,
} from "@/lib/asaas/types";

type AsaasErrorBody = {
  errors?: Array<{
    code?: string;
    description?: string;
  }>;
};

export class AsaasApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const description =
      typeof body === "object" &&
      body !== null &&
      "errors" in body &&
      Array.isArray((body as AsaasErrorBody).errors)
        ? (body as AsaasErrorBody).errors
            ?.map((error) => error.description)
            .filter(Boolean)
            .join(" ")
        : null;

    super(description || `Asaas API returned HTTP ${status}.`);
    this.name = "AsaasApiError";
    this.status = status;
    this.body = body;
  }
}

async function asaasRequest<T>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown },
) {
  const config = getAsaasConfig();
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "PGM Academy/1.0",
      access_token: config.apiKey,
      ...init.headers,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });

  const responseText = await response.text();
  const body = responseText ? JSON.parse(responseText) : null;

  if (!response.ok) {
    throw new AsaasApiError(response.status, body);
  }

  return body as T;
}

export async function createAsaasCustomer(input: CreateAsaasCustomerInput) {
  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: input,
  });
}

export async function updateAsaasCustomer(
  customerId: string,
  input: UpdateAsaasCustomerInput,
) {
  return asaasRequest<AsaasCustomer>(`/customers/${customerId}`, {
    method: "PUT",
    body: input,
  });
}

export async function createAsaasPayment(input: CreateAsaasPaymentInput) {
  return asaasRequest<AsaasPayment>("/payments", {
    method: "POST",
    body: input,
  });
}
