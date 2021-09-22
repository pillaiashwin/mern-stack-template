import { Logger } from "tslog";
import { Request, Response, Router } from "express";
import isEmpty from "lodash/isEmpty";
import jwt from "jsonwebtoken";

import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import authorizationMiddleware from "../middleware/authorization-middleware";
import UserService from "../services/UserService";
import config from "../config";

class UsersController {
  logger: Logger;
  router: Router;
  userService: UserService;

  constructor() {
    this.logger = new Logger();
    this.router = Router();
    this.userService = new UserService();

    // Middleware
    this.router.use(authorizationMiddleware);

    // Endpoints
    this.router.post("/authorize", this.authorize);
    this.router.get("/current", this.current);
    this.router.get("/:id", this.getById);
    this.router.patch("/:id", this.updateById);
    this.router.delete("/:id", this.deleteById);
    this.router.post("/", this.create);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.create(req.body);

    delete user.password;

    res.status(200).json({ data: user });
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await this.userService.getById(req.params.id);

    delete user.password;

    res.status(200).json({ data: user });
  };

  updateById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(200).end();
  };

  deleteById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(200).end();
  };

  authorize = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = jwt.verify(req.body.data, config.jwtSecret);
    const user = await this.userService.checkPassword(data.email, data.password);

    if (isEmpty(user)) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      delete user.password;

      res.status(200).json({ data: user });
    }
  };

  current = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await this.userService.getById(req.userJwt?.id);

    if (isEmpty(user)) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      delete user.password;

      res.status(200).json({ data: user });
    }
  };
}

export default UsersController;
