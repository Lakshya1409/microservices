import { CrudRepository } from "./crud-repository";
import { UserSessionModel, IUserSession } from "../models/user-session-model";
import { Types } from "mongoose";

export class UserSessionRepository extends CrudRepository<IUserSession> {
  constructor() {
    super(UserSessionModel);
  }

  async findBySessionId(sessionId: string): Promise<IUserSession | null> {
    return this.model.findOne({ _id: sessionId, isActive: true }).exec();
  }

  async findActiveByUserId(userId: Types.ObjectId): Promise<IUserSession[]> {
    return this.model
      .find({
        userId,
        isActive: true,
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }

  async deactivateSession(sessionId: Types.ObjectId): Promise<void> {
    await this.model.updateOne({ _id: sessionId }, { isActive: false }).exec();
  }

  async deactivateAllByUserId(userId: Types.ObjectId): Promise<void> {
    await this.model.updateMany({ userId }, { isActive: false }).exec();
  }

  async updateToken(
    sessionId: Types.ObjectId,
    newToken: string
  ): Promise<void> {
    await this.model.updateOne({ _id: sessionId }, { token: newToken }).exec();
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.model
      .updateMany(
        {
          expiresAt: { $lt: new Date() },
          isActive: true,
        },
        { isActive: false }
      )
      .exec();

    return result.modifiedCount;
  }

  async getSessionCount(userId: Types.ObjectId): Promise<number> {
    return this.model
      .countDocuments({
        userId,
        isActive: true,
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }
}

export const userSessionRepository = new UserSessionRepository();
