# Trazabilidad de la sesión 1 contra los repositorios originales

## Base de revisión

Revisión del árbol local realizada el 16 de septiembre de 2026 (America/Bogota), ampliada con el laboratorio RabbitMQ de la sesión. No se usaron las copias de backend/frontend de la semana 06. No se ejecutaron los servicios originales ni se certifican todos sus flujos funcionales. La ejecución del broker y consumidor de laboratorio se acredita por separado.

Directorio contenedor: `C:/www/sistemas-distribuido/Multitour-Monolito-Portal`.

| Componente | Ruta dentro del contenedor | HEAD observado | Estado |
| --- | --- | --- | --- |
| Backend | `Multitour-Monolito-Api/Multitour-Monolito-Api` | `aaed367d3ddeb458f5128173a93c6069d2fb1e68` | Sin cambios locales al revisar |
| Frontend | `Multitour-Monolito-Portal` | `06fdefdadfcb66b0373973915e88304f6d098138` | Con cambios locales; la revisión incluye esos cambios, no solo HEAD |

Las siguientes rutas de frontend parten de `src/app/`. Las de backend parten de `src/main/java/com/corhuila/errorcapa8/travesia_natural/`. Son ubicaciones del código original, no archivos copiados a esta entrega.

## Matriz HTTP actual: correspondencia con código

En las rutas, `T` representa `/api/tenants/{tenantId}` y `R` representa `T/reservations`. Son abreviaturas de documentación, no rutas literales.

| Filas | Cliente HTTP del frontend | Controlador del backend | Rutas observadas |
| --- | --- | --- | --- |
| C01 | `core/tenant-api.service.ts` | `tenants/infrastructure/in/web/TenantController.java` | `/api/tenants`, `T`, `T/deactivate`, `T/reactivate` |
| C02 | `core/login-api.service.ts` | `tenants/infrastructure/in/web/AuthController.java` | POST `T/login` |
| C03 | `core/customer-api.service.ts`, `core/collaborator-api.service.ts` | `tenants/infrastructure/in/web/CustomerController.java`, `CollaboratorController.java` | POST `T/customers`; GET/POST `T/collaborators`; GET `T/collaborators/{membershipId}` |
| C04 | `core/establishment-api.service.ts` | `establishments/infrastructure/in/web/EstablishmentController.java` | `T/establishments` y operaciones por establecimiento |
| C05 | `core/catalog-api.service.ts` | `catalog/infrastructure/in/web/CatalogItemController.java` | `T/catalog-items`, consulta/PATCH por ID y activación/desactivación |
| C06 | `core/discount-api.service.ts` | `discounts/infrastructure/in/web/DiscountController.java` | `T/discounts`, consulta/PATCH por ID y activación/desactivación |
| C07 | `core/reservation-api.service.ts` | `reservations/infrastructure/in/web/ReservationController.java` | `R`, `R/{reservationId}`, `R/me`, `R/me/{reservationId}`, `cancel`, `modify` |
| C08 | `core/reservation-api.service.ts` | `reservations/infrastructure/in/web/ReservationController.java` | POST `R/{reservationId}/apply-discount` |
| C09 | `core/payment-api.service.ts` | `reservations/infrastructure/in/web/PaymentController.java` | `payments`, `payments/decide-support`, `payments/followups` bajo reserva; `R/pending-support` |
| C10 | `core/reservation-api.service.ts` | `reservations/infrastructure/in/web/ReservationController.java` | `refund`, `refund/authorize`, `refund/reject`, `refund/credit-balance` bajo reserva |
| C11 | `core/operation-api.service.ts` | `operations/infrastructure/in/web/OperationController.java` | `execution`, `costs` bajo reserva; `R/pending-execution` |
| C12 | `core/reservation-api.service.ts` | `reservations/infrastructure/in/web/ReservationController.java` | POST `R/{reservationId}/finalize` |
| C13–C14 | `core/cash-api.service.ts` | `cash/infrastructure/in/web/CashController.java` | `T/cash`, `history`, `consolidation`; `movements`, `close`, `corrections` bajo caja |
| C15 | `core/audit-api.service.ts` | `common/audit/AuditController.java` | GET `/api/audit` |

Esto acredita existencia de código cliente y servidor, no que todas las operaciones tengan autorización, aislamiento y manejo de errores certificados en ejecución.

## Dependencias internas y propuestas

| Filas | Evidencia en backend | Lectura correcta |
| --- | --- | --- |
| C16–C19 | `reservations/application/CreateReservationService.java`, `RegisterPaymentService.java`, `DecidePaymentSupportService.java` | Usan repositorios de tenant, catálogo o pertenencias dentro del mismo proceso. La frontera REST es propuesta. La validación general de cliente de C18 amplía el diseño; no se atribuye íntegramente a CreateReservationService. |
| C17 | Servicios de aplicación de cada módulo y `cash/application/TenantGuard.java` | Validaciones locales de tenant; no hay un servicio remoto llamado por HTTP en estas clases. |
| C20 | `reservations/application/ApplyDiscountReservationService.java` | Aplica `command.percentage()` y escribe auditoría; no consulta el módulo Descuentos. Esa nueva dependencia debe implementarse si se adopta el diseño. |
| C27 | `discounts/application/CreateDiscountService.java:33-49` | Valida tenant y consulta `CatalogItemRepositoryPort.findByTenantIdAndCatalogItemId` antes de guardar el descuento. Es síncrona local; al separar módulos se decide REST para resolver esa dependencia inmediata. |
| C21 | `operations/application/RegisterExecutionService.java`, `RegisterOperationCostService.java` | Consultan el repositorio de Reservas localmente; REST sustituiría esa dependencia al separar procesos. |
| C22–C23 | `cash/application/MonthlyCashConsolidationService.java` | Consulta reservas y costos mediante repositorios. Un endpoint de agregado por período es una propuesta, no una ruta existente acreditada. |
| C24 | `common/audit/AuditRecorder.java`, `common/audit/infrastructure/AuditRecorderAdapter.java` | Auditoría local persistida por JPA. No hay servicio REST de escritura de auditoría demostrado por estas clases. |
| C25–C26 | `reservations/application/RegisterPaymentService.java`, `RefundReservationService.java`; `cash/application/RegisterCashMovementService.java` | Los pagos/devoluciones se guardan en Reservas; el registro de caja es un caso de uso separado. El backend Java no integra RabbitMQ. La comunicación real se incorpora en esta sesión con publicador de eventos sintéticos y consumidor de conciliación, sin alterar esos casos de uso. |

## Diferencias que la entrega debe conservar

1. **Salud:** [HealthController](../../../../Multitour-Monolito-Portal/Multitour-Monolito-Api/Multitour-Monolito-Api/src/main/java/com/corhuila/errorcapa8/travesia_natural/common/web/HealthController.java) devuelve `UP` sin consultar PostgreSQL. El Compose utiliza `/actuator/health`, un endpoint distinto respaldado por la dependencia Actuator. No se verificó su respuesta en ejecución.
2. **Proxy y despliegue:** [nginx.conf](../../../../Multitour-Monolito-Portal/Multitour-Monolito-Portal/nginx.conf) envía `/api/` a `host.docker.internal:8081`; [proxy.conf.json](../../../../Multitour-Monolito-Portal/Multitour-Monolito-Portal/proxy.conf.json) usa `localhost:8080` en desarrollo. El Compose del backend contiene un contexto `../Frontend` inexistente localmente. La actividad no acredita un arranque completo de ese Compose.
3. **Registro/login:** `pages/signup/signup.component.ts` llama a CustomerApiService y `pages/login/login.component.ts` usa LoginUseCase. Algunos comentarios antiguos de otros servicios dicen que falta conexión; prevalece el código ejecutable revisado.
4. **Recuperación:** `pages/recover/recover.component.ts` informa que no existe el flujo real. No hay envío de correo de recuperación que presentar como implementado.
5. **Perfil y sesión:** `pages/client/client-profile.service.ts` guarda el perfil en `localStorage`; `core/session.service.ts` usa `sessionStorage`. Editar perfil no actualiza el backend y cerrar sesión limpia la sesión local.
6. **Permisos de colaboradores:** `pages/operator/collaborators/collaborators.component.ts` cambia un servicio local de roles. El backend sí expone PATCH `T/collaborator-support-permission`, pero el interruptor no lo invoca. Por eso C03 ya no afirma que ese cambio viaje por REST.
7. **Destino de eventos:** tanto la demo local como el consumidor RabbitMQ usan `idempotencia.mjs` y registran hechos para conciliación. No llaman al comando real de caja, que exige `cashRegisterId`, tipo, importe, concepto y actor. Automatizar la caja requiere otra decisión; no se debe sumar la bandeja al consolidado actual.
8. **Identificadores:** `RegisterPaymentCommand` no incluye `eventId` o una clave estable por abono. La propuesta necesita generarlas y persistirlas con la operación antes de publicar. Los IDs de la demo son sintéticos.

## Verificación de esta entrega

- Se contrastaron las decisiones con clientes HTTP, controladores, servicios y configuración originales.
- Se corrigieron referencias a la copia semanal, salud, proxy, permisos y destino de conciliación.
- La demostración local conserva sus ocho casos en [la evidencia](Evidencias/01-idempotencia.txt). El laboratorio real añade [publicaciones, duplicados y reentrega del broker](Evidencias/02-rabbitmq.txt).
- La existencia de los enlaces locales de ambos documentos se verifica desde el workspace compartido. Los enlaces a repositorios hermanos requieren conservar esa estructura fuera de este equipo.
- No se modificaron fuentes de los repositorios originales. Se desplegó RabbitMQ únicamente mediante `compose.yaml` de esta sesión, con nombre de proyecto y puertos propios.

## Implementación del laboratorio

Todas estas rutas parten de la carpeta de la sesión 1:

| Archivo | Responsabilidad / evidencia |
| --- | --- |
| `compose.yaml` | Broker real, puertos localhost 5677/15677, volumen y healthcheck |
| `rabbitmq.mjs` | Conexión AMQP, cola durable, DLQ y publicaciones persistentes con confirmación |
| `publicar-rabbitmq.mjs`, `evento-pago.json` | Productor independiente con entrada sintética, no extraída del backend |
| `consumidor-rabbitmq.mjs` | Suscripción `consume`, ACK manual después del commit y rechazo a DLQ |
| `idempotencia.mjs` | Lógica compartida de inbox, clave por movimiento y transacción SQLite |
| `verificar-rabbitmq.mjs` | Publica antes del consumo, provoca caída después del commit, verifica reentrega y efectos únicos |
| `Evidencias/02-rabbitmq.txt` | Resultado de las aserciones y filas SQL finales |
| `Evidencias/03-infraestructura.txt` | Versión del broker, imagen, salud y estado de colas |

La integración del productor en las transacciones del monolito permanece fuera de alcance. El PASS de sesión 1 corresponde al inventario corregido y a la comunicación real e idempotente del laboratorio; no certifica una migración del sistema a microservicios.
