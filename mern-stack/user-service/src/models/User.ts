import { Entity, Column, ObjectID, ObjectIdColumn } from "typeorm";

@Entity({
  name: 'users',
})
class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  constructor(data: any = {}) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name || data.email;
    this.role = data.role || 'EDITOR';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.deletedAt = data.deletedAt;
  }
}

export default User;
