import { Logger } from "tslog";
import express, { Request, Response, Router } from "express";
import fetch from "node-fetch";
import isEmpty from "lodash/isEmpty";
import jwt from "jsonwebtoken";

import config from "../config";
import ReverseProxyOptions from "../interfaces/ReverseProxyOptions";
import SessionService from "../services/SessionService";

const logger: Logger = new Logger();

export const reverseProxyMiddleware = (options: ReverseProxyOptions = {}): Router => {
  const router: Router = Router();
  const sessionService = new SessionService();

  // Implement proxy to service based on url options.
  router.use(options.url, async (req: Request, res: Response) => {
    const requestUrl = `${options.targetUrl}${req.originalUrl}`;
    const requestOptions = {
      method: req.method,
      headers: req.headers,
      body: undefined,
    };

    if (!isEmpty(req.body)) {
      requestOptions.body = JSON.stringify(req.body);
      console.log("requestOptions['body']: ", JSON.stringify(req.body));
    }

    const sessionCookies = sessionService.getSessionTokensFromCookie(req.cookies.session);
    const session = await sessionService.getByAccessToken(sessionCookies.accessToken);

    if (!isEmpty(session)) {
      const authorizeResponse = await fetch(`${config.userServiceUrl}/v1/users/${session.userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (authorizeResponse.status === 200) {
        const authorizeResponseJson = await authorizeResponse.json();
        const encodedJwt = jwt.sign(authorizeResponseJson.data, options.jwtSecret);

        requestOptions.headers.authorization = `Bearer ${encodedJwt}`;
      }
    }

    logger.info(`Proxying request to ${requestUrl}`)

    try {
      const response = await fetch(requestUrl, requestOptions);
      const contentLength = response.headers.get("content-length");

      if (contentLength > 0) {
        const responseJson = await response.json();

        res.status(response.status).json(responseJson);
        console.log("responseJson: ", JSON.stringify(responseJson));
      } else {
        res.status(response.status).end();
      }
    } catch (error) {
      logger.error(error);

      res.status(500).end('Internal server error while proxying request.');
    }
  });

  return router;
};

export default reverseProxyMiddleware;
