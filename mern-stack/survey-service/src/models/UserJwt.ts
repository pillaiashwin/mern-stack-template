import jwt from "jsonwebtoken";

import UserJwtInterface from "../interfaces/UserJwt";

class UserJwt implements UserJwtInterface {
  id: string;
  role: string;

  constructor(bearerToken: string, secret: string) {
    const data = jwt.verify(bearerToken, secret);

    this.id = data._id;
    this.role = data.role;
  }
}

export default UserJwt;
