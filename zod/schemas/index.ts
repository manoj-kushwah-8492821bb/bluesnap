import { z } from "zod";

// ---------------- Plan schema to validate --------------- //
export const planCreateSchema = z.object({
  body: z.object({
    chargeFrequency: z.string({
      required_error: "Charge frequency is required.",
      invalid_type_error: "Charge frequency must be a string",
    }),
    name: z.string({
      required_error: "Plan name is required.",
      invalid_type_error: "Plan name must be a string",
    }),
    currency: z.string({
      required_error: "Currency is required.",
      invalid_type_error: "Currency must be a string",
    }),
    recurringChargeAmount: z.number({
      required_error: "Recurring Charge Amount is required",
      invalid_type_error: "Recurring Charge Amount must be a number",
    }),
  }),
});

export const planSpecificSchema = z.object({
  params: z.object({
    planId: z.string({
      required_error: "plan id is required",
      invalid_type_error: "plan id must be a string.",
    }),
  }),
});

// ---------------- Subscripton schema to validate --------------- //
const payerInfoSchema = z.object({
  firstName: z.string({
    required_error: "first name is required",
    invalid_type_error: "first name must be a string.",
  }),
  lastName: z.string({
    required_error: "last name is required",
    invalid_type_error: "last name must be a string.",
  }),
});

const creditCardSchema = z.object({
  expirationYear: z.number({
    required_error: "expiration year is required",
    invalid_type_error: "expiration year must be a number.",
  }),
  securityCode: z.number({
    required_error: "security code is required",
    invalid_type_error: "security code must be a number.",
  }),
  expirationMonth: z.number({
    required_error: "expiration month is required",
    invalid_type_error: "expiration month must be a number.",
  }),
  cardNumber: z.number({
    required_error: "card number is required",
    invalid_type_error: "card number must be a number.",
  }),
});

const paymentSourceSchema = z.object({
  creditCardInfo: z.object({
    creditCard: creditCardSchema,
  }),
});

export const subscriptonCreateSchema = z.object({
  body: z.object({
    payerInfo: payerInfoSchema,
    paymentSource: paymentSourceSchema,
  }),
  params: z.object({
    accountId: z.string({
      required_error: "account id is required",
      invalid_type_error: "account id must be a string.",
    }),
    planId: z.string({
      required_error: "plan id is required",
      invalid_type_error: "plan id must be a string.",
    }),
  }),
});

export const subscriptonSpecificSchema = z.object({
  params: z.object({
    subscriptionId: z.string({
      required_error: "subscription id is required",
      invalid_type_error: "subscription id must be a string.",
    }),
  }),
});

export const subscriptonCancelSchema = z.object({
  params: z.object({
    accountId: z.string({
      required_error: "account id is required",
      invalid_type_error: "account id must be a string.",
    }),
  }),
});

export const planSwitchSchema = z.object({
  params: z.object({
    accountId: z.string({
      required_error: "account id is required",
      invalid_type_error: "account id must be a string.",
    }),
    planId: z.string({
      required_error: "plan id is required",
      invalid_type_error: "plan id must be a string.",
    }),
  }),
});

// ---------------- Service schema to validate --------------- //

export const transactionSchema = z.object({
  cardTransactionType: z.string({
    required_error: "Transaction type is required.",
    invalid_type_error: "Transaction type must be a string",
  }),
  softDescriptor: z.string({
    required_error: "Description is required.",
    invalid_type_error: "Description must be a string",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }),
  currency: z.string({
    required_error: "Currency is required.",
    invalid_type_error: "Currency must be a string",
  }),
  cardHolderInfo: payerInfoSchema,
  creditCard: creditCardSchema,
});
