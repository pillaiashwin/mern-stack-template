import { Logger } from "tslog";
import { NextFunction, Request, Response } from "express";
import isEmpty from "lodash/isEmpty";

import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import config from "../config";
import UserJwt from "../models/UserJwt";

const logger: Logger = new Logger();

const authorizationMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authorizationHeader = String(req.headers['authorization'] || '');

    if (!isEmpty(authorizationHeader)) {
      const bearerToken = authorizationHeader.replace('Bearer ', '');
      const userJwt = new UserJwt(bearerToken, config.jwtSecret);

      req.userJwt = userJwt;
    }
  } catch (error) {
    logger.error("Unable to decode authorization header");
  }

  next();
};

export default authorizationMiddleware;
