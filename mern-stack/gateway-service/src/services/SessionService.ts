import { getMongoRepository, MongoRepository, ObjectID } from "typeorm";
import bcrypt from "bcrypt";
import split from "lodash/split";

import { randomString } from "../utils/strings";
import Session from "../models/Session";
import SessionTokens from "../interfaces/SessionTokens";
import { isBefore } from "date-fns";

class SessionService {
  repository: MongoRepository<Session>;

  constructor() {
    this.repository = getMongoRepository(Session);
  }

  async create(id: string): Promise<Session> {
    const accessToken = randomString(36);
    const session = new Session({
      userId: id,
      accessToken,
      refreshToken: bcrypt.hashSync(accessToken, 10),
    });

    const newSession = await this.repository.save(session);

    return newSession;
  }

  async getByAccessToken(accessToken: string): Promise<Session> {
    const session = await this.repository.findOne({ accessToken, deletedAt: null });

    return session;
  }

  async deleteByAccessToken(accessToken: string): Promise<void> {
    const session = await this.repository.findOne({ accessToken, deletedAt: null });

    await this.repository.update(session._id, { deletedAt: new Date() });
  }

  async checkTokens(sessionTokens: SessionTokens): Promise<Session> {
    const currentSession = await this.repository.findOne({
      accessToken: sessionTokens.accessToken,
      refreshToken: sessionTokens.refreshToken,
      deletedAt: null,
    });

    if (currentSession && isBefore(new Date(), currentSession.accessTokenExpirey)) {
      return currentSession;
    }

    return null;
  }

  async refreshTokens(sessionTokens: SessionTokens): Promise<Session> {
    const currentSession = await this.repository.findOne({
      accessToken: sessionTokens.accessToken,
      refreshToken: sessionTokens.refreshToken,
      deletedAt: null,
    });

    if (currentSession && isBefore(new Date(), currentSession.refreshTokenExpirey)) {
      const newAccessToken = randomString(36);
      const session = new Session({
        userId: currentSession.userId,
        accessToken: newAccessToken,
        refreshToken: bcrypt.hashSync(newAccessToken, 10),
      });

      const newSession = await this.repository.save(session);

      return newSession;
    }

    return null;
  }

  getSessionTokensFromCookie(sessionCookie: string): SessionTokens {
    const session = {
      accessToken: '',
      refreshToken: '',
    };

    split(sessionCookie, "&").forEach((sessionCookiePart) => {
      const [key, value] = split(sessionCookiePart, "=");

      session[key] = value;
    });

    return session;
  }
}

export default SessionService;
