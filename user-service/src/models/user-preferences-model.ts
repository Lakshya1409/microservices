import { Schema, model, Document, Types } from "mongoose";

export interface IUserPreferences extends Document {
  userId: Types.ObjectId;
  language: string;
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    language: { type: String },
    currency: { type: String },
    timezone: { type: String },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: false },
    orderUpdates: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserPreferencesModel = model<IUserPreferences>(
  "UserPreferences",
  UserPreferencesSchema
);
