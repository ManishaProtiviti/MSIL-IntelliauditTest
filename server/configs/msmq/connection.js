import amqp from 'amqplib';
import { EventEmitter } from 'events';
import { Environment } from '../../constants.js';

const emitter = new EventEmitter();

const RABBITMQ_URL = Environment.AMQP_URL;

let connection = null;
let channel = null;

async function connectRabbitMQ() {
  if (connection) return { connection, channel };

  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log('✅ Connected to RabbitMQ');
    emitter.emit('connected');

    connection.on('error', (err) => {
      console.error('⚠️ RabbitMQ connection error:', err.message);
      connection = null;
      channel = null;
      retryConnect();
    });

    connection.on('close', () => {
      console.error('❌ RabbitMQ connection closed');
      connection = null;
      channel = null;
      retryConnect();
    });

    return { connection, channel };
  } catch (err) {
    console.error('❌ Failed to connect to RabbitMQ:', err.message);
    retryConnect();
  }
}

function retryConnect(delay = 3000) {
  setTimeout(() => {
    console.log('🔁 Retrying RabbitMQ connection...');
    connectRabbitMQ();
  }, delay);
}

export { connectRabbitMQ, emitter };
