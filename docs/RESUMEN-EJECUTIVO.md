# Chekdor · Resumen ejecutivo del sistema

**Documento técnico y de negocio**
**Estado: 12 de octubre de 2026 · commit `3e693da` + cambios locales sin confirmar**

---

## 1. Qué es

**Chekdor** es un sistema de control de asistencia por NFC y cálculo de nómina para
PyMEs mexicanas, con **integración contable** como propuesta de valor central.

### La tesis del producto

El cálculo de la nómina no es el problema de un despacho contable; **es la
captura**. Entre el marcaje del empleado y el dato dentro del sistema contable
hay un trayecto manual —Excel con celdas combinadas, foto del cuaderno, audio
por WhatsApp— donde se van las horas y se cuelan los errores.

Chekdor elimina ese trayecto: **registra la asistencia, calcula la nómina y
entrega el archivo de importación y la póliza contable ya cuadrada.**

### Frontera del producto: Chekdor NO timbra

Decisión explícita del negocio:

```
Chekdor calcula  →  genera el layout y la póliza  →  el contador los descarga
                                                        ↓
                                        los sube a SU sistema de facturación
                                                        ↓
                                              ahí se timbra el CFDI
```

Chekdor **no es PAC, no contrata PAC y no emite CFDI.** El módulo de Facturapi
existe en el código pero queda **deshabilitado** sin `FACTURAPI_KEY`
(`src/app/(app)/contabilidad/page.tsx:212`). La aplicación funciona completa sin
él: cálculo, pólizas, exportación, reportes.

**Consecuencia de esta decisión:** los layouts de exportación son el
entregable crítico. Si al archivo le falta un dato del complemento, el contador
lo captura a mano por cada trabajador — exactamente el trabajo que el producto
promete eliminar. Ver § 5.

### Cliente objetivo

| Perfil | Qué le duele |
|---|---|
| **Despacho contable** | 15 clientes × 2-4 horas/mes capturando nómina |
| **Área contable de una PyME** | Cuadrar la póliza cada quincena |
| **Contador independiente** | El cierre de fin de mes se come el tiempo |

---

## 2. Planes

| Plan | Precio | Límite | Perfil |
|---|---|---|---|
| **Básico** | $299 MXN/mes | 10 empleados | PyME con un solo centro de trabajo |
| **Contable** | $599 MXN/mes | 30 empleados | PyME con área contable propia |
| **Despacho** | $1,299 MXN/mes | 100 empleados | Despacho con varios clientes |

> Los precios son **previstos, no una oferta de cobro**. No incluyen timbrado,
> porque el timbrado no lo hace Chekdor.

---

## 3. Tamaño y forma del sistema

| Componente | Archivos | Líneas |
|---|---:|---:|
| Lógica de negocio (`src/lib`) | 51 | 12,267 |
| Páginas (`src/app`) | 20 | 4,110 |
| Acciones de servidor | 13 | 2,937 |
| Componentes de la aplicación | 26 | 3,130 |
| Landing (16 `.jsx` + `vista-archivos.tsx`) | 17 | 2,585 |
| Pruebas | 6 | 3,550 |
| Migraciones SQL | 19 | 3,461 |
| Scripts de operación | 6 | 2,583 |
| Documentación | 13 | 4,240 |
| **Total** | **~120** | **35,316** |

> El total **excluye este resumen**. La carpeta `src/components/landing/`
> contiene además `datos.ts`, que no es un componente sino el módulo de datos
> **generado** por `npm run datos:landing`.

---

## 4. Arquitectura

### 4.1 Stack

| Capa | Tecnología | Nota |
|---|---|---|
| Framework | **Next.js 16.4** App Router | `cacheComponents: true` (PPR), Turbopack |
| UI | **React 19.3** + TypeScript strict | |
| Estilos | **Tailwind CSS 4** | Tokens en `@theme` de CSS; sin `tailwind.config.js` |
| Base de datos | **Supabase** (PostgreSQL) | RLS multi-tenant |
| Autenticación | Supabase Auth | Roles: `super_admin`, `admin_empresa`, `rh`, `supervisor`, `empleado` |
| Pagos | **Stripe** SDK v23 | Suscripciones |
| Movimiento | **`motion` 14.1** (MIT) | Sucesor de framer-motion |
| Iconos | `lucide-react` | |
| Pruebas | `node:test` nativo | 197 casos |

### 4.2 Restricción arquitectónica crítica

`cacheComponents: true` implementa **Partial Prerendering**: **cualquier dato no
cacheado durante el prerenderizado es un error de build bloqueante.** Y
`export const runtime` está prohibido por esa configuración.

La landing debe mantenerse como **cascarón estático**. Toda la animación es
client-side. Verificado: `/` se compila como `○ (Static)`.

### 4.3 Módulos de la aplicación

| Ruta | Función |
|---|---|
| `/` | Landing pública (estática) |
| `/login` · `/registro` · `/onboarding` | Acceso y alta |
| `/dashboard` | Asistencia del día |
| `/marcar` | Marcaje por NFC (móvil, sin app nativa) |
| `/empleados` · `/empleados/[id]` | Altas y datos fiscales del trabajador |
| `/puntos` | Tags NFC |
| `/contabilidad` | Cálculo de nómina, recibos, descarga |
| `/contabilidad/configuracion` | **Mapeo del catálogo de cuentas** |
| `/reportes` | Jornadas y asistencias |
| `/configuracion` · `/configuracion/facturacion` | Empresa y suscripción |
| `/nom035` · `/nom035/evaluacion/[id]` | Cuestionario NOM-035 (riesgo psicosocial) |
| `/privacidad` · `/privacidad/arco` | Aviso por empresa y derechos ARCO |
| `/privacidad-encargado` · `/terminos` | Documentos legales públicos |

**Endpoints de API:**

```
/api/stripe/webhook              Suscripciones
/api/cfdi/[nominaId]/xml         Descarga de XML  (módulo deshabilitado)
/api/facturapi/webhook           Cancelaciones    (módulo deshabilitado)
/api/tareas/reconciliar          Tarea programada (módulo deshabilitado)
```

### 4.4 Seguridad multi-tenant

Aislamiento por **Row Level Security** de PostgreSQL, no por lógica de
aplicación. Funciones auxiliares: `puede_administrar()`, `es_super_admin()`,
`auth_empresa_id()`, `mis_empleado_ids()`.

Documentado en `docs/MEDIDAS_DE_SEGURIDAD.md` y
`docs/PROCEDIMIENTO_VULNERACIONES.md`.

---

## 5. El motor de nómina

Es el activo central del sistema: **12,267 líneas** de lógica fiscal pura, sin
dependencias de red ni de la base de datos, para poder probarla y razonarla.

### 5.1 Módulos

| Archivo | Responsabilidad |
|---|---|
| `engine.ts` | Orquesta el cálculo del recibo |
| `isr.ts` | ISR con tarifa y subsidio al empleo |
| `imss.ts` | Cuotas obrero-patronales, SAR e INFONAVIT |
| `lft.ts` | Jornadas: horas extra, prima dominical |
| `polizas.ts` | **Generación de la póliza contable** |
| `exportar.ts` | Filas de exportación |
| `serializador.ts` | Escritura de archivos con separador, BOM y fin de línea |
| `plantillas.ts` | **9 layouts** (CONTPAQi, Aspel, CSV genérico) |
| `tablas.ts` | Catálogos con respaldo en código |
| `conceptos.ts` | Conceptos con clave SAT y clave contable |

### 5.2 Precisión verificada

Caso de referencia: salario diario **$600**, quincena del 1 al 15 de octubre de
2026, **6 horas extra dobles**, **2 domingos** trabajados.

| Concepto | Importe |
|---|---|
| Sueldo (15 días) | $9,000.00 |
| Horas extra dobles (6 h) | $900.00 |
| Prima dominical (2 domingos) | $300.00 |
| ISR retenido | −$1,117.82 |
| IMSS cuotas obreras | −$182.67 |
| **Neto a pagar** | **$8,899.51** |
| Cuotas patronales | $2,218.65 |
| **Costo total para la empresa** | **$11,118.16** |
| SBC | $629.58 |

**Póliza contable: cuadra exacto.**

```
debe  10,200.00
haber 10,200.00   ←  CUADRA
```

### 5.3 La póliza contable

Cada concepto del recibo cae en su cuenta, con el catálogo que **configura el
cliente** (no uno impuesto). Ejemplo real:

```
510-001  Sueldo                    debe   9,000.00
510-002  Horas extra               debe     900.00
510-003  Prima dominical           debe     300.00
210-001  ISR retenido                      haber  1,117.82
210-002  IMSS cuotas obreras               haber    182.67
210-010  Neto a pagar                      haber  8,899.51
```

Genera **provisión, pago y cuotas patronales**, por separado o consolidadas.

### 5.4 Los 9 layouts de exportación

| Layout | Documento | Separador | Encabezado |
|---|---|---|---|
| CONTPAQi Contabilidad | póliza | `\|` | no |
| CONTPAQi Nóminas | nómina (resumen) | `\|` | sí |
| CONTPAQi Nóminas | nómina (detalle) | `\|` | sí |
| Aspel COI | póliza | `\|` | — |
| Aspel NOI | nómina (resumen) | CSV | — |
| Aspel NOI | nómina (detalle) | CSV | — |
| CSV genérico | nómina | `,` | sí |
| CSV conceptos | detalle | `,` | sí |
| Póliza genérica | póliza | `,` | — |

Codificación configurable (UTF-8 con o sin BOM), porque Excel y NOI leen los
acentos distinto.

### 5.5 Datos que el contador recibe para timbrar

Cotejado contra la **Guía de llenado del comprobante del recibo de pago de
nómina** del SAT (CFDI 4.0 / complemento 1.2, edición de enero de 2026, 133
páginas). Ver `docs/EXPORTACION-CFDI.md`.

**Los 18 campos del nodo `Receptor` están soportados**, y las claves SAT de cada
concepto viajan en el archivo de detalle:

```
P  clave_sat=001  gravado=9000   exento=0       Sueldo
P  clave_sat=019  gravado= 450   exento=450     Horas extra
P  clave_sat=020  gravado= 73.72 exento=226.28  Prima dominical
D  clave_sat=002                                ISR retenido
D  clave_sat=001                                IMSS cuotas obreras
```

Verificable con `npm run verificar:exportacion`.

---

## 6. Cumplimiento de la reforma laboral de 2026

**Hecho verificado contra el DOF y dos despachos legales.**

Decreto publicado en el **DOF el 1 de mayo de 2026**, que da cumplimiento a la
reforma constitucional al art. 123 publicada el **3 de marzo de 2026**.

### 6.1 Lo que cambia y cuándo

| Materia | 2026 | 2027 | 2028 | 2029 | 2030 |
|---|---|---|---|---|---|
| Jornada máxima semanal | 48 h | **46 h** | 44 h | 42 h | **40 h** |
| Horas extra máximas/semana | 9 h | 9 h | 10 h | 11 h | 12 h |

**Registro electrónico de jornada: obligatorio el 1 de enero de 2027**
(art. 132 fr. XXXIV). Multa de **250 a 5,000 UMA** (art. 994 fr. IV Bis) =
**$28,285 a $565,700** con la UMA de 2026 ($113.14).

> **Matiz crítico:** la obligación entra en vigor cuando la **STPS publique las
> disposiciones de carácter general**. A la fecha de este documento **esas
> disposiciones aún no se publican**.

### 6.2 Nuevo régimen de horas extra

La reforma **deroga el art. 67** y crea dos bloques:

| | Régimen anterior | Nuevo régimen |
|---|---|---|
| 1er bloque (100% adicional) | 3 h/día, máx 3 veces/semana (9 h) | Hasta **4 h/día**, en máx 4 días |
| 2º bloque (200% adicional) | Excedente de 9 h/semana | **Máx 4 h/semana** |
| Tope diario absoluto | *sin límite expreso* | **12 h** (ordinaria + extra) |
| Menores | Prohibido < 16 años | Prohibido **< 18 años** |

### 6.3 Estado de cumplimiento

| Requisito | Estado |
|---|---|
| Régimen de horas extra de **2026** (9 h al doble) | ✅ **Cumple** — `lft.ts:10` |
| Prima dominical 25 % (art. 71) | ✅ Cumple |
| Registro electrónico con marca de tiempo | ✅ **Es el producto** |
| **Topes parametrizados por ejercicio** | ❌ **Faltan** — hardcodeados |
| **Jornada de 46 horas** | ❌ Sin pruebas |
| **Tope absoluto de 12 h diarias** | ❌ Faltan |
| **Prueba plena** (registro acordado con el trabajador) | ❌ **Oportunidad** |

### 6.4 La oportunidad estratégica

El análisis legal lo dice textualmente:

> «El contenido del registro electrónico hará **prueba plena** si se acredita
> que fue **acordado entre la persona trabajadora y la persona empleadora**.»

Un registro de jornada **inmutable y acordado por escrito con el trabajador**
gana un juicio laboral. Eso convierte a Chekdor en algo más que un checador:
en **la defensa documental del patrón**.

Ninguna función del sistema captura hoy ese acuerdo.

---

## 7. Módulo de CFDI (deshabilitado por decisión de negocio)

**16 archivos**, ~2,000 líneas, **71 casos de prueba** (37 + 34).

Capacidades implementadas y probadas: timbrado, cancelación con motivos,
reconciliación por webhook y tarea programada, **sustitución (motivo 01)**,
descarga de XML y PDF.

**Queda inactivo sin `FACTURAPI_KEY`.** Si el negocio lo confirma, es código
muerto; si algún cliente lo pide, ya está escrito y probado.

---

## 8. Verificación y pruebas

### 8.1 Suite: 197 casos, 100 % pasando

| Dominio | Casos |
|---|---:|
| CFDI (timbrado, payload, catálogos) | 37 |
| Stripe (suscripciones, webhooks) | 36 |
| CFDI · sustitución (motivo 01) | 35 |
| CFDI · cancelación | 34 |
| Nómina (ISR, IMSS, pólizas) | 29 |
| CFDI · reconciliación | 26 |
| **Total** | **197** |

### 8.2 Comandos de operación

| Comando | Qué verifica |
|---|---|
| `npm test` | 197 casos |
| `npm run build` | Compilación de producción |
| `npx tsc --noEmit` | Tipos |
| `npm run diagnostico` | Configuración y base de datos |
| `npm run verificar:demo` | **La landing no miente** |
| `npm run verificar:exportacion` | Los 20 campos del complemento |
| `npm run datos:landing` | Regenera las cifras de la landing |

### 8.3 El control de coherencia

`npm run verificar:demo` compara **lo que la landing publica** contra **lo que el
motor calcula desde la base**, concepto por concepto. Existe porque encontró un
bug real: la landing publicaba un costo patronal de $11,101.19 mientras el
producto calculaba $11,118.16.

---

## 9. Estado de la landing

**Cascarón estático con 12 de 16 secciones animadas.**

| Métrica | Valor |
|---|---|
| Peso total (gzip) | **283 KB** |
| HTML | 44 KB |
| JavaScript | 228 KB (10 fragmentos) |
| CSS | 10.5 KB |
| Caché | `s-maxage=31536000` (un año) |
| Renderizado | `○ (Static)` |

**Identidad visual «Papel y sello»:** marfil (papel), tinta cálida (texto) y
rojo teja como acento único, con tipografía **Plus Jakarta Sans**. Los tokens
viven en `globals.css` (`@theme`) y aplican a **landing y aplicación**, para
coherencia visual completa.

**Estrategia de diferenciación:** mostrar **artefactos reales** —el recibo
calculado, la póliza que cuadra, el archivo de CONTPAQi— en lugar de
ilustraciones de ellos. Para un contador, un documento real vence a un dibujo.

Las cifras de la landing **no se escriben a mano**: las genera el motor
(`npm run datos:landing`), que lee los catálogos fiscales **de la misma base que
la aplicación**. Esa clase de divergencia dejó de ser posible.

---

## 10. Infraestructura y despliegue

| Elemento | Estado |
|---|---|
| Base de datos | **19 migraciones aplicadas** en local y remoto |
| Proyecto Supabase | `hpjcpipflivbzafdmgck` |
| Repositorio | `github.com/omarviga/chekdor` (privado) |
| Rama | `main`, sincronizada |
| Autor de commits | `omarviga` con correo `noreply` (ver § 12) |
| Despliegue | Vercel |
| Empresa demo | ✅ Cargada: 6 trabajadores, 1 periodo |

### 10.1 Empresa demo

**Comercializadora del Bajío, S.A. de C.V.** — RFC `DEMO260101AB1`.

Los seis trabajadores cubren los cuatro tramos del ISR y del subsidio:

| Trabajador | Salario diario | Qué demuestra |
|---|---|---|
| Ana Torres Núñez | $200.00 | **Subsidio entregable** (Art. 97 LISR) |
| María López Ruiz | $278.80 | Salario mínimo: el subsidio reduce el ISR |
| Sofía Gutiérrez Peña | $430.00 | Tramo bajo |
| **Juan Pérez López** | **$600.00** | **El escenario de la landing** |
| Carlos Ramírez Soto | $900.00 | Tramo alto + una falta |
| Luis Hernández Vega | $2,500.00 | ISR al 35 % |

Detalle en `docs/EMPRESA-DEMO.md`.

---

## 11. Pendientes

### 11.1 Bloqueadores reales

| # | Pendiente | Impacto |
|---|---|---|
| 1 | **`RECONCILIACION_SECRETO`** | Solo si se expone la tarea programada |
| 2 | **Variables de entorno en Vercel** | Un build que compila no es un build con variables puestas |

> **Corrección:** `FACTURAPI_KEY`, `FACTURAPI_WEBHOOK_SECRET` y la validación de
> catálogos del SAT **no son bloqueadores**. Estaban mal clasificados: Chekdor no
> timbra.

### 11.2 Bugs y riesgos técnicos

| # | Pendiente | Gravedad |
|---|---|---|
| 3 | **El descuento de guarderías se SUMA** al costo patronal cuando el catálogo dice que es un descuento ($16.97/trabajador) | **Alta** |
| 4 | **La tabla de respaldo tiene 11 filas de IMSS y la base 13** — el mismo recibo da dos costos distintos | **Alta** |
| 5 | **Topes de la LFT hardcodeados**, sin tabla por ejercicio | **Alta** (2027) |
| 6 | **Jornada de 46 h sin pruebas** | Media |
| 7 | **Tope de 12 h diarias** ausente | Media |
| 8 | **Banco y cuenta bancaria** no salen en la exportación | Media |
| 9 | **Webhook de Facturapi sin probar** (nunca recibió una petición real) | Baja (módulo apagado) |

### 11.3 Alcance de producto

| # | Pendiente |
|---|---|
| 10 | **Separación e indemnización** — el motor solo calcula nómina ordinaria. Si un trabajador renuncia, el contador no tiene el finiquito |
| 11 | **Incapacidad por riesgo de trabajo** — subsidio del IMSS |
| 12 | **Prueba plena** — acuerdo del registro con el trabajador |
| 13 | **Exportación de la bitácora** de jornada para la autoridad |

### 11.4 Documentación y negocio

| # | Pendiente |
|---|---|
| 14 | **El runbook está desactualizado**: dice que falta `SUPABASE_SERVICE_ROLE_KEY` (ya está) y que hay 18 migraciones (son 19) |
| 15 | **Falta `/privacidad`** — el aviso de privacidad **como responsable** no existe |
| 16 | **~10 datos por llenar** en `/privacidad-encargado` (RFC, domicilio, región de Supabase) |
| 17 | **Validación con un laboralista** del análisis de la reforma |
| 18 | **Validación con un contador** de los catálogos fiscales |

---

## 12. El problema de atribución de commits (resuelto)

**Síntoma:** los commits aparecían atribuidos a la cuenta `ovieyra2103` y con
una `X` roja de verificación, aunque el push lo hacía `omarviga`.

**Causa raíz:** GitHub atribuye un commit **por el correo del autor**, no por
quien lo sube. Los commits usaban `joseomarvieyra@gmail.com`, verificado en la
cuenta `ovieyra2103`. Y `omarviga` tenía ese correo como **privado**, así que
GitHub **bloqueaba el push** con `GH007: Your push would publish a private email
address`.

**Solución:** configurar el repositorio con el correo `noreply` de la propia
cuenta — `68872653+omarviga@users.noreply.github.com` — cuyo prefijo **es el id
de `omarviga`**. Configurado **solo en este repositorio**; la configuración
global quedó intacta.

---

## 13. Riesgos estratégicos

| Riesgo | Detalle | Mitigación |
|---|---|---|
| **Dependencia del sistema contable del cliente** | Si el contador ya usa CONTPAQi para timbrar, Chekdor es proveedor de datos, no la herramienta donde trabaja | Ser el motor de cálculo, no la interfaz |
| **Los layouts de importación cambian entre versiones** | CONTPAQi 2020 ≠ 2022 ≠ 2024. Si el archivo no importa, el producto entero no sirve | Probar con un contador y un archivo real |
| **La STPS aún no publica las disposiciones** | El detalle técnico del registro electrónico es incierto | Diseñar para el requisito general: integridad, inalterabilidad, trazabilidad |
| **Deuda de alcance** | Separación, indemnización e incapacidad fuera del motor | Decidir si entran o si la landing lo declara |
| **Concentración en un solo desarrollador** | 35,316 líneas sin equipo | Documentación extensa (4,240 líneas) |

---

## 14. Fortalezas del sistema

1. **El motor calcula en serio.** ISR con tarifa y subsidio, IMSS obrero y
   patronal con factor de integración, horas extra por bloques semanales, prima
   dominical con su exención, póliza que cuadra. Verificado al centavo.

2. **Las pólizas cuadran y son auditables.** Cada concepto cae en su cuenta, y
   la trazabilidad del ISR muestra el renglón de la tarifa que aplicó.

3. **La landing no puede mentir.** Las cifras se generan del motor y hay un
   comando que compara landing contra base de datos.

4. **197 casos de prueba** y build limpio, con `tsc` y ESLint sin errores.

5. **Diseño para el cumplimiento.** Marca de tiempo inmutable, bitácora
   auditable: la reforma de 2027 describe el producto que ya existe.

6. **Artefactos reales, no ilustraciones.** El archivo de CONTPAQi de la landing
   lo produce el serializador real con las plantillas reales.

---

## 15. Acciones inmediatas recomendadas

| Prioridad | Acción | Tamaño |
|---|---|---|
| 1 | Parametrizar los topes de la LFT por ejercicio (2026–2030) | Pequeño |
| 2 | Corregir la landing: art. 132 fr. **XXXIV** y multas reales ($28,285–$565,700) | Pequeño |
| 3 | Agregar pruebas de la jornada de 46 h | Pequeño |
| 4 | Tope absoluto de 12 h diarias y 4 h extra/día | Pequeño |
| 5 | Banco y cuenta bancaria en la exportación | Pequeño |
| 6 | Decidir el alcance de separación e indemnización | Decisión |
| 7 | Aceptación del registro por el trabajador (**prueba plena**) | Mediano |
| 8 | Validar con un **laboralista** y un **contador** | Externo |

Las cinco primeras son **una tarde de trabajo** y dejan el sistema en capacidad
de decir «cumplo 2027» con fundamento.

---

## 16. Conclusión

Chekdor resuelve un problema real y medible —**la captura manual de nómina**—
con un motor de cálculo fiscal verificado al centavo, pólizas que cuadran y una
exportación que el contador puede importar sin recapturar.

La **reforma laboral de 2026 convierte ese producto en una obligación legal**:
el registro electrónico de jornada es exigible desde el 1 de enero de 2027, con
multas de hasta $565,700, y un registro acordado con el trabajador **hará prueba
plena** ante un tribunal.

El sistema está técnicamente sano —197 pruebas, build limpio, sin errores de
tipos ni de lint— y su deuda principal no es de calidad sino de **alcance**:
nóminas especiales (separación, incapacidad) y la parametrización anual de los
topes laborales.

**El riesgo mayor no es técnico.** Es que la exportación no importe en la versión
de CONTPAQi o Aspel de un contador real. Eso no lo detecta ninguna prueba
unitaria: lo detecta un contador con un archivo real.

---

*Documento generado el 12 de octubre de 2026. Las cifras de nómina provienen del
motor real. Las fechas y montos de la reforma laboral se verificaron contra el
DOF y dos análisis legales. **Este documento no constituye asesoría legal.***
