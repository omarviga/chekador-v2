# Sustitución del CFDI de nómina (motivo 01)

Guía del flujo que reemplaza un CFDI por otro, con las reglas verificadas y
las decisiones de diseño.

> **Estado:** la lógica está completa y cubierta por **35 pruebas**. **No se
> ha probado sustituyendo un CFDI real**: no había credenciales de Facturapi.
> Ver § 6.

---

## 1. Qué es una sustitución y por qué el orden no es negociable

Una sustitución reemplaza un CFDI por otro. El SAT prescribe **este orden**
(presentación [Esquema de cancelación de CFDI 2026](https://www.sat.gob.mx/minisitio/Factura/documentos/EsquemaCancelacionCFDI.pdf)):

1. **Emitir** el CFDI nuevo, registrando en CFDI Relacionados la clave
   **`04` — «Sustitución de los CFDI previos»** y el UUID del erróneo.
2. **Cancelar** el original con motivo **`01`** y el UUID del sustituto.

**Si se invierte el orden, se pierde el comprobante fiscal de un pago que sí
ocurrió.** El SAT rechaza la cancelación con motivo 01 cuando el UUID de
sustitución no existe todavía: quedaría el original cancelado y el sustituto
sin emitir, es decir, el recibo **sin ningún CFDI vigente**.

Por eso todo el diseño gira alrededor de una idea: **el original no se toca
mientras el sustituto no esté timbrado.**

### La clave de relación

| Clave | Descripción |
|---|---|
| `04` | Sustitución de los CFDI previos |

Fuente: tabla «Relación entre facturas» del
[OpenAPI de Facturapi](https://docs.facturapi.io/api/), que coincide con el
catálogo `c_TipoRelacion` del Anexo 20. El catálogo tiene nueve claves (01 a
09); las demás son para notas de crédito, anticipos y pagos en parcialidades,
que no aplican a una nómina.

### `FolioSustitucion` es obligatorio con motivo 01

El Anexo 20 define `FolioSustitucion` como un atributo **condicional**:
«es requerido cuando la clave del motivo de cancelación es 01». Facturapi lo
exige igual y devuelve **400** si falta.

---

## 2. Los tres obstáculos que había que resolver

Antes de escribir el flujo, la sustitución era **imposible** por tres razones
del esquema. Resolverlas fue la mayor parte del trabajo.

### Obstáculo 1 — `unique (nomina_id)`

La migración 0015 declaró que un recibo tiene **un** CFDI. Con una
sustitución hay **dos**: el original cancelado y el nuevo vigente.

Se sustituyó por una restricción que expresa la regla real: **un recibo puede
tener muchos CFDIs, pero solo uno vigente** (índice único parcial sobre
`nomina_id where vigente`).

### Obstáculo 2 — el recálculo destruía el CFDI

`nomina_id ... on delete cascade` combinado con que el recálculo **borraba y
reinsertaba** los recibos del periodo significaba que **recalcular un periodo
destruía el registro de un CFDI ya timbrado**: se perdía el UUID y no había
forma de cancelarlo ni de saber que existió. Una pérdida de datos silenciosa.

Se resolvió en dos partes:

1. **`on delete restrict`**: la base impide borrar un recibo que tenga CFDIs.
2. **El recálculo actualiza en su lugar** (`upsert` por
   `empresa + periodo + empleado`) en vez de borrar y reinsertar. Los
   conceptos sí se borran y reinsertan: son el desglose derivado, no tienen
   valor fiscal propio y el CFDI guarda los suyos en su XML.

Con el `upsert` el `nomina_id` **no cambia**, así que el CFDI original sigue
apuntando a una fila válida y la sustitución se vuelve un flujo natural:
corregir el dato, recalcular, emitir el sustituto, cancelar el original.

### Obstáculo 3 — no había dónde registrar la relación

Faltaban las columnas. Se añadieron:

| Columna | Para qué |
|---|---|
| `vigente` | Solo el CFDI que representa fiscalmente al recibo |
| `uuid_relacionado` | UUID del CFDI que este sustituye |
| `tipo_relacion` | Clave del catálogo (`04`) |
| `sustituido_por` | CFDI que reemplazó a este: permite recorrer la cadena |

---

## 3. El flujo completo

```
Usuario pulsa «Sustituir» y confirma
        │
        ▼
PASO 0 · Validar (validarInicioSustitucion)
   · el original está timbrado
   · tiene UUID y identificador del PAC
   · no tiene una cancelación en trámite
   · no quedó en estado ambiguo
        │
        ▼
PASO 1 · Recalcular y timbrar el sustituto
   · calcularPeriodo() con los datos YA CORREGIDOS
   · generarPayloadNomina({ sustituyeA: uuidOriginal })
       → related_documents: [{ relationship: "04", documents: [uuid] }]
   · idempotency_key DISTINTA de la del original
   · marcar el original como vigente = false
   · insertar el nuevo CFDI con vigente = true
        │
        ▼
PASO 2 · Cancelar el original con motivo 01
   · cancelarCfdi(facturapiId, "01", uuidSustituto)
   · registrar el intento en la bitácora
        │
        ├── Éxito ──► el original queda cancelado
        │
        └── Falla ──► DOS CFDIs vigentes: se avisa y se puede reintentar
                      SOLO la cancelación
```

### Qué pasa si falla el paso 2

El sustituto queda timbrado y el original sigue vigente: **hay dos CFDIs
vigentes por el mismo pago**. Es recuperable pero exige acción, y no se deja
al azar:

- `evaluarSustitucion` detecta el estado y devuelve `hay_dos_vigentes` con
  `exigeAccion: true`.
- La interfaz muestra **«Sustitución incompleta»** en lugar del botón de
  sustituir, para que nadie sustituya por segunda vez.
- El mensaje de error incluye el UUID del sustituto: el documento **es válido
  ante el SAT** aunque el proceso haya quedado a medias.

### Por qué la clave de idempotencia debe ser distinta

El recálculo produce un recibo con el mismo empleado, periodo y fecha de pago,
así que **la clave de idempotencia base sería idéntica a la del original**. Con
la misma clave, el PAC devolvería el CFDI que ya existe en lugar de crear el
sustituto, y la sustitución nunca ocurriría.

Por eso el sustituto usa `claveOriginal|sustitucion-vN`, donde `N` es la
versión (cuántos CFDIs ha tenido el recibo). Y la cancelación por sustitución
usa `claveOriginal|cancelacion-motivo-01`, para no reutilizar la respuesta de
una cancelación anterior con otro motivo.

---

## 4. Cómo usarlo

1. **Corrige primero el dato** que estaba mal (el tipo de contrato, la clave de
   entidad federativa, el salario, los descuentos…).
2. En `/contabilidad`, en la columna **CFDI**, pulsa **«Sustituir»**.
3. Confirma. La interfaz explica los tres pasos antes de ejecutarlos.

Si no cambiaste nada, el CFDI nuevo saldrá **idéntico** al anterior. La
interfaz lo advierte: el sentido de una sustitución es corregir un error.

### Verificar en la base

```sql
-- Cadena de versiones de un recibo. La versión 1 es el original.
select version, uuid_fiscal, estado, estado_cancelacion, vigente,
       tipo_relacion, uuid_relacionado
  from public.cfdi_cadena_sustitucion
 where nomina_id = '...'
 order by version;

-- COMPROBACIÓN IMPORTANTE: sustituciones a medias.
-- Debe devolver CERO filas. Si devuelve alguna, se emitió el sustituto pero
-- no se canceló el original: hay dos CFDIs vigentes por el mismo pago.
select c.uuid_fiscal, c.uuid_relacionado, o.estado_cancelacion as estado_del_original
  from public.cfdi_nomina c
  join public.cfdi_nomina o on o.uuid_fiscal = c.uuid_relacionado
 where c.vigente and c.tipo_relacion = '04'
   and o.estado_cancelacion not in ('aceptada', 'plazo_vencido');

-- Historial de intentos, incluida la cancelación por sustitución
select c.uuid_fiscal, i.motivo, i.uuid_sustitucion, i.exito, i.estado_devuelto, i.created_at
  from public.cfdi_cancelacion_intentos i
  join public.cfdi_nomina c on c.id = i.cfdi_id
 order by i.created_at desc
 limit 20;
```

### Qué confirmar

- [ ] El payload del sustituto declara `related_documents` con la clave 04 y
      el UUID del original. Si no, el SAT no reconoce la cadena.
- [ ] El CFDI nuevo tiene su propio UUID y `vigente = true`.
- [ ] El original queda `vigente = false`, `estado = 'sustituido'` y
      `sustituido_por` apuntando al nuevo.
- [ ] La cancelación del original se registra con **motivo 01** y el UUID del
      sustituto.
- [ ] **La consulta de sustituciones a medias devuelve cero filas.**

---

## 5. Por qué el recálculo ya no borra los recibos

Es el cambio más profundo y conviene entenderlo, porque afecta a todo el
módulo de nómina y no solo a la sustitución.

**Antes:** recalcular un periodo borraba todos sus recibos y los volvía a
crear. Con `on delete cascade`, un CFDI timbrado desaparecía con su recibo.

**Ahora:** el recálculo hace `upsert` por la clave natural
(`empresa + periodo + empleado`), así que **actualiza la misma fila**. Los
conceptos se reemplazan porque son datos derivados.

Consecuencias:

- Recalcular un periodo con CFDIs timbrados es **seguro**: el vínculo entre el
  recibo y su documento fiscal se conserva.
- Los totales del recibo pueden quedar distintos de los del CFDI ya timbrado
  (porque el CFDI guarda su propio XML). Eso es **correcto y esperado**: el
  CFDI es un documento emitido, no un espejo del cálculo actual. El recibo
  refleja el cálculo vigente y el CFDI lo que se declaró.
- Si el recibo se corrige y el CFDI no se sustituye, el sistema queda con un
  CFDI que no refleja el recibo. **Eso no es un error del sistema**: es la
  señal de que falta sustituir el CFDI.

La migración `0018` añade la restricción `nominas_periodo_empleado_unico` que
hace posible el `upsert`, y **aborta si ya hay duplicados** para no dejar los
datos a medias.

---

## 6. Validación pendiente antes de producción

- [ ] **Sustituir un CFDI de nómina de prueba** y confirmar la secuencia
      completa: el sustituto se timbra con relación 04 y el original se
      cancela con motivo 01.
- [ ] **Verificar que el CFDI timbrado lleva la relación.** Descarga el XML del
      sustituto y busca el nodo `CfdiRelacionados` con
      `TipoRelacion="04"` y el UUID del original. Es la comprobación definitiva
      de que el paso 1 funcionó.
- [ ] **Probar el fallo del paso 2**: corta la red o invalida la clave justo
      después del timbrado. El sistema debe avisar de los dos CFDIs vigentes y
      el botón de sustituir debe desaparecer, ofreciendo solo cancelar.
- [ ] **Confirmar que recalcular un periodo con CFDIs timbrados ya no borra
      nada.** Es el cambio más delicado del módulo de nómina.
- [ ] **Verificar el literal del catálogo `c_MotivoCancelacion`** cuando el
      servidor de catálogos del SAT responda.

---

## 7. Límites de lo implementado

| Falta | Por qué importa |
|---|---|
| **No se ha probado contra el PAC real** | El mapeo y las validaciones están cubiertos, pero ningún CFDI se ha sustituido. Ver § 6 |
| **No hay vista de historial de versiones** | La cadena se guarda (`cfdi_cadena_sustitucion`, `sustituido_por`) pero la interfaz solo muestra el CFDI vigente |
| **Solo se sustituye por la vía de la corrección del recibo** | El flujo recalcula. Si el error fue solo de forma (un acento en el nombre) y no se quiere recalcular, no hay un camino «emitir sustituto con los mismos importes» |
| **No se sustituye una nómina con CFDI relacionado por otro motivo** | Si el CFDI tiene relaciones distintas de la 04, el SAT lo marca como «No cancelable». La validación no lo detecta: se descubriría al cancelar |
| **No hay reintento automático del paso 2** | Si la cancelación falla, el usuario debe reintentarla a mano. La tarea de reconciliación ayuda, pero no reintenta la cancelación por sí sola |
| **El plazo del Art. 29-A solo se advierte** | Si el original ya no es cancelable, sustituirlo deja dos CFDIs vigentes. El mes límite depende del tipo de contribuyente y no está verificado |

---

## 8. Archivos

| Archivo | Responsabilidad |
|---|---|
| `supabase/migrations/20261011070000_0018_cfdi_sustitucion.sql` | `vigente`, relación, `on delete restrict`, clave natural del recibo y vista de la cadena |
| `src/lib/cfdi/tipos.ts` | Estado `sustituido`, `TIPO_RELACION`, `esUuidValido` |
| `src/lib/cfdi/sustitucion.ts` | Validación, relación, idempotencia y estado intermedio. **Puro, probado** |
| `src/lib/cfdi/nomina-payload.ts` | `related_documents` en el payload del sustituto |
| `src/lib/actions/sustitucion-cfdi.ts` | La acción que orquesta los dos pasos |
| `src/lib/actions/nomina.ts` | El recálculo que actualiza en lugar de borrar |
| `src/components/contabilidad/boton-sustituir.tsx` | Interfaz con la explicación de los tres pasos |
| `tests/cfdi-sustitucion.test.ts` | 35 pruebas |
