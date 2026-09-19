import { connect, topology, publishFile, queue } from './rabbitmq.mjs';

const connection = await connect();
try {
  const channel = await connection.createConfirmChannel();
  await topology(channel);
  const event = await publishFile(channel, process.argv[2] || 'evento-pago.json');
  console.log(JSON.stringify({ status: 'BROKER_CONFIRM', queue, eventId: event.eventId }));
  await channel.close();
} finally {
  await connection.close();
}
