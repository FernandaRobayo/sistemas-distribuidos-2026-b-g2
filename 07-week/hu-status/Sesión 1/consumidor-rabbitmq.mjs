import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { consume, initialize } from './idempotencia.mjs';
import { connect, topology, queue } from './rabbitmq.mjs';

const file = process.env.DATABASE_FILE || '.runtime/conciliacion.sqlite';
mkdirSync(dirname(file), { recursive: true });
const db = new DatabaseSync(file);
initialize(db);
const connection = await connect();
const channel = await connection.createChannel();
await topology(channel);
await channel.prefetch(1);
function report(data) {
  console.log(JSON.stringify(data));
  if (process.send) process.send(data);
}
const { consumerTag } = await channel.consume(queue, message => {
  if (!message) return;
  let event;
  let result;
  try {
    event = JSON.parse(message.content.toString('utf8'));
    result = consume(db, event);
  } catch (error) {
    // Errores se conservan en DLQ para revisión; no se reencolan en bucle.
    channel.nack(message, false, false);
    report({ status: 'DLQ', messageId: message.properties.messageId, reason: error.message });
    return;
  }
  if (process.argv.includes('--crash-after-commit') && result === 'PROCESADO') {
    // Solo inyección de fallo de la verificación: persistido, sin ACK.
    console.log(JSON.stringify({ status: 'CRASH_AFTER_COMMIT', eventId: event.eventId }));
    process.exit(86);
  }
  channel.ack(message);
  report({ status: result, eventId: event.eventId, type: event.type,
    redelivered: message.fields.redelivered, ack: true });
}, { noAck: false });
report({ status: 'READY', queue });
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await channel.cancel(consumerTag);
  await channel.close();
  await connection.close();
  db.close();
  if (process.connected) process.disconnect();
}
process.on('message', message => { if (message === 'stop') void stop(); });
process.on('SIGINT', () => void stop());
process.on('SIGTERM', () => void stop());
