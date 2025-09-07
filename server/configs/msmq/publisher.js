import { Environment } from "../../constants.js";
import { connectRabbitMQ } from "./connection.js";
async function publishToQueue(queue, data) {
  if (!Environment.AMQP_ENABLED) {
    console.log(
      "message can not be publish because AMQP is disabled via environment variable"
    );
    return;
  }
  try {
    const { channel } = await connectRabbitMQ();
    await channel.assertQueue(queue, { durable: false });
    const payload = Buffer.from(JSON.stringify(data));
    channel.sendToQueue(queue, payload);
    console.log(`📤 Published to queue '${queue}'`);
  } catch (err) {
    console.error("❌ Failed to publish message:", err.message);
  }
}

export { publishToQueue };
