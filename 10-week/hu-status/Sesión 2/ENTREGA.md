# Entrega documental · Semana 10, sesión 2

Fecha de cierre: 2026-10-12, America/Bogota. Autora: Maria Fernanda Robayo Laguna.
**Lista para revisión documental. La entrega integrada de MVP 2 sigue parcial.**
Alcance: únicamente este repositorio. No se modifican ni consultan repositorios externos.

## Material preparado

- [Informe, checklist y límites de la evidencia](README.md#lista-de-entrega-y-dod).
- [Retrospectiva técnica](README.md#retrospectiva-técnica-preliminar) y [guion de demostración pendiente](README.md#guion-de-demostración-integrada-pendiente).
- [Evidencias originales](Evidencias/resultados.json), [antecedentes de correcciones](Evidencias/correcciones.json) y [verificación local](Evidencias/auditoria-local.json).
- [Notas del candidato](CHANGELOG.md) y [backlog propuesto para Corte 3](README.md#pendientes-propuestos-para-corte-3).

## Participación y cierre pendiente

| Responsable | Evidencia disponible | Pendiente |
| --- | --- | --- |
| Fernanda | Informe, logs archivados, validación local y seguimiento semanal | Publicación del paquete académico |
| Jhon | No se ha aportado un enlace individual en este paquete | Adjuntar sus PR/commits y aportes; no se certifica su participación |
| Equipo | Retrospectiva técnica preparada y backlog propuesto | Confirmar acuerdos, responsables y retrospectiva conjunta |
| Docente | La norma exige revisión de main | Aprobación de los PR correspondientes; no se presume concedida |

Las suites archivadas del candidato contienen 467 casos hoja; las correcciones previas, 113.
Son ejecuciones de versiones diferentes y no se suman como pruebas únicas del MVP.
Los cuatro escenarios de fallo son un subconjunto de la suite del workflow.
Las referencias remotas son snapshots del 11 de octubre, no comprobaciones actuales.

## Revisión dentro de este repositorio

Ejecutar `& '.\10-week\hu-status\Sesión 2\verificar.ps1'` desde la raíz.
Resultado: valida archivos y escribe `Evidencias/auditoria-local.json`; no ejecuta el producto.
El cierre técnico requiere participantes reales, consumidores, deduplicación, aislamiento,
promoción aprobada y tag, según el checklist del informe. Esas tareas quedan fuera de este alcance.

Publicación académica pendiente en `docs/10-week-mvp2-session-2`, mediante PR a main (norm 6.1).
Título propuesto: `docs(10-week): finalize local mvp2 evidence and corte 3 handoff`.
Descripción propuesta: "Document the partial MVP 2 candidate and Corte 3 handoff for HU-WRK-007.
Validate archived evidence offline and record the remaining integration and release requirements."
El enlace formal a la issue de la HU debe confirmarse antes del PR (norm 9.1).
