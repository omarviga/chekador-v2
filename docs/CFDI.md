# Timbrado de nómina (CFDI 4.0 con Facturapi)

Guía para configurar y usar el timbrado del CFDI de nómina.

> **Estado:** el mapeo y las validaciones están completos y cubiertos por
> **37 pruebas**, pero **el timbrado NO se ha probado contra el PAC real**:
> no había credenciales de Facturapi. Las claves de los catálogos del SAT
> se transcribieron de los catálogos publicados y **deben validarse
> timbrando un CFDI de prueba** antes de facturar nómina en producción. Ver
> § 6.

---

## 1. Configuración

### 1.1 Cuenta de Facturapi

Crea una cuenta en [facturapi.io](https://www.facturapi.io) y configura tu
**CSD** (Certificado de Sello Digital) en el panel. Sin CSD cargado no se
puede timbrar: el PAC necesita tu certificado para sellar.

Datos que Facturapi pide de la organización:

| Dato | De dónde sale |
|---|---|
| RFC | Tu constancia de situación fiscal |
| Régimen fiscal | Constancia de situación fiscal |
| Domicilio fiscal con código postal | Constancia de situación fiscal |
| CSD (`.cer`, `.key` y contraseña) | SAT → Certifica → Certificados digitales |

### 1.2 Variable de entorno

```bash
FACTURAPI_KEY=sk_test_...

# Webhook: lo firma Facturapi y se verifica con HMAC-SHA256 local.
FACTURAPI_WEBHOOK_SECRET=wh_sec_...

# Tarea de reconciliación. Si no se define, la ruta se NIEGA a funcionar.
RECONCILIACION_SECRETO=<openssl rand -hex 32>
```

> ⚠️ **Modo prueba vs. producción.** La llave `sk_test_...` emite **CFDI de
> prueba** (sin validez fiscal). La llave `sk_live_...` emite **CFDI
> reales** ante el SAT. El código **no** deduce el modo: elegir mal no
> rompe nada visible, simplemente timbra documentos fiscales de verdad. Si
> usas llaves de prueba, usa también la organización de prueba.

Sin `FACTURAPI_KEY` la aplicación funciona y la columna «CFDI» aparece
deshabilitada con el aviso «Falta config.», en lugar de fallar al hacer
clic.

### 1.3 Datos fiscales de la empresa

En la base, tabla `empresas`. La migración `0015` agregó las dos columnas
que faltaban:

```sql
update public.empresas
   set regimen_fiscal   = '601',            -- catálogo c_RegimenFiscal
       registro_patronal = 'A1234567890',   -- registro ante el IMSS
       razon_social     = 'Mi Empresa SA de CV'
 where id = '...';
```

- **`regimen_fiscal`** es obligatorio en el CFDI 4.0. Sin él, el timbrado se
  detiene antes de llamar al PAC.
- **`razon_social`** es el nombre legal del emisor. Si está vacío se usa
  `nombre_comercial`, pero el CFDI saldría con un emisor distinto al del
  SAT.
- **`registro_patronal`** es opcional en el complemento, pero el SAT puede
  marcar el CFDI como incompleto sin él.

### 1.4 Datos fiscales de cada trabajador

En la tabla `empleados`. La migración `0015` agregó estas columnas:

| Columna | Catálogo | Obligatorio |
|---|---|---|
| `clave_ent_fed` | `c_Estado` (CMX, JAL, NLE…) | **Sí** |
| `tipo_regimen` | `c_RegimenFiscal` del trabajador (casi siempre `605`) | Sí (se asume 605) |
| `tipo_jornada` | `c_TipoJornada` (`01` diurna) | Sí (se asume 01) |
| `riesgo_puesto` | `c_RiesgoPuesto` (`1` a `5`) | Sí (se deriva de `clase_riesgo`) |
| `sindicalizado` | — | No (por omisión `false`) |

`clave_ent_fed` es la entidad donde el trabajador **presta sus servicios**,
no donde vive. Si falta, el timbrado se detiene.

### 1.5 Aplicar la migración

```bash
supabase db push
```

> La migración `0015` **depende de la `0011`**: hace `comment on table
> public.nomina_conceptos`, que no existe hasta entonces. El orden por
> timestamp lo garantiza.

---

## 2. Cómo funciona el flujo

```
El usuario hace clic en «Timbrar» (con confirmación)
        │
        ▼
timbrarNominaAction (Server Action)
   · exige rol de administrador
   · verifica que FACTURAPI_KEY esté configurada
   · lee el recibo GUARDADO (no recalcula)
   · valida que no esté ya timbrado
   · genera el payload y lo valida
        │
        ├── Hay errores de datos ──► se detiene SIN llamar al PAC
        │                            (cada intento cuesta dinero)
        ▼
   Facturapi → timbra → devuelve UUID
        │
        ▼
   Descarga el XML y lo guarda en cfdi_nomina
        │
        ▼
   La UI muestra el UUID y ofrece la descarga
```

### Decisiones de diseño que conviene conocer

**No se recalcula el recibo.** Timbrado un CFDI, sus cifras son definitivas:
el documento ya está sellado. Los conceptos de `nomina_conceptos` son la
fuente de verdad y el motor solo se usa para definir sus **tipos**.

**Con errores de datos NO se llama al PAC.** El timbrado cuesta por intento
y el SAT rechazaría el CFDI igual. Se registra el intento en `cfdi_nomina`
con su motivo para que el usuario vea qué corregir.

**Doble barrera contra el timbrado duplicado.** La `idempotency_key` que se
envía a Facturapi, y la restricción única `cfdi_nomina.nomina_id`. Ambas son
necesarias: un doble clic es un problema de interfaz y un reintento por fallo
de red es un problema de red, y ocurren en momentos distintos.

**El XML se guarda en la base.** Es el documento fiscal: hay que poder
reproducirlo y entregarlo años después, y el cliente puede perder su copia.
Si la descarga falla al timbrar, el timbrado sigue siendo válido (el UUID
existe) y el XML se recupera del PAC la primera vez que alguien lo pida.

**Si el timbrado tiene éxito pero el guardado falla**, se informa el UUID en
el mensaje de error. El documento **es válido ante el SAT** aunque el sistema
no lo tenga registrado, y ese es el dato que se necesita para recuperarlo.

---

## 3. El caso del subsidio al empleo

Es el punto donde más implementaciones se equivocan, así que conviene
entenderlo.

Cuando el subsidio causado supera al ISR determinado, el patrón debe
**entregar la diferencia al trabajador** (Art. 97 LISR). Ese importe:

- **NO** es una percepción del trabajo.
- **SÍ** va en el nodo `OtrosPagos`, con `tipo_otro_pago: "002"`.
- Lleva `subsidio_causado`, que es el subsidio de la **tabla del Anexo 8**
  (no la diferencia entregada). Es obligatorio con la clave `002`.

### Un error que encontré y corregí

En `src/lib/nomina/conceptos.ts`, el concepto `P009` (subsidio entregable)
tenía declarado `claveSat: "009"`. En el catálogo `c_TipoPercepcion`, **`009`
significa «Depósitos en efectivo»**: un concepto fiscal que no tiene ninguna
relación con el subsidio.

Ese valor se usaba en la exportación contable y **habría producido un CFDI
con un concepto equivocado** si se hubiera tomado de ahí. Se corrigió a
`"002"`, que es la clave correcta de `c_TipoOtroPago`.

Además, el generador **no confía en `claveSat`** para el subsidio: lo
construye desde `nomina.isr`, porque el importe entregado y el causado son
dos números distintos y solo el motor los conoce. Hay dos pruebas dedicadas a
esto.

### Cómo verificarlo

```bash
# El caso D de la validación: salario bajo con subsidio entregable
npm run validar:nomina -- --json | Select-String "subsidioPagable"
```

Un trabajador con $200 diarios produce subsidio entregable. Un trabajador con
$600 diarios, no.

---

## 4. Probar el timbrado

```bash
# 1. Aplica las migraciones
supabase db push

# 2. Configura FACTURAPI_KEY con una llave de PRUEBA (sk_test_...)

# 3. Captura los datos fiscales (empresa y trabajadores)

# 4. Calcula un periodo en /contabilidad
# 5. En la columna «CFDI», pulsa «Timbrar» y confirma
```

### Qué revisar tras el primer timbrado

```sql
-- El CFDI quedó registrado con su UUID
select estado, uuid_fiscal, fecha_timbrado, intentos, error_mensaje
  from public.cfdi_nomina
 order by created_at desc
 limit 5;

-- El XML se guardó (pesa entre 15 y 40 KB)
select nomina_id, length(xml) as bytes_xml, uuid_fiscal
  from public.cfdi_nomina
 where estado = 'timbrado';

-- Cuántos recibos de cada periodo están timbrados
select * from public.timbrado_por_periodo;

-- Qué datos fiscales faltan por empresa
select * from public.faltantes_para_timbrar;
```

### Probar la idempotencia

Es la prueba más importante. Un CFDI duplicado hay que cancelarlo y la
cancelación de una nómina NO requiere la aceptación del trabajador (ver CFDI-CANCELACION.md):

1. Timbra un recibo.
2. Vuelve a pulsar «Timbrar» sobre el mismo recibo.
3. Debe responder **«Este recibo ya está timbrado con el UUID…»** y **no**
   crear un segundo CFDI.
4. Verifica en `cfdi_nomina` que sigue habiendo **un solo** renglón para ese
   `nomina_id`.

### Probar con el modo borrador

Para ver cómo quedará el CFDI antes de timbrarlo, el generador acepta
`estado: "draft"`:

```ts
generarPayloadNomina(nomina, emisor, claves, {
  claseRiesgoImss: 1,
  estado: "draft",   // no timbra: solo guarda el borrador
});
```

Facturapi también tiene `invoices.previewPdf(body)`, que devuelve el PDF sin
timbrar. Es la forma más segura de revisar la maquetación antes de gastar un
timbrado.

---

## 5. Agregar la descarga del PDF

El código ya tiene `descargarPdf()` en `src/lib/cfdi/facturapi.ts`, que
devuelve el PDF en base64. **No está conectado a ninguna ruta** porque falta
decidir dónde guardar el binario.

Dos opciones:

| Opción | Ventaja | Costo |
|---|---|---|
| Guardar en la base (`text` con base64) | Consistente con el XML, sin dependencias nuevas | La base crece ~1.4× el tamaño del PDF |
| Supabase Storage | No infla la base | Requiere configurar un bucket y sus políticas |
| Descargar del PAC al vuelo | Nada que almacenar | Si Facturapi cae o se cancela la cuenta, se pierde la representación impresa |

Recomendación: **almacenar**. La representación impresa es parte del
documento fiscal y no debería depender de que el PAC siga disponible.

---

## 6. Validación de catálogos antes de producción

⚠️ **Esto no se ha hecho y es indispensable.**

Las claves de los catálogos del SAT en `src/lib/cfdi/catalogos.ts` se
transcribieron de los catálogos publicados, pero **no se validaron timbrando
un CFDI real**. El SAT rechaza el CFDI cuando una clave no existe en el
catálogo, y cada rechazo cuesta un intento.

Checklist:

- [ ] Timbrar un CFDI de prueba con **Facturapi en modo test** y un
      trabajador ficticio. Si el PAC lo acepta, la estructura es válida.
- [ ] Cotejar `c_PeriodicidadPago` contra el Anexo 20 de la RMF del
      ejercicio. Chekdor usa seis periodicidades: diaria, semanal, decenal,
      catorcenal, quincenal y mensual.
- [ ] Cotejar `c_TipoContrato`. Chekdor guarda texto libre, así que la
      inferencia por palabra clave puede caer en `"99"` (otro). **Revisar
      cuántos trabajadores caen en 99**:

      ```sql
      select tipo_contrato, count(*) from public.empleados
       where activo = true group by 1 order by 2 desc;
      ```

      Todo lo que no sea inequívoco («indeterminado», «obra determinada»…)
      hay que confirmarlo con el cliente.
- [ ] Cotejar `c_RiesgoPuesto`. Chekdor lo deriva de
      `configuracion_nomina.clase_riesgo`, que es la clase del **IMSS para la
      empresa**, no el riesgo del **puesto**. Coinciden en una PyME con
      puestos homogéneos, pero no si hay puestos de riesgos distintos.
- [ ] Verificar el `registro_patronal` contra el del IMSS. Un registro
      patronal incorrecto produce un CFDI que el SAT acepta pero que el IMSS
      no reconoce.
- [ ] Timbrar el caso con **subsidio entregable** (salario bajo) y revisar
      que el nodo `OtrosPagos` salga con `tipo_otro_pago: "002"` y su
      `subsidio_causado`.
- [ ] Timbrar el caso con **horas extra** y revisar que el nodo
      `horas_extra` salga con `dias`, `tipo_horas` y `horas_extra`.
- [ ] **Un contador debe revisar un CFDI timbrado** contra el recibo de
      nómina antes de emitir el primero en producción.

### Lo que NO se implementó

| Falta | Por qué importa |
|---|---|
| ~~Cancelación de CFDI~~ | **Implementada.** Ver [docs/CFDI-CANCELACION.md](CFDI-CANCELACION.md) |
| **CFDI de nómina extraordinaria** (`tipo_nomina: "E"`) | El generador lo soporta, pero el motor no calcula aguinaldo, prima vacacional ni finiquito, así que no hay nada que timbrar como extraordinario |
| **Ajuste anual del ISR** | No se calcula |
| **Cuota patronal adicional Ley 97** | No se calcula |
| **Consulta del estatus del CFDI ante el SAT** | `consultarCfdi()` existe en el cliente pero no hay interfaz ni tarea programada |
| **No hay tarea que reintente un webhook con error** | Un evento que falla queda en `facturapi_eventos` con `error`; la tarea programada lo recupera por otra vía, pero el evento mismo no se reprocesa |
| **Sustitución (motivo 01)** | **Implementada.** El recálculo actualiza el recibo en su lugar, se emite el CFDI nuevo con relación 04 y se cancela el original. Ver [docs/CFDI-SUSTITUCION.md](CFDI-SUSTITUCION.md) |

---

## 7. Archivos de la integración

| Archivo | Responsabilidad |
|---|---|
| `supabase/migrations/20261011040000_0015_cfdi_nomina.sql` | Columnas fiscales, tabla `cfdi_nomina`, vistas de avance y de faltantes |
| `src/lib/cfdi/catalogos.ts` | Catálogos del SAT y sus mapeos. **Puro, probado** |
| `src/lib/cfdi/nomina-payload.ts` | Genera el cuerpo que espera Facturapi. **Puro, probado** |
| `src/lib/cfdi/facturapi.ts` | Cliente del PAC y traducción de errores. `server-only` |
| `src/lib/actions/cfdi.ts` | Server Actions de timbrado y descarga |
| `src/app/api/cfdi/[nominaId]/xml/route.ts` | Entrega el XML como archivo |
| `src/components/contabilidad/boton-timbrar.tsx` | Botón con confirmación y estado |
| `tests/cfdi.test.ts` | 37 pruebas |
| `src/lib/cfdi/cancelacion.ts`, `reconciliacion.ts`, `reconciliar-servidor.ts` | Cancelación y reconciliación. Ver [docs/CFDI-CANCELACION.md](CFDI-CANCELACION.md) |
| `src/app/api/facturapi/webhook/route.ts`, `src/app/api/tareas/reconciliar/route.ts` | Webhook del PAC y tarea programada de reconciliación |
| `scripts/extraer-schema-nomina.py` | Extrae los schemas del OpenAPI de Facturapi |

### Por qué la lógica está repartida así

`catalogos.ts` y `nomina-payload.ts` **no** llevan `server-only`, a
diferencia de `facturapi.ts`. La razón es la misma que en la integración de
Stripe: `server-only` impide importar el módulo desde una prueba, y lo que
hay que probar es precisamente el mapeo. Aislarlo permitió cubrir las
decisiones que deciden el contenido de un documento fiscal sin debilitar el
guardia que protege la clave del PAC.

### Cómo se obtuvo la forma del payload

El SDK de Facturapi (v5.1.0) tipa `invoices.create` como
`Record<string, any>`: **no hay tipos para el complemento de nómina**. En vez
de adivinar los nombres de los campos, se extrajo la definición del OpenAPI
público del PAC:

```bash
curl -o %TEMP%\facturapi-openapi.yaml https://docs.facturapi.io/en/redocusaurus/api-en.yaml
python scripts/extraer-schema-nomina.py
```

De ahí salieron los nombres reales (`tipo_percepcion`, `importe_gravado`,
`num_dias_pagados`, `subsidio_causado`…) y la estructura
`complements[].data`. **Si Facturapi cambia su API, este script es la forma
de detectarlo.**

---

## 8. Problemas conocidos

| Tema | Estado |
|---|---|
| **Timbrado no probado contra el PAC** | El mapeo y las validaciones están probados, pero ningún CFDI se ha timbrado. Ver § 6 |
| **`dias` de las horas extra es una aproximación** | El motor no expone el desglose por día, así que se divide entre el máximo legal de 3 h/día (LFT Art. 66). El SAT no usa ese campo para recalcular, pero conviene mejorarlo si se requiere exactitud |
| **Reconciliación programada** | Existe (`/api/tareas/reconciliar`) pero **hay que programarla**: sin un cron, un webhook perdido deja el estado desactualizado. Ver [docs/CFDI-CANCELACION.md](CFDI-CANCELACION.md) § 7 |
| **Riesgo del puesto derivado de la clase del IMSS** | Son catálogos distintos que casi coinciden. Ver § 6 |
| **El XML no se cifra en la base** | Un CFDI contiene RFC, CURP, NSS y el desglose de percepciones. La tabla tiene RLS, pero el XML queda legible para quien tenga acceso a la base. Es la misma deficiencia declarada en `docs/legal/MEDIDAS_DE_SEGURIDAD.md` |
| **Sin política de retención del XML** | El CFDI hay que conservarlo años (Art. 30 CFF: cinco años). La tabla crecerá de forma indefinida y no hay purga ni archivado |
| **`nomina_conceptos.clave_sat` de `P009` corregido** | Estaba en `"009"` (Depósitos en efectivo). Se corrigió a `"002"`. **Si algún entorno ya exportó archivos contables con ese valor, hay que revisarlos** |
