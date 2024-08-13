import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";

const prisma = new PrismaClient();
import successHandler from "../common/successHandler";
import { BLUESNAP_API } from "../bluesnap/interceptor";
import { RECURRING_PLAN, RECURRING_SUBSCRIPTION } from "../bluesnap/endpoints";
import { SubscriptionParamsInterface } from "../interfaces/subscription";

// @desc : This function will return a list of all subscriptions from the our database.
// @path : /recurring/subscriptions
export const subscriptionList = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      // fetch subscriptions from bluesnap
      const result = await BLUESNAP_API.get(
        `${RECURRING_SUBSCRIPTION}?gettotal=true`
      );
      // fetch subscriptions from db
      const subscription = await prisma.subscription.findMany({
        include: { payerInfo: true, paymentInfo: true },
      });

      // success respond
      successHandler(res, {
        message: "Fetch all subscriptions",
        subscription,
        resul: result.data,
      });
    } catch (error: any) {
      res.status(400);
      throw new Error(error);
    }
  }
);

// @desc : This function takes a subscriptionId in params to search particular subscripton based on subscriptionId and after will return subscription data from the our database.
// @path : /recurring/subscriptions/:subscriptionId
export const subscriptionSpecific = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { subscriptionId } = req.params;
    try {
      // fetch subscription from bluesnap
      const result = await BLUESNAP_API.get(
        `${RECURRING_SUBSCRIPTION}/${subscriptionId}`
      );

      // find specific subscription data from db
      const subscription = await prisma.subscription.findUnique({
        include: { payerInfo: true, paymentInfo: true },
        where: { subscriptionId: Number(subscriptionId) },
      });

      // if subsription not found in db
      if (!subscription) {
        res.status(400);
        throw new Error(`Subscription does not exist in the database`);
      }

      // success respond
      successHandler(res, {
        message: `Subscription with subscriptionId `,
        subscription,
      });
    } catch (error: any) {
      res.status(400);
      throw new Error(error);
    }
  }
);

// @desc : This function takes accountId in params to cancel subscription and after success will return subscription data in a response.
// @path : /recurring/subscriptions/:accountId/cancel
export const subscriptionCancel = expressAsyncHandler(
  async (req: Request, res: Response, next: any) => {
    const { accountId } = req.params;
    const payload = { status: "CANCELED" };
    const subscription = await prisma.subscription.findUnique({
      include: { payerInfo: true, paymentInfo: true },
      where: {
        accountId: Number(accountId),
      },
    });

    // if subscription not found in db
    if (!subscription) {
      res.status(400);
      throw new Error("Invalid account id.");
    }

    try {
      const { subscriptionId } = subscription;
      const result = await BLUESNAP_API.put(
        `${RECURRING_SUBSCRIPTION}/${subscriptionId}`,
        payload
      );

      // update the subscription
      const updatedSubscription = await prisma.subscription.update({
        where: {
          subscriptionId: Number(subscriptionId),
          accountId: Number(accountId),
        },
        data: { status: result.data.status },
      });

      // success handler
      successHandler(res, {
        message: "Subscription cancelled successfully.",
        subscription: updatedSubscription,
      });
    } catch (error: any) {
      res.status(400);
      throw new Error(
        error?.response?.data?.message?.[0]
          ? error?.response?.data?.message?.[0]?.description
          : "Something went wrong."
      );
    }
  }
);

// @desc : This function takes ( payerInfo, paymentSource ) in body & (accountId & planId) in params to create subscription in database and after success will return subscription data in a response.
// @path : /recurring/subscriptions/:accountId/:planId/create
export const subscriptionCreate = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { accountId, planId } = req.params;
    const { payerInfo, paymentSource } = req.body;

    // if user have already subscription
    const subscription = await prisma.subscription.findUnique({
      include: { payerInfo: true, paymentInfo: true },
      where: {
        accountId: Number(accountId),
      },
    });

    // if user have already subscription
    if (subscription) {
      res.status(400);
      throw new Error(
        "You have already subscription, please updated existing subscription."
      );
    }

    const payload = {
      payerInfo,
      paymentSource,
      planId: Number(planId),
    };

    try {
      const result = await BLUESNAP_API.post(RECURRING_SUBSCRIPTION, payload);

      // destructure
      const {
        subscriptionId,
        planId,
        vaultedShopperId,
        status,
        quantity,
        softDescriptor,
        chargeFrequency,
        recurringChargeAmount,
        currency,
        autoRenew,
        nextChargeDate,
      } = result.data;

      // save subscription details
      const data = await prisma.subscription.create({
        data: {
          subscriptionId: Number(subscriptionId),
          accountId: Number(accountId),
          planId: Number(planId),
          vaultedShopperId: Number(vaultedShopperId),
          status,
          quantity: Number(quantity),
          softDescriptor,
          chargeFrequency,
          recurringChargeAmount: parseFloat(recurringChargeAmount),
          currency,
          autoRenew: Boolean(autoRenew),
          nextChargeDate,
        },
      });

      // save payerInfo
      await prisma.payerInfo.create({
        data: {
          subscriptionId,
          firstName: result.data.payerInfo.firstName,
          lastName: result.data.payerInfo.lastName,
          zip: result.data.payerInfo.zip,
          phone: result.data.payerInfo.phone,
        },
      });

      // payment source
      await prisma.creditCardInfo.create({
        data: {
          subscriptionId,
          ...result.data.paymentSource.creditCardInfo.creditCard,
        },
      });

      // success respond
      successHandler(res, { message: "Subscription created success.", data });
    } catch (error: any) {
      res.status(400);
      throw new Error(error?.response?.data);
    }
  }
);

// @desc :  This function takes accountId & newPlanId in params to sitch plan and after success will return subscription data in a response.
// @path : /recurring/subscriptions/:accountId/switchPlan/:planId
export const switchPlan = expressAsyncHandler(
  async (req: Request<SubscriptionParamsInterface>, res: Response) => {
    const { accountId, planId } = req.params;
    const payload = { planId: Number(planId), currency: "USD" };

    // check account id valid or not
    const subscription = await prisma.subscription.findUnique({
      include: { payerInfo: true, paymentInfo: true },
      where: { accountId: Number(accountId) },
    });

    // if subscription not found in db
    if (!subscription) {
      res.status(400);
      throw new Error("Invalid account id.");
    }

    const plan = await prisma.plan.findUnique({
      where: { planId: Number(planId) },
    });
    // const result = await BLUESNAP_API.get(`${RECURRING_PLAN}/${planId}`);

    // if plan not found in db
    if (!plan) {
      res.status(400);
      throw new Error("Plan does not exist in the database");
    }

    try {
      const { subscriptionId } = subscription;
      const result = await BLUESNAP_API.put(
        `${RECURRING_SUBSCRIPTION}/${subscriptionId}`,
        payload
      );

      // update the subscription
      const updatedSubscription = await prisma.subscription.update({
        where: {
          subscriptionId: Number(subscriptionId),
          accountId: Number(accountId),
        },
        data: { planId: result.data.planId },
      });

      // success handler
      successHandler(res, {
        message: "Plan updated successfully.",
        subscription: updatedSubscription,
      });
    } catch (error: any) {
      res.status(400);
      throw new Error(
        error?.response?.data?.message?.[0]
          ? error?.response?.data?.message?.[0]?.description
          : "Something went wrong."
      );
    }
  }
);
