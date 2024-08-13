import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import PlanInterface from "../interfaces/plan";
import successHandler from "../common/successHandler";
import { RECURRING_PLAN } from "../bluesnap/endpoints";
import { BLUESNAP_API } from "../bluesnap/interceptor";

// @desc : This function will return a list of all plans from the bluesnap database.
// @path : /recurring/plans
export const planList = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const data = await BLUESNAP_API.get(`${RECURRING_PLAN}?gettotal=true`);
      // success respond
      successHandler(res, {
        message: "Fetch all plans",
        plans: data.data.plans,
      });
    } catch (error: any) {
      res.status(400);
      throw new Error(error);
    }
  }
);

// @desc : This function takes a planId in params to search particular plan based on planId and after will return plan data from the bluesnap database.
// @path : /recurring/plans/:planId
export const planSpecific = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { planId } = req.params;
    try {
      const result = await BLUESNAP_API.get(`${RECURRING_PLAN}/${planId}`);
      // success respond
      successHandler(res, { message: `Plan`, plan: result.data });
    } catch (error: any) {
      res.status(400);
      throw new Error(error);
    }
  }
);

// @desc : This function takes ( chargeFrequency, name, currency, recurringChargeAmount ) to create plan in database and after success will return plan data in a response.
// @path : /recurring/plans
export const planCreate = expressAsyncHandler(
  async (req: Request<{}, {}, PlanInterface>, res: Response) => {
    const { chargeFrequency, name, currency, recurringChargeAmount } = req.body;

    // throw error any field miss
    if (!chargeFrequency || !name || !currency || !recurringChargeAmount) {
      res.status(400);
      throw new Error("All field are required.");
    }

    // create new plan on bluesnap server & own server
    const result = await BLUESNAP_API.post(RECURRING_PLAN, {
      chargeFrequency,
      name,
      currency,
      recurringChargeAmount,
    });

    // success respond
    successHandler(res, {
      message: "Plan successfully saved.",
      result: result.data,
    });
  }
);
