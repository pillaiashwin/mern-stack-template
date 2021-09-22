import { getMongoRepository, MongoRepository, FindOneOptions, ObjectID } from "typeorm";
import bcrypt from "bcrypt";

import User from "../models/User";

class UserService {
  repository: MongoRepository<User>;

  constructor() {
    this.repository = getMongoRepository(User);
  }

  async get(data: any): Promise<User[]> {
    const users = await this.repository.find(data);

    return users;
  }

  async getById(id: any): Promise<User> {
    if (!id) {
      return null;
    }

    const user = await this.repository.findOne(id);

    return user;
  }

  async create(data: any): Promise<User> {
    const user = new User(data);

    user.password = bcrypt.hashSync(user.password, 10);

    const newUser = await this.repository.save(user);

    return newUser;
  }

  async checkPassword(email: string, password: string): Promise<User> {
    const user = await this.repository.findOne({ email, deletedAt: null });

    if (user && password && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return null;
  }
}

export default UserService;
