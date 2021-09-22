import { Logger } from "tslog";
import { Request, Response, Router } from "express";

import AuthenticatedRequest from "../interfaces/AuthenticatedRequest";
import authorizationMiddleware from "../middleware/authorization-middleware";
import SurveyService from "../services/SurveyService";

class UsersController {
  logger: Logger;
  router: Router;
  surveyService: SurveyService;

  constructor() {
    this.logger = new Logger();
    this.router = Router();
    this.surveyService = new SurveyService();

    // Middleware
    this.router.use(authorizationMiddleware);

    // Endpoints
    this.router.get("/", this.get);
    this.router.post("/", this.create);
    this.router.get("/:id", this.getById);
    this.router.patch("/:id", this.updateById);
    this.router.delete("/:id", this.deleteById);
  }

  create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.userJwt?.role !== 'EDITOR') {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      const survey = await this.surveyService.create({ userId: req.userJwt?.id, data: req.body });

      res.status(200).json({ data: survey });
    }
  };

  get = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.userJwt?.id) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      const surveys = await this.surveyService.get({ userId: req.userJwt?.id });

      console.log(surveys)

      res.status(200).json({ data: surveys });
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(200);
  };

  updateById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(200).end();
  };

  deleteById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(200);
  };
}

export default UsersController;
