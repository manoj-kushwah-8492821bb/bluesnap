import { Router } from "express";
const planRouter = Router();
import { planCreateSchema, planSpecificSchema } from "../zod/schemas";
import { planCreate, planList, planSpecific } from "../controllers/plan";
import { validatePlanCreate, validatePlanSpecific } from "../zod/validator";

planRouter.get(
  "/:planId",
  validatePlanSpecific(planSpecificSchema),
  planSpecific
); // specific plan by planId
planRouter
  .route("/")
  .get(planList)
  .post(validatePlanCreate(planCreateSchema), planCreate); // plan list & plan create

export default planRouter;
