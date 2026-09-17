import { readFileSync } from 'node:fs';
import { connect, topology, publish, queue } from './rabbitmq.mjs';

const event = JSON.parse(readFileSync(process.argv[2] || 'evento-pago.json', 'utf8'));
const connection = await connect();
try {
  const channel = await connection.createConfirmChannel();
  await topology(channel);
  await publish(channel, event);
  console.log(JSON.stringify({ status: 'BROKER_CONFIRM', queue, eventId: event.eventId }));
  await channel.close();
} finally {
  await connection.close();
}
