import { Request } from "express";

import UserJwt from "./UserJwt";

interface AuthenticatedRequest extends Request {
  userJwt: UserJwt,
}

export default AuthenticatedRequest;
