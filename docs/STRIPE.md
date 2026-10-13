# Integración con Stripe

Guía para configurar, probar y poner en producción el cobro de las
suscripciones de Chekdor.

> **Estado:** el código está completo y probado (17 pruebas dedicadas). Lo
> que falta es la configuración: las claves, los `price_id` y el webhook.
> Mientras no estén, la pantalla de facturación muestra un aviso y los
> botones de suscripción están deshabilitados **a propósito**: es preferible
> a que un clic falle con un error técnico.

---

## 1. Configuración paso a paso

### 1.1 Crear los productos en Stripe

En el panel de Stripe → **Catálogo de productos** → **Añadir producto**.
Crea tres, con estos datos exactos:

| Producto | Precio | Moneda | Periodicidad |
|---|---|---|---|
| Chekdor Básico | 299.00 | MXN | Mensual |
| Chekdor Contable | 599.00 | MXN | Mensual |
| Chekdor Despacho | 1,299.00 | MXN | Mensual |

> ⚠️ **Nomenclatura.** En el código y en la base de datos la clave del plan
> intermedio es `pro` (la columna `empresas.plan` usa el enum
> `basico|pro|business`). El nombre **visible** es «Contable», que es como
> se llama en la landing. No renombres la clave interna sin migrar el enum.

De cada precio anota el **API ID**, que empieza por `price_`.

### 1.2 Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...          # se obtiene en el paso 1.4
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com

NEXT_PUBLIC_STRIPE_PRICE_BASICO=price_...
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_...
```

**Sobre el modo:** el código **no** deduce si estás en prueba o en
producción a partir del prefijo de la clave. Deducción automática de
`sk_test_` es frágil y un error ahí cobraría de verdad. La regla es simple:
si usas claves de prueba, usa también `price_id` de prueba y un webhook de
prueba.

### 1.3 Aplicar la migración

```bash
supabase db push
```

La migración `0013`:

- añade `estado_suscripcion` y `trial_fin` a `empresas`;
- añade los identificadores de Stripe y el periodo actual a `suscripciones`;
- crea `stripe_eventos` para la idempotencia;
- reescribe la función `crear_empresa` para que arranque el periodo de
  prueba de 14 días y cree la suscripción inicial.

> La migración **elimina la versión anterior** de `crear_empresa` (la de 4
> argumentos) antes de crear la nueva de 5. Si no se hiciera así, quedarían
> dos sobrecargas y la llamada con 4 argumentos sería ambigua. Al final hay
> una comprobación que **aborta la migración** si quedara más de una.

### 1.4 Configurar el webhook

En el panel de Stripe → **Developers** → **Webhooks** → **Añadir endpoint**.

- **URL:** `https://tu-dominio.com/api/stripe/webhook`
- **Eventos a escuchar** (los seis, y solo estos):
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

Copia el **Signing secret** (`whsec_...`) a `STRIPE_WEBHOOK_SECRET`.

> ⚠️ **No confundas el signing secret con la clave secreta.** El signing
> secret es único por endpoint. Si lo cambias o creas otro endpoint,
> actualiza la variable o todas las peticiones se rechazarán con un 400 y
> verás en los logs «firma inválida».

### 1.5 Configurar el portal de cliente

En el panel de Stripe → **Settings** → **Billing** → **Customer portal**.
Activa:

- **Actualizar método de pago** — obligatorio.
- **Cambiar de plan** — permite subir y bajar de plan con prorrateo.
- **Cancelar suscripción** — con la opción de cancelar al final del periodo.
- **Ver historial de facturas**.

Sin esto, el botón «Gestionar suscripción» abrirá un portal vacío y el
cliente no podrá hacer nada.

---

## 2. Cómo funciona el flujo

```
Cliente hace clic en «Suscribirme»
        │
        ▼
iniciarCheckout (Server Action)
   · valida el rol de administrador
   · valida que los price_id estén configurados
   · getOrCreateCustomer → reutiliza el customer si ya existe
   · crea la sesión de Checkout con empresa_id en la metadata
        │
        ▼
   Stripe Checkout (pago con tarjeta)
        │
        ├──► success_url → /configuracion/facturacion?checkout=exito
        └──► cancel_url  → /configuracion/facturacion?checkout=cancelado
        │
        ▼
   Webhooks (asíncronos, en este orden típico)
   1. checkout.session.completed      → vincula subscription_id y customer_id
   2. customer.subscription.created   → estado, plan, periodo, trial
   3. invoice.payment_succeeded       → estado = active
        │
        ▼
   empresas.estado_suscripcion y empresas.plan quedan actualizados
        │
        ▼
   La UI (banner y página de facturación) refleja el estado
```

### Decisiones de diseño que conviene conocer

**El checkout completado no activa la suscripción.** Solo vincula los
identificadores. El estado real llega en `customer.subscription.*`, porque
en el momento del checkout el pago puede estar todavía pendiente.

**Un pago fallido deja `past_due`, no `canceled`.** Stripe reintenta el
cobro durante varios días. Cancelar en el primer fallo le quitaría el
acceso a alguien que puede pagar mañana. El efecto práctico de `past_due`
es que **no se pueden dar de alta empleados nuevos**, pero se conserva el
acceso y la información.

**Un pago exitoso siempre deja `active`.** Es la única forma de salir de
`past_due` sin intervención manual.

**La idempotencia se apoya en la llave única `stripe_eventos.stripe_event_id`.**
Stripe reenvía un evento cuando no recibe un 2xx a tiempo. Sin esta tabla,
un reenvío duplicaría efectos.

**Los eventos fuera de orden se descartan.** Stripe no garantiza el orden
de entrega. Se compara `stripe_created` del evento contra el último
procesado con éxito para la misma suscripción; si el que llega es más
viejo, se ignora. Sin esto, un `subscription.updated` viejo podría revertir
el estado que dejó uno nuevo.

**Al responder:** los errores transitorios devuelven **500** para que
Stripe reintente; los errores permanentes y accionables (por ejemplo, un
`price_id` que no está en el catálogo) devuelven **200** con el evento
registrado en `error`. Si devolvieran 500, Stripe reintentaría durante días
algo que ningún reintento va a resolver.

**El periodo de facturación puede no venir.** Las versiones recientes de la
API movieron `current_period_start` / `current_period_end` del objeto
`Subscription` a sus `SubscriptionItem`. El código lee primero el item y
cae al objeto de suscripción. **Si no lo encuentra en ninguno, no escribe
nada**: escribir `NULL` borraría una fecha válida que ya estaba guardada.

---

## 3. Probar el flujo completo

### 3.1 Con la CLI de Stripe (recomendado)

```bash
# Instala la CLI: https://stripe.com/docs/stripe-cli
stripe login

# Reenvía los eventos de prueba a tu servidor local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La CLI imprime un signing secret (`whsec_...`) **distinto** al del
dashboard. Úsalo en `.env.local` mientras desarrollas.

```bash
npm run dev
```

### 3.2 Tarjetas de prueba

| Escenario | Número | Resultado esperado |
|---|---|---|
| Pago exitoso | `4242 4242 4242 4242` | `active`, plan aplicado |
| Pago rechazado | `4000 0000 0000 0002` | `past_due`, banner rojo |
| Requiere autenticación 3DS | `4000 0025 0000 3155` | Se pide confirmar, luego `active` |
| Fondos insuficientes | `4000 0000 0000 9995` | `past_due` |
| Vence pronto | `4000 0067 0000 0022` | Renovación próxima |

Para cualquier tarjeta: **cualquier fecha futura**, **cualquier CVC de 3
dígitos** y **cualquier código postal de 5 dígitos**.

> En México el código postal debe ser válido para el cálculo de impuestos.
> Usa uno real de tu ciudad de pruebas.

### 3.3 Recorrido de verificación

1. Crea una cuenta nueva → llega a `/onboarding` → crea la empresa.
   Verifica en la base de datos que la empresa quedó con
   `estado_suscripcion = 'trialing'` y `trial_fin` a 14 días.
2. Ve a `/configuracion/facturacion`. Debe mostrar «En prueba» con los días
   restantes y los tres planes con botón «Suscribirme».
3. Suscríbete al plan Contable con `4242 4242 4242 4242`.
4. Vuelve a `/configuracion/facturacion`. El estado debe ser «Activa», el
   plan «Contable» y el tope 30 empleados.
5. Verifica en la base de datos:

```sql
select tipo, procesado, error
  from public.stripe_eventos
 order by created_at desc
 limit 10;

select plan, max_empleados, estado_suscripcion, trial_fin
  from public.empresas;

select plan, stripe_subscription_id, periodo_actual_inicio,
       periodo_actual_fin, cancelar_al_final
  from public.suscripciones;
```

6. Da de alta 30 empleados y comprueba que el número 31 falla con el
   mensaje de límite del plan.
7. Abre «Gestionar suscripción», cambia al plan Despacho y confirma que el
   tope sube a 100.
8. Desde el portal, cancela la suscripción. El estado debe pasar a
   «Cancelada» (o «Se cancela el…» si elegiste cancelar al final del
   periodo) y el banner debe aparecer.

### 3.4 Probar los casos difíciles

| Qué probar | Cómo |
|---|---|
| **Idempotencia** | Usa «Reenviar» en el panel de Stripe sobre un evento ya procesado. No debe cambiar nada y debe aparecer `duplicado` en los logs. |
| **Pago vencido** | Con una suscripción activa, cambia la tarjeta por `4000 0000 0000 0002` y usa «Simular renovación» en el panel. |
| **Precio desconocido** | En el panel de Stripe, cambia el precio de la suscripción por uno que no esté en el catálogo. El evento debe registrarse con aviso y **no** debe cambiar el plan. |
| **Firma inválida** | `curl -X POST localhost:3000/api/stripe/webhook -d '{}'` → debe responder 400. |
| **Webhook caído** | Detén el servidor, provoca un evento, arráncalo de nuevo y usa «Reenviar» en el panel. |

---

## 4. Activar el modo producción

Checklist antes de cobrar de verdad:

### 4.1 En Stripe

- [ ] **Activar la cuenta** y completar la verificación de identidad y
      datos bancarios.
- [ ] **Cambiar a modo live** y recrear los tres productos y precios. Los
      precios de prueba **no** sirven en producción.
- [ ] **Configurar el correo de recibos** (Settings → Billing → Emails) con
      tu marca.
- [ ] **Configurar los datos fiscales** de la empresa (Settings → Business
      details) para que las facturas salgan con tu RFC.
- [ ] **Revisar la configuración del portal** también en modo live (no se
      copia del modo de prueba).
- [ ] **Crear un webhook nuevo en modo live** con su propio signing secret.

### 4.2 En el servidor

- [ ] Reemplazar las tres variables de Stripe por las de producción.
- [ ] Verificar que `NEXT_PUBLIC_SITE_URL` apunte al dominio real: si está
      mal, el cliente vuelve a una URL equivocada después de pagar.
- [ ] Confirmar que `NODE_ENV=production`.
- [ ] **Verificar que `SUPABASE_SERVICE_ROLE_KEY` esté definida.** El
      webhook la necesita para escribir saltándose RLS; sin ella devuelve
      500 en cada evento.

### 4.3 Prueba final

- [ ] Un pago real de **$10 MXN** con tu propia tarjeta, sobre un producto
      temporal creado para la prueba. Confirma que el webhook actualiza la
      suscripción. Reembólsalo y cancela la suscripción.
- [ ] Revisar que la tabla `stripe_eventos` se esté llenando y que **no
      haya errores**:

```sql
select tipo, count(*), count(*) filter (where error is not null) as con_error
  from public.stripe_eventos
 group by tipo
 order by 2 desc;

-- Debe estar vacío:
select * from public.stripe_eventos
 where procesado = false and created_at < now() - interval '1 hour';
```

- [ ] Configurar una **alerta de fallos de webhook** en Stripe
      (Settings → Notifications) hacia tu correo de soporte.

### 4.4 Aviso importante sobre el aviso de privacidad y los términos

Al activar el cobro hay que **quitar los avisos de «etapa de pilotos»** de:

| Archivo | Qué quitar |
|---|---|
| `src/components/landing/Precios.jsx` | El recuadro `#aviso-piloto` y el comentario de `PLANES` sobre precios previstos |
| `src/components/landing/FAQ.jsx` | Las respuestas «todavía no está habilitado el cobro» y la de cancelación por correo |
| `docs/legal/terminos/contenido_terminos.py` | El recuadro «AVISO SOBRE COBROS» de la sección 7 y el recuadro «Cómo eliminar la cuenta» |

Después de editar los términos, regenerar **las dos** salidas:

```bash
python docs/legal/terminos/generar_docx.py
python docs/legal/terminos/generar_tsx.py
```

### 4.5 Revisar el contrato de servicios antes de la primera firma

Al habilitar el cobro se activa la **cláusula de contraprestación** del
Contrato de Prestación de Servicios, que hoy describe una obligación que no se
puede cumplir (emitir comprobante fiscal). Revisa:

- `docs/legal/servicios/contenido_contrato.py` → qué dice la cláusula de
  contraprestación sobre el comprobante fiscal.
- `docs/legal/README.md` § 7 → la lista de pendientes antes de la primera
  firma, incluida la decisión del **tope de responsabilidad** y la **meta de
  disponibilidad**, que deben corresponder con lo que realmente puedes
  sostener.
- **Que el Anexo I esté completo.** Sin plan, precio ni vigencia, el contrato
  no obliga a nada concreto.

Regenerar el contrato tras cualquier cambio:

```bash
python docs/legal/servicios/generar_docx.py
```

---

## 5. Agregar un nuevo plan

Tres lugares, en este orden:

### 5.1 El enum de la base de datos

```sql
alter type public.plan_empresa add value if not exists 'enterprise';
```

> `ALTER TYPE ... ADD VALUE` **no puede ejecutarse dentro de una
> transacción** en versiones antiguas de PostgreSQL. Si `supabase db push`
> falla, ejecútalo por separado en el editor SQL.

### 5.2 El catálogo de planes

En `src/lib/stripe/planes.ts`: agrega la clave a `CLAVES_PLAN` y el plan a
`obtenerPlanes()`. **Los dos**, porque `listaDePlanes()` recorre
`CLAVES_PLAN`:

```ts
export const CLAVES_PLAN = ["basico", "pro", "business", "enterprise"] as const;

// … dentro de obtenerPlanes():
enterprise: {
  clave: "enterprise",
  nombre: "Enterprise",
  precioMensual: 2999,
  maxEmpleados: 500,
  priceId: priceIdDeEntorno("NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE"),
  descripcion: "Para operaciones grandes",
  incluye: ["Todo lo del plan Despacho", "Soporte 24/7", "SLA por escrito"],
},
```

### 5.3 La variable de entorno y visualización

```bash
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_...
```

Y el nombre visible en `src/lib/stripe/planes.ts` (`nombre`) y en
`src/components/landing/Precios.jsx`.

**No hace falta tocar el webhook ni la base de datos:** el plan se resuelve
por `getPlanFromPriceId`, así que un precio nuevo se mapea solo. Tampoco
hay que tocar `maxDePlan` ni `precioDePlan` (ya no existen: el webhook lee
del catálogo).

### 5.4 Verificar

```bash
npm test          # las pruebas del catálogo deben seguir pasando
npm run build
```

Si agregas un plan, **agrega una prueba** en `tests/stripe.test.ts` que
verifique que su tope de empleados es coherente con su precio respecto de
los demás.

---

## 6. Archivos de la integración

| Archivo | Responsabilidad |
|---|---|
| `supabase/migrations/20261011020000_0013_stripe_suscripciones.sql` | Esquema, `stripe_eventos`, vista `suscripcion_vigente`, `crear_empresa` con trial |
| `src/lib/stripe/planes.ts` | Catálogo de planes y `price_id`. Consumible desde cliente |
| `src/lib/stripe/utilidades.ts` | Conversión de datos de Stripe. **Puro, sin dependencias** |
| `src/lib/stripe/reglas.ts` | Decisiones de negocio (límite de empleados, creación de customer). **Puro, probado** |
| `src/lib/stripe/client.ts` | Instancia del SDK. `server-only` |
| `src/lib/stripe/server.ts` | Consultas con Supabase y Stripe. `server-only` |
| `src/lib/stripe/eventos.ts` | Procesamiento de cada tipo de evento. Recibe Supabase como parámetro |
| `src/lib/actions/stripe.ts` | Server Actions: checkout, portal, lectura |
| `src/app/api/stripe/webhook/route.ts` | Verificación de firma, idempotencia y traducción a HTTP |
| `src/app/(app)/configuracion/facturacion/page.tsx` | Pantalla de facturación |
| `src/app/(app)/configuracion/page.tsx` | Índice de configuración |
| `src/components/checkout-button.tsx` | Botón de suscripción |
| `src/components/portal-button.tsx` | Botón del portal de Stripe |
| `src/components/banner-suscripcion.tsx` | Aviso de estado en el layout |
| `tests/stripe.test.ts` | 17 pruebas |

### Por qué la lógica está repartida así

`utilidades.ts` y `reglas.ts` **no** llevan `server-only`, a diferencia de
`client.ts` y `server.ts`. La razón es concreta: `server-only` hace que el
import falle fuera de un componente de servidor, lo que impide probar la
lógica con el runner de Node. Aislar lo puro permitió cubrir las decisiones
que de verdad importan —el límite de empleados y la creación de clientes—
sin debilitar el guardia que protege la clave secreta.

---

## 7. Problemas conocidos y límites

| Tema | Estado |
|---|---|
| **Comprobante fiscal (CFDI) de la suscripción** | Stripe emite su propia factura, que **no es un CFDI**. Para facturar en México hay que integrar un PAC. Ver `docs/NOMINA.md` § 8. |
| **Aviso de privacidad y términos** | Mientras el cobro no esté activo, hay avisos de «etapa de pilotos» en la landing y en los términos. **Hay que quitarlos al activar el cobro** (sección 4.4). |
| **Multi-empresa por cliente** | Un despacho con varios clientes necesita **una cuenta por cliente**. El plan Despacho da el tope alto y el panel, pero no la administración de varias empresas desde una sola cuenta. |
| **Webhook y datos personales** | El payload completo del evento se guarda en `stripe_eventos.payload`. Incluye nombre, correo y últimos 4 dígitos de la tarjeta. **No se guarda el número completo.** Aun así, la tabla debería purgarse periódicamente; no hay una política de retención definida. |
| **Reintentos manuales** | Un evento con error permanente queda en `stripe_eventos` con `procesado = true` y `error` lleno. **No hay interfaz para reprocesarlo**: hay que hacerlo a mano. |
| **Idempotencia del reenvío tras error** | Si un evento quedó con error, un reenvío lo **sí** reprocesa (es la vía de recuperación). Está implementado y probado. |
| **Precios en la landing** | `src/components/landing/Precios.jsx` y `planes.ts` declaran los precios por separado. **Deben coincidir.** No hay una verificación automática que lo compruebe. |
