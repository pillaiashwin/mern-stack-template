import { createConnection } from "typeorm";
import { Logger } from "tslog";
import express, { Application, Request, Response } from "express";

import config from "./config";
import loggingMiddleware from "./middleware/logging-middleware";
import UsersController from "./controllers/UsersController";
import User from "./models/User";

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
        User,
      ]
    };

    await createConnection(connectionOptions);
  } catch (error) {
    logger.error("Error connecting to database:", error);
  }

  // Middleware to be on every request
  app.use(express.json());
  app.use(loggingMiddleware);

  // Generic health check endpoint for determining if the webserver is running
  app.get("/health", async (req: Request, res: Response): Promise<Response> => res.json({ status: "OK" }));

  // Implement each controller
  app.use("/v1/users", new UsersController().router);

  try {
    app.listen(config.port, (): void => {
      logger.info(`Connected successfully on port ${config.port}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error.message);
  }
};

start();
