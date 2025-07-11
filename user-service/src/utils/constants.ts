export const EXCHANGES = {
  NOTIFICATION: "notification_exchange",
  // Add more exchanges here
};

export const QUEUES = {
  SMS: "notification.sms",
  EMAIL: "notification.email",
  PUSH: "notification.push",
  // Add more queues here
};

export enum NotificationType {
  SMS = "sms",
  EMAIL = "email",
  PUSH = "pushNotification",
}
