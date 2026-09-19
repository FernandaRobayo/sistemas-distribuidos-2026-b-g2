import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import Ajv from 'ajv/dist/2020.js';
import YAML from 'yaml';
import { consume, initialize } from '../../Sesión 1/idempotencia.mjs';
import { publishFile, queue } from '../../Sesión 1/rabbitmq.mjs';

const file = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const ajv = new Ajv({ strict: true });
const cases = [
  ['PagoConfirmado', '../contracts/events/pago-confirmado.v1.schema.json', '../../Sesión 1/evento-pago.json'],
  ['DevolucionEjecutada', '../contracts/events/devolucion-ejecutada.v1.schema.json', '../contracts/events/devolucion-ejecutada.example.json'],
];

for (const [type, schemaPath, examplePath] of cases) {
  test(`Caja consume el payload publicado de ${type} v1`, async () => {
    const schema = file(schemaPath);
    const validate = ajv.compile(schema);
    let sent;
    const channel = {
      sendToQueue(name, body, options, callback) {
        sent = { name, body, options };
        callback(null);
      },
    };
    const source = file(examplePath);
    await publishFile(channel, new URL(examplePath, import.meta.url));
    assert.ok(sent, 'El publicador no envió un mensaje');
    assert.equal(sent.name, queue);
    assert.equal(sent.options.persistent, true);
    assert.equal(sent.options.contentType, 'application/json');
    const event = JSON.parse(sent.body.toString('utf8'));
    assert.equal(sent.options.messageId, event.eventId);
    assert.equal(event.type, type);
    assert.equal(event.eventId, source.eventId);
    assert.equal(validate(event), true, JSON.stringify(validate.errors));

    // La expectativa del consumidor incluye el efecto y la deduplicación reales.
    const db = new DatabaseSync(':memory:');
    try {
      initialize(db);
      assert.equal(consume(db, event), 'PROCESADO');
      assert.equal(consume(db, event), 'DUPLICADO_EVENTO');
      assert.equal(db.prepare('SELECT COUNT(*) AS n FROM movements').get().n, 1);
      assert.equal(db.prepare('SELECT amount_minor FROM movements').get().amount_minor, event.amountMinor);
    } finally {
      db.close();
    }

    assert.equal(validate({ ...event, amountMinor: -1 }), false);
    assert.equal(validate({ ...event, type: 'PagoPendiente' }), false);
    const missingTenant = { ...event };
    delete missingTenant.tenantId;
    assert.equal(validate(missingTenant), false);
    assert.equal(validate({ ...event, optionalProducerField: 'compatible' }), true);
  });
}

test('OpenAPI propuesto es YAML válido y resuelve sus referencias locales', () => {
  const spec = YAML.parse(readFileSync(new URL('../contracts/openapi.yaml', import.meta.url), 'utf8'));
  assert.equal(spec.openapi, '3.0.3');
  assert.equal(Object.keys(spec.paths).length, 5);
  const walk = value => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.$ref === 'string') {
      assert.ok(value.$ref.startsWith('#/'), `Referencia externa inesperada: ${value.$ref}`);
      const target = value.$ref.slice(2).split('/').reduce((part, key) => part?.[key], spec);
      assert.ok(target, `Referencia sin destino: ${value.$ref}`);
    }
    Object.values(value).forEach(walk);
  };
  walk(spec);
});
