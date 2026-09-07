# Semana 1 · Sesión 2

## Objetivo de la actividad

Configurar el repositorio de perfil (bloque CONFIG) y la bifurcación académica, completar `01-week/hu-status/README.md` como índice de la semana, documentar el repositorio `docs` del equipo, y elaborar el ADR-001 (estilo arquitectónico inicial) junto con el backlog inicial de MVP 1 con criterios de aceptación comprobables. Fuente funcional: **PDR Multi tour v1.7.1 — 2026-09-03**.

## 1. Repositorio de perfil y CONFIG

El repositorio raíz (`README.md`) ya documenta la convención exacta que debe reutilizarse, sin inventar claves nuevas:

```
Create your profile repo `username/username` with a CONFIG block:

<!-- CONFIG
FULL_NAME: Your Full Name
GITHUB_USER: your-github-user
-->
```

A partir de la evidencia ya presente en este repositorio (`01-week/hu-status/README.md`, bloque `CONFIG-START`/`CONFIG-END`):

| Dato | Valor verificado localmente |
| --- | --- |
| FULL_NAME | Maria Fernanda Robayo Laguna |
| GITHUB_USER | FernandaRobayo |
| TEAM | ErrorCapa8 |

Repositorio de perfil esperado, según la convención `username/username` ya documentada en la raíz de este repositorio: `github.com/FernandaRobayo/FernandaRobayo`.

**Estado: ⚠️ REQUIERE VERIFICACIÓN MANUAL EN GITHUB.** El bloque CONFIG del repositorio de perfil vive en un repositorio distinto a este (`FernandaRobayo/FernandaRobayo`), que no está clonado ni presente en este checkout local. No puede confirmarse desde aquí que ese repositorio exista ni que contenga el bloque CONFIG con los valores anteriores.

### Evidencia pendiente
El estudiante debe verificar manualmente en GitHub:
1. Que existe el repositorio `https://github.com/FernandaRobayo/FernandaRobayo`.
2. Que su `README.md` contiene el bloque `<!-- CONFIG ... -->` con `FULL_NAME` y `GITHUB_USER` coincidiendo exactamente con los valores usados en `01-week/hu-status/README.md`.

## 2. Bifurcación / fork

Verificación ejecutada localmente (sin modificar remotes, sin crear fork, sin hacer push):

```
git remote -v
origin  git@github.com:FernandaRobayo/sistemas-distribuidos-2026-b-g2.git (fetch)
origin  git@github.com:FernandaRobayo/sistemas-distribuidos-2026-b-g2.git (push)

git branch --show-current
main
```

Solo existe el remoto `origin`; no hay un remoto `upstream` configurado localmente. Sin embargo, el historial de commits sí deja evidencia local de la relación de bifurcación: el commit `90397ec` registra explícitamente **"Merge branch 'code-corhuila:main' into main"**, lo que confirma que este repositorio recibió una sincronización desde `code-corhuila/sistemas-distribuidos-2026-b-g2` (el repositorio base del curso, según también lo referencia `README.md` raíz: `code-corhuila.github.io/ova-web/...`).

**Estado: ✅ VERIFICADO (parcial).** La relación de bifurcación con `code-corhuila/sistemas-distribuidos-2026-b-g2` queda evidenciada en el historial de Git local (commit de merge), aunque no hay un remoto `upstream` configurado en este checkout. La existencia formal del fork como tal en GitHub (relación "forked from" visible en la interfaz web) queda como:

### Evidencia pendiente
El estudiante debe verificar manualmente en GitHub que `github.com/FernandaRobayo/sistemas-distribuidos-2026-b-g2` muestra la etiqueta "forked from code-corhuila/sistemas-distribuidos-2026-b-g2".

## 3. Evidencia del hu-status

- `01-week/hu-status/README.md` ya existía (plantilla de estado semanal, en inglés, con lectura automática de calificación). Se completó únicamente la sección "6. Evidence links" para enlazar la Sesión 1 y esta Sesión 2, sin alterar su estructura, marcadores ni el resto de su contenido.
- `01-week/hu-status/Sesión 1/README.md` ya existía (creado en la actividad anterior de esta misma semana) y **no fue modificado** en esta sesión.

## 4. Repositorio docs del equipo

**Estado: ✅ EXISTE.**

| Dato | Valor |
| --- | --- |
| Nombre del repositorio | `travesia-natural-docs` (organización `code-corhuila`) |
| Integrante responsable | `@Molina211` (coautor del PDR, ver Sesión 1) |
| Propósito | Documentación técnica del proyecto: gobernanza, contexto, dominio, producto y datos, según el framework de gobernanza de microservicios usado por el curso. |
| Evidencia local | `docs/index.html` (tracker de avance del curso) confirma el repositorio con contenido real en Contexto (🟢), Dominio (🟢), Producto (🟢) y Datos (🟢); UX/UI queda pendiente (🔴). `01-week/hu-status/README.md` enlaza directamente `https://github.com/Molina211/Travesia-Natural-docs`. |

**Relación con Multi Tour.** El repositorio se llama `travesia-natural-docs` porque nació documentando el caso base de validación (Travesía Natural), pero su contenido ya describe la plataforma multitenencia completa: el propio tracker registra su overview como "plataforma de turismo multitenant con roles específicos (Platform Admin, Tenant Admin, Colaborador, Cliente)". Es decir: **Multi Tour es la plataforma documentada; Travesía Natural es el tenant de validación que da nombre histórico al repositorio.** No se propone renombrar el repositorio; se documenta la relación tal como está.

## 5. ADR-001

Ver [ADR-001](./ADR-001.md) — "Estilo arquitectónico inicial de Multi Tour", Estado: Propuesto.

Registra tres decisiones distintas y complementarias: DDD para los límites de dominio, Arquitectura Hexagonal para la separación interna (dominio sin I/O, convención ya usada por el curso), y sistema distribuido por dominios como dirección candidata de despliegue, constreñida por la restricción académica obligatoria del PDR (4 Micro Frontends, Angular/React, Java/Go, PostgreSQL/MongoDB), cuya asignación concreta queda pendiente de la etapa de arquitectura.

**Observación (no es una contradicción, es una coincidencia de nomenclatura):** este repositorio ya contiene otro archivo también titulado "ADR-001" en `04-week/hu-status/Sesión 2/ADR-001-mvp1-ownership-contexts.md`, con Estado: Aceptado. Ese documento resuelve una decisión distinta y más específica (ownership de endpoints concretos del contrato OpenAPI por bounded context), fechada varias semanas después. No se modificó ni se referenció como si fuera el mismo documento; se deja constancia de que ambos archivos coexisten con el mismo número de ADR en carpetas de semanas distintas.

## 6. Backlog inicial del MVP 1

Ver [Backlog MVP 1](./BACKLOG-MVP1.md) — 9 historias de usuario, todas con dos criterios de aceptación comprobables (formato DADO/CUANDO/ENTONCES) y evidencia esperada verificable como PASS/FAIL.

El backlog cubre la cadena de dependencias: contexto multitenant → identidad/autenticación → catálogo (solo consulta) → cliente → reserva → pago básico, y se contrastó (sin copiarlo) contra la priorización MoSCoW ya consolidada en `04-week/hu-status/Sesión 2/sprint-mvp1-moscow.md` para mantener consistencia con el alcance de MVP 1 que el proyecto ya definió más adelante.

## 7. Relación con la Sesión 1

Se revisó `01-week/hu-status/Sesión 1/README.md` antes de escribir esta sesión, sin modificarlo. La Sesión 2 es coherente con lo ya establecido en la Sesión 1:

- **Problema y actores:** el ADR-001 y el backlog reutilizan los mismos actores (Administrador de plataforma, Administrador, Colaborador operativo, Cliente final) y la misma identidad de producto (Multi Tour = plataforma, Travesía Natural = tenant de validación) ya fijados en la Sesión 1.
- **Operaciones críticas y consistencia:** el ADR-001 cita directamente los resultados de la Sesión 1 (15 operaciones con consistencia fuerte, 2 con consistencia eventual) como parte de la justificación de por qué los dominios pueden evolucionar de forma independiente.
- **Semántica de entrega:** las historias de reserva (HU-05) y pago (HU-07) del backlog incorporan explícitamente el criterio de no duplicidad ante reintentos (idempotencia) ya identificado en la Sesión 1 para esas mismas operaciones.

**No se detectaron contradicciones** entre la Sesión 1 y el contenido producido en esta Sesión 2, más allá de la coincidencia de nomenclatura de ADR-001 ya reportada en la sección 5.

## Conclusiones

Esta sesión deja registrada una dirección arquitectónica inicial (DDD + Hexagonal + distribución por dominios candidata) coherente con las restricciones académicas obligatorias del PDR y con el análisis de consistencia ya producido en la Sesión 1, sin cerrar decisiones que el propio PDR reserva para la etapa de arquitectura. El backlog inicial de MVP 1 traduce esa dirección en un corte vertical pequeño y verificable (9 historias, 18 criterios de aceptación comprobables), evitando repetir el alcance completo del PDR y manteniéndose consistente con la definición de MVP 1 que el proyecto ya consolidó en una semana posterior. Los puntos que dependen de GitHub (repositorio de perfil y relación formal de fork) quedan documentados como evidencia pendiente de verificación manual, sin inventar URLs ni capturas.
