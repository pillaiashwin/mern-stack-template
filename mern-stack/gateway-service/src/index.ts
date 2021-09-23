import { createConnection } from "typeorm";
import { Logger } from "tslog";
import cookieParser from "cookie-parser";
import each from "lodash/each";
import express, { Application, Request, Response } from "express";

import config from "./config";
import corsMiddleware from "./middleware/cors-middleware";
import loggingMiddleware from "./middleware/logging-middleware";
import LoginController from "./controllers/LoginController";
import ReverseProxyController from "./controllers/ReverseProxyController";
import reverseProxyMiddleware from "./middleware/reverse-proxy-middleware";
import ReverseProxyOptions from "./interfaces/ReverseProxyOptions";
import Session from "./models/Session";

const logger: Logger = new Logger();

const start = async () => {
  const app: Application = express();

  try {
    const connectionOptions: any = {
      type: "mongodb",
      url: config.dbConnStr,
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      logging: true,
      entities: [
        Session,
      ]
    };

    await createConnection(connectionOptions);
  } catch (error) {
    logger.error("Error connecting to database:", error);
  }

  app.get('/get', (req, res) => { 
    console.log("GET REQUEST received!!");
    console.log("request", req);
    console.log("response", res);
    res.send('GET REQUEST');
  });


  // Middleware to be on every request
  app.use(cookieParser());
  app.use(corsMiddleware());
  app.use(express.json());
  app.use(loggingMiddleware);

  // Generic health check endpoint for determining if the webserver is running
  app.get("/health", async (req: Request, res: Response): Promise<Response> => res.json({ status: "OK" }));

  // Implement each controller
  app.use("/v1/authorization", new LoginController().router);


  // Configure a reverse proxy for each service in the service map
  each(config.serviceMap, (serviceMapOptions: ReverseProxyOptions) => {
    //TO DELETE - the console log statement and switch case
    console.log(serviceMapOptions.url);
    switch(serviceMapOptions.url) {
      case "/v1/surveys":
        app.use(reverseProxyMiddleware(serviceMapOptions));
        break;
      case "/v1/users":
        app.use(reverseProxyMiddleware(serviceMapOptions));
        break;
      case "/v1/integration":
        app.use("/v1/integration", new ReverseProxyController().router);
        break;
    }

    // app.use(reverseProxyMiddleware(serviceMapOptions));
  });

  try {
    app.listen(config.port, (): void => {
      logger.info(`Connected successfully on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error.message);
  }
};

start();
