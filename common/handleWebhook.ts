import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Define the webhook handler function
const handleWebhook = async (event: any) => {
  const eventType = event.transactionType;
  const subscriptionId = event.subscriptionId;

  console.log(event);

  switch (eventType) {
    case "CANCELLATION":
      await prisma.subscription.update({
        where: {
          subscriptionId: Number(subscriptionId),
        },
        data: { status: "CANCELED" },
      });
      break;

    case "CONTRACT_CHANGE":
      await prisma.subscription.update({
        where: {
          subscriptionId: Number(subscriptionId),
        },
        data: { planId: Number(event.newContractId) },
      });
      break;

    case "CHARGE":
      const plan = await prisma.plan.findUnique({
        where: { planId: Number(event?.contractId) },
      });
      const untilDate = new Date(event?.untilDate);
      const nextChargeDate = untilDate.toISOString().substring(0, 10);
      const [expirationMonth, expirationYear] =
        event?.creditCardExpDate?.split("/");
      if (event?.subscriptionId) {
        await prisma.subscription.create({
          data: {
            subscriptionId: Number(event?.subscriptionId),
            accountId: Number(event?.accountId),
            planId: Number(event?.contractId),
            vaultedShopperId: Number(event?.accountId),
            status: "ACTIVE",
            quantity: Number(event?.quantity),
            softDescriptor: "",
            chargeFrequency: plan?.chargeFrequency,
            recurringChargeAmount: Number(plan?.recurringChargeAmount),
            currency: event?.currency,
            autoRenew: true,
            nextChargeDate: nextChargeDate,
          },
        });
        await prisma.payerInfo.create({
          data: {
            subscriptionId: event?.subscriptionId,
            firstName: event?.firstName,
            lastName: event?.lastName,
            zip: event?.zipCode,
            phone: event?.workPhone,
          },
        });
        await prisma.creditCardInfo.create({
          data: {
            subscriptionId: event?.subscriptionId,
            cardLastFourDigits: event?.creditCardLastFourDigits,
            cardType: event?.creditCardType,
            cardSubType: event?.cardSubType,
            cardCategory: event?.cardCategory,
            binCategory: event?.binCategory,
            binNumber: event?.binNumber,
            cardRegulated: event?.regulatedCard,
            expirationMonth,
            expirationYear,
            issuingCountryCode: event?.cardIssuingCountry,
          },
        });
      }
      break;
    // Add more cases for other event types if needed
    default:
    // Handle unknown event type
  }
};

export default handleWebhook;
