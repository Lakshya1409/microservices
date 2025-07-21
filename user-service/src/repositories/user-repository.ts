import { CrudRepository } from "./crud-repository";
import { UserModel, IUser } from "../models/user-model";
import { Types } from "mongoose";

export class UserRepository extends CrudRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async updateLastLogin(userId: Types.ObjectId): Promise<void> {
    await this.model
      .updateOne({ _id: userId }, { lastLogin: new Date() })
      .exec();
  }

  async findByEmailAndPassword(
    email: string,
    password: string
  ): Promise<IUser | null> {
    return this.model.findOne({ email, password }).exec();
  }

  async updatePassword(
    userId: Types.ObjectId,
    hashedPassword: string
  ): Promise<void> {
    await this.model
      .updateOne({ _id: userId }, { password: hashedPassword })
      .exec();
  }

  async verifyEmail(userId: Types.ObjectId): Promise<void> {
    await this.model.updateOne({ _id: userId }, { isVerified: true }).exec();
  }

  async deactivateUser(userId: Types.ObjectId): Promise<void> {
    await this.model.updateOne({ _id: userId }, { isActive: false }).exec();
  }

  async activateUser(userId: Types.ObjectId): Promise<void> {
    await this.model.updateOne({ _id: userId }, { isActive: true }).exec();
  }
}
export const userRepository = new UserRepository();
