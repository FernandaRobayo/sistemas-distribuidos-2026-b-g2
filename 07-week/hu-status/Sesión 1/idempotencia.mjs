import assert from 'node:assert/strict';

export function consume(db, event, fail = false) {
  for (const key of ['eventId', 'tenantId', 'reservationId', 'movementId']) {
    assert.equal(typeof event[key], 'string');
    assert.ok(event[key].length > 0);
  }
  assert.ok(['PagoConfirmado', 'DevolucionEjecutada'].includes(event.type));
  assert.ok(Number.isSafeInteger(event.amountMinor) && event.amountMinor > 0);
  assert.equal(event.currency, 'COP');
  const consumer = 'caja-movimientos';
  const payload = JSON.stringify([
    event.tenantId, event.movementId, event.reservationId,
    event.type, event.amountMinor, event.currency,
  ]);
  db.exec('BEGIN IMMEDIATE');
  try {
    const previous = db.prepare(`SELECT payload FROM inbox
      WHERE consumer=? AND tenant_id=? AND event_id=?`)
      .get(consumer, event.tenantId, event.eventId);
    if (previous) {
      assert.equal(previous.payload, payload, 'ID reutilizado con contenido diferente');
      db.exec('COMMIT');
      return 'DUPLICADO_EVENTO';
    }
    db.prepare('INSERT INTO inbox VALUES (?, ?, ?, ?)')
      .run(consumer, event.tenantId, event.eventId, payload);
    if (fail) throw new Error('FALLO_SIMULADO');
    const movement = db.prepare(`SELECT payload FROM movements
      WHERE tenant_id=? AND movement_id=?`).get(event.tenantId, event.movementId);
    if (movement) {
      assert.equal(movement.payload, payload, 'Movimiento reutilizado con contenido diferente');
    } else {
      db.prepare('INSERT INTO movements VALUES (?, ?, ?, ?, ?)')
        .run(event.tenantId, event.movementId, event.type, event.amountMinor, payload);
    }
    db.exec('COMMIT');
    // En el adaptador de mensajería real, el ACK se enviaría después de retornar.
    return movement ? 'DUPLICADO_MOVIMIENTO' : 'PROCESADO';
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function initialize(db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS inbox (
        consumer TEXT NOT NULL, tenant_id TEXT NOT NULL,
        event_id TEXT NOT NULL, payload TEXT NOT NULL,
        PRIMARY KEY (consumer, tenant_id, event_id)
      );
      CREATE TABLE IF NOT EXISTS movements (
        tenant_id TEXT NOT NULL, movement_id TEXT NOT NULL,
        type TEXT NOT NULL, amount_minor INTEGER NOT NULL CHECK (amount_minor > 0),
        payload TEXT NOT NULL, PRIMARY KEY (tenant_id, movement_id)
      );
    `);
}
