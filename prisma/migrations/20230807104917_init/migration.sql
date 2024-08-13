-- CreateTable
CREATE TABLE "Plan" (
    "planId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "currency" TEXT,
    "chargeFrequency" TEXT,
    "status" TEXT,
    "chargeOnPlanSwitch" TEXT,
    "recurringChargeAmount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Subscription" (
    "subscriptionId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "vaultedShopperId" INTEGER NOT NULL,
    "status" TEXT,
    "quantity" INTEGER NOT NULL,
    "softDescriptor" TEXT,
    "chargeFrequency" TEXT,
    "recurringChargeAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT,
    "autoRenew" BOOLEAN NOT NULL,
    "nextChargeDate" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateTable
CREATE TABLE "PayerInfo" (
    "subscriptionId" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "zip" TEXT,
    "phone" TEXT,

    CONSTRAINT "PayerInfo_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateTable
CREATE TABLE "CreditCardInfo" (
    "subscriptionId" INTEGER NOT NULL,
    "cardLastFourDigits" TEXT,
    "cardType" TEXT,
    "cardSubType" TEXT,
    "cardCategory" TEXT,
    "binCategory" TEXT,
    "binNumber" TEXT,
    "cardRegulated" TEXT,
    "expirationMonth" TEXT,
    "expirationYear" TEXT,
    "issuingCountryCode" TEXT,

    CONSTRAINT "CreditCardInfo_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_planId_key" ON "Plan"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_accountId_key" ON "Subscription"("accountId");

-- AddForeignKey
ALTER TABLE "PayerInfo" ADD CONSTRAINT "PayerInfo_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("subscriptionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardInfo" ADD CONSTRAINT "CreditCardInfo_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("subscriptionId") ON DELETE RESTRICT ON UPDATE CASCADE;
