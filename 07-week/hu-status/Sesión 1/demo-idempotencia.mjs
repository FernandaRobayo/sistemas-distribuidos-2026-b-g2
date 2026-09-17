import { consume, initialize } from './idempotencia.mjs';
// Demostración aislada: no conecta con RabbitMQ ni con el backend de Multi Tour.
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';


if (process.argv[2] === '--consume') {
  const db = new DatabaseSync(process.argv[3]);
  try {
    console.log(consume(db, JSON.parse(process.argv[4]), process.argv[5] === 'fail'));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
} else {
  const directory = mkdtempSync(join(tmpdir(), 'multitour-week07-'));
  const path = join(directory, 'demo.sqlite');
  const db = new DatabaseSync(path);
  try {
    initialize(db);
    const event = {
      eventId: 'EVENT-001', type: 'PagoConfirmado', tenantId: 'travesia-natural',
      reservationId: 'RES-001', movementId: 'PAY-001', amountMinor: 15000000,
      currency: 'COP',
    };
    function deliver(message, expected, fail = false) {
      // Cada entrega ocurre en un proceso nuevo que abre la misma BD persistente.
      const result = spawnSync(process.execPath, [
        fileURLToPath(import.meta.url), '--consume', path,
        JSON.stringify(message), fail ? 'fail' : 'ok',
      ], { encoding: 'utf8', windowsHide: true });
      if (result.error) throw result.error;
      if (expected === 'ERROR') {
        assert.equal(result.status, 1, result.stderr);
        return result.stderr;
      }
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout.trim(), expected);
    }
    const count = () => db.prepare('SELECT COUNT(*) AS n FROM movements').get().n;
    console.log(`Multi Tour - Semana 07 - ${new Date().toISOString()}`);
    console.log(`Runtime: ${process.version}; consumidor aislado, SQLite persistente, sin broker`);
    deliver(event, 'PROCESADO');
    assert.equal(count(), 1);
    console.log('PASS 1: EVENT-001 -> 1 movimiento');
    deliver(event, 'DUPLICADO_EVENTO');
    assert.equal(count(), 1);
    console.log('PASS 2: reentrega tras reinicio -> sigue 1 movimiento');
    deliver({ ...event, eventId: 'EVENT-ALIAS' }, 'DUPLICADO_MOVIMIENTO');
    assert.equal(count(), 1);
    console.log('PASS 3: otro eventId para PAY-001 -> sigue 1 movimiento');
    const second = { ...event, eventId: 'EVENT-002', movementId: 'PAY-002' };
    assert.match(deliver(second, 'ERROR', true), /FALLO_SIMULADO/);
    assert.equal(count(), 1);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM inbox WHERE event_id='EVENT-002'").get().n, 0);
    console.log('PASS 4: fallo antes del efecto -> rollback de inbox y movimiento');
    deliver(second, 'PROCESADO');
    deliver(second, 'DUPLICADO_EVENTO');
    assert.equal(count(), 2);
    console.log('PASS 5: reintento tras rollback -> un segundo movimiento, sin duplicar');
    deliver({ ...event, tenantId: 'otro-tenant' }, 'PROCESADO');
    assert.equal(count(), 3);
    console.log('PASS 6: mismos IDs en otro tenant -> registro independiente');
    assert.match(deliver({ ...event, amountMinor: 999 }, 'ERROR'), /contenido diferente/);
    assert.equal(count(), 3);
    assert.equal(db.prepare(`SELECT amount_minor FROM movements
      WHERE tenant_id=? AND movement_id=?`).get(event.tenantId, event.movementId).amount_minor, 15000000);
    console.log('PASS 7: mismo ID con importe alterado -> rechazado, importe original conservado');
    const refund = { ...event, eventId: 'EVENT-003', movementId: 'REFUND-001', type: 'DevolucionEjecutada' };
    deliver(refund, 'PROCESADO');
    deliver(refund, 'DUPLICADO_EVENTO');
    assert.equal(count(), 4);
    console.log('PASS 8: devolución duplicada -> una sola devolución');
    console.log('RESULTADO: 8 casos correctos. No se modificaron datos del sistema real.');
  } finally {
    db.close();
    unlinkSync(path);
    rmdirSync(directory);
  }
}
