import { Request, Response, Router } from "express";
import config from "../config";

import SessionService from "../services/SessionService";
import UserService from "../services/UserService";

class LoginController {
  router: Router;
  sessionService: SessionService;
  userService: UserService;

  constructor() {
    this.router = Router();
    this.sessionService = new SessionService();
    this.userService = new UserService({
      url: config.userServiceUrl,
      secret: config.userServiceJwtSecret,
    });

    this.router.post("/login", this.login);
    this.router.post("/logout", this.logout);
  }

  login = async (req: Request, res: Response): Promise<void> => {
    const userId = await this.userService.checkPassword(req.body.email, req.body.password);

    if (userId) {
      const session = await this.sessionService.create(userId);

      res.cookie("session", `accessToken=${session.accessToken}&refreshToken=${session.refreshToken}`);

      res.status(200).end();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    const sessionTokens = this.sessionService.getSessionTokensFromCookie(req.cookies.session);

    await this.sessionService.deleteByAccessToken(sessionTokens.accessToken);

    res.status(200).end();
  }
}

export default LoginController;
