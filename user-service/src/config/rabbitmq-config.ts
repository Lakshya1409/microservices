import amqp, { Channel, Connection, Options } from "amqplib";
import { logger } from "./logger-config";

export class RabbitMQ {
  private static instance: RabbitMQ;
  private connection: Connection | undefined = undefined;
  private channel: Channel | undefined = undefined;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  private constructor(private uri: string) {
    // Handle graceful shutdown
    process.on("SIGINT", () => this.close());
    process.on("SIGTERM", () => this.close());
  }

  /**
   * Get singleton instance
   */
  static getInstance(uri: string): RabbitMQ {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ(uri);
    }
    return RabbitMQ.instance;
  }

  async connect(): Promise<Channel> {
    if (this.channel && this.connection) {
      return this.channel;
    }

    if (this.isConnecting) {
      await this.waitForConnection();
      if (this.channel) return this.channel;
    }

    this.isConnecting = true;

    try {
      if (!this.connection) {
        logger.info("Connecting to RabbitMQ...");
        const conn: any = await amqp.connect(this.uri);
        if (typeof conn.createChannel === "function") {
          this.connection = conn;
        } else {
          throw new Error("amqp.connect did not return a valid Connection");
        }
        this.setupConnectionHandlers();
        logger.info("Successfully connected to RabbitMQ");
        this.reconnectAttempts = 0;
      }

      if (!this.connection) {
        throw new Error("Failed to establish RabbitMQ connection");
      }

      if (!this.channel && this.connection) {
        this.channel = await (this.connection as any).createChannel();
        if (this.channel) {
          this.setupChannelHandlers();
          await this.channel.prefetch(1);
          logger.info("RabbitMQ channel created successfully");
        }
      }

      if (!this.channel) {
        throw new Error("Failed to create RabbitMQ channel");
      }

      this.isConnecting = false;
      return this.channel;
    } catch (error) {
      this.isConnecting = false;
      logger.error("Failed to connect to RabbitMQ:", error);
      await this.handleConnectionError(error);
      throw error;
    }
  }

  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.on("error", (error) => {
      logger.error("RabbitMQ connection error:", error);
      this.handleConnectionError(error);
    });

    this.connection.on("close", () => {
      logger.warn("RabbitMQ connection closed");
      this.connection = undefined;
      this.channel = undefined;
      this.attemptReconnect();
    });
  }

  private setupChannelHandlers(): void {
    if (!this.channel) return;

    this.channel.on("error", (error) => {
      logger.error("RabbitMQ channel error:", error);
      this.channel = undefined;
    });

    this.channel.on("close", () => {
      logger.warn("RabbitMQ channel closed");
      this.channel = undefined;
    });
  }

  private async handleConnectionError(error: any): Promise<void> {
    this.connection = undefined;
    this.channel = undefined;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      await this.attemptReconnect();
    } else {
      logger.error(`Max reconnection attempts reached. Giving up.`);
    }
  }

  private async attemptReconnect(): Promise<void> {
    if (this.isConnecting) return;

    this.reconnectAttempts++;
    const delay = 5000 * this.reconnectAttempts; // Progressive delay

    logger.info(
      `Attempting to reconnect to RabbitMQ (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      await this.connect();
      logger.info("Successfully reconnected to RabbitMQ");
    } catch (error) {
      logger.error(
        `Reconnection attempt ${this.reconnectAttempts} failed:`,
        error
      );
    }
  }

  private async waitForConnection(): Promise<void> {
    const maxWait = 30000; // 30 seconds
    const checkInterval = 100;
    let waited = 0;

    while (this.isConnecting && waited < maxWait) {
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      waited += checkInterval;
    }
  }

  async assertExchange(
    exchange: string,
    type: string = "direct",
    options: Options.AssertExchange = { durable: true }
  ): Promise<void> {
    try {
      const channel = await this.connect();
      await channel.assertExchange(exchange, type, options);
      logger.info(`Exchange '${exchange}' asserted successfully`);
    } catch (error) {
      logger.error(`Failed to assert exchange '${exchange}':`, error);
      throw error;
    }
  }

  async assertQueue(
    queue: string,
    options: Options.AssertQueue = { durable: true }
  ): Promise<amqp.Replies.AssertQueue> {
    try {
      const channel = await this.connect();
      const result = await channel.assertQueue(queue, options);
      logger.info(`Queue '${queue}' asserted successfully`);
      return result;
    } catch (error) {
      logger.error(`Failed to assert queue '${queue}':`, error);
      throw error;
    }
  }

  async bindQueue(
    queue: string,
    exchange: string,
    pattern: string = ""
  ): Promise<void> {
    try {
      const channel = await this.connect();
      await channel.bindQueue(queue, exchange, pattern);
      logger.info(
        `Queue '${queue}' bound to exchange '${exchange}' with pattern '${pattern}'`
      );
    } catch (error) {
      logger.error(
        `Failed to bind queue '${queue}' to exchange '${exchange}':`,
        error
      );
      throw error;
    }
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: Buffer,
    options: Options.Publish = { persistent: true }
  ): Promise<boolean> {
    try {
      const channel = await this.connect();
      const result = channel.publish(exchange, routingKey, message, options);
      if (result) {
        logger.debug(
          `Message published to exchange '${exchange}' with routing key '${routingKey}'`
        );
      } else {
        logger.warn(
          `Failed to publish message to exchange '${exchange}' - channel busy`
        );
      }
      return result;
    } catch (error) {
      logger.error(
        `Failed to publish message to exchange '${exchange}':`,
        error
      );
      throw error;
    }
  }

  async consume(
    queue: string,
    onMessage: (msg: amqp.ConsumeMessage | null) => void,
    options: Options.Consume = { noAck: false }
  ): Promise<void> {
    try {
      const channel = await this.connect();
      await channel.consume(queue, onMessage, options);
      logger.info(`Consumer set up for queue '${queue}'`);
    } catch (error) {
      logger.error(`Failed to set up consumer for queue '${queue}':`, error);
      throw error;
    }
  }

  isConnected(): boolean {
    return !!(this.connection && this.channel);
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = undefined;
        logger.info("RabbitMQ channel closed");
      }

      if (
        this.connection &&
        typeof (this.connection as any).close === "function"
      ) {
        await (this.connection as any).close();
        this.connection = undefined;
        logger.info("RabbitMQ connection closed");
      }
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error);
      this.connection = undefined;
      this.channel = undefined;
    }
  }
}
