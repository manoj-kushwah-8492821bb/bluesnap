import { Router } from "express";
const serviceRouter = Router();
import {
  authCapture,
  authOnly,
  authReversal,
  capture,
  retrieveCapture,
} from "../controllers/service";
import { validateServiceBody } from "../zod/validator";
import { transactionSchema } from "../zod/schemas";

serviceRouter.put("/capture", capture);
serviceRouter.post("/auth-only", authOnly);
serviceRouter.post(
  "/auth-capture",
  validateServiceBody(transactionSchema),
  authCapture
);
serviceRouter.put("/auth-reversal", authReversal);
serviceRouter.get("/retrieve-transaction/:transactionId", retrieveCapture);

export default serviceRouter;
