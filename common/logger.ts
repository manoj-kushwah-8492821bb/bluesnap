import winston from "winston";

const logger = new winston.Logger({
  level: "error",
  transports: [new winston.transports.File({ filename: "error.log" })],
});

export default logger;
