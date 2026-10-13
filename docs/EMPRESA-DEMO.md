# Empresa demo

Datos de demostración para poder capturar pantallas, mostrar el producto y
probar el cálculo **sin usar información de un cliente real**.

> **Todos los datos son ficticios.** Ninguna persona, RFC, CURP, NSS ni
> dirección corresponde a alguien real.

---

## 1. Qué crea la migración `0019`

| | |
|---|---|
| **Empresa** | Comercializadora del Bajío, S.A. de C.V. |
| **RFC** | `DEMO260101AB1` — **empieza por `DEMO`** a propósito |
| **Régimen** | `601` (General de Ley Personas Morales) |
| **Suscripción** | `trialing`, 14 días — para que se vean los días restantes |
| **Trabajadores** | 6, con datos fiscales completos |
| **Periodo** | Quincena del 1 al 15 de octubre de 2026, en `borrador` |
| **Jornadas** | 15 días por trabajador, con domingos, tiempo extraordinario y una falta |

### Por qué el RFC empieza por `DEMO`

Un RFC con formato válido pero **reservado** hace imposible confundir esta
empresa con un cliente real, y hace trivial encontrarla y borrarla. **Nunca
debe llegarse a timbrar un CFDI con ella**: el SAT rechazaría el RFC.

### Los salarios no son arbitrarios

Cubren los cuatro tramos que importan del ISR y del subsidio al empleo:

| Trabajador | Salario diario | Qué demuestra |
|---|---|---|
| Ana Torres Núñez | $200.00 | **Subsidio entregable**: el patrón paga la diferencia (Art. 97 LISR) |
| María López Ruiz | $278.80 | Salario mínimo: el subsidio **reduce** el ISR sin eliminarlo |
| Sofía Gutiérrez Peña | $430.00 | Tramo bajo del ISR |
| Juan Pérez López | $600.00 | **El escenario de la landing**, con 6 h extra y 2 domingos |
| Carlos Ramírez Soto | $900.00 | Tramo alto, con ISR marginal del 21.36 % y **una falta** |
| Luis Hernández Vega | $2,500.00 | Tramo muy alto, ISR al 35 % |

Los dos primeros casos son los que más importan: **casi todo el software de
nómina se equivoca con el subsidio entregable**, y una demo que lo muestre
bien es más elocuente que cualquier texto.

---

## 2. Aplicarla

```bash
supabase db push
```

La migración es **idempotente**: si ya existe una empresa con RFC de demo, la
borra y la recrea. Aplicarla dos veces no duplica nada.

### Enlazar tu usuario para poder entrar

La migración **no crea un usuario de autenticación**: hacerlo desde SQL exige
manipular el esquema `auth.users` de Supabase, que cambia entre versiones y es
frágil. En su lugar:

1. Regístrate en `/registro` con un correo de prueba.
2. En Supabase → **Authentication**, copia el `user_id` del usuario creado.
3. Enlázalo a la empresa demo:

```sql
update public.perfiles
   set empresa_id = (select id from public.empresas where rfc = 'DEMO260101AB1'),
       rol = 'admin_empresa'
 where user_id = '<tu-user-id>';
```

> ⚠️ Un perfil pertenece a **una sola** empresa. Si el registro te creó tu
> propia empresa, este `update` te mueve a la demo y deja la otra vacía. Si
> quieres volver, cambia el `empresa_id` de nuevo.

---

## 3. Generar los recibos y la póliza

La migración **no siembra recibos ni pólizas**: deja el periodo creado para
que los generes con el motor.

1. Entra a **`/contabilidad`**.
2. Selecciona el periodo del **1 al 15 de octubre de 2026**.
3. Pulsa **Calcular**.

Los 6 recibos y las pólizas se generan con el motor real. **Eso es lo que hay
que demostrar**, no una tabla escrita a mano.

### Comprobar que la landing no miente

```bash
npm run verificar:demo
```

Compara **lo que la landing publica** contra **lo que el motor calcula desde
la base de datos**, concepto por concepto. Devuelve código de salida distinto
de cero si algo difiere.

Es la comprobación que encontró el bug documentado en § 4: la landing
publicaba un costo patronal de `11,101.19` mientras el producto calculaba
`11,118.16`.

Para Juan Pérez debe dar:

| | |
|---|---|
| Días pagados | 15 |
| SBC | 629.58 |
| Total percepciones | 10,200.00 |
| ISR a retener | 1,117.82 |
| Neto a pagar | **8,899.51** |
| Cuotas patronales | **2,218.65** |
| Costo total patrón | **11,118.16** |

Y la póliza debe cuadrar:

```sql
select p.tipo, p.numero, sum(l.debe) as debe, sum(l.haber) as haber,
       (sum(l.debe) = sum(l.haber)) as cuadra
  from public.polizas p
  join public.polizas_lineas l on l.poliza_id = p.id
 group by p.id, p.tipo, p.numero;
```

---

## 4. El bug que encontró esta verificación

Sigue **abierto**, y explica por qué esta comprobación existe.

### Qué pasa

El catálogo `tablas_imss` tiene una fila llamada **`guarderias_descuento`**,
cuyo propio texto dice:

> «Mismo 1.00 %, aplicado sobre UMA por cada día de inasistencia (**no se
> calcula en automático**).»

El motor, sin embargo, **la calcula sola y la SUMA** al total patronal. En
`src/lib/nomina/imss.ts`, una fila con base `uma` que no sea cuota fija usa
`umaDiaria` como base y devuelve `patronal = base × tasa × días`, que se
acumula en el total.

Para Juan Pérez: `113.14 × 1 % × 15 días = 16.97`, sumados al costo del
patrón.

### Por qué importa

1. **Es un descuento tratado como cargo.** El nombre y el texto del catálogo
   dicen «descuento»; el motor lo suma. Si la intención era descontar del
   1 % de guarderías, el efecto es el doble del debido.

2. **La base es incorrecta.** Debería aplicar «por cada día de
   **inasistencia**», pero el motor usa `diasCotizados`, que son los días
   pagados. No hay relación entre ambos.

3. **La tabla de respaldo del código NO tiene esa fila.** Tiene 11 filas de
   IMSS y el catálogo de la base tiene 13. Eso significaba que **el mismo
   recibo producía dos costos patronales distintos** según de dónde salieran
   los catálogos: `2,201.68` con el respaldo y `2,218.65` con la base.

### Qué se corrigió y qué falta

**Corregido:** el generador de los datos de la landing ahora lee los catálogos
**de la base de datos**, con `cargarCatalogos`, la misma función que usa la
aplicación. Esta clase de divergencia deja de ser posible: si el catálogo
cambia, la landing cambia con él.

**Pendiente, y no lo toco sin confirmación:** el tratamiento de
`guarderias_descuento` en `src/lib/nomina/imss.ts`. Tres opciones:

| Opción | Efecto |
|---|---|
| **Excluirla del cálculo** | Es lo que el catálogo pide por escrito. El total patronal baja $16.97 por trabajador |
| **Restarla** del 1 % de guarderías | Si la intención era descontar, el efecto actual es el doble |
| **Preguntar al contador** | La opción correcta antes de elegir |

**No se corrigió por cuenta propia porque cambia el costo patronal de todos
los recibos**, y la semántica del descuento de guarderías del Art. 211 LSS es
una cuestión fiscal que debe confirmar un contador, no un programador.

---

## 5. Capturas de pantalla para la landing

Con la demo cargada, las tres capturas que necesita la landing se pueden tomar
**sin exponer datos de nadie**:

| Pantalla | Ruta | Qué demuestra |
|---|---|---|
| Nómina calculada | `/contabilidad` | Los recibos con ISR, IMSS y neto |
| Mapeo de cuentas | `/contabilidad/configuracion` | Que **no hay que cambiar tu catálogo** |
| Asistencia del día | `/dashboard` | El registro por NFC |

**Especificaciones técnicas:**

- **PNG a 2× de resolución** (por ejemplo, 2880 px de ancho para un panel de
  1440). En pantallas Retina, una captura a 1× se ve borrosa.
- **Ventana de 1440 px de ancho**, que es la medida en que se diseñó el panel.
- **Sin la barra del navegador** ni pestañas: solo la interfaz.
- **Tema claro**, que es el de la aplicación.

> Antes de tomarlas, comprueba que **no aparezca ningún dato real**. La demo
> existe precisamente para eso, así que si ves un nombre que no está en la
> lista de arriba, estás en la empresa equivocada.

---

## 6. Quitarla

```sql
-- Comprobar qué se va a borrar ANTES de borrarlo
select e.rfc, e.nombre_comercial, count(emp.id) as empleados
  from public.empresas e
  left join public.empleados emp on emp.empresa_id = e.id
 where e.rfc like 'DEMO%'
 group by 1, 2;

-- Borrar
delete from public.empresas where rfc like 'DEMO%';
```

El borrado en cascada se lleva configuración de nómina, empleados, jornadas,
periodos, recibos, conceptos, pólizas y CFDIs de esa empresa.

> ⚠️ Si llegaste a timbrar un CFDI con la demo, el `on delete restrict` de la
> migración `0018` **impedirá el borrado**. Es deliberado: un CFDI es un
> documento fiscal y no debe desaparecer en silencio. Cancélalo primero.

---

## 7. Qué NO trae la demo, y por qué

| Falta | Razón |
|---|---|
| **Recibos de nómina sembrados** | Se generan con el motor al pulsar «Calcular». Sembrarlos a mano produciría cifras que podrían no coincidir con lo que el motor calcula, y **una demo que miente es peor que no tener demo** |
| **Marcajes NFC** (`registros_horarios`) | El motor lee las **jornadas** ya resueltas, no los marcajes. Añadirlos serviría para una captura de `/reportes`; se pueden agregar después si hace falta |
| **Usuario de autenticación** | Requiere manipular `auth.users` desde SQL, que es frágil entre versiones. Ver § 2 |
| **CFDIs timbrados** | Se timbran desde la interfaz con la llave de Facturapi en modo prueba. La demo no debe traer documentos fiscales |
| **Datos de NOM-035** | El cuestionario se responde desde la aplicación y las respuestas son de una persona. No se siembran |
