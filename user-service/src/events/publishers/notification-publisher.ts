import { RabbitMQ } from "../../config";
import { ServerConfig } from "../../config";
import { logger } from "../../config/logger-config";
import {
  EXCHANGES,
  QUEUES,
  NOTIFICATION_TYPE,
  EVENT_PRIORITY,
  NOTIFICATION_SEVERITY,
} from "../../utils/constants";

export interface NotificationMessage {
  id: string;
  type: NOTIFICATION_TYPE;
  recipient: string;
  event: string;
  priority?: EVENT_PRIORITY;
  severity?: NOTIFICATION_SEVERITY;
  metadata?: Record<string, any>;
  timestamp: number;
  source?: string;
}

export class NotificationPublisher {
  private rabbit: RabbitMQ;
  private isSetup: boolean = false;

  constructor() {
    this.rabbit = RabbitMQ.getInstance(ServerConfig.RABBITMQ_URI);
  }

  async setup(): Promise<void> {
    if (this.isSetup) {
      logger.debug("NotificationPublisher already setup");
      return;
    }

    try {
      logger.info("Setting up notification publisher...");

      // Assert exchange
      await this.rabbit.assertExchange(EXCHANGES.NOTIFICATION, "direct", {
        durable: true,
      });

      // Assert queues
      await this.rabbit.assertQueue(QUEUES.SMS, { durable: true });
      await this.rabbit.assertQueue(QUEUES.EMAIL, { durable: true });
      await this.rabbit.assertQueue(QUEUES.PUSH, { durable: true });

      // Bind queues to exchange
      await this.rabbit.bindQueue(
        QUEUES.SMS,
        EXCHANGES.NOTIFICATION,
        NOTIFICATION_TYPE.SMS
      );
      await this.rabbit.bindQueue(
        QUEUES.EMAIL,
        EXCHANGES.NOTIFICATION,
        NOTIFICATION_TYPE.EMAIL
      );
      await this.rabbit.bindQueue(
        QUEUES.PUSH,
        EXCHANGES.NOTIFICATION,
        NOTIFICATION_TYPE.PUSH
      );

      this.isSetup = true;
      logger.info("NotificationPublisher setup completed");
    } catch (error) {
      logger.error("Failed to setup NotificationPublisher:", error);
      throw error;
    }
  }

  async publish(
    type: NOTIFICATION_TYPE,
    message: Partial<NotificationMessage>
  ): Promise<boolean> {
    try {
      if (!this.isSetup) {
        await this.setup();
      }

      const notificationMessage: NotificationMessage = {
        id: message.id || this.generateMessageId(),
        type,
        recipient: message.recipient || "",
        event: message.event || "",
        priority: message.priority || EVENT_PRIORITY.NORMAL,
        severity: message.severity || NOTIFICATION_SEVERITY.INFO,
        metadata: message.metadata || {},
        timestamp: Date.now(),
        source: message.source,
      };

      if (!notificationMessage.recipient || !notificationMessage.event) {
        throw new Error("Missing required fields: recipient and event");
      }

      const result = await this.rabbit.publish(
        EXCHANGES.NOTIFICATION,
        type,
        Buffer.from(JSON.stringify(notificationMessage)),
        {
          persistent: true,
          priority: this.getPriorityValue(
            notificationMessage.priority ?? EVENT_PRIORITY.NORMAL
          ),
        }
      );

      if (result) {
        logger.info(`Notification published successfully`, {
          type,
          event: notificationMessage.event,
          messageId: notificationMessage.id,
          recipient: notificationMessage.recipient,
          priority: notificationMessage.priority,
          severity: notificationMessage.severity,
        });
      }

      return result;
    } catch (error) {
      logger.error(`Failed to publish ${type} notification:`, error);
      throw error;
    }
  }

  async publishSMS(
    recipient: string,
    event: string,
    metadata?: Record<string, any>,
    options?: {
      priority?: EVENT_PRIORITY;
      severity?: NOTIFICATION_SEVERITY;
      source?: string;
    }
  ): Promise<boolean> {
    return this.publish(NOTIFICATION_TYPE.SMS, {
      recipient,
      event,
      metadata,
      priority: options?.priority,
      severity: options?.severity,
      source: options?.source,
    });
  }

  async publishEmail(
    recipient: string,
    event: string,
    metadata?: Record<string, any>,
    options?: {
      priority?: EVENT_PRIORITY;
      severity?: NOTIFICATION_SEVERITY;
      source?: string;
    }
  ): Promise<boolean> {
    return this.publish(NOTIFICATION_TYPE.EMAIL, {
      recipient,
      event,
      metadata,
      priority: options?.priority,
      severity: options?.severity,
      source: options?.source,
    });
  }

  async publishPush(
    recipient: string,
    event: string,
    metadata?: Record<string, any>,
    options?: {
      priority?: EVENT_PRIORITY;
      severity?: NOTIFICATION_SEVERITY;
      source?: string;
    }
  ): Promise<boolean> {
    return this.publish(NOTIFICATION_TYPE.PUSH, {
      recipient,
      event,
      metadata,
      priority: options?.priority,
      severity: options?.severity,
      source: options?.source,
    });
  }

  // Convenience methods for common events
  async publishUserEvent(
    action:
      | "registered"
      | "verified"
      | "suspended"
      | "password_reset"
      | "login_failed",
    recipient: string,
    metadata?: Record<string, any>,
    options?: {
      priority?: EVENT_PRIORITY;
      source?: string;
    }
  ): Promise<boolean> {
    const severity =
      action === "suspended" || action === "login_failed"
        ? NOTIFICATION_SEVERITY.WARNING
        : NOTIFICATION_SEVERITY.INFO;

    return this.publishEmail(recipient, `user.${action}`, metadata, {
      priority: options?.priority,
      severity,
      source: options?.source,
    });
  }

  async publishOrderEvent(
    action:
      | "created"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled"
      | "refunded",
    recipient: string,
    metadata?: Record<string, any>,
    options?: {
      priority?: EVENT_PRIORITY;
      source?: string;
    }
  ): Promise<boolean> {
    const severity =
      action === "cancelled"
        ? NOTIFICATION_SEVERITY.WARNING
        : NOTIFICATION_SEVERITY.INFO;
    const priority =
      action === "shipped" || action === "delivered"
        ? EVENT_PRIORITY.HIGH
        : EVENT_PRIORITY.NORMAL;

    return this.publishEmail(recipient, `order.${action}`, metadata, {
      priority: options?.priority || priority,
      severity,
      source: options?.source,
    });
  }

  async publishPaymentEvent(
    action: "succeeded" | "failed" | "refunded" | "pending",
    recipient: string,
    metadata?: Record<string, any>,
    options?: {
      priority?: EVENT_PRIORITY;
      source?: string;
    }
  ): Promise<boolean> {
    const severity =
      action === "failed"
        ? NOTIFICATION_SEVERITY.ERROR
        : NOTIFICATION_SEVERITY.INFO;
    const priority =
      action === "failed" ? EVENT_PRIORITY.HIGH : EVENT_PRIORITY.NORMAL;

    return this.publishEmail(recipient, `payment.${action}`, metadata, {
      priority: options?.priority || priority,
      severity,
      source: options?.source,
    });
  }

  async publishSystemEvent(
    action: "maintenance" | "outage" | "update" | "security_alert",
    recipient: string,
    metadata?: Record<string, any>,
    options?: {
      priority?: EVENT_PRIORITY;
      source?: string;
    }
  ): Promise<boolean> {
    const severity =
      action === "outage" || action === "security_alert"
        ? NOTIFICATION_SEVERITY.CRITICAL
        : NOTIFICATION_SEVERITY.INFO;
    const priority =
      action === "outage" || action === "security_alert"
        ? EVENT_PRIORITY.URGENT
        : EVENT_PRIORITY.NORMAL;

    return this.publishEmail(recipient, `system.${action}`, metadata, {
      priority: options?.priority || priority,
      severity,
      source: options?.source,
    });
  }

  private getPriorityValue(priority: EVENT_PRIORITY): number {
    const priorityMap: Record<EVENT_PRIORITY, number> = {
      [EVENT_PRIORITY.LOW]: 1,
      [EVENT_PRIORITY.NORMAL]: 5,
      [EVENT_PRIORITY.HIGH]: 8,
      [EVENT_PRIORITY.URGENT]: 10,
    };
    return priorityMap[priority];
  }

  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async close(): Promise<void> {
    await this.rabbit.close();
    this.isSetup = false;
  }
}

export const notificationPublisher = new NotificationPublisher();
