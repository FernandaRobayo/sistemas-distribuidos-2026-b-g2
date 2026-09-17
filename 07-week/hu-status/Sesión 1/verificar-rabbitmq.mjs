import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { connect, topology, publish } from './rabbitmq.mjs';

// Cola y BD propias por ejecución: no purga ni elimina datos de otros ensayos.
const runId = randomUUID();
const queue = `caja.movimientos.verificacion-${runId}`;
const database = resolve('.runtime', `${runId}.sqlite`);
const lines = [];
function log(message) { lines.push(message); console.log(message); }
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(condition, description) {
  const deadline = Date.now() + 20000;
  while (!condition()) {
    if (Date.now() > deadline) throw Error(`Timeout: ${description}`);
    await delay(50);
  }
}
const children = [];
function worker(crash = false) {
  const child = fork(fileURLToPath(new URL('./consumidor-rabbitmq.mjs', import.meta.url)),
    crash ? ['--crash-after-commit'] : [], {
      env: { ...process.env, AMQP_QUEUE: queue, DATABASE_FILE: database },
      silent: true, windowsHide: true,
    });
  const state = { child, messages: [], exited: false, code: undefined, error: undefined };
  child.on('message', data => state.messages.push(data));
  child.on('exit', code => { state.exited = true; state.code = code; });
  child.on('error', error => { state.error = error; state.exited = true; });
  child.stdout.on('data', chunk => {
    for (const line of chunk.toString().trim().split('\n')) log(`CONSUMER ${line}`);
  });
  child.stderr.on('data', chunk => process.stderr.write(chunk));
  children.push(state);
  return state;
}
log(`Multi Tour / Semana 07 / RabbitMQ real / ${new Date().toISOString()}`);
log(`Node ${process.version}; queue=${queue}; datos sintéticos; sin backend Java`);
const connection = await connect();
let channel;
try {
  channel = await connection.createConfirmChannel();
  await topology(channel, queue);
  const payment = JSON.parse(readFileSync('evento-pago.json', 'utf8'));
  const refund = { ...payment, eventId: 'EVENT-002', movementId: 'REFUND-001',
    type: 'DevolucionEjecutada', amountMinor: 5000000 };
  for (const event of [payment, payment, refund, refund]) {
    await publish(channel, event, queue);
    log(`BROKER_CONFIRM ${event.eventId} ${event.type}`);
  }
  const pending = await channel.checkQueue(queue);
  assert.equal(pending.messageCount, 4);
  assert.equal(pending.consumerCount, 0);
  log('PASS: 4 publicaciones confirmadas y pendientes con 0 consumidores; productor desacoplado.');

  const first = worker(true);
  await until(() => first.exited, 'caída controlada del primer consumidor');
  if (first.error) throw first.error;
  assert.equal(first.code, 86);
  const before = new DatabaseSync(database, { readOnly: true });
  assert.equal(before.prepare('SELECT COUNT(*) AS n FROM movements').get().n, 1);
  before.close();
  log('PASS: consumidor terminó después del COMMIT y antes del ACK; 1 efecto persistido.');

  const second = worker();
  await until(() => second.messages.filter(m => m.ack).length === 4 || second.exited,
    'consumo de cuatro mensajes incluyendo reentrega');
  if (second.error) throw second.error;
  assert.equal(second.exited, false, 'El consumidor terminó inesperadamente');
  const deliveries = second.messages.filter(m => m.ack);
  assert.equal(deliveries.length, 4);
  assert.ok(deliveries.some(m => m.eventId === payment.eventId && m.redelivered && m.status === 'DUPLICADO_EVENTO'));
  assert.equal(deliveries.filter(m => m.eventId === payment.eventId).length, 2);
  assert.equal(deliveries.filter(m => m.eventId === refund.eventId).length, 2);
  second.child.send('stop');
  await until(() => second.exited, 'cierre del consumidor después de ACK');
  assert.equal(second.code, 0);

  const db = new DatabaseSync(database, { readOnly: true });
  const movements = db.prepare('SELECT tenant_id, movement_id, type, amount_minor FROM movements ORDER BY movement_id').all();
  const inbox = db.prepare('SELECT event_id FROM inbox ORDER BY event_id').all();
  db.close();
  assert.equal(movements.length, 2);
  assert.equal(inbox.length, 2);
  assert.equal(movements.find(m => m.movement_id === 'PAY-001').amount_minor, 15000000);
  assert.equal(movements.find(m => m.movement_id === 'REFUND-001').amount_minor, 5000000);
  const remaining = await channel.checkQueue(queue);
  const dlq = await channel.checkQueue(`${queue}.dlq`);
  assert.equal(remaining.messageCount, 0);
  assert.equal(remaining.consumerCount, 0);
  assert.equal(dlq.messageCount, 0);
  log('PASS: RabbitMQ reentregó EVENT-001 (redelivered=true); deduplicado tras reinicio.');
  log('PASS: pago publicado dos veces -> 1 efecto; devolución publicada dos veces -> 1 efecto.');
  log(`SQL movements=${JSON.stringify(movements)}`);
  log(`SQL inbox=${JSON.stringify(inbox)}`);
  log('PASS: cola vacía, consumidor cerrado tras ACK y DLQ vacía.');
  log('RESULTADO: PASS - 4 publicaciones, 5 entregas (incluida caída), 2 efectos persistidos.');
  mkdirSync('Evidencias', { recursive: true });
  writeFileSync('Evidencias/02-rabbitmq.txt', lines.join('\n') + '\n');
} finally {
  for (const state of children) {
    if (!state.exited) {
      state.child.kill();
      await until(() => state.exited, 'terminación del proceso de prueba');
    }
  }
  if (channel) await channel.close();
  await connection.close();
}
