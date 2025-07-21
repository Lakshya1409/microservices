import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  gender: string;
  profileImage: string;
  isActive: boolean;
  isVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  toUserResponse(): object;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    profileImage: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true }, // Auto-verify for development
    role: {
      type: String,
      enum: ["customer", "admin", "vendor"],
      default: "customer",
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

UserSchema.methods.toUserResponse = function () {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    profileImage: this.profileImage,
    isActive: this.isActive,
    isVerified: this.isVerified,
    role: this.role,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const UserModel = model<IUser>("User", UserSchema);
