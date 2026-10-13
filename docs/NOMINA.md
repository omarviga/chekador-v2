# Nómina y exportación contable (CONTPAQi / Aspel)

Este documento explica cómo funciona el motor de nómina de Chekdor, qué
valores son configurables, **qué debes verificar antes de timbrar** y cómo
adaptar los archivos de importación a tu versión de CONTPAQi o Aspel.

---

## 1. Flujo completo

```
Marcajes NFC
   ↓  (Reportes → Recalcular jornadas)
Jornadas  ·  LFT Art. 61, 66-68, 71
   ↓  (Nómina → Calcular nómina)
Recibos   ·  motor de nómina
   │        ├─ percepciones y exenciones (LISR Art. 93)
   │        ├─ ISR (LISR Art. 96-97)
   │        └─ IMSS / SAR / INFONAVIT (LSS)
   ↓
Pólizas contables (cargo y abono)
   ↓  (Nómina → Exportar)
CONTPAQi · Aspel · CSV
```

Comandos:

```bash
npm run test:nomina   # 29 pruebas del motor (ISR, IMSS, pólizas, layouts)
npm run typecheck     # tsc --noEmit
npm run build         # compilación de producción
```

---

## 2. Estructura del código

| Archivo | Responsabilidad |
|---|---|
| `src/lib/nomina/periodos.ts` | Utilidades numéricas, fechas y periodicidad |
| `src/lib/nomina/periodos-nomina.ts` | Divide un mes en periodos de pago |
| `src/lib/nomina/tablas.ts` | Catálogos fiscales, factor de integración, respaldos |
| `src/lib/nomina/isr.ts` | Retención de ISR y subsidio al empleo |
| `src/lib/nomina/imss.ts` | Cuotas obrero-patronales, SAR e INFONAVIT |
| `src/lib/nomina/conceptos.ts` | Catálogo de conceptos con clave SAT y cuenta |
| `src/lib/nomina/cuentas.ts` | Mapeo de cuentas contables (lado cliente) |
| `src/lib/nomina/engine.ts` | **Orquestador del cálculo de un recibo** |
| `src/lib/nomina/jornadas.ts` | Contrato mínimo con el motor LFT |
| `src/lib/nomina/datos.ts` | Traducción Supabase → tipos del motor |
| `src/lib/nomina/calculo.ts` | Orquestación de un periodo completo |
| `src/lib/nomina/polizas.ts` | Pólizas contables (formato neutro) |
| `src/lib/nomina/plantillas.ts` | Layouts de exportación declarativos |
| `src/lib/nomina/serializador.ts` | Escritura de archivos (separador, BOM, codificación) |
| `src/lib/nomina/exportar.ts` | Mapeo resultado → filas de exportación |

**Principio de diseño:** todo lo que es una **tasa** o una **tarifa** vive en
la base de datos (`tablas_isr`, `tablas_subsidio`, `tablas_imss`), no en el
código. El código solo contiene reglas. Los valores del código son un
*respaldo* que se marca con `fuente: "respaldo"` y genera una advertencia
visible en la UI.

---

## 3. Fuentes oficiales — VERIFICA ESTO

Los catálogos se cargan con los valores vigentes conocidos al momento de
escribir la migración `0011`. **Antes de timbrar nómina real, valida cada
uno contra su fuente.** Los valores están versionados por `ejercicio` y
`vigente_desde`, así que actualizarlos es un `INSERT`, no un despliegue.

| Dato | Dónde | Fuente que debes consultar |
|---|---|---|
| Tarifa del ISR | `public.tablas_isr` | **Anexo 8 de la RMF** del ejercicio (DOF). Son 11 renglones mensuales. |
| Subsidio al empleo | `public.tablas_subsidio` | **Decreto de subsidio al empleo** vigente (DOF). Un solo renglón: subsidio mensual fijo cuando el ingreso mensual no rebasa el límite. |
| Cuotas del IMSS | `public.tablas_imss` | **LSS Art. 25, 106, 107, 147, 168, 211 y 218** más los acuerdos del Consejo Técnico del IMSS. |
| UMA diaria | `public.tablas_imss.uma_diaria` | **INEGI**, publicada en enero/febrero y vigente desde el 1 de febrero. |
| Salario mínimo | `configuracion_nomina.salario_minimo` | **CONASAMI** (DOF). |
| Prima de riesgo | `configuracion_nomina.prima_riesgo_trabajo` | La tuya, con la fórmula del **Art. 72 LSS**. En el primer año es 0.005 (0.5 %). |

### Cómo agregar el ejercicio siguiente

```sql
-- 1) Tarifa del ISR del nuevo ejercicio
insert into public.tablas_isr
    (ejercicio, periodicidad, limite_inferior, limite_superior, cuota_fija, tasa_excedente)
values
    (2027, 'mensual', 0.01, 800.00, 0.00, 0.0192),
    -- … los 11 renglones …
on conflict do nothing;

-- 2) Si el decreto de subsidio cambió
insert into public.tablas_subsidio (ejercicio, vigente_desde, limite_mensual, subsidio_mensual)
values (2027, '2027-01-01', 9500.00, 500.00);

-- 3) Actualizar la UMA
update public.tablas_imss set uma_diaria = 118.00 where ejercicio = 2027;
```

> Recuerda que la tarifa se define por periodicidad. La migración `0011`
> genera las seis (mensual, quincenal, catorcenal, semanal, decenal y
> diaria) a partir de la mensual. Si agregas un ejercicio a mano, replica
> ese procedimiento o ejecuta la consulta con la lista de periodos.

---

## 4. Reglas de cálculo implementadas

### Factor de integración del SBC — LSS Art. 27

```
factor = (365 + días de vacaciones × prima vacacional + días de aguinaldo) / 365
```

Con los valores mínimos de ley (12 días de vacaciones por la reforma de
2023, 25 % de prima, 15 días de aguinaldo) da **1.0493**. El piso legal
**1.0452** del primer año se aplica solo si el cálculo queda por debajo.

Los días de vacaciones se escalan por antigüedad conforme al LFT Art. 76
(12 días el primer año, +2 por cada quinquenio) cuando el empleado no
tiene un valor propio.

### ISR — LISR Art. 96 y 97

1. Se suman las percepciones **gravadas** del periodo (las exenciones del
   Art. 93 ya están aplicadas concepto por concepto).
2. Se localiza el renglón de la tarifa de la periodicidad correspondiente.
3. `ISR = cuota fija + (base − límite inferior) × tasa del excedente`
4. El subsidio al empleo se determina contra el **ingreso mensual
   proyectado** (`base × 30 / días del periodo`) y se prorratea a los días
   del periodo.
5. Si el subsidio supera al ISR, la diferencia **se paga al trabajador**
   (Art. 97) y aparece como percepción `P009`, no gravable.

**Sobre la tarifa por periodicidad:** se deriva de la mensual del Anexo 8
con los límites escalados por el factor del periodo, la tasa intacta y la
cuota fija dividida entre los periodos que caben en el mes. Es el
procedimiento que autoriza el Art. 96 y el que usan CONTPAQi y Aspel.

> ⚠️ El prorrateo puede dejar traslapes de un centavo entre el límite
> superior de un renglón y el inferior del siguiente, porque la propia
> tarifa mensual tiene huecos de un centavo (6 332.05 → 6 332.06). El
> motor reconstruye la frontera en `normalizarTablaISR`; no edites los
> límites a mano en la base de datos esperando que el motor los use tal cual.

### Exenciones aplicadas (LISR Art. 93)

| Concepto | Exención |
|---|---|
| Horas extra (fr. XIV) | 50 % del importe que no rebase 9 salarios mínimos por semana, prorrateado a los días del periodo |
| Prima dominical (fr. XIII) | 1 UMA por cada domingo laborado |
| Aguinaldo (fr. XIII) | 30 UMA *(se captura en nómina extraordinaria)* |
| Prima vacacional (fr. XIII) | 15 UMA *(se captura en nómina extraordinaria)* |

### Días pagados — LFT Art. 69, 74 y 76

Los **días pagados son los días naturales del periodo menos las faltas
injustificadas registradas explícitamente como incidencia**.

Esto es deliberado: derivar las faltas como «días del periodo − días
trabajados» descontaría el **séptimo día** (Art. 69), los **días festivos**
(Art. 74), las **vacaciones** (Art. 76) y las **incapacidades del IMSS**,
que se pagan íntegros. El resultado sería un subpago sistemático de
alrededor de un día por semana.

Los días esperados sin marcaje ni incidencia **se pagan** y se reportan en
`advertencias` para que recursos humanos los justifique antes de timbrar.
La nómina no adivina: si hubo una falta, hay que registrarla.

### Cuotas obrero-patronales

| Ramo | Base | Obrero | Patronal |
|---|---|---|---|
| Enfermedad y maternidad · cuota fija | Salario mínimo | — | 20.40 % |
| Enfermedad y maternidad · excedente 3 UMA | SBC − 3 UMA | 0.40 % | 1.10 % |
| Enfermedad y maternidad · prestaciones en dinero | SBC | — | 0.70 % |
| Invalidez y vida | SBC | 0.625 % | 1.75 % |
| Cesantía y vejez | SBC | 1.125 % | 3.15 % |
| Guarderías y prestaciones sociales | SBC | — | 1.00 % |
| Retiro (SAR) | SBC | — | 2.00 % |
| INFONAVIT | SBC | — | 5.00 % |
| Riesgos de trabajo | (SBC − 3 UMA) × 75 % | — | prima de la empresa |

Todas las tasas se multiplican por los **días cotizados**.

**No implementado (deliberadamente):** la *cuota patronal adicional* del
régimen de la Ley 97 (CESANTÍA, transitoria hasta 2030). Depende del
salario del trabajador y del año, y su fórmula vive en los artículos
transitorios de la reforma de 2020. Si tu empresa cotiza en ese régimen,
captúrala como un descuento/concepto manual o pide que la agreguemos.

---

## 5. Layouts de exportación

Los layouts de CONTPAQi y Aspel **no son universales**: cambian entre
versiones (2020, 2022, 2024), entre productos y según cómo esté configurado
cada despacho. Por eso la exportación es **declarativa**: una plantilla es
una lista ordenada de campos, y el serializador obedece.

Plantillas incluidas:

| Identificador | Producto | Separador | Codificación |
|---|---|---|---|
| `contpaqi-poliza-resumen` | CONTPAQi Contabilidad | `\|` | UTF-8 con BOM |
| `contpaqi-nomina-resumen` | CONTPAQi Nóminas | `\|` | UTF-8 con BOM |
| `contpaqi-nomina-detalle` | CONTPAQi Nóminas (por concepto) | `\|` | UTF-8 con BOM |
| `aspel-poliza-resumen` | Aspel COI | `\|` | windows-1252 |
| `aspel-nomina-resumen` | Aspel NOI | `,` | UTF-8 con BOM |
| `aspel-nomina-detalle` | Aspel NOI (por concepto) | `,` | UTF-8 con BOM |
| `otro-nomina-resumen` | CSV genérico | `,` | UTF-8 con BOM |
| `otro-nomina-detalle` | CSV genérico (por concepto) | `,` | UTF-8 con BOM |
| `otro-poliza-resumen` | Pólizas en CSV | `,` | UTF-8 con BOM |

### Antes de la primera importación real

1. Descarga el archivo de un periodo **de prueba**.
2. Ábrelo en el bloc de notas: verifica el orden de las columnas y el
   separador del layout de importación de *tu* versión.
3. Importa en el sistema contable con un periodo de prueba y revisa que
   las cuentas y los importes hayan entrado donde corresponde.
4. Si el orden no coincide, **dinos cuál es** (mándanos tu archivo de
   ejemplo, sin datos reales) y agregamos un identificador nuevo. El
   mecanismo alterno es editar `src/lib/nomina/plantillas.ts`: cada
   plantilla es un objeto con el arreglo `campos` en el orden exacto, y el
   motor de pólizas y el serializador ya respetan ese orden.

### Opciones avanzadas de pólizas

La URL de exportación acepta parámetros:

| Parámetro | Efecto |
|---|---|
| `pago=1` | Agrega la póliza de pago (cargo sueldos por pagar / abono bancos) |
| `patronal=0` | Omite la póliza de cuotas patronales |
| `consolidar=1` | Registra las cuotas patronales en la misma póliza de la nómina |

### Pólizas que se generan

**A) Provisión de nómina** — `diario`
```
cargo   510-001 Sueldos                 total de sueldos
cargo   510-002 Tiempo extraordinario   horas extra
cargo   510-003 Prima dominical
cargo   511-005 Subsidio entregable     (si aplica)
abono   210-001 ISR retenido por pagar
abono   210-002 IMSS cuotas obreras por pagar
abono   210-010 Sueldos por pagar       neto
```

**B) Pago de nómina** — `egreso`
```
cargo   210-010 Sueldos por pagar
abono   110-001 Bancos
```

**C) Cuotas patronales** — `diario`
```
cargo   511-001 IMSS cuotas patronales
cargo   511-002 Riesgos de trabajo
cargo   511-003 SAR
cargo   511-004 INFONAVIT
abono   511-001 Cuotas patronales por enterar
```

> Sobre **C**: es contablemente correcto provisionar el gasto patronal en el
> periodo al que corresponde, aunque el entero al IMSS ocurra el mes
> siguiente. Si tu práctica es registrar solo el pago (criterio de flujo),
> usa `patronal=0` o `consolidar=1` según prefieras.

**Antes de descargar una póliza, el motor verifica que el debe sea igual al
haber.** Si no cuadra, no genera archivo y explica la diferencia. De nada
sirve importar una póliza descuadrada.

---

## 6. Configuración

`/contabilidad/configuracion`:

- **Sistema destino** y número de empresa.
- **Periodicidad de pago**: determina la fracción de la tarifa de ISR.
- **Prestaciones**: días de vacaciones, prima vacacional, días de
  aguinaldo. El factor de integración se recalcula en vivo en la pantalla.
- **Salario mínimo** y **prima de riesgo** de tu empresa.
- **Subsidio al empleo**: actívalo salvo que tu empresa no esté obligada.
- **Mapeo de cuentas contables**: las 19 claves lógicas → tu catálogo.
  El botón «Rellenar con el catálogo sugerido» propone un catálogo
  estándar mexicano sin sobrescribir lo que ya capturaste.

Los cambios aplican al **siguiente cálculo**; los periodos ya guardados no
se modifican, para que el archivo que descargues mañana sea idéntico al de
hoy.

---

## 7. Esquema de base de datos

| Tabla | Contenido |
|---|---|
| `configuracion_nomina` | Una fila por empresa: parámetros + mapeo de cuentas |
| `periodos_nomina` | Cabecera del periodo (fechas, tipo, estado) |
| `nominas` | Un recibo por empleado y periodo, con totales materializados |
| `nomina_conceptos` | Desglose: un renglón por percepción, deducción y cuota patronal |
| `polizas` / `polizas_movimientos` | Pólizas generadas (borrador para auditoría) |
| `tablas_isr` / `tablas_subsidio` / `tablas_imss` | Catálogos fiscales versionados |
| `descuentos_empleado` | Pensión alimenticia, préstamos, crédito INFONAVIT |
| `empleado_cuentas_bancarias` | CLABE y banco para la dispersión |

Migraciones: `0009` (esquema), `0010` (RLS), `0011` (catálogos),
`0012` (endurecimientos de seguridad + descuentos).

### Aislamiento multi-tenant

- `configuracion_nomina`, `periodos_nomina`, `nominas`, `polizas`: solo
  `admin_empresa`, `rh` y `super_admin`.
- `nominas` y `nomina_conceptos`: el **empleado puede leer los suyos**
  (sus percepciones y deducciones le pertenecen conforme a la LFPDPPP
  Art. 22), pero no los de sus compañeros.
- `tablas_*`: lectura para cualquier usuario autenticado (no contienen
  datos personales); escritura solo `super_admin`.

---

## 8. Lo que este módulo NO hace

Sé explícito con tu contador sobre los límites actuales:

1. **El timbrado del CFDI de nómina está implementado pero NO probado contra
   el PAC.** El mapeo a los catálogos del SAT y las validaciones están
   cubiertos por 37 pruebas, pero ningún CFDI se ha timbrado todavía. Ver
   `docs/CFDI.md` § 6: hay que validar los catálogos timbrando un CFDI de
   prueba antes de facturar en producción.
2. **No cancela CFDI.** Un recibo timbrado por error solo se puede cancelar
   desde el panel de Facturapi. El esquema tiene las columnas, pero no hay
   acción ni interfaz.
3. **No acumula el ISR anual.** Calcula la retención por periodo, que es lo
   que exige el flujo mensual del Art. 96. El ajuste anual del Art. 98 es
   un cálculo distinto.
4. **No calcula aguinaldo, prima vacacional ni finiquito** de forma
   automática. Se capturan como conceptos manuales; el catálogo y el mapeo
   contable ya están listos (claves `P004`, `P005`, `P006`).
5. **No incluye la cuota patronal adicional** del régimen de la Ley 97
   (ver §4).
6. **No tiene integración por API** con CONTPAQi ni Aspel. Eso requiere
   licencia y SDK del proveedor; los archivos de importación son el camino
   soportado. El CFDI **sí** se integra por API, con Facturapi.
7. **La puntuación de NOM-035 es orientativa**, no el instrumento oficial
   de la Guía de Referencia I. Ver el aviso en la propia pantalla.

---

## 9. Verificación

```bash
npm run test:nomina
```

Las 29 pruebas cubren: factor de integración, ISR con y sin subsidio,
subsidio entregable, cuotas del IMSS ramo por ramo, exención de horas
extra, días pagados con y sin falta, prorrateo por alta a mitad de periodo,
cuadre de las tres pólizas, no duplicación del subsidio, serializador con
separadores y comillas, y división del mes en periodos.

Los valores esperados están **calculados a mano** en los comentarios de
`tests/nomina.test.ts`, con la fórmula y los fundamentos legales. Si una
prueba falla después de actualizar un catálogo, la prueba es la señal de que
hay que revisar la tabla.
