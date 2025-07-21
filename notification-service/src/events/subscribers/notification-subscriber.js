import { ServerConfig, logger, RabbitMQ } from "../../config/index.js";

import { EXCHANGES, QUEUES, NotificationType } from "../../utils/constants.js";

const rabbit = RabbitMQ.getInstance(ServerConfig.RABBITMQ_URI);

async function setupAndConsume() {
  // Assert exchange and queues, and bind
  await rabbit.assertExchange(EXCHANGES.NOTIFICATION, "direct");
  await rabbit.assertQueue(QUEUES.SMS);
  await rabbit.assertQueue(QUEUES.EMAIL);
  await rabbit.assertQueue(QUEUES.PUSH);
  await rabbit.bindQueue(
    QUEUES.SMS,
    EXCHANGES.NOTIFICATION,
    NotificationType.SMS
  );
  await rabbit.bindQueue(
    QUEUES.EMAIL,
    EXCHANGES.NOTIFICATION,
    NotificationType.EMAIL
  );
  await rabbit.bindQueue(
    QUEUES.PUSH,
    EXCHANGES.NOTIFICATION,
    NotificationType.PUSH
  );

  await rabbit.consume(QUEUES.SMS, (msg) => {
    if (msg) {
      logger.info(`[SMS] Received: ${msg.content.toString()}`);
      // TODO: handle SMS notification logic
      rabbit.channel.ack(msg);
    }
  });

  await rabbit.consume(QUEUES.EMAIL, (msg) => {
    if (msg) {
      logger.info(`[EMAIL] Received: ${msg.content.toString()}`);
      // TODO: handle Email notification logic
      rabbit.channel.ack(msg);
    }
  });

  await rabbit.consume(QUEUES.PUSH, (msg) => {
    if (msg) {
      logger.info(`[PUSH] Received: ${msg.content.toString()}`);
      // TODO: handle Push notification logic
      rabbit.channel.ack(msg);
    }
  });
}

setupAndConsume().catch((err) => {
  logger.error("Failed to setup notification subscriber:", err);
  process.exit(1);
});
