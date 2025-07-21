import { Schema, model, Document, Types } from "mongoose";

export interface IUserSession extends Document {
  userId: Types.ObjectId;
  token: string;
  refreshToken: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const UserSessionSchema = new Schema<IUserSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    refreshToken: { type: String, required: true },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UserSessionModel = model<IUserSession>(
  "UserSession",
  UserSessionSchema
);
