import { RabbitMQ } from "../../config";
import { ServerConfig } from "../../config";
import { logger } from "../../config/logger-config";
import { EXCHANGES, QUEUES, NotificationType } from "../../utils/constants";

export interface NotificationMessage {
  id: string;
  type: NotificationType;
  recipient: string;
  subject?: string;
  body: string;
  metadata?: Record<string, any>;
  timestamp: number;
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
        NotificationType.SMS
      );
      await this.rabbit.bindQueue(
        QUEUES.EMAIL,
        EXCHANGES.NOTIFICATION,
        NotificationType.EMAIL
      );
      await this.rabbit.bindQueue(
        QUEUES.PUSH,
        EXCHANGES.NOTIFICATION,
        NotificationType.PUSH
      );

      this.isSetup = true;
      logger.info("NotificationPublisher setup completed");
    } catch (error) {
      logger.error("Failed to setup NotificationPublisher:", error);
      throw error;
    }
  }

  async publish(
    type: NotificationType,
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
        subject: message.subject,
        body: message.body || "",
        metadata: message.metadata || {},
        timestamp: Date.now(),
      };

      if (!notificationMessage.recipient || !notificationMessage.body) {
        throw new Error("Missing required fields: recipient and body");
      }

      const result = await this.rabbit.publish(
        EXCHANGES.NOTIFICATION,
        type,
        Buffer.from(JSON.stringify(notificationMessage)),
        { persistent: true }
      );

      if (result) {
        logger.info(`Notification published successfully`, {
          type,
          messageId: notificationMessage.id,
          recipient: notificationMessage.recipient,
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
    body: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    return this.publish(NotificationType.SMS, {
      recipient,
      body,
      metadata,
    });
  }

  async publishEmail(
    recipient: string,
    subject: string,
    body: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    return this.publish(NotificationType.EMAIL, {
      recipient,
      subject,
      body,
      metadata,
    });
  }

  async publishPush(
    recipient: string,
    body: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    return this.publish(NotificationType.PUSH, {
      recipient,
      body,
      metadata,
    });
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
