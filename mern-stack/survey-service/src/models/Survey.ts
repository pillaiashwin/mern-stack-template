import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

@Entity({
  name: "surveys",
})
class Survey {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  userId: any;

  @Column()
  data: any;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  constructor(data: any = {}) {
    this.userId = data.userId;
    this.data = data.data;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.deletedAt = data.deletedAt;
  }
}

export default Survey;
