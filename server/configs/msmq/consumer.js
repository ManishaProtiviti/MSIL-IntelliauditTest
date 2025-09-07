import { Environment } from '../../constants.js';
import { uploadRequestConsumer } from '../../handlers/msmq/uploadRequestConsumer.js';
import { connectRabbitMQ, emitter } from './connection.js';

const QUEUE = Environment.MSIL_UPLOAD_REQUEST_QUEUE

async function startConsumer() {
  if(!Environment.AMQP_ENABLED) {
    console.log('Consumer will not start because AMQP is disabled via environment variable');
    return;
  }
  try {
    const { channel } = await connectRabbitMQ();
    await channel.assertQueue(QUEUE, { durable: false });

    channel.consume(QUEUE, (msg) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log('📥 Consumed:', data);
          channel.ack(msg);
          uploadRequestConsumer(msg.content.toString())
        } catch(e) {
          console.log('message consumed error', e)
          channel.nack(msg);
        }
      }
    });

    console.log(`[*] Waiting for messages in queue: ${QUEUE}`);
  } catch (err) {
    console.error('❌ Consumer failed:', err.message);
  }
}
emitter.on('connected', () => {
  startConsumer();
});

export { startConsumer };
