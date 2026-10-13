# Validación de cálculos de nómina

Este documento es la hoja de trabajo para validar el motor de nómina contra
fuentes externas. Registra **qué valores están cargados**, **con qué casos se
prueban** y **qué no está calculado todavía**.

> **Estado de validación:** los cálculos del motor están cubiertos por 29
> pruebas automatizadas (`npm test`), pero **la validación contra el SAT, el
> IMSS y un sistema contable real está pendiente**. Este documento es el
> registro de ese proceso. No marques un renglón como validado sin haber
> cotejado el número contra la fuente y anotado quién y cuándo.

---

## 1. Cómo ejecutar la validación

```bash
# Requiere que las migraciones estén aplicadas y .env.local configurado
npm run validar:nomina

# Salida en JSON, para procesarla o archivarla como evidencia
npm run validar:nomina -- --json > validacion-2026-10.json

# Otra periodicidad (la configuración debe coincidir)
npm run validar:nomina -- --periodicidad=mensual
```

El script **no modifica nada**: es de solo lectura. Imprime, por cada caso, el
desglose completo con las fórmulas y los renglones aplicados.

### Cómo hacer que lea los catálogos de la base de datos

La cabecera imprime **`Origen de catálogos`** y **`Vía de acceso`**. Si dice
`RESPALDO`, los números que ves salen del código y **no deben usarse para
validar contra el SAT**. Hay dos vías para leer los catálogos vigentes:

| Vía | Cómo se configura | Qué valida |
|---|---|---|
| **Sesión** (recomendada) | `TEST_EMAIL` y `TEST_PASSWORD` en `.env.local`, de un usuario creado en el panel de Supabase | Los cálculos **y** las políticas RLS, porque el script entra con el rol `authenticated`, igual que la aplicación en producción |
| **Clave de servicio** | `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` | Solo los cálculos: salta RLS por completo, así que no prueba las políticas |

**Recomendación: usa la vía de sesión.** La clave de servicio es para
depurar, no para confiar.

### Por qué no se usa la clave anónima a secas

Los catálogos fiscales conceden lectura a `authenticated`, **no a `anon`**.
Es deliberado desde la migración `0006`: un cliente anónimo no debe poder leer
nada de la base. Y conceptualmente es lo correcto: los catálogos se leen en el
contexto de una empresa que está calculando su nómina, no como un servicio
público abierto.

> ⚠️ **`public.nomina_conceptos` no es un catálogo.** Tiene `empresa_id` y
> `nomina_id`, y guarda `gravado`, `exento` e `importe` por persona. Es el
> desglose de percepciones y deducciones de cada trabajador. Concederle
> lectura a `anon` permitiría descargar el salario de todos los trabajadores
> de todos los clientes usando una clave que es pública por diseño. La
> migración `0014` incluye una comprobación que **aborta** si alguien lo
> expone por descuido.

### Si la cabecera sigue diciendo `RESPALDO` después de aplicar las migraciones

Revisa, en este orden:

1. **El ejercicio.** Los catálogos están versionados por `ejercicio`. Si
   calculas 2027 y solo hay filas de 2026, no hay nada que leer y el motor
   cae al respaldo con su advertencia. Es el comportamiento correcto.

   ```sql
   select ejercicio, periodicidad, count(*)
     from public.tablas_isr
    group by 1, 2
    order by 1 desc, 2;
   ```

2. **La periodicidad.** `tablas_isr` necesita filas para la periodicidad
   solicitada. La migración `0011` carga las seis.

3. **Las variables de entorno.** Que `.env.local` tenga
   `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`, más
   `TEST_EMAIL` y `TEST_PASSWORD`.

4. **El privilegio de tabla.** Un `42501 permission denied` significa que
   falta el `GRANT`, no la política: en PostgreSQL los privilegios de tabla
   se verifican **antes** que las políticas de RLS. La migración `0014`
   otorga los privilegios de los tres catálogos fiscales a `anon` y
   `authenticated`.

---

## 2. Valores fiscales cargados

Todos viven en la base de datos, versionados por `ejercicio` y
`vigente_desde`. El código solo tiene una copia de **respaldo** que se marca
con `fuente: "respaldo"` y genera una advertencia visible.

### 2.1 Tarifa del ISR

| Dato | Dónde | Fuente oficial que debes consultar |
|---|---|---|
| Tarifa mensual, 11 renglones | `public.tablas_isr` | **Anexo 8 de la RMF** del ejercicio, publicado en el DOF |
| Tarifas por periodicidad | `public.tablas_isr` | Derivadas de la mensual conforme al **Art. 96 LISR** |

La migración `0011` genera las seis periodicidades a partir de la mensual:
los **límites** se multiplican por el factor del periodo, la **tasa** no
cambia y la **cuota fija se divide** entre los periodos que caben en el mes.

Valores del respaldo en el código (`src/lib/nomina/tablas.ts`), ejercicio 2026:

| Límite inferior | Límite superior | Cuota fija | Tasa |
|---|---|---|---|
| 0.01 | 746.04 | 0.00 | 1.9200 % |
| 746.05 | 6,332.05 | 14.32 | 6.4000 % |
| 6,332.06 | 11,128.01 | 371.83 | 10.8800 % |
| 11,128.02 | 15,144.94 | 893.63 | 16.0000 % |
| 15,144.95 | 22,206.40 | 1,536.31 | 17.9200 % |
| 22,206.41 | 39,615.26 | 2,801.77 | 21.3600 % |
| 39,615.27 | 53,303.18 | 6,523.52 | 23.5200 % |
| 53,303.19 | 106,642.36 | 9,742.54 | 30.0000 % |
| 106,642.37 | 160,339.84 | 25,743.29 | 32.0000 % |
| 160,339.85 | 213,878.44 | 42,934.33 | 34.0000 % |
| 213,878.45 | sin tope | 61,137.46 | 35.0000 % |

**Pendiente de verificar contra el Anexo 8 del ejercicio en curso.**
☐ Verificado por: __________ Fecha: __________

### 2.2 Subsidio al empleo

| Dato | Dónde | Fuente oficial |
|---|---|---|
| Límite de ingreso mensual | `public.tablas_subsidio.limite_mensual` | **Decreto de subsidio al empleo** vigente (DOF) |
| Subsidio mensual | `public.tablas_subsidio.subsidio_mensual` | El mismo decreto |

Valor del respaldo: límite **$9,081.00** mensuales, subsidio **$475.00**
mensuales, vigente desde el 1 de mayo de 2024.

El subsidio se determina contra el **ingreso mensual proyectado**
(`base gravable × 30 / días del periodo`) y se prorratea a los días del
periodo. Si supera al ISR, la diferencia **se paga al trabajador** (Art. 97
LISR) y aparece como percepción `P009`, no gravable.

**Pendiente de verificar contra el decreto vigente.**
☐ Verificado por: __________ Fecha: __________

### 2.3 Cuotas del IMSS, SAR e INFONAVIT

| Concepto | Base | Obrero | Patronal | Fundamento |
|---|---|---|---|---|
| Enfermedad y maternidad · cuota fija | Salario mínimo | — | 20.40 % | LSS Art. 106 fr. I |
| Enfermedad y maternidad · excedente 3 UMA | SBC − 3 UMA | 0.40 % | 1.10 % | LSS Art. 106 fr. II |
| Enfermedad y maternidad · prestaciones en dinero | SBC | — | 0.70 % | LSS Art. 107 |
| Invalidez y vida | SBC | 0.625 % | 1.75 % | LSS Art. 147 |
| Cesantía y vejez | SBC | 1.125 % | 3.15 % | LSS Art. 168 |
| Guarderías y prestaciones sociales | SBC | — | 1.00 % | LSS Art. 211 |
| Retiro (SAR) | SBC | — | 2.00 % | LSS Art. 211 |
| INFONAVIT | SBC | — | 5.00 % | Ley del INFONAVIT Art. 29 |
| Riesgos de trabajo | (SBC − 3 UMA) × 75 % | — | prima de la empresa | LSS Art. 71-73 |

**UMA diaria:** valor del respaldo **$113.14** (ejercicio 2026).
Fuente oficial: **INEGI**, publicado en enero y vigente desde el 1 de febrero.

**Salario mínimo diario:** valor por omisión de la configuración **$278.80**.
Fuente oficial: **CONASAMI** (DOF). Se configura por empresa porque ya no
existe un salario mínimo diferenciado para la Zona Libre de la Frontera Norte.

**Prima de riesgo de trabajo:** valor por omisión **0.5000 %**. Es la prima de
siniestralidad de **tu** empresa, no una tasa fija. Se determina cada año con
la fórmula del Art. 72 LSS.

**Pendiente de verificar.**
☐ Cuotas IMSS: verificado por __________ Fecha: __________
☐ UMA: verificado por __________ Fecha: __________
☐ Salario mínimo: verificado por __________ Fecha: __________

### 2.4 Parámetros laborales

| Dato | Valor por omisión | Fundamento |
|---|---|---|
| Días de aguinaldo | 15 | LFT Art. 87 |
| Días de vacaciones | 12 el primer año, +2 por quinquenio | LFT Art. 76 (reforma 2023) |
| Prima vacacional | 25 % | LFT Art. 80 |
| Factor de integración mínimo | 1.0452 | LSS Art. 27 fr. I |
| Días por año | 365 | — |
| Jornada diaria | 8 horas | LFT Art. 61 |
| Horas extra al doble por semana | 9 | LFT Art. 66 |
| Prima dominical | 25 % | LFT Art. 71 |

El **factor de integración** se calcula como:

```
factor = (365 + días de vacaciones × prima vacacional + días de aguinaldo) / 365
```

Con los valores mínimos da **1.0493**. El piso de **1.0452** aplica al primer
año de servicio.

---

## 3. Casos de prueba

El script `scripts/test-nomina-real.ts` calcula cuatro casos sobre la **primera
quincena de octubre de 2026** (días 1 al 15, pago el 16). Los resultados de
abajo son los que produce el motor con los **catálogos de respaldo**; al correr
el script con la base de datos aplicada, los números pueden cambiar si tus
catálogos difieren.

| Caso | Descripción | Salario diario | Horas extra dobles | Domingos | Faltas |
|---|---|---|---|---|---|
| A | Salario mínimo | 278.80 | 0 | 0 | 0 |
| B | Salario medio | 600.00 | 6 | 2 | 0 |
| C | Salario alto | 1,500.00 | 12 | 0 | 1 |
| D | Salario bajo con subsidio entregable | 200.00 | 0 | 0 | 0 |

### Resultados del motor

| Caso | Gravable | ISR retenido | Subsidio pagable | IMSS obrero | Neto a pagar | Costo del patrón |
|---|---|---|---|---|---|---|
| A | 4,182.00 | 58.96 | 0.00 | 76.80 | 4,046.24 | 5,496.16 |
| B | 9,523.72 | 1,117.82 | 0.00 | 182.67 | 8,899.51 | 11,101.19 |
| C | 22,125.00 | 3,806.80 | 0.00 | 454.75 | 18,988.45 | 23,036.44 |
| D | 3,000.00 | 0.00 | 62.21 | 55.08 | 3,007.13 | 4,288.39 |

### Qué valida cada caso

**Caso A — el subsidio reduce el ISR pero no lo elimina.**
A salario mínimo el ISR determinado ($296.46) es mayor que el subsidio
($237.50), así que **sí hay retención de $58.96**. Este caso existe para
detectar el error contrario: una herramienta que devuelva cero aquí está
aplicando mal el subsidio.

**Caso B — exenciones del Art. 93.**
La base gravable ($9,523.72) es **menor** que el total de percepciones
($10,200.00) porque se aplicaron dos exenciones: el 50 % de la exención de
horas extra y 2 UMA de prima dominical. Si tu cálculo no separa gravado de
exento, este caso lo revela.

**Caso C — el paso del doble al triple.**
Con 12 horas extra en la quincena, el reparto semanal manda las primeras 9 al
doble y **las restantes al triple** (Art. 66-68 LFT). También incluye una falta
injustificada, así que los días pagados son 14 y no 15.

**Caso D — subsidio entregable (Art. 97 LISR).**
Con $200 diarios el subsidio ($237.50) **supera** al ISR determinado, la
retención queda en cero y el patrón debe **pagar $62.21 al trabajador**. Es el
caso que más herramientas omiten.

### Frontera del subsidio entregable

Se verificó empíricamente con el motor y la tarifa quincenal de 2026. Es útil
para saber qué esperar al validar:

| Salario diario | Gravable | ISR determinado | Subsidio | Retiene | Paga al trabajador |
|---|---|---|---|---|---|
| 100.00 | 1,500.00 | 79.29 | 237.50 | 0.00 | 158.21 |
| 200.00 | 3,000.00 | 175.29 | 237.50 | 0.00 | 62.21 |
| 240.00 | 3,600.00 | 233.13 | 237.50 | 0.00 | 4.37 |
| 260.00 | 3,900.00 | 265.77 | 237.50 | 28.27 | 0.00 |
| 278.80 | 4,182.00 | 296.46 | 237.50 | 58.96 | 0.00 |

**La frontera está entre $240 y $260 diarios.** Por debajo, el patrón paga la
diferencia; por arriba, retiene.

---

## 4. Procedimiento de validación

### 4.1 Contra el calculador del SAT

El SAT publica un calculador de ISR de nómina. No calcula IMSS ni aportaciones:
solo el ISR.

1. Aplica las migraciones y corre `npm run validar:nomina`.
2. Abre el calculador del SAT.
3. Por cada caso, captura:
   - Salario diario y **días pagados** (no días del periodo).
   - Las percepciones **gravadas** y **exentas por separado**. El SAT pide los
     dos importes, no el total. Los obtienes del renglón
     `TOTAL GRAVADO` / `TOTAL EXENTO` del script.
   - La periodicidad configurada.
4. Compara contra `ISR A RETENER`.

**Si difiere, revisa en este orden:**

| # | Qué revisar | Dónde |
|---|---|---|
| 1 | El renglón de la tarifa aplicado | Sección `ISR` del script: límite inferior y cuota fija |
| 2 | La exención de horas extra | Depende del **salario mínimo** configurado. Si tu zona tiene otro, el resultado cambia |
| 3 | La exención de prima dominical | 1 UMA por domingo laborado (Art. 93 fr. XIII) |
| 4 | El subsidio al empleo | Límite mensual del catálogo |
| 5 | El ejercicio fiscal | Se elige por la **fecha de pago**, no por la del periodo |

Registro:

| Caso | ISR motor | ISR SAT | ¿Coincide? | Notas |
|---|---|---|---|---|
| A | 58.96 | | ☐ | |
| B | 1,117.82 | | ☐ | |
| C | 3,806.80 | | ☐ | |
| D | 0.00 | | ☐ | |

### 4.2 Contra el IMSS

El SAT no calcula cuotas. Usa **IMSS Desde Tu Empresa (IDSE)** o la calculadora
de cuotas obrero-patronales del IMSS.

Espera dos diferencias frente a un cálculo manual:

- La **cuota fija** del seguro de salud se calcula sobre el **salario mínimo**
  del área geográfica, no sobre la UMA (LSS Art. 106 fr. I). Es el error más
  común en herramientas caseras.
- La **prima de riesgo de trabajo** del script es 0.5000 %, que es el valor de
  una empresa en su primer año. La tuya depende de tu siniestralidad.

Registro:

| Caso | Obrero motor | Obrero IMSS | Patronal motor | Patronal IMSS | ¿Coincide? |
|---|---|---|---|---|---|
| A | 76.80 | | 1,449.92 | | ☐ |
| B | 182.67 | | 2,201.68 | | ☐ |
| C | 454.75 | | 4,047.99 | | ☐ |
| D | 55.08 | | 1,281.26 | | ☐ |

### 4.3 Contra un contador

Pedirle al contador que **recalcule a mano** al menos el caso B y el caso D, y
que confirme:

- ☐ La base gravable y la exenta de cada percepción.
- ☐ El renglón de la tarifa de ISR que le corresponde.
- ☐ El tratamiento del subsidio al empleo del caso D.
- ☐ Que la estructura de la póliza contable es la que él usaría.
- ☐ Si le falta algún concepto habitual en su operación.

Notas del contador:
_______________________________________________________________
_______________________________________________________________
Validado por: ____________________ Fecha: __________

### 4.4 Contra CONTPAQi o Aspel

Pendiente hasta tener un archivo de layout real. Ver la sección 6.

---

## 5. Cómo actualizar los catálogos cada año

Los catálogos están versionados: actualizarlos es un `INSERT`, no un despliegue.

### 5.1 Qué cambia y cuándo

| Dato | Cuándo cambia | Quién lo publica |
|---|---|---|
| UMA | Enero/febrero, vigente desde el 1 de febrero | INEGI |
| Salario mínimo | Diciembre, vigente desde el 1 de enero | CONASAMI (DOF) |
| Tarifa del ISR | Anual, en el Anexo 8 de la RMF | SAT (DOF) |
| Subsidio al empleo | Cuando se emite un decreto nuevo | Ejecutivo (DOF) |
| Cuotas del IMSS | Cuando el Consejo Técnico las modifica | IMSS |
| Prima de riesgo | Anual, por empresa | Cálculo propio (Art. 72 LSS) |

### 5.2 Agregar un ejercicio nuevo

```sql
-- 1) Tarifa del ISR: los 11 renglones mensuales del Anexo 8 del ejercicio
--    y sus derivadas por periodicidad. La forma más segura es copiar la
--    consulta de la migración 0011 y cambiar el ejercicio y los valores.
insert into public.tablas_isr
    (ejercicio, periodicidad, limite_inferior, limite_superior, cuota_fija, tasa_excedente)
values
    (2027, 'mensual', 0.01, 800.00, 0.00, 0.0192),
    -- … los 11 renglones …
    (2027, 'quincenal', 0.01, 400.00, 0.00, 0.0192)
    -- … y las otras cuatro periodicidades …
on conflict do nothing;

-- 2) Subsidio al empleo, si el decreto cambió
insert into public.tablas_subsidio (ejercicio, vigente_desde, limite_mensual, subsidio_mensual)
values (2027, '2027-01-01', 9500.00, 500.00);

-- 3) Cuotas del IMSS con la UMA nueva
update public.tablas_imss
   set uma_diaria = 118.00
 where ejercicio = 2027;

-- 4) Salario mínimo por empresa (o cambia el valor por omisión del código)
update public.configuracion_nomina
   set salario_minimo = 295.00
 where salario_minimo = 278.80;
```

> **Recuerda:** la cuota fija de la tarifa se **divide** entre los periodos que
> caben en el mes, no se multiplica. Si la multiplicas, la retención sale
> inflada (en una quincena de $4,500 pasa de $271 a $331). Está explicado en
> los comentarios de la migración `0011`.

### 5.3 Verificar el ejercicio nuevo

```bash
# 1) Las pruebas del motor deben seguir pasando
npm test

# 2) La validación debe leer el catálogo nuevo de la base de datos,
#    no el respaldo del código
npm run validar:nomina -- --periodicidad=quincenal
#   → la cabecera debe decir "Origen de catálogos: BD"

# 3) Cotejar contra el Anexo 8 recién publicado (sección 4.1)
```

### 5.4 Actualizar el respaldo del código

El respaldo (`src/lib/nomina/tablas.ts`) existe solo para que el sistema no se
detenga cuando falta un catálogo. **Cuando actualices un ejercicio, actualiza
también el respaldo** para que sus números no queden desfasados:

1. `ISR_MENSUAL_RESPALDO` — los 11 renglones del Anexo 8.
2. `tablaSubsidioRespaldo` — límite y subsidio mensual.
3. `UMA_RESPALDO` y `IMSS_RESPALDO` — UMA y tasas.
4. `CONFIG_POR_DEFECTO.salarioMinimo` en `src/lib/nomina/datos.ts`.

5. Actualiza las pruebas: los valores esperados de `tests/nomina.test.ts` están
   calculados a mano **con la tarifa de 2026**. Si cambias el respaldo, las
   pruebas fallarán, y **eso es correcto**: la prueba es la señal de que hay que
   recalcular los valores esperados y anotar el fundamento.

6. Actualiza los ejemplos de la landing, que usan cifras reales del motor:
   `src/components/landing/Hero.jsx` y `Exportacion.jsx`. Está advertido en los
   comentarios de ambos archivos.

---

## 6. Lo que NO está calculado todavía

Lista exhaustiva, para que no haya sorpresas en una validación.

### 6.1 Cálculos ausentes

| Falta | Impacto | Nota |
|---|---|---|
| **Timbrado del CFDI de nómina 4.0** | No se puede cumplir con la obligación de timbrar | Los conceptos ya llevan la clave `c_TipoPercepcion` / `c_TipoDeduccion`; falta la integración con el PAC |
| **Aguinaldo y prima vacacional automáticos** | Se capturan como conceptos manuales | El catálogo y el mapeo contable ya los contemplan (claves `P004`, `P005`) |
| **Finiquito y liquidación** | No se calcula | Requiere prima de antigüedad, indemnización y cálculo de ISR por separación |
| **Ajuste anual del ISR (Art. 98 LISR)** | No se calcula | El motor calcula retención por periodo, que es el flujo mensual del Art. 96 |
| **Cuota patronal adicional del régimen de la Ley 97** | No se incluye | Depende del salario del trabajador y del año; fórmula en los artículos transitorios de la reforma de 2020 |
| **Estado de cuenta del IMSS y SUA** | No se generan | Se descargan de IDSE |
| **Determinación de la prima de riesgo anual** | No se calcula automáticamente | El valor se configura a mano |
| **Cálculo de vacaciones devengadas** | No se calcula | Se capturan como incidencia |
| **Incapacidades del IMSS** | Se tratan como días con incidencia, sin cálculo de subsidio | El pago lo hace el IMSS, no el patrón |
| **Horas extra por jornada mixta o nocturna** | No aplica factor de recargo | El motor asume jornada diurna de 8 h |
| **Destajo, comisiones y PPR** | No se calculan | Se capturan como percepciones manuales |

### 6.2 Supuestos del motor que deben verificarse por caso

| Supuesto | Qué implica | Dónde cambiarlo |
|---|---|---|
| Jornada diurna de 8 horas | El valor de la hora extra es `salario diario / 8` | `JORNADA_DIARIA_HORAS` en `engine.ts` |
| Semana laboral de 6 días | El tope de exención de horas extra se prorratea sobre 6 días | `DIAS_SEMANA_LABORAL` en `engine.ts` |
| Todos los días naturales del periodo se pagan | Las faltas se descuentan **solo** si hay incidencia explícita | Comportamiento deliberado; ver el comentario en `engine.ts` |
| Factor de integración con 12 días de vacaciones | Aplica a partir del segundo año solo si el empleado no tiene un valor propio | `empleado.diasVacacionales` |
| ISR calculado por periodo | No acumula ni anualiza | Ver `isr.ts` |
| El subsidio se prorratea por días | `subsidio mensual / 30 × días del periodo` | `isr.ts` |

### 6.3 Lo que el motor NO puede validar por ti

- **Los datos de entrada.** Si el CURP o el NSS están mal capturados, el
  cálculo es correcto pero el trámite se rechaza. El sistema valida formato,
  no existencia.
- **La veracidad de los marcajes.** Si alguien marca por otro, el cálculo es
  consistente con un dato falso.
- **Las condiciones particulares del contrato de trabajo.** El motor aplica la
  ley general; si tu contrato colectivo ofrece prestaciones superiores, hay que
  configurarlas.
- **El criterio del contador.** El motor ofrece una interpretación defendible
  de la ley, con su fundamento anotado. Un contador puede aplicar un criterio
  distinto y legítimo.

---

## 7. Agregar la variante de layout de CONTPAQi

Cuando tengas el archivo real de tu versión de CONTPAQi o Aspel, agregarlo **no
rompe lo existente**: los layouts son declarativos y cada uno tiene su propio
identificador.

### 7.1 Cómo mandarlo

Del archivo de importación real, se necesita saber:

1. **El orden exacto de las columnas.**
2. **El separador** (`|`, `,`, tabulador).
3. **Si lleva encabezado** de nombres de columna.
4. **La codificación** (UTF-8, UTF-8 con BOM, windows-1252).
5. **El fin de línea** (CRLF o LF).
6. **Si los importes van con decimales o enteros** y con qué separador de miles.
7. **Las fechas en qué formato** (`dd/mm/aaaa`, `aaaammdd`).

**Envíalo sin datos reales**: sustituye nombres, RFC, CURP y NSS por valores
ficticios. No hace falta que compartas información de tus clientes.

### 7.2 Cómo se agrega

Un layout nuevo es un objeto más en `src/lib/nomina/plantillas.ts`:

```ts
export const PLANTILLA_CONTPAQI_NOMINA_2022: PlantillaExportacion = {
  sistema: "contpaqi",
  producto: "CONTPAQi Nóminas (layout 2022)",
  documento: "nomina",
  variante: "resumen",
  separador: "|",
  entrecomillar: false,
  encabezado: true,
  extension: "txt",
  codificacion: "windows-1252",
  campos: ["rfc", "curp", "nss", "nombre", /* … en el orden real … */],
  finLinea: "\r\n",
  nota: "Layout específico de la versión 2022. Validado contra la importación del …",
};
```

Y se agrega al arreglo `PLANTILLAS`. Aparece solo en la interfaz de
exportación y en la tabla de la página de configuración. **Ninguna plantilla
existente cambia**, porque cada una se identifica por
`sistema-documento-variante`.

### 7.3 Campos disponibles

Los campos que el mapeador sabe emitir están en `CAMPOS_NOMINA`,
`CAMPOS_CONCEPTO` y `CAMPOS_POLIZA` (en `plantillas.ts`). Si el layout necesita
un campo que no existe, se agrega en tres lugares:

1. El arreglo de campos disponibles.
2. La etiqueta legible en `ETIQUETAS_CAMPO`.
3. El mapeo en `src/lib/nomina/exportar.ts` (`filaResumen`, `filasDetalle` o
   `filaPoliza`).

### 7.4 Cómo se valida

```bash
npm test                                    # las pruebas del serializador
npm run dev                                 # descarga el archivo desde /contabilidad
```

Después, **impórtalo en un periodo de prueba** y verifica que las cuentas y los
importes entren donde corresponde. Ese paso no lo puede hacer el script: se
requiere el sistema contable.

☐ Layout recibido el: __________
☐ Variante agregada el: __________
☐ Importación probada el: __________ Resultado: __________

---

## 8. Registro de validaciones

Lleva este registro al día. Es la evidencia de que el sistema se validó antes
de usarlo con nómina real.

| Fecha | Qué se validó | Contra qué | Resultado | Responsable |
|---|---|---|---|---|
| | Migraciones aplicadas | `supabase db push` | ☐ | |
| | Pruebas del motor (29) | `npm test` | ☐ | |
| | ISR de 4 casos | Calculador del SAT | ☐ | |
| | Cuotas de 4 casos | IDSE / calculadora IMSS | ☐ | |
| | Cálculo completo | Contador independiente | ☐ | |
| | Exportación de nómina | CONTPAQi / Aspel real | ☐ | |
| | Póliza contable | CONTPAQi Contabilidad | ☐ | |
