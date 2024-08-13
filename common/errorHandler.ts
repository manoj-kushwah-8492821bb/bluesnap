import logger from "./logger";

// --------- Error Handler ---------- //
const errorHandler = (err: any, req: any, res: any, next: any) => {
  // errors logger
  logger.log("error", err.message.replace("Error: ", ""), "my string");
  res.json({
    error: true,
    success: false,
    status: res.statusCode ? res.statusCode : 500,
    message: err.message.replace("Error: ", ""),
  });
};

export default errorHandler;
