# Exportación para timbrado por el contador

**Chekdor no timbra.** Calcula la nómina y genera el archivo y la póliza; el
contador descarga el archivo, lo importa en **su** sistema de facturación y
timbra ahí el CFDI de nómina.

Esa decisión define qué tiene que llevar la exportación: **todo lo que el
complemento de nómina exige**, porque si falta un dato el contador lo captura
a mano por cada trabajador — que es justo el trabajo que el producto promete
eliminar.

---

## 1. Cotejo contra la guía del SAT

Se cotejó contra la **«Guía de llenado del comprobante del recibo de pago de
nómina y su complemento»** (versión 4.0 del CFDI y complemento de nómina 1.2,
edición de enero de 2026, 133 páginas).

### Nodo `Receptor` — completo

El complemento define 18 campos. **Los 18 están soportados:**

| Campo del SAT | Columna en `empleados` | En la exportación |
|---|---|---|
| `Curp` | `curp` | `curp` |
| `NumSeguridadSocial` | `nss` | `nss` |
| `FechaInicioRelLaboral` | `fecha_ingreso` | `fecha_ingreso` |
| `Antiguedad` | — (se calcula de la fecha) | — |
| `TipoContrato` | `tipo_contrato` | `tipo_contrato` |
| `Sindicalizado` | `sindicalizado` | `sindicalizado` |
| `TipoJornada` | `tipo_jornada` | `tipo_jornada` |
| `TipoRegimen` | `tipo_regimen` | `tipo_regimen` |
| `NumEmpleado` | `codigo_empleado` | `codigo` / `numero_empleado` |
| `Departamento` | `departamento` | `departamento` |
| `Puesto` | `puesto` | `puesto` |
| `RiesgoPuesto` | `riesgo_puesto` | `riesgo_puesto` |
| `PeriodicidadPago` | `periodicidad` (del periodo) | derivado |
| `Banco` | `empleado_cuentas_bancarias` | ⚠️ ver § 3 |
| `CuentaBancaria` | `empleado_cuentas_bancarias` | ⚠️ ver § 3 |
| `SalarioBaseCotApor` | calculado por el motor | `sbc` |
| `SalarioDiarioIntegrado` | calculado por el motor | `sdi` |
| `ClaveEntFed` | `clave_ent_fed` | `clave_ent_fed` |

### Percepciones, deducciones y otros pagos — completos

Las **claves del SAT ya viajan en el archivo de detalle**
(`nomina_conceptos.clave_sat` → columna `clave_sat`), junto con
`importe_gravado` e `importe_exento`.

Ejemplo del archivo real, para el recibo de la empresa demo:

```
P  clave_sat=001  gravado=9000  exento=0       Sueldo
P  clave_sat=019  gravado= 450  exento=450     Horas extra
P  clave_sat=020  gravado= 73.72 exento=226.28 Prima dominical
D  clave_sat=002                ISR retenido
D  clave_sat=001                IMSS cuotas obreras
```

> ⚠️ Las cuotas **patronales** (prefijo `_patron` en la clave) **no llevan
> clave SAT** y aparecen con el tipo `A`. Es correcto: no son una retención al
> trabajador ni una percepción suya, son un costo de la empresa. El CFDI del
> trabajador no las incluye.

### Nivel superior — completo

Campos obligatorios del complemento (`fecha_inicial_pago`, `fecha_final_pago`,
`num_dias_pagados`, `tipo_nomina`, más los nodos): **todos presentes**.

---

## 2. Huecos conocidos

### 2.1 Banco y cuenta bancaria

Las columnas `banco` y `cuenta_bancaria` **no existen** en `empleados`. La
información vive en la tabla aparte **`empleado_cuentas_bancarias`** y el motor
ya la carga (`cargarCuentasBancarias` en `datos.ts`).

**Falta:** incluir `banco` y `cuenta_bancaria` en las plantillas de
exportación, tomándolos de esa tabla. Sin ellos el complemento sale sin datos
de la cuenta del trabajador.

### 2.2 Nóminas especiales no soportadas

El motor calcula **nómina ordinaria**. No maneja estos supuestos:

| Supuesto | Nodos del SAT | ¿Importa? |
|---|---|---|
| **Separación / indemnización** | `Separacion` (5 campos) | **Sí** — cuando se da de baja a alguien |
| **Incapacidad por riesgo de trabajo** | `Incapacidad` (3 campos) | **Sí** — subsidio del IMSS al trabajador |
| Jubilación o pensión | `Jubilacion` (5 campos) | Poco frecuente en una PyME |
| Subcontratación (REPSE) | `Subcontratacion` (2 campos) | Solo si presta personal a otra empresa |
| Compensación anual | `Compensacion` (3 campos) | Al cierre de ejercicio |
| Acciones o compensaciones | `Acciones` (2 campos) | Casi nunca en una PyME |

**Los dos primeros son los que un despacho va a encontrarse.** Si un
trabajador renuncia o se enferma, el contador **no tiene de dónde sacar esos
datos** desde Chekdor.

### 2.3 Campos del emisor

De los 4 campos del nodo `Emisor`, hay 2 sin soporte:

- **`RfcPatronOrigen`** — solo aplica en subcontratación.
- **`EntidadSNCF`** — solo para trabajadores del sistema ferroviario.

No aplican al mercado objetivo.

---

## 3. Cómo verificarlo

```bash
npm run verificar:exportacion
```

Arma la exportación con los datos **reales** de la empresa demo y comprueba,
campo por campo, que los 20 datos del complemento estén presentes y no vacíos.
Devuelve código de salida distinto de cero si falta alguno.

Requiere la empresa demo cargada (migración `0019`). Ver
[docs/EMPRESA-DEMO.md](EMPRESA-DEMO.md).

---

## 4. Lo que el contador recibe

| Archivo | Contenido | Para qué |
|---|---|---|
| **Resumen** | Un renglón por trabajador, 28 columnas | Importar la nómina |
| **Detalle** | Un renglón por concepto, con `clave_sat`, `gravado`, `exento` | Armar el CFDI sin recapturar |
| **Póliza** | Cargos y abonos con el catálogo de cuentas | Contabilidad |

Los tres salen del **mismo motor**, así que las cifras de la póliza y las del
recibo no pueden divergir.
