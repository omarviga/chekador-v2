# Cancelación del CFDI de nómina

Guía de la cancelación de CFDIs de nómina, con las reglas fiscales
verificadas y sus fuentes.

> **Estado:** la lógica está completa y cubierta por **34 pruebas**. **No se
> ha probado cancelando un CFDI real**: no había credenciales de Facturapi.
> Ver § 6.

---

## 1. Lo que hay que entender antes de tocar el código

La cancelación de un CFDI **no es una operación instantánea** y **no siempre
procede**. Dos hechos gobiernan todo el diseño:

**Hecho 1 — La nómina se cancela SIN la aceptación del trabajador.**
La RMF, regla **2.7.1.35 fracción II**, lista «Por concepto de nómina» entre
los supuestos que se pueden cancelar sin aceptación del receptor, **con
independencia del monto**. El SAT además **no notifica al trabajador**: en el
flujo de cancelación sin aceptación, la presentación oficial del SAT dice
literalmente *«No se requiere notificar al contribuyente receptor»*.

Consecuencia práctica: la cancelación de una nómina debe resolverse de
inmediato. **No hay que esperar 72 horas ni gestionar el rechazo de nadie.**

**Hecho 2 — El SAT sí devuelve estados transitorios.**
Aunque no haya aceptación que esperar, el SAT puede contestar que recibió la
solicitud y la está validando. Ese estado es transitorio y se resuelve solo.

### Las fuentes

| Dato | Fuente |
|---|---|
| Supuestos sin aceptación del receptor | RMF regla 2.7.1.35 — [sat.gob.mx](https://wwwmat.sat.gob.mx/articulo/62770/regla-2.7.1.39) |
| Aceptación del receptor y su plazo | RMF regla 2.7.1.34 — [sat.gob.mx](https://wwwmat.sat.gob.mx/articulo/22240/regla-2.7.1.38) |
| Motivos de cancelación | [Esquema de cancelación de CFDI 2026](https://www.sat.gob.mx/minisitio/Factura/documentos/EsquemaCancelacionCFDI.pdf) (SAT) |
| Estatus y escenarios | [Preguntas frecuentes y escenarios de cancelación 2026](https://www.sat.gob.mx/minisitio/Factura/documentos/PreguntasFrecuentes_CancelacionFactura25082026.pdf) (SAT) |
| `FolioSustitucion` obligatorio con motivo 01 | Anexo 20, elemento `Cancelacion` (SAT) |
| Plazo absoluto | Art. 29-A del CFF — [Cámara de Diputados](https://www.diputados.gob.mx/LeyesBiblio/pdf/CFF.pdf) |
| Estados de cancelación del PAC | [Facturapi — Cancelaciones](https://docs.facturapi.io/docs/guides/invoices/cancelaciones/) |

---

## 2. El error que casi cometo, y por qué importa

Implementé la traducción de estados del PAC y traduje `expired` como **CFDI
cancelado**. Es lo contrario.

La documentación de Facturapi define los estados así:

| `cancellation_status` | Significado (textual de Facturapi) |
|---|---|
| `none` | «No hay solicitud registrada por el SAT.» |
| `verifying` | «El SAT recibió la solicitud y la está validando.» |
| `pending` | «Requiere aceptación del receptor.» |
| `accepted` | «La cancelación fue aceptada. **La factura queda en `status: "canceled"`**.» |
| `rejected` | «La cancelación fue rechazada.» |
| `expired` | «**El receptor no respondió a tiempo. Puedes intentar cancelar de nuevo si aplica.**» |

Ese *«puedes intentar cancelar de nuevo si aplica»* prueba que **el CFDI sigue
vigente**. Corresponde al estatus «Plazo vencido» del portal del SAT, que la
pregunta 15 de las FAQ oficiales describe igual: *«el comprobante adquiere
automáticamente el estatus de "Plazo vencido", pero **continúa vigente**»*.

### La trampa de nombres del SAT

El SAT tiene dos estatus que suenan casi igual y **tienen efectos opuestos**:

| Estatus del SAT | ¿El CFDI existe? |
|---|---|
| «Cancelado **plazo vencido**» | **NO** — el SAT canceló por positiva ficta |
| «**Plazo vencido**» | **SÍ** — rechazaste la primera vez y no respondiste las siguientes |

**Facturapi agrupa los dos casos en `expired`.** No los distingue. Por eso el
código **no puede afirmar qué pasó**: traduce `expired` a un estado propio,
`requiere_revision`, que significa exactamente eso: *el CFDI sigue vigente
según el PAC, pero hay que verificarlo en el portal del SAT*.

Es la decisión segura. Dar por cancelado un documento fiscal que sigue vivo
es mucho más grave que revisar uno que sí se canceló: en el primer caso el
sistema cree que no hay nada que declarar cuando sí lo hay.

Por eso existe una función dedicada a la pregunta que de verdad importa:

```ts
cfdiSigueVigente(estado)   // false solo para 'aceptada' y 'plazo_vencido'
```

---

## 3. Un supuesto que corregí

Escribí el código asumiendo que el umbral de **$1,000 MXN** para cancelar sin
aceptación del receptor estaba **condicionado al motivo 01**. No es así.

La RMF 2.7.1.35 lista supuestos **autónomos e independientes**:

> **I.** Los que amparen montos totales de hasta $1,000.00.
> **II.** Por concepto de nómina.
> **III.** Por concepto de egresos.
> **IV.** Por concepto de traslado. […]

**La regla no menciona el motivo de cancelación en ningún momento.** El umbral
es la fracción I; la nómina es la fracción II. Y para nómina el umbral es
irrelevante: **la exención aplica cualquiera que sea el monto**.

El código quedó con una constante `UMBRAL_SIN_ACEPTACION = 1000` que **no se
usa para decidir nada**, documentada como referencia y para el día en que este
módulo cancele otros tipos de comprobante. La decisión la toma una sola
función:

```ts
requiereAceptacionReceptor(motivo, total)   // siempre false: es nómina
```

Tenerla aislada es lo que permitió corregir el error en un solo punto.

---

## 4. El modelo de datos: dos ejes, no uno

```
estado               →  pendiente | timbrado | error | cancelado
estado_cancelacion   →  sin_solicitud | en_proceso | aceptada | rechazada
                        | plazo_vencido | requiere_revision | error
```

Es deliberado que sean **dos columnas**. Un CFDI puede estar `timbrado` (existe
ante el SAT) y a la vez tener la cancelación `en_proceso`. Un solo booleano
«cancelado» no puede representar eso, y confundirlos es la causa de que se
pierdan de vista documentos fiscales vigentes.

Significado de cada estado de cancelación:

| Estado | El CFDI existe | Qué hacer |
|---|---|---|
| `sin_solicitud` | Sí | Nada |
| `en_proceso` | Sí | Consultar el estado más tarde |
| `aceptada` | **No** | Nada |
| `rechazada` | Sí | Corregir y reintentar, o reexpedir |
| `plazo_vencido` | **No** | Nada |
| `requiere_revision` | Sí | **Verificar a mano en el portal del SAT** |
| `error` | Sí | Revisar el motivo del error |

---

## 5. Cómo usarlo

1. En `/contabilidad`, busca la columna **CFDI** del periodo calculado.
2. Pulsa **Cancelar** en un recibo timbrado.
3. Elige el **motivo** del catálogo `c_MotivoCancelacion`.
4. Si el motivo es **01**, captura el **UUID del CFDI que sustituye**.
5. Lee el aviso y confirma.

### Los cuatro motivos

| Clave | Texto | ¿Sustitución? |
|---|---|---|
| 01 | Comprobante emitido con errores con relación | **Sí, obligatoria** |
| 02 | Comprobante emitido con errores sin relación | No |
| 03 | No se llevó a cabo la operación | No |
| 04 | Operación nominativa relacionada en una factura global | No |

> ⚠️ **Variante textual.** El SAT usa «Comprobante emitido…» (singular) en su
> presentación 2026 y «Comprobantes emitidos…» (plural) en las FAQ 2026. **No
> se pudo descargar el archivo del catálogo `c_MotivoCancelacion`** (el
> servidor de catálogos del SAT devuelve 504 y las rutas clásicas 404), así que
> el literal del catálogo no está verificado. El código usa la forma singular,
> que coincide con la presentación del SAT, Facturapi y Solución Factible.

### El orden importa con el motivo 01

El SAT prescribe esta secuencia:

1. **Emitir primero** el CFDI nuevo, registrando en CFDI Relacionados la clave
   **04 «Sustitución de los CFDI previos»** y el UUID del erróneo.
2. **Después cancelar** el original con motivo 01 y el UUID del sustituto.

Si el sustituto no existe, el SAT rechaza la solicitud. La interfaz lo
recuerda al usuario al elegir el motivo 01.

> **La sustitución está implementada.** El botón **«Sustituir»** de la
> columna CFDI recalcula el recibo, timbra el CFDI nuevo con la relación 04 y
> cancela el original con motivo 01. Tiene su propia guía:
> [docs/CFDI-SUSTITUCION.md](CFDI-SUSTITUCION.md).

---

## 6. Probar la cancelación

```bash
# 1. Aplica las migraciones
supabase db push

# 2. Configura FACTURAPI_KEY con una llave de PRUEBA (sk_test_...)

# 3. Calcula un periodo, timbra un recibo y cancélalo
```

### Verificar en la base

```sql
-- Estado de cancelación de los CFDIs
select uuid_fiscal, estado, estado_cancelacion, motivo_cancelacion,
       uuid_sustitucion, cancelacion_solicitada_en, cancelacion_resuelta_en
  from public.cfdi_cancelables
 where estado_cancelacion <> 'sin_solicitud'
 order by cancelacion_solicitada_en desc;

-- Situación de cada CFDI con los indicadores de apoyo
select uuid_fiscal, se_puede_cancelar, conviene_reconciliar, exige_revision_manual
  from public.cfdi_cancelables;

-- Historial de intentos de cancelación
select c.uuid_fiscal, i.motivo, i.exito, i.estado_devuelto, i.mensaje, i.created_at
  from public.cfdi_cancelacion_intentos i
  join public.cfdi_nomina c on c.id = i.cfdi_id
 order by i.created_at desc
 limit 20;
```

### Qué confirmar

- [ ] El recibo **NO** se marca como cancelado si el PAC no confirma. Si el
      PAC devuelve `verifying`, el estado es `en_proceso` y el CFDI sigue
      vigente.
- [ ] El motivo y el UUID de sustitución quedan registrados.
- [ ] El intento aparece en `cfdi_cancelacion_intentos` con su resultado.
- [ ] Al reintentar cancelar un CFDI ya cancelado, el sistema lo detiene
      **antes** de llamar al PAC.
- [ ] Cancelar con motivo 01 **sin** UUID devuelve un error de validación, no
      una llamada al PAC.

### Reconciliar el estado

El botón **«Consultar estado»** aparece cuando la cancelación está en trámite.
Pregunta al PAC y actualiza. Es necesario porque la cancelación puede
resolverse después de la solicitud.

---

## 7. Reconciliación: cómo se entera el sistema del resultado

La cancelación es asíncrona, así que el sistema tiene que **enterarse
después** de qué resolvió el SAT. Hay tres vías y **las tres usan la misma
decisión** (`decidirReconciliacion`), para que un CFDI no acabe con un
estado distinto según por dónde llegó la actualización.

```
                    ┌──────────────────────────────┐
                    │  decidirReconciliacion()     │
                    │  (puro, probado)             │
                    └──────────────┬───────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
   Webhook                    Tarea programada           Botón manual
   POST /api/facturapi/       GET /api/tareas/           «Consultar
   webhook                    reconciliar                estado»
```

### Vía 1 — Webhook (la normal)

Facturapi envía `invoice.cancellation_status_updated` **«cuando el estado
deja de estar `pending` o `verifying`»**, que es exactamente el momento en
que hay que enterarse. También se escucha `invoice.status_updated`.

El evento **incluye el objeto completo de la factura**, así que procesarlo
es **una sola escritura, sin llamadas al PAC**. Eso importa: un webhook no
debe consumir cuota.

**Configurarlo:**

1. En el panel de Facturapi → **Webhooks** → añadir endpoint:
   `https://tu-dominio.com/api/facturapi/webhook`
2. Eventos: `invoice.cancellation_status_updated` y `invoice.status_updated`
3. Copia el **secret** (`wh_sec_...`) a `FACTURAPI_WEBHOOK_SECRET`

**La firma se verifica con HMAC-SHA256 local**, no llamando a la API de
Facturapi. Verifiqué el código del SDK (v5.1.0): en Node usa
`crypto.createHmac("sha256", secret).update(payload)` comparado con
`timingSafeEqual`, y solo cae a la API como último recurso. Verificar
localmente importa porque, si dependiera de la API, **una caída de
Facturapi haría que se rechazaran sus propios webhooks**.

> ⚠️ El cuerpo se lee con `request.text()`, **nunca con `request.json()`**.
> La firma se calcula sobre los bytes exactos: parsear y volver a
> serializar rompe la firma y rechaza todos los webhooks. Es el mismo error
> que hay que evitar en el webhook de Stripe.

### Vía 2 — Tarea programada (la red de seguridad)

`GET /api/tareas/reconciliar` consulta al PAC los CFDI cuya cancelación
quedó pendiente o ambigua.

**Por qué hace falta si ya hay webhook:** un webhook se puede perder (un
despliegue justo en el momento del aviso, un 500, una caída de red), y hay
un caso que el webhook **no puede cubrir**: que el SAT resuelva la
cancelación sin que Facturapi emita ningún aviso.

**Programarla.** La ruta no depende de ninguna plataforma:

```bash
# 1. cron del sistema
curl -H "Authorization: Bearer $RECONCILIACION_SECRETO" \
     https://tu-dominio.com/api/tareas/reconciliar

# 2. Programador externo (cron-job.org, EasyCron, GitHub Actions)
#    Es la opción recomendada: el secreto viaja en un encabezado y no
#    queda en los logs de la aplicación.

# 3. Cron de Vercel: añade a vercel.json
#    { "crons": [{ "path": "/api/tareas/reconciliar", "schedule": "0 */6 * * *" }] }
#    Vercel añade `Authorization: Bearer $CRON_SECRET` si defines
#    CRON_SECRET (usa el mismo valor que RECONCILIACION_SECRETO).
```

Cada 6 horas es razonable: la cancelación de una nómina se resuelve de
inmediato, así que esta tarea solo recoge lo que se perdió. Con más
frecuencia se gastaría cuota del PAC sin ganar nada.

**Parámetros:** `?limite=N` acota cuántos CFDI se consultan (por omisión 50,
máximo 200). Existe para que una ejecución no agote la cuota del PAC ni el
tiempo máximo de la función.

**La respuesta incluye el detalle**, no solo un contador:

```json
{
  "ok": true,
  "actualizados": 2,
  "sinCambio": 5,
  "fallidos": 1,
  "detalle": [{ "uuidFiscal": "…", "de": "en_proceso", "a": "aceptada", "quedoCancelado": true }],
  "errores": [{ "uuidFiscal": "…", "motivo": "El PAC no devolvió el estado." }]
}
```

Un reporte que solo dijera «0 actualizados» no permitiría distinguir entre
«todo bien» y «no se pudo consultar nada».

### Vía 3 — Botón manual

El botón **«Consultar estado»** aparece en el recibo cuando la cancelación
está pendiente. Sirve para cuando alguien necesita el dato ahora.

### Qué se consulta y con qué prioridad

No todos los pendientes son iguales. `clasificarPendientes` decide:

| Situación | Prioridad | Por qué |
|---|---|---|
| `requiere_revision` | **Alta** | Hay un CFDI del que no se sabe si existe. Es información fiscal ambigua |
| `en_proceso` con más de 72 h | **Alta** | Ya pasó el plazo del receptor, así que el SAT **necesariamente** resolvió. Si el sistema sigue en trámite, se perdió la notificación |
| `en_proceso` reciente | Baja | Todavía puede estar en proceso legítimamente |
| Fecha ilegible o ausente | Media | Es más seguro preguntar que asumir |
| CFDI ya cancelado | — | **No se consulta**: no puede cambiar, y cada consulta gasta cuota |

El orden importa: la ejecución programada se detiene al llegar al límite,
así que lo urgente va primero.

### Dos protecciones de la idempotencia

**En el webhook.** Los eventos de Facturapi **no traen un identificador
único** (su tipo `ApiEvent` solo tiene `created_at`, `organization`,
`livemode`, `type` y `data`), así que la clave se deriva del contenido:

```
sha256(tipo | uuid | status | cancellation_status | created_at)
```

Un reintento del mismo evento envía el mismo `created_at` y produce la
misma clave, así que se deduplica en `facturapi_eventos`. Un cambio
posterior tiene otro `created_at` (u otro estado) y se procesa.

**En la decisión.** Aunque el evento se cuele, `decidirReconciliacion`
devuelve `sin_cambio` si el estado guardado ya es el correcto. Escribir de
nuevo cambiaría `cancelacion_resuelta_en` y falsearía la fecha.

### La protección más importante: no retroceder

**Los webhooks no llegan en orden garantizado.** Un `verifying` puede
llegar *después* de un `accepted`. Si se aplicara, revertiría una
cancelación ya confirmada y devolvería a la vida un CFDI muerto.

Por eso la decisión descarta cualquier evento que contradiga un estado ya
cancelado. Hay dos pruebas dedicadas a esto.

---

## 8. Probar la reconciliación

```bash
# Consultar el estado de los pendientes, a mano
curl -H "Authorization: Bearer $RECONCILIACION_SECRETO" \
     "http://localhost:3000/api/tareas/reconciliar?limite=10"
```

### Verificar la protección

```bash
# Sin secreto → 404 (no se confirma que la ruta exista)
curl -i http://localhost:3000/api/tareas/reconciliar

# Con secreto equivocado → 404
curl -i -H "Authorization: Bearer incorrecto" http://localhost:3000/api/tareas/reconciliar

# Sin RECONCILIACION_SECRETO definida → 503, nunca «abierta»
```

### Verificar el webhook

```bash
# Sin firma → 400
curl -i -X POST http://localhost:3000/api/facturapi/webhook -d '{}'

# Con firma inválida → 400
curl -i -X POST http://localhost:3000/api/facturapi/webhook \
     -H "Facturapi-Signature: 00" -d '{}'
```

### Verificar en la base

```sql
-- Los eventos que llegaron y su resultado
select tipo, procesado, error, intentos, created_at
  from public.facturapi_eventos
 order by created_at desc
 limit 20;

-- Si algún evento quedó sin procesar, hay un problema
select * from public.facturapi_eventos
 where procesado = false and created_at < now() - interval '1 hour';

-- Actividad de cancelación por día, para vigilar la cuota del PAC
select * from public.reconciliacion_actividad order by dia desc;
```

### Simular una cancelación sin webhook

Para comprobar que la tarea programada funciona como red de seguridad:

1. Cancela un CFDI **desde el panel de Facturapi** (no desde Chekdor), o
   deshabilita temporalmente el webhook.
2. El CFDI queda como `en_proceso` o `requiere_revision` en la base.
3. Ejecuta la tarea:
   ```bash
   curl -H "Authorization: Bearer $RECONCILIACION_SECRETO" \
        "http://localhost:3000/api/tareas/reconciliar"
   ```
4. El estado debe actualizarse solo.

---

## 9. Validación pendiente antes de producción

- [ ] **Configurar el webhook** en el panel de Facturapi y **verificar que
      llega**: cancela un CFDI de prueba y comprueba que aparece una fila en
      `facturapi_eventos` con `procesado = true`.
- [ ] **Cancelar un CFDI de nómina de prueba** y confirmar que el PAC
      devuelve `status: "canceled"` + `cancellation_status: "accepted"` sin
      pasar por `pending`. **Si apareciera `pending`**, la exención de la
      RMF 2.7.1.35 fracción II no se aplicó y habría que investigar por qué.
- [ ] **Programar la tarea** y confirmar que se ejecuta y devuelve JSON.
- [ ] **Probar la protección**: sin secreto y con secreto incorrecto debe
      devolver 404; sin `RECONCILIACION_SECRETO` debe devolver 503.
- [ ] **Verificar el literal del catálogo `c_MotivoCancelacion`** cuando el
      servidor de catálogos del SAT responda.
- [ ] **Confirmar el mes del plazo del Art. 29-A** según el tipo de
      contribuyente del emisor. El código **avisa sin bloquear** porque ese
      mes no está verificado. Ver § 10.

---

## 10. Límites de lo implementado

| Falta | Por qué importa |
|---|---|
| **La sustitución no tiene vista de historial** | La cadena de versiones se guarda en `cfdi_cadena_sustitucion` y en `sustituido_por`, pero la interfaz solo muestra el CFDI vigente. Para ver las versiones anteriores hay que consultar la vista |
| **El plazo del Art. 29-A solo se advierte, no se bloquea** | El mes límite depende del tipo de contribuyente del emisor y no está verificado. Bloquear con un dato incierto impediría cancelaciones legítimas |
| **La reconciliación no es en tiempo real** | El webhook sí, pero la tarea programada depende de que algo la invoque. **Hay que programarla**: sin eso, un webhook perdido deja el estado desactualizado hasta que alguien pulse el botón |
| **No se reintenta automáticamente un evento con error** | Si `aplicarEventoCancelacion` falla, el evento queda en `facturapi_eventos` con `error`. La tarea programada lo recupera por otra vía, pero no hay reproceso del evento mismo |
| **No se descarga el acuse de cancelación** | El SDK tiene `downloadCancellationReceiptXml/Pdf`. Es la evidencia de que la solicitud se presentó; conviene guardarla |
| **`plazo_vencido` nunca se produce automáticamente** | La traducción no puede distinguirlo de «Plazo vencido» porque Facturapi agrupa ambos en `expired`. Solo se asigna si alguien lo corrige a mano |
| **Sin interfaz para ver el trabajo pendiente en conjunto** | El botón manual es por recibo. `contarPendientes` existe en el servidor pero no hay una pantalla que lo muestre |
| **El envío del acuse al trabajador es manual** | El SAT no notifica al trabajador, y una nómina cancelada desaparece de su Visor sin aviso. Avisarle es buena práctica, no obligación legal verificada |

### Lo que NO está verificado y no debe presentarse como hecho

1. **El texto literal del archivo `c_MotivoCancelacion`.** Las etiquetas del
   código provienen de publicaciones oficiales del SAT de 2026, no del archivo
   del catálogo (que no se pudo descargar: 504 en la página de catálogos y 404
   en las rutas del archivo).
2. **El código de error exacto del SAT** cuando falta el UUID de sustitución.
3. **La afirmación de un PAC** de que la exención de nómina aplica «únicamente
   en el ejercicio en el que se expidan». La RMF 2.7.1.35 fracción II **no
   contiene esa restricción**. Queda anotada como riesgo operativo, no como
   regla.
4. **El mes exacto** del plazo del Art. 29-A por tipo de contribuyente.
5. **El comportamiento real de Facturapi con la firma del webhook**: se
   verificó leyendo su código, pero no se ha recibido un webhook real.

---

## 11. Archivos

| Archivo | Responsabilidad |
|---|---|
| `supabase/migrations/20261011050000_0016_cfdi_cancelacion.sql` | Estados, motivo, sustitución, bitácora de intentos y vista `cfdi_cancelables` |
| `supabase/migrations/20261011060000_0017_facturapi_eventos.sql` | Idempotencia de webhooks y vista de actividad |
| `src/lib/cfdi/tipos.ts` | Estados y motivos compartidos |
| `src/lib/cfdi/cancelacion.ts` | Traducción de estados y validación. **Puro, probado** |
| `src/lib/cfdi/reconciliacion.ts` | Decisión de escritura y priorización. **Puro, probado** |
| `src/lib/cfdi/secreto.ts` | Comparación en tiempo constante |
| `src/lib/cfdi/cancelacion-facturapi.ts` | Llamada al PAC y traducción de errores. `server-only` |
| `src/lib/cfdi/reconciliar-servidor.ts` | Aplica eventos y reconcilia pendientes. `server-only` |
| `src/lib/actions/cancelacion-cfdi.ts` | Server Actions de cancelación y consulta manual |
| `src/app/api/facturapi/webhook/route.ts` | Firma, idempotencia y aplicación del evento |
| `src/app/api/tareas/reconciliar/route.ts` | Tarea programada, protegida con secreto |
| `src/components/contabilidad/boton-cancelar.tsx` | Interfaz con elección de motivo y avisos |
| `tests/cfdi-cancelacion.test.ts` | 34 pruebas |
| `tests/cfdi-reconciliacion.test.ts` | 26 pruebas |

