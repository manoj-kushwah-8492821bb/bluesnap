import { z, AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

// ---------------- Plan validator --------------- //
export const validatePlanCreate = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body });
      return next();
    } catch (error: any) {
      res.status(400);
      throw new Error(error?.issues?.[0]?.message);
    }
  };
};

export const validatePlanSpecific = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ params: req.params });
      return next();
    } catch (error: any) {
      res.status(400);
      throw new Error(error?.issues?.[0]?.message);
    }
  };
};

// ---------------- Subscription validator --------------- //
export const validateSubscriptionCreate = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({ error: error.issues[0].message });
    }
  };
};

export const validateSubscriptionCancel = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({ error: error.issues[0].message });
    }
  };
};

export const validateSubscriptionSpecific = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({ error: error.issues[0].message });
    }
  };
};

export const validatePlanSwitch = (schema: z.Schema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({ error: error.issues[0].message });
    }
  };
};

// ---------------- Service validator --------------- //
export const validateServiceBody = (schema: z.Schema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400);
      throw new Error(error?.issues?.[0]?.message);
    }
  };
};
