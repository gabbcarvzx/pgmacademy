import { createHash } from "node:crypto";

import { getAsaasConfig } from "@/lib/asaas/config";
import {
  createAsaasCustomer,
  createAsaasPayment,
  updateAsaasCustomer,
} from "@/lib/asaas/client";
import type { AsaasPayment, AsaasWebhookPayload } from "@/lib/asaas/types";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database, Json } from "@/types/database";

const PRODUCT_NAME = "Acesso Premium Passaporte PGM";
const PRODUCT_PRICE_CENTS = 2990;
const PRODUCT_PRICE_REAIS = PRODUCT_PRICE_CENTS / 100;
const PRODUCT_CURRENCY = "BRL";
const DEFAULT_DUE_DAYS = 3;

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];

type CheckoutResult = {
  alreadyPaid: boolean;
  checkoutUrl: string;
  reusedPendingPayment: boolean;
  subscriptionId: string | null;
};

type CreatePremiumCheckoutInput = {
  cpfCnpj: string;
};

const payableStatuses = new Set(["pending", "overdue"]);
const premiumEvents = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);
const refundedEvents = new Set(["PAYMENT_REFUNDED"]);
const overdueEvents = new Set(["PAYMENT_OVERDUE"]);
const blockedEvents = new Set(["PAYMENT_DELETED"]);
const pendingEvents = new Set([
  "PAYMENT_CREATED",
  "PAYMENT_UPDATED",
  "PAYMENT_CREDIT_CARD_CAPTURE_REFUSED",
]);

function getPaymentDueDate() {
  const dueDays = Number(process.env.ASAAS_PAYMENT_DUE_DAYS ?? DEFAULT_DUE_DAYS);
  const safeDueDays = Number.isFinite(dueDays) && dueDays >= 0 ? dueDays : 3;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + safeDueDays);

  return dueDate.toISOString().slice(0, 10);
}

function getDashboardUrl() {
  const { appUrl } = getAsaasConfig();
  return `${appUrl.replace(/\/$/, "")}/dashboard`;
}

function getCheckoutUrlFromMetadata(metadata: Json) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return null;
  }

  const url = metadata.asaas_invoice_url;
  return typeof url === "string" && url.length > 0 ? url : null;
}

function mergeMetadata(
  currentMetadata: Json,
  nextMetadata: Record<string, Json>,
) {
  return {
    ...(currentMetadata &&
    typeof currentMetadata === "object" &&
    !Array.isArray(currentMetadata)
      ? currentMetadata
      : {}),
    ...nextMetadata,
  } satisfies Json;
}

function getCustomerName(profile: Pick<ProfileRow, "full_name" | "email">) {
  return profile.full_name || profile.email || "Aluno PGM Academy";
}

function normalizeCpfCnpj(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 11 && digits.length !== 14) {
    throw new Error("Informe um CPF ou CNPJ válido para o pagamento.");
  }

  return digits;
}

function getPaidAt(payment: AsaasPayment) {
  const paymentDate =
    payment.paymentDate ?? payment.confirmedDate ?? payment.dateCreated;

  if (!paymentDate) {
    return new Date().toISOString();
  }

  return new Date(paymentDate).toISOString();
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stableStringify(
          (value as Record<string, unknown>)[key],
        )}`,
    )
    .join(",")}}`;
}

function buildFallbackEventId(payload: AsaasWebhookPayload, rawBody: string) {
  const hash = createHash("sha256")
    .update(rawBody || stableStringify(payload))
    .digest("hex");

  return `asaas_${hash}`;
}

export async function createPremiumCheckout(
  userId: string,
  input: CreatePremiumCheckoutInput,
): Promise<CheckoutResult> {
  const admin = getSupabaseAdminClient();
  const dashboardUrl = getDashboardUrl();
  const cpfCnpj = normalizeCpfCnpj(input.cpfCnpj);

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, tenant_id, full_name, email, access_status")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error("Perfil do usuário não encontrado para iniciar pagamento.");
  }

  if (profile.access_status === "paid") {
    return {
      alreadyPaid: true,
      checkoutUrl: dashboardUrl,
      reusedPendingPayment: false,
      subscriptionId: null,
    };
  }

  const { data: existingSubscriptions, error: subscriptionError } = await admin
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "asaas")
    .order("created_at", { ascending: false })
    .limit(5);

  if (subscriptionError) {
    throw new Error("Não foi possível consultar assinaturas existentes.");
  }

  const existingPaidSubscription = existingSubscriptions?.find(
    (subscription) => subscription.status === "paid",
  );

  if (existingPaidSubscription) {
    await admin
      .from("profiles")
      .update({ access_status: "paid" })
      .eq("id", userId);

    return {
      alreadyPaid: true,
      checkoutUrl: dashboardUrl,
      reusedPendingPayment: false,
      subscriptionId: existingPaidSubscription.id,
    };
  }

  const reusablePendingSubscription = existingSubscriptions?.find(
    (subscription) =>
      payableStatuses.has(subscription.status) &&
      getCheckoutUrlFromMetadata(subscription.metadata),
  );

  if (reusablePendingSubscription) {
    return {
      alreadyPaid: false,
      checkoutUrl: getCheckoutUrlFromMetadata(
        reusablePendingSubscription.metadata,
      ) as string,
      reusedPendingPayment: true,
      subscriptionId: reusablePendingSubscription.id,
    };
  }

  const reusableCustomerId = existingSubscriptions?.find(
    (subscription) => subscription.provider_customer_id,
  )?.provider_customer_id;

  const customer = reusableCustomerId
    ? await updateAsaasCustomer(reusableCustomerId, {
        name: getCustomerName(profile),
        email: profile.email ?? undefined,
        cpfCnpj,
        externalReference: profile.id,
      })
    : await createAsaasCustomer({
        name: getCustomerName(profile),
        email: profile.email ?? undefined,
        cpfCnpj,
        externalReference: profile.id,
      });

  const { data: subscription, error: createSubscriptionError } = await admin
    .from("subscriptions")
    .insert({
      tenant_id: profile.tenant_id,
      user_id: userId,
      provider: "asaas",
      status: "pending",
      access_model: "one_time",
      price_cents: PRODUCT_PRICE_CENTS,
      currency: PRODUCT_CURRENCY,
      provider_customer_id: customer.id,
      metadata: {
        product_name: PRODUCT_NAME,
        checkout_status: "creating",
        checkout_started_at: new Date().toISOString(),
      },
    })
    .select("*")
    .single();

  if (createSubscriptionError || !subscription) {
    throw new Error("Não foi possível registrar a assinatura pendente.");
  }

  const payment = await createAsaasPayment({
    customer: customer.id,
    billingType: "UNDEFINED",
    value: PRODUCT_PRICE_REAIS,
    dueDate: getPaymentDueDate(),
    description: PRODUCT_NAME,
    externalReference: subscription.id,
  });

  if (!payment.invoiceUrl) {
    throw new Error("O Asaas não retornou uma URL de pagamento.");
  }

  const updatedMetadata = mergeMetadata(subscription.metadata, {
    asaas_billing_type: payment.billingType,
    asaas_due_date: payment.dueDate,
    asaas_invoice_url: payment.invoiceUrl,
    asaas_payment_status: payment.status,
    checkout_status: "created",
    checkout_created_at: new Date().toISOString(),
    product_currency: PRODUCT_CURRENCY,
    product_name: PRODUCT_NAME,
    product_price_cents: PRODUCT_PRICE_CENTS,
  });

  await admin
    .from("subscriptions")
    .update({
      provider_payment_id: payment.id,
      metadata: updatedMetadata,
    })
    .eq("id", subscription.id);

  return {
    alreadyPaid: false,
    checkoutUrl: payment.invoiceUrl,
    reusedPendingPayment: false,
    subscriptionId: subscription.id,
  };
}

export async function processAsaasWebhook(
  payload: AsaasWebhookPayload,
  rawBody: string,
) {
  const admin = getSupabaseAdminClient();
  const eventType = payload.event ?? "UNKNOWN";
  const payment = payload.payment;
  const eventId = payload.id ?? buildFallbackEventId(payload, rawBody);
  const providerPaymentId = payment?.id ?? null;
  const externalReference = payment?.externalReference ?? null;

  let subscription: SubscriptionRow | null = null;

  if (providerPaymentId) {
    const { data } = await admin
      .from("subscriptions")
      .select("*")
      .eq("provider", "asaas")
      .eq("provider_payment_id", providerPaymentId)
      .maybeSingle();
    subscription = data;
  }

  if (!subscription && externalReference) {
    const { data } = await admin
      .from("subscriptions")
      .select("*")
      .eq("provider", "asaas")
      .eq("id", externalReference)
      .maybeSingle();
    subscription = data;
  }

  const { data: eventRecord, error: eventInsertError } = await admin
    .from("payment_events")
    .insert({
      tenant_id: subscription?.tenant_id ?? null,
      subscription_id: subscription?.id ?? null,
      provider: "asaas",
      event_id: eventId,
      event_type: eventType,
      provider_payment_id: providerPaymentId,
      processing_status: subscription ? "received" : "ignored",
      payload: payload as Json,
    })
    .select("id")
    .single();

  if (eventInsertError) {
    if (eventInsertError.code === "23505") {
      return {
        duplicate: true,
        eventId,
        eventType,
        processed: false,
      };
    }

    throw eventInsertError;
  }

  if (!eventRecord) {
    throw new Error("Não foi possível registrar o evento financeiro.");
  }

  if (!subscription || !payment) {
    return {
      duplicate: false,
      eventId,
      eventType,
      processed: false,
    };
  }

  const metadata = mergeMetadata(subscription.metadata, {
    asaas_billing_type: payment.billingType,
    asaas_due_date: payment.dueDate,
    asaas_invoice_url: payment.invoiceUrl ?? null,
    asaas_payment_status: payment.status,
    last_asaas_event: eventType,
    last_asaas_event_at: payload.dateCreated ?? new Date().toISOString(),
  });

  if (premiumEvents.has(eventType)) {
    await admin
      .from("subscriptions")
      .update({
        status: "paid",
        provider_payment_id: payment.id,
        paid_at: getPaidAt(payment),
        metadata,
      })
      .eq("id", subscription.id);

    await admin
      .from("profiles")
      .update({ access_status: "paid" })
      .eq("id", subscription.user_id);
  } else if (refundedEvents.has(eventType)) {
    await admin
      .from("subscriptions")
      .update({
        status: "refunded",
        provider_payment_id: payment.id,
        metadata,
      })
      .eq("id", subscription.id);

    await admin
      .from("profiles")
      .update({ access_status: "refunded" })
      .eq("id", subscription.user_id);
  } else if (overdueEvents.has(eventType)) {
    await admin
      .from("subscriptions")
      .update({
        status: "overdue",
        provider_payment_id: payment.id,
        metadata,
      })
      .eq("id", subscription.id);
  } else if (blockedEvents.has(eventType)) {
    await admin
      .from("subscriptions")
      .update({
        status: "blocked",
        provider_payment_id: payment.id,
        metadata,
      })
      .eq("id", subscription.id);
  } else if (pendingEvents.has(eventType)) {
    await admin
      .from("subscriptions")
      .update({
        status: subscription.status === "paid" ? "paid" : "pending",
        provider_payment_id: payment.id,
        metadata,
      })
      .eq("id", subscription.id);
  }

  await admin
    .from("payment_events")
    .update({
      processing_status: "processed",
      processed_at: new Date().toISOString(),
    })
    .eq("id", eventRecord.id);

  return {
    duplicate: false,
    eventId,
    eventType,
    processed: true,
  };
}
