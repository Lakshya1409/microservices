import { userRepository } from "../repositories";
import { notificationPublisher } from "../events/publishers";
import { IUser } from "../models/user-model";
import { Types } from "mongoose";
import { AUTH_MESSAGES, VALIDATION_MESSAGES } from "../utils/messages";

export const userService = {
  async getUserById(userId: string): Promise<IUser | null> {
    return userRepository.findById(userId);
  },

  async getAllUsers(): Promise<IUser[]> {
    return userRepository.findAll();
  },

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    const updatedUser = await userRepository.updateById(userId, updateData);
    if (!updatedUser) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    return updatedUser;
  },

  async deleteUser(userId: string): Promise<void> {
    const deleted = await userRepository.deleteById(userId);
    if (!deleted) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return userRepository.findByEmail(email);
  },

  async updateLastLogin(userId: string): Promise<void> {
    await userRepository.updateLastLogin(new Types.ObjectId(userId));
  },

  async verifyEmail(userId: string): Promise<void> {
    await userRepository.verifyEmail(new Types.ObjectId(userId));
  },

  async deactivateUser(userId: string): Promise<void> {
    await userRepository.deactivateUser(new Types.ObjectId(userId));
  },

  async activateUser(userId: string): Promise<void> {
    await userRepository.activateUser(new Types.ObjectId(userId));
  },
};
