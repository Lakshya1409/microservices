import { UserRepository } from "../repositories";
import { NotificationPublisher } from "../events/publishers";
import { IUser } from "../models/user-model";

const userRepository = new UserRepository();
const notificationPublisher = new NotificationPublisher();

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  if (!name || !email || !password) {
    throw new Error("All fields are required.");
  }
  const existing = await userRepository.customQuery({ email });
  if (existing.length > 0) {
    throw new Error("Email already registered.");
  }
  const user = (await userRepository.create({
    name,
    email,
    password,
  })) as IUser;
  await notificationPublisher.setup();
  await notificationPublisher.publishSMS(String(user._id), "Your SMS body", {
    name,
    email,
  });
  await notificationPublisher.publishEmail(
    String(user._id),
    "Welcome!",
    "Your email body",
    { name, email }
  );
  await notificationPublisher.publishPush(String(user._id), "Your push body", {
    name,
    email,
  });
  return user;
}
