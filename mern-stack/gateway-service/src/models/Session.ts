import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";
import addDays from "date-fns/addDays";

@Entity({
  name: "sessions",
})
class Session {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  userId: any;

  @Column()
  accessToken: string;

  @Column()
  accessTokenExpirey: Date;

  @Column()
  refreshToken: string;

  @Column()
  refreshTokenExpirey: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  constructor(data: any = {}) {
    this.userId = data.userId;
    this.accessToken = data.accessToken;
    this.accessTokenExpirey = data.accessTokenExpirey || addDays(new Date(), 1);
    this.refreshToken = data.refreshToken;
    this.refreshTokenExpirey = data.refreshTokenExpirey || addDays(new Date(), 365);
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.deletedAt = data.deletedAt;
  }
}

export default Session;
