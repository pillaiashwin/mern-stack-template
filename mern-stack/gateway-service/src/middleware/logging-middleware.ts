import { NextFunction, Request, Response } from "express";
import { Logger } from "tslog";

const logger: Logger = new Logger();

const loggingMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.info(`Request ${req.originalUrl}`);
  next();
}

export default loggingMiddleware;
