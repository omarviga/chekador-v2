# Puesta en marcha

Guía para dejar Chekdor operando. Está ordenada por **bloqueadores**: lo que
impide operar va primero, porque el orden importa — configurar un webhook antes
de tener la clave de servicio solo produce errores confusos.

> **Cómo usar esta guía.** Empieza por `npm run diagnostico`. Te dice en qué
> punto estás y qué falta. Las casillas de aquí se corresponden con lo que ese
> comando comprueba.

```bash
npm run diagnostico
```

El diagnóstico **no modifica nada**: solo lee. Devuelve código de salida
distinto de cero si hay bloqueadores, así que también sirve en un script de
despliegue.

---

## Estado actual (11-oct-2026)

| Área | Estado |
|---|---|
| Migraciones (18) | ✅ Aplicadas |
| Catálogos fiscales | ✅ Cargados (66 renglones de ISR, ejercicio 2026) |
| Stripe: claves y webhook | ✅ Configurados en modo prueba |
| Stripe: precios de los planes | ❌ **Nombre de variable incorrecto** |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ **Falta: bloquea todos los webhooks** |
| Facturapi | ❌ Falta la clave |
| Reconciliación | ❌ Falta el secreto |
| Validación con el SAT | ❌ Pendiente |

**Cinco puntos por resolver.** Tres de ellos **fallan en silencio**, que es la
peor categoría: nada da error, simplemente la función no opera.

---

## Fase 1 — Bloqueadores

### 1.1 Renombrar las variables de los precios ⚠️ FALLA EN SILENCIO

Tus variables son `STRIPE_PRICE_BASICO`, `STRIPE_PRICE_PRO` y
`STRIPE_PRICE_BUSINESS`. El código lee **`NEXT_PUBLIC_STRIPE_PRICE_*`**: lleva
el prefijo porque el navegador necesita conocer los identificadores de precio
para decidir si muestra el botón de suscripción.

Con el nombre sin prefijo, `obtenerPlanes()` devuelve cadenas vacías, la
pantalla de facturación muestra el aviso «Falta config.» y **los tres botones
de suscripción aparecen deshabilitados sin ningún mensaje de error**. Tu webhook
de Stripe funciona perfectamente y no hay forma de iniciar un pago.

En `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PRICE_BASICO=price_...
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_STRIPE_PRICE_BUSINESS=price_...
```

Elimina las tres versiones sin prefijo.

### 1.2 Añadir `SUPABASE_SERVICE_ROLE_KEY` ⚠️ BLOQUEA TODOS LOS WEBHOOKS

Supabase → **Project Settings → API → service_role**.

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Es un JWT: empieza por `eyJ`.** Si pegaste por error la clave `anon`, el
diagnóstico lo detecta.

**Por qué es imprescindible.** Los webhooks no tienen sesión de usuario: el
evento llega de Stripe o de Facturapi, no de un navegador. Sin la clave de
servicio no pueden escribir en la base y **devuelven 500 en cada evento**.
Stripe reintenta durante días y luego se rinde. El síntoma es
desconcertante: todo parece configurado, el webhook aparece como entregado en
el panel con errores, y el plan del cliente nunca se actualiza.

La misma clave la necesitan:

- El webhook de Stripe (`/api/stripe/webhook`)
- El webhook de Facturapi (`/api/facturapi/webhook`)
- La tarea de reconciliación (`/api/tareas/reconciliar`)
- `npm run diagnostico` y `npm run validar:nomina`

> **Es secreta.** Nunca debe llevar el prefijo `NEXT_PUBLIC_`: eso la
> incrustaría en el bundle del navegador y cualquiera podría leer y escribir
> toda la base saltándose RLS.

### 1.3 Comprobar el resultado

```bash
npm run diagnostico
```

La sección **BASE DE DATOS** debe mostrar las tablas y columnas presentes, y los
datos fiscales capturados. Antes de tener la clave de servicio, el diagnóstico
no puede comprobar ninguna de las dos cosas y lo dice en lugar de inventar
resultados.

---

## Fase 2 — Facturapi (timbrado)

### 2.1 Cuenta y CSD

1. Crea una cuenta en [facturapi.io](https://www.facturapi.io).
2. Carga el **CSD** (Certificado de Sello Digital) en el panel: `.cer`, `.key` y
   su contraseña. **Sin CSD no se puede timbrar**: el PAC lo necesita para
   sellar. Pídeselo a tu contador.
3. Configura los datos fiscales de la organización.

### 2.2 Clave de API

Dashboard de Facturapi → **Developers → API Keys**.

```bash
FACTURAPI_KEY=sk_test_...
```

> ⚠️ **Modo prueba vs. producción.** `sk_test_` emite **CFDI de prueba** (sin
> validez fiscal); `sk_live_` emite **CFDI reales ante el SAT**. El código **no**
> deduce el modo de la clave: elegir mal no rompe nada visible, simplemente
> timbra documentos fiscales de verdad. Empieza con `sk_test_`.

### 2.3 Webhook

Dashboard de Facturapi → **Webhooks** → añadir endpoint:

- **URL:** `https://tu-dominio.com/api/facturapi/webhook`
- **Eventos:** `invoice.cancellation_status_updated` y `invoice.status_updated`
- Copia el **secret** (`wh_sec_...`):

```bash
FACTURAPI_WEBHOOK_SECRET=wh_sec_...
```

La firma se verifica con **HMAC-SHA256 local** (verificado en el código del SDK),
así que no depende de que la API de Facturapi esté disponible.

### 2.4 Datos fiscales de la empresa

Sin **régimen fiscal** el timbrado se detiene antes de llamar al PAC: es
obligatorio en el CFDI 4.0 y es el error más probable en la puesta en marcha,
porque es una columna que se agregó después.

```sql
select id, nombre_comercial, rfc,
       regimen_fiscal,   -- catálogo c_RegimenFiscal (601, 605, 612, 626…)
       razon_social,     -- nombre LEGAL, no el comercial
       cp,               -- 5 dígitos, del domicilio fiscal
       registro_patronal -- del IMSS
  from public.empresas;
```

```sql
update public.empresas
   set regimen_fiscal    = '601',
       razon_social      = 'Mi Empresa SA de CV',
       cp                = '06600',
       registro_patronal = 'A1234567890'
 where id = '...';
```

| Columna | Obligatoria | Nota |
|---|---|---|
| `regimen_fiscal` | **Sí** | Sin ella el timbrado se detiene |
| `razon_social` | En la práctica | Si falta se usa la comercial, pero el CFDI saldrá con un emisor distinto al del SAT |
| `cp` | **Sí** | 5 dígitos. Sin él el timbrado se detiene |
| `registro_patronal` | No | El SAT puede marcar el CFDI como incompleto |

### 2.5 Datos fiscales de los trabajadores

```sql
select count(*) as activos,
       count(*) filter (where rfc is null or curp is null or nss is null
                          or clave_ent_fed is null or tipo_regimen is null) as incompletos
  from public.empleados
 where activo = true;
```

Si `incompletos` es mayor que cero, esos recibos **no se podrán timbrar**. Para
cada trabajador hacen falta:

| Columna | Catálogo | Nota |
|---|---|---|
| `clave_ent_fed` | `c_Estado` (CMX, JAL…) | Dónde **presta sus servicios**, no donde vive |
| `tipo_regimen` | `c_RegimenFiscal` | Casi siempre `605` (Sueldos y Salarios) |
| `tipo_jornada` | `c_TipoJornada` | `01` diurna por omisión |
| `riesgo_puesto` | `c_RiesgoPuesto` | `1` a `5`. Se deriva de `clase_riesgo` si falta |

**Revisa el tipo de contrato**, que es texto libre y se clasifica por palabra
clave:

```sql
select tipo_contrato, count(*) from public.empleados
 where activo = true group by 1 order by 2 desc;
```

Todo lo que no sea inequívoco («indeterminado», «obra determinada»…) cae en
`"99"` (otro), que es un dato fiscal incorrecto aunque el CFDI se timbre.

### 2.6 Primer timbrado de prueba

1. `/contabilidad` → calcula un periodo.
2. Columna **CFDI** → **Timbrar**.
3. Verifica:

```sql
select estado, uuid_fiscal, fecha_timbrado, length(xml) as bytes_xml
  from public.cfdi_nomina order by created_at desc limit 3;
```

**La comprobación definitiva:** descarga el XML y confirma que existe el
complemento de nómina y que los importes coinciden con el recibo. Un contador
debe revisarlo **antes** de emitir el primer CFDI real.

Detalle completo: [docs/CFDI.md](CFDI.md) § 6.

---

## Fase 3 — Reconciliación de cancelaciones

### 3.1 Secreto

```bash
openssl rand -hex 32
```

```bash
RECONCILIACION_SECRETO=<el valor generado>
```

Si no se define, la ruta `/api/tareas/reconciliar` devuelve **503**: no se
degrada a «abierta». Una ruta sin protección silenciosa sería peor que una que
no funciona, porque consume la cuota del PAC y nadie se entera de que está
expuesta.

### 3.2 Programarla

Sin un cron, un webhook perdido deja el estado desactualizado hasta que alguien
pulse «Consultar estado» a mano.

**Opción recomendada** — programador externo (cron-job.org, EasyCron, GitHub
Actions), cada 6 horas:

```bash
curl -H "Authorization: Bearer $RECONCILIACION_SECRETO" \
     https://tu-dominio.com/api/tareas/reconciliar
```

El secreto viaja en un encabezado y **no queda en los logs** de la aplicación.

**Opción con Vercel** — `vercel.json`:

```json
{ "crons": [{ "path": "/api/tareas/reconciliar", "schedule": "0 */6 * * *" }] }
```

Define `CRON_SECRET` con el mismo valor que `RECONCILIACION_SECRETO`: Vercel
añade el encabezado `Authorization` automáticamente. Si prefieres el parámetro
`?secreto=`, funciona, pero **queda en los logs de la plataforma**.

### 3.3 Verificarla

```bash
# Con el secreto correcto → JSON con el resumen
curl -H "Authorization: Bearer $RECONCILIACION_SECRETO" \
     "http://localhost:3000/api/tareas/reconciliar?limite=10"

# Sin secreto → 404 (no se confirma que la ruta exista)
curl -i http://localhost:3000/api/tareas/reconciliar
```

Detalle completo: [docs/CFDI-CANCELACION.md](CFDI-CANCELACION.md) § 7.

---

## Fase 3.b — Cargar la empresa demo

Si no tienes datos reales todavía, la migración `0019` crea una empresa
ficticia completa para poder demostrar el producto y capturar pantallas:

```bash
supabase db push      # la 0019 viene incluida
```

Después, enlaza tu usuario para poder entrar (instrucciones en el documento)
y pulsa **Calcular** en `/contabilidad` para generar los recibos y las
pólizas con el motor real.

**Detalle completo:** [docs/EMPRESA-DEMO.md](EMPRESA-DEMO.md)

> La demo **no siembra cifras de nómina**: deja el periodo creado para que lo
> calcule el motor. Una demo con números escritos a mano se desincroniza del
> producto, y entonces la demo miente.

---

## Fase 4 — Validar los cálculos (con tu contador)

**Esta es la fase que no se puede automatizar.** Todo lo anterior hace que el
sistema *funcione*; esto hace que los números sean *correctos*.

### 4.1 Leer los catálogos de la base, no del código

```bash
npm run validar:nomina
```

La cabecera debe decir **`Origen de catálogos: BD`**. Si dice `RESPALDO`, los
números que veas salen del código y **no sirven para validar contra el SAT**.

Para que lea la base, define las credenciales de un usuario de prueba:

```bash
TEST_EMAIL=usuario-de-prueba@ejemplo.com
TEST_PASSWORD=...
```

Créalo en Supabase → **Authentication**. Es la vía preferida sobre la clave de
servicio porque entra con el rol `authenticated`, el mismo que usa la aplicación
en producción, así que de paso valida las políticas RLS.

### 4.2 La validación que importa

`docs/CALCULOS-VALIDACION.md` tiene el procedimiento completo. Los tres puntos
que hay que cerrar:

1. **Cotejar los catálogos contra el Anexo 8 de la RMF y el decreto de
   subsidio.** Que estén cargados **no** significa que estén vigentes. El
   diagnóstico lo advierte a propósito.
2. **Cotejar el resultado contra la calculadora del SAT**, caso por caso, con el
   procedimiento de § 4 de ese documento.
3. **Que un contador firme la revisión.** El sistema calcula; la responsabilidad
   fiscal es del patrón y de su contador.

> **Antes de firmar con un cliente**, léete `docs/legal/README.md`: tiene la
> lista de datos por completar en los contratos (RFC, razón social, domicilio,
> jurisdicción) y los buzones `privacidad@`, `legal@` y `soporte@`.

---

## Fase 5 — Antes de cobrar de verdad

Cuando decidas pasar a producción:

### 5.1 Stripe

- [ ] **Activa la cuenta** y completa la verificación de identidad y datos
      bancarios.
- [ ] **Cambia a modo live** y **recrea los tres productos y precios**. Los
      precios de prueba **no** sirven en producción.
- [ ] Cambia las tres variables a los precios de producción y la clave a
      `sk_live_...`.
- [ ] **Crea un webhook nuevo en modo live** con su propio signing secret (no se
      copia del modo de prueba).
- [ ] **Reconfigura el portal de cliente** también en modo live.
- [ ] Pasa las tres variables a los valores de producción.

### 5.2 Facturapi

- [ ] Cambia `FACTURAPI_KEY` a `sk_live_...`.
- [ ] **Crea un webhook nuevo en modo live** con su propio secret.
- [ ] Timbra **un CFDI real** de un empleado propio y cancélalo. Confirma que
      aparece `aceptada` sin pasar por `pending` (la nómina no requiere
      aceptación del receptor).

### 5.3 Avisos legales que hay que retirar

Al activar el cobro hay que **quitar los avisos de «etapa de pilotos»**:

| Archivo | Qué quitar |
|---|---|
| `src/components/landing/Precios.jsx` | El recuadro `#aviso-piloto` |
| `src/components/landing/FAQ.jsx` | «todavía no está habilitado el cobro» y la cancelación por correo |
| `docs/legal/terminos/contenido_terminos.py` | El recuadro «AVISO SOBRE COBROS» de la sección 7 |

Regenera los dos artefactos de los términos:

```bash
python docs/legal/terminos/generar_docx.py
python docs/legal/terminos/generar_tsx.py
```

Y revisa la **cláusula de comprobante fiscal** del contrato de servicios: hoy
promete algo que solo podrás cumplir cuando el timbrado esté validado.

### 5.4 Verificación final

- [ ] `npm run diagnostico` sin bloqueadores.
- [ ] `npm run build` correcto.
- [ ] Un pago real de **$10 MXN** con tu propia tarjeta, y reembolsarlo.
- [ ] Revisar que los webhooks lleguen:

```sql
select tipo, procesado, error, created_at
  from public.stripe_eventos order by created_at desc limit 10;

select tipo, procesado, error, created_at
  from public.facturapi_eventos order by created_at desc limit 10;

-- Los eventos sin procesar indican un problema
select * from public.stripe_eventos
 where procesado = false and created_at < now() - interval '1 hour';
```

---

## Los cuatro errores que fallan en silencio

Vale la pena tenerlos presentes: ninguno produce un mensaje de error, y los
cuatro se manifiestan como «la función simplemente no hace nada».

| Error | Síntoma | Detección |
|---|---|---|
| Variable de precio sin el prefijo `NEXT_PUBLIC_` | Los botones de suscripción aparecen deshabilitados | `npm run diagnostico` |
| Falta `SUPABASE_SERVICE_ROLE_KEY` | Los webhooks devuelven 500 en el panel del proveedor y el plan nunca cambia | `npm run diagnostico` |
| Catálogos fiscales vacíos o desactualizados | El motor calcula con los valores de respaldo del código | `npm run validar:nomina` (cabecera) |
| La tarea de reconciliación sin programar | Una cancelación en trámite se queda así para siempre | Revisar que el cron exista |

---

## Comandos de referencia

```bash
npm run diagnostico        # estado de la configuración y de la base
npm run validar:nomina     # desglose de 4 casos para cotejar contra el SAT
npm test                   # 197 pruebas
npm run typecheck          # TypeScript estricto
npm run build              # compilación de producción

supabase db push           # aplicar migraciones
python docs/legal/terminos/generar_docx.py   # regenerar los términos
```

## Documentación por módulo

| Documento | Contenido |
|---|---|
| [docs/NOMINA.md](NOMINA.md) | Motor de nómina: fórmulas, fuentes legales y límites |
| [docs/CALCULOS-VALIDACION.md](CALCULOS-VALIDACION.md) | **La validación con el SAT y el contador** |
| [docs/CFDI.md](CFDI.md) | Timbrado del CFDI de nómina |
| [docs/CFDI-CANCELACION.md](CFDI-CANCELACION.md) | Cancelación y reconciliación |
| [docs/CFDI-SUSTITUCION.md](CFDI-SUSTITUCION.md) | Sustitución (motivo 01) |
| [docs/STRIPE.md](STRIPE.md) | Suscripciones y cobro |
| [docs/legal/README.md](legal/README.md) | Contratos: qué firmar y qué falta |
