import axios from "axios";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";

import { SERVICES } from "../bluesnap/endpoints";
import successHandler from "../common/successHandler";
import { BASEURL, BLUESNAP_API, TOKEN } from "../bluesnap/interceptor";
import {
  AuthCaptureInterface,
  AuthOnlyInterface,
  CaptureInterface,
} from "../interfaces/service";

// @desc : This function takes ( cardTransactionType, softDescriptor,amount,currency,cardHolderInfo,creditCard ) in body to check card has sufficient balance or  check valid or not.
// @path : /services/auth-capture
export const authCapture = expressAsyncHandler(
  async (req: Request<{}, {}, AuthCaptureInterface>, res: Response) => {
    try {
      const result = await BLUESNAP_API.post(SERVICES, req.body);
      successHandler(res, {
        message: "auth capture success",
        data: result.data,
      });
    } catch (error: any) {
      res.status(400);
      throw new Error(error?.response?.data?.message?.[0]?.description);
    }
  }
);

// @desc : This function takes ( cardTransactionType, softDescriptor,amount,currency,cardHolderInfo,creditCard ) in body to check card has sufficient balance or  check valid or not.
// @path : /services/auth-only
export const authOnly = expressAsyncHandler(
  async (req: Request<{}, {}, AuthOnlyInterface>, res: Response) => {
    try {
      const result = await BLUESNAP_API.post(SERVICES, req.body);
      successHandler(res, {
        message: "auth only success",
        data: result.data,
      });
    } catch (error: any) {
      res.status(400);
      throw new Error(error?.response?.data?.message?.[0]?.description);
    }
  }
);

// @desc : This function takes ( cardTransactionType, transactionId ) in body to capture transaction.
// @path : /services/capture
export const capture = expressAsyncHandler(
  async (req: Request<{}, {}, CaptureInterface>, res: Response) => {
    const options = {
      method: "PUT",
      url: `${BASEURL}/${SERVICES}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: TOKEN,
      },
      data: req.body,
    };

    axios
      .request(options)
      .then(function (response) {
        successHandler(res, { data: response.data });
      })
      .catch(function (error) {
        res.send(error);
      });
  }
);

// @desc : This function takes ( cardTransactionType, transactionId ) in body to auth reversal. To know in more details can visit this link "https://developers.bluesnap.com/v8976-JSON/reference/auth-reversal"
// @path : /services/auth-reversal
export const authReversal = expressAsyncHandler(
  async (req: Request<{}, {}, CaptureInterface>, res: Response) => {
    const options = {
      method: "PUT",
      url: `${BASEURL}/${SERVICES}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: TOKEN,
      },
      data: req.body,
    };

    axios
      .request(options)
      .then(function (response) {
        successHandler(res, { data: response.data });
      })
      .catch(function (error) {
        res.send(error);
      });
  }
);

// @desc : This function takes (  transactionId ) in params to retrive transaction.
// @path : /services/retrieve-transaction/:transactionId
export const retrieveCapture = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const result = await BLUESNAP_API.get(`${SERVICES}/${transactionId}`);
    successHandler(res, { message: result.data });
  }
);
