export const EXCHANGES = {
  NOTIFICATION: "notification_exchange",
  USER_EVENTS: "user_events_exchange",
  AUDIT: "audit_exchange",
} as const;

export const QUEUES = {
  SMS: "notification.sms",
  EMAIL: "notification.email",
  PUSH: "notification.push",
} as const;

export const EVENT_TYPES = {
  USER_REGISTERED: "user.created",
  USER_UPDATED: "user.updated",
  USER_DELETED: "user.deleted",
  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
  PASSWORD_CHANGED: "user.password_changed",
  EMAIL_VERIFIED: "user.email_verified",
  ACCOUNT_LOCKED: "user.account_locked",
  ACCOUNT_UNLOCKED: "user.account_unlocked",
  SESSION_CREATED: "user.session_created",
  SESSION_EXPIRED: "user.session_expired",
} as const;

export enum NOTIFICATION_TYPE {
  SMS = "SMS",
  EMAIL = "EMAIL",
  PUSH = "PUSH",
}

export enum EVENT_PRIORITY {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum NOTIFICATION_SEVERITY {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}
