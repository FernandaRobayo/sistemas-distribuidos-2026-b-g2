import amqp from 'amqplib';
import { readFileSync } from 'node:fs';

export const queue = process.env.AMQP_QUEUE || 'caja.movimientos';
export async function connect() {
  return amqp.connect(process.env.AMQP_URL ||
    'amqp://week07:week07-local-demo@127.0.0.1:5677', { timeout: 10000 });
}
export async function topology(channel, name = queue) {
  await channel.assertQueue(`${name}.dlq`, { durable: true });
  return channel.assertQueue(name, {
    durable: true,
    arguments: { 'x-dead-letter-exchange': '', 'x-dead-letter-routing-key': `${name}.dlq` },
  });
}
export async function publish(channel, event, name = queue) {
  // Confirmación del broker, sin esperar al consumidor de negocio.
  return new Promise((resolve, reject) => {
    channel.sendToQueue(name, Buffer.from(JSON.stringify(event)), {
      persistent: true, contentType: 'application/json', messageId: event.eventId,
    }, error => error ? reject(error) : resolve());
  });
}

export async function publishFile(channel, file, name = queue) {
  const event = JSON.parse(readFileSync(file, 'utf8'));
  await publish(channel, event, name);
  return event;
}
