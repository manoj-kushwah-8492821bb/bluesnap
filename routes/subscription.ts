import { Router } from "express";
const subscriptionRouter = Router();
import {
  subscriptionCancel,
  subscriptionCreate,
  subscriptionList,
  subscriptionSpecific,
  switchPlan,
} from "../controllers/subscription";
import {
  subscriptonCreateSchema,
  subscriptonCancelSchema,
  subscriptonSpecificSchema,
  planSwitchSchema,
} from "../zod/schemas";
import {
  validateSubscriptionCreate,
  validateSubscriptionCancel,
  validateSubscriptionSpecific,
  validatePlanSwitch,
} from "../zod/validator";

subscriptionRouter.get("/", subscriptionList); // subscription list
subscriptionRouter.get(
  "/:subscriptionId",
  validateSubscriptionSpecific(subscriptonSpecificSchema),
  subscriptionSpecific
); // specific subscription
subscriptionRouter.put(
  "/:accountId/cancel",
  validateSubscriptionCancel(subscriptonCancelSchema),
  subscriptionCancel
); // subscription cancellation
subscriptionRouter.put("/:accountId/switchPlan/:planId", switchPlan); // plan switching
subscriptionRouter.post(
  "/:accountId/:planId/create",
  validateSubscriptionCreate(subscriptonCreateSchema),
  subscriptionCreate
); // create subscription

export default subscriptionRouter;
