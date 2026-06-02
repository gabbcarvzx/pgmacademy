export type AsaasEnvironment = "sandbox" | "production";

export type AsaasBillingType =
  | "UNDEFINED"
  | "BOLETO"
  | "CREDIT_CARD"
  | "PIX";

export type AsaasCustomer = {
  object?: "customer";
  id: string;
  name: string;
  email?: string;
  externalReference?: string;
};

export type AsaasPayment = {
  object?: "payment";
  id: string;
  customer: string;
  billingType: AsaasBillingType;
  status: string;
  value: number;
  netValue?: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  transactionReceiptUrl?: string;
  dateCreated?: string;
  paymentDate?: string;
  confirmedDate?: string;
  deleted?: boolean;
};

export type AsaasWebhookPayload = {
  id?: string;
  event?: string;
  dateCreated?: string;
  payment?: AsaasPayment;
  [key: string]: unknown;
};

export type CreateAsaasCustomerInput = {
  name: string;
  email?: string;
  cpfCnpj: string;
  externalReference?: string;
};

export type UpdateAsaasCustomerInput = {
  name?: string;
  email?: string;
  cpfCnpj?: string;
  externalReference?: string;
};

export type CreateAsaasPaymentInput = {
  customer: string;
  billingType: AsaasBillingType;
  value: number;
  dueDate: string;
  description: string;
  externalReference: string;
};
