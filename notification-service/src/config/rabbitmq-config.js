import amqp from "amqplib";
import { logger } from "./logger-config.js";

export class RabbitMQ {
  constructor(uri) {
    this.uri = uri;
    this.connection = null;
    this.channel = null;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    process.on("SIGINT", () => this.close());
    process.on("SIGTERM", () => this.close());
  }

  static getInstance(uri) {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ(uri);
    }
    return RabbitMQ.instance;
  }

  async connect() {
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
        this.connection = await amqp.connect(this.uri);
        this.setupConnectionHandlers();
        logger.info("Successfully connected to RabbitMQ");
        this.reconnectAttempts = 0;
      }
      if (!this.connection) {
        throw new Error("Failed to establish RabbitMQ connection");
      }
      if (!this.channel) {
        this.channel = await this.connection.createChannel();
        this.setupChannelHandlers();
        await this.channel.prefetch(1);
        logger.info("RabbitMQ channel created successfully");
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

  setupConnectionHandlers() {
    if (!this.connection) return;
    this.connection.on("error", (error) => {
      logger.error("RabbitMQ connection error:", error);
      this.handleConnectionError(error);
    });
    this.connection.on("close", () => {
      logger.warn("RabbitMQ connection closed");
      this.connection = null;
      this.channel = null;
      this.attemptReconnect();
    });
  }

  setupChannelHandlers() {
    if (!this.channel) return;
    this.channel.on("error", (error) => {
      logger.error("RabbitMQ channel error:", error);
      this.channel = null;
    });
    this.channel.on("close", () => {
      logger.warn("RabbitMQ channel closed");
      this.channel = null;
    });
  }

  async handleConnectionError(error) {
    this.connection = null;
    this.channel = null;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      await this.attemptReconnect();
    } else {
      logger.error(`Max reconnection attempts reached. Giving up.`);
    }
  }

  async attemptReconnect() {
    if (this.isConnecting) return;
    this.reconnectAttempts++;
    const delay = 5000 * this.reconnectAttempts;
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

  async waitForConnection() {
    const maxWait = 30000;
    const checkInterval = 100;
    let waited = 0;
    while (this.isConnecting && waited < maxWait) {
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      waited += checkInterval;
    }
  }

  async assertExchange(exchange, type = "direct", options = { durable: true }) {
    try {
      const channel = await this.connect();
      await channel.assertExchange(exchange, type, options);
      logger.info(`Exchange '${exchange}' asserted successfully`);
    } catch (error) {
      logger.error(`Failed to assert exchange '${exchange}':`, error);
      throw error;
    }
  }

  async assertQueue(queue, options = { durable: true }) {
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

  async bindQueue(queue, exchange, pattern = "") {
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

  async publish(exchange, routingKey, message, options = { persistent: true }) {
    try {
      const channel = await this.connect();
      const result = channel.publish(
        exchange,
        routingKey,
        Buffer.from(message),
        options
      );
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

  async consume(queue, onMessage, options = { noAck: false }) {
    try {
      const channel = await this.connect();
      await channel.consume(queue, onMessage, options);
      logger.info(`Consumer set up for queue '${queue}'`);
    } catch (error) {
      logger.error(`Failed to set up consumer for queue '${queue}':`, error);
      throw error;
    }
  }

  isConnected() {
    return !!(this.connection && this.channel);
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
        logger.info("RabbitMQ channel closed");
      }
      if (this.connection && typeof this.connection.close === "function") {
        await this.connection.close();
        this.connection = null;
        logger.info("RabbitMQ connection closed");
      }
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error);
      this.connection = null;
      this.channel = null;
    }
  }
}

RabbitMQ.instance = null;
