# Documentos legales

Esta carpeta contiene los documentos que Chekdor necesita para operar como
**encargado del tratamiento** conforme a la Ley Federal de Protección de
Datos Personales en Posesión de los Particulares (LFPDPPP).

## Qué hay aquí

| Archivo | Qué es | Audiencia |
|---|---|---|
| `Contrato_Prestacion_Servicios_Chekdor.docx` | Contrato de servicios con Anexo I (datos contratados), II (funciones por plan) y III (fuera de alcance). **Se firma con cada cliente.** | Cliente |
| `Contrato_Encargo_Tratamiento_Chekdor.docx` | Contrato de encargo de tratamiento. Se firma con cada cliente. | Cliente |
| `Terminos_y_Condiciones_Chekdor.docx` | Términos y condiciones de servicio. Se aceptan al registrarse. | Cliente |
| `Aviso_Privacidad_Encargado_Chekdor.docx` | Aviso de privacidad de Chekdor como encargado, dirigido a los trabajadores del cliente. | Titulares |
| `MEDIDAS_DE_SEGURIDAD.md` | Inventario de medidas de seguridad, con la evidencia de cada una. **Es la fuente del Anexo B del contrato de encargo.** | Interno |
| `PROCEDIMIENTO_VULNERACIONES.md` | Procedimiento de atención a vulneraciones con los plazos de la Ley y del contrato. **Es el rubro pendiente del Anexo B.** | Interno |
| `_comun.py` | Utilidades de formato compartidas por todos los generadores. | — |
| `generar_contrato_encargo.py` | Genera el contrato de encargo. | — |
| `generar_aviso_privacidad_encargado.py` | Genera el aviso de privacidad. | — |
| `servicios/contenido_contrato.py` | **Fuente única del texto del contrato de servicios.** | — |
| `servicios/generar_docx.py` | Genera el Word del contrato de servicios. | — |
| `terminos/contenido_terminos.py` | **Fuente única del texto de los Términos.** | — |
| `terminos/generar_docx.py` | Genera el Word de los Términos. | — |
| `terminos/generar_tsx.py` | Genera la página pública `/terminos`. | — |

## Qué documento usar en cada situación

La relación con un cliente puede formalizarse de tres formas. **No son
alternativas excluyentes**: los tres conviven y cada uno regula una materia.

| Situación | Documentos que aplican |
|---|---|
| Cliente que se registra solo y paga con tarjeta | **Términos** (aceptados al registrarse) + **Aviso** (informativo) |
| Cliente que carga datos de trabajadores | Lo anterior **+ Contrato de Encargo** (obligatorio antes de cargar datos personales) |
| Cliente con condiciones negociadas: precio especial, SLA con penalización, vigencia distinta, multi-sucursal | Lo anterior **+ Contrato de Servicios** con su Anexo I completo |
| Despacho contable que administra varios clientes | Contrato de Servicios por cada cliente final, con su propio Anexo I |

> **El Contrato de Servicios no sustituye a los Términos.** Los Términos
> cubren lo estándar y se aceptan con un clic; el Contrato de Servicios
> cubre lo negociado y se firma. Cuando ambos aplican, el contrato
> prevalece sobre los Términos por su cláusula Decimosexta — y eso importa,
> porque los Términos son un documento **unilateral** que Chekdor puede
> modificar, mientras que el contrato solo cambia si ambas partes lo firman.

### Orden de prevalencia entre documentos

```
Contrato de Servicios          ← lo negociado (plan, precio, SLA, vigencia)
      ↓
Contrato de Encargo            ← datos personales, seguridad, ARCO
      ↓
Términos y Condiciones         ← lo estándar, modificable unilateralmente
      ↓
Documentación técnica
```

El Contrato de Servicios y los Términos declaran este mismo orden, así que no
hay ambigüedad. **Si alguna vez cambias el orden en un documento, cámbialo en
los dos**: está escrito en la cláusula Decimosexta del contrato de servicios y
en la sección 21 de los Términos.

## Cómo regenerar los documentos

Los `.docx` **se generan desde código**, no se editan a mano. Así el
contrato, los términos, el aviso, el inventario de medidas y la página
publicada se mantienen consistentes.

```bash
python docs/legal/generar_contrato_encargo.py
python docs/legal/generar_aviso_privacidad_encargado.py
python docs/legal/servicios/generar_docx.py    # Word del contrato de servicios
python docs/legal/terminos/generar_docx.py     # Word de los Términos
python docs/legal/terminos/generar_tsx.py      # página pública /terminos
```

Si editas un `.docx` o el `.tsx` a mano, el siguiente que ejecute el
generador sobrescribirá tus cambios. **Modifica la fuente, no la salida.**

### El caso de los Términos: una fuente, dos salidas

Los Términos existen en dos formas —el Word que se firma y la página pública
`/terminos`— y **ambas se generan del mismo archivo**:
`terminos/contenido_terminos.py`, que contiene el texto como datos
estructurados y no como formato.

La alternativa (mantener el Word y la página por separado) garantiza que en
tres meses digan cosas distintas. Con una sola fuente, no pueden divergir.

Si necesitas cambiar una cláusula: edita `contenido_terminos.py` y ejecuta
**los dos** generadores.

### Verificar y revisar visualmente

```bash
# Integridad estructural y que el texto obligatorio esté presente
python "<skill>/scripts/check_office.py" docs/legal/Contrato_Encargo_Tratamiento_Chekdor.docx

# Vista previa en PDF para revisar la maquetación
node "<libreoffice-kit>/lib/cli.js" convert \
  --input docs/legal/Contrato_Encargo_Tratamiento_Chekdor.docx \
  --output docs/legal/_pdf/contrato.pdf
```

## El aviso y los términos también están publicados

| Documento | URL pública | Fuente |
|---|---|---|
| Aviso de privacidad (encargado) | `/privacidad-encargado` | `Aviso_Privacidad_Encargado_Chekdor.docx` **y** `src/app/privacidad-encargado/page.tsx` |
| Términos y condiciones | `/terminos` | `terminos/contenido_terminos.py` (genera las dos salidas) |

Ambos se sirven **sin requerir inicio de sesión**, que es lo que permite a un
prospecto evaluarlos antes de crear cuenta. Están enlazados desde el pie de
página de la landing.

> ⚠️ **El aviso tiene dos copias que deben coincidir:** el `.docx` revisable y
> la página. Si cambias uno, cambia el otro. **Los términos no tienen ese
> problema:** su fuente única genera las dos salidas.
>
> La duplicación del aviso es deuda técnica pendiente. El camino para
> eliminarla es aplicar a `src/app/privacidad-encargado/page.tsx` el mismo
> patrón que se usó en los Términos: mover el texto a un módulo de contenido y
> generar la página desde ahí.

## Antes de usar estos documentos en producción

Los tres documentos tienen campos marcados con **●** que hay que completar.
Además, hay pendientes que no son de texto sino de operación:

### 1. Datos de la empresa

| Dato | Dónde |
|---|---|
| Razón social o nombre de la persona física | Contrato (declaraciones I.1) y aviso (primer párrafo) |
| RFC | Contrato (I.2) y aviso |
| Domicilio fiscal | Contrato (I.2), cláusula Decimocuarta y aviso (apartado 8) |
| Escritura pública, notario y folio mercantil | Contrato (I.1). Si eres persona física, ajusta ese inciso |
| Representante legal que firma | Contrato (I.3) |
| Jurisdicción (ciudad de los tribunales) | Contrato (cláusula Decimoséptima) |
| Teléfono | Contrato y aviso |

### 2. Regiones reales de los proveedores de nube

**No copies lo que está escrito: verifícalo.** Entra al panel de Supabase y
de Vercel y confirma la **región del proyecto**. Si declaras una región
distinta de la real, el Anexo C y el aviso son inexactos, y el aviso
inexacto es un incumplimiento de la LFPDPPP.

### 3. Correos que deben existir y tener a alguien que los lea

- `privacidad@chekdor.com.mx` — recibe reportes de titulares y de clientes.
- `legal@chekdor.com.mx` — notificaciones formales.

Si no existen, el contrato promete un canal de comunicación que no funciona.
Ese es el tipo de detalle que invalida la defensa en una reclamación.

### 4. Anexo B: cerrar las medidas pendientes

`MEDIDAS_DE_SEGURIDAD.md` marca las medidas con evidencia y las pendientes.
**Las pendientes no deben declararse como vigentes.** El orden de cierre
sugerido está en el plan del propio documento; el primero es el **cifrado en
reposo de CURP, RFC, NSS y CLABE**, porque es la única deficiencia que deja
datos personales en claro si alguien accede a la base de datos.

Cuando cierres una medida:

1. Actualiza el estado y agrega la evidencia en `MEDIDAS_DE_SEGURIDAD.md`.
2. Regenera el contrato (`generar_contrato_encargo.py`), porque el Anexo B
   se escribe desde el script.
3. Si la medida afecta lo que se declara a los titulares, regenera también
   el aviso **y** actualiza `src/app/privacidad-encargado/page.tsx`.

### 5. Firmar el contrato con el primer cliente

El contrato está redactado para firmarse con cualquier cliente. Antes de la
primera firma conviene una **revisión por un abogado** especializado en
protección de datos. No porque el documento esté mal, sino porque:

- El **límite de responsabilidad** de la cláusula Decimotercera (12 meses de
  contraprestaciones) debe ser una decisión consciente del negocio.
- La **jurisdicción** elegida conviene revisarla según dónde estén tus
  clientes.
- Si vas a contratar con **personas morales grandes**, te van a pedir firmar
  *su* contrato. Conviene saber de antemano qué cedes y qué no.

Este documento es una base técnica y legal sólida, pero **no sustituye la
asesoría jurídica de un abogado**.

### 6. Lo que estos documentos NO cubren

| Falta | Cuándo se necesita |
|---|---|
| **Política de cookies del sitio** | Si agregas analítica o píxeles de publicidad |
| **Contrato de confidencialidad con empleados y colaboradores** | Se menciona en el Anexo B como implementado; el documento en sí debe existir |
| **Registro de actividades de tratamiento** | La tabla `auditoria` lo alimenta, pero el registro formal en el formato del Reglamento no está documentado |
| **Contrato con cada subencargado** (Supabase, Vercel, correo) | El Anexo C los declara cubiertos "contractualmente". Hay que **verificar que los términos de cada proveedor acepten las obligaciones del Art. 32 del Reglamento**, o firmar un addendum de tratamiento de datos. Varios ofrecen un DPA en su panel |
| **Carta de instrucciones para el proveedor de nube** | Si el DPA del proveedor no cubre las transferencias internacionales del Art. 34, hay que formalizarlas por separado |

### 7. Pendientes del contrato de servicios antes de la primera firma

| # | Pendiente | Por qué importa |
|---|---|---|
| 1 | **Completar el Anexo I** con el plan, precio, vigencia y tope de empleados reales | Sin él no hay plan, precio ni vigencia determinados: el contrato no obliga a nada concreto |
| 2 | **Decidir la meta de disponibilidad** (por omisión 99.5 %) y si lleva penalización | Un compromiso que no puedes medir ni sostener es un incumplimiento esperando a ocurrir. El Anexo I permite pactarla distinto por cliente |
| 3 | **Decidir el tope de responsabilidad**: 12 meses de contraprestaciones o un importe fijo | Es la cláusula que más te protege y la que más te van a negociar. Debe ser una decisión consciente del negocio |
| 4 | **Elegir la jurisdicción** (cláusula Vigésima) | Depende de dónde estén tus clientes |
| 5 | **Verificar la fecha de primera facturación** contra lo que promete la landing | La landing ofrece 14 días de prueba. La vigencia debe empezar en el primer cobro, no en el registro |
| 6 | **Cotejar el Anexo II con `src/lib/stripe/planes.ts`** | Si difieren, el Cliente contrata una cosa y recibe otra. Las funciones por plan están declaradas en el código y en el anexo, por separado |

> ⚠️ **La cláusula de comprobante fiscal asume que ya puedes facturar.** Mientras
> el cobro no esté activo (ver `docs/STRIPE.md` § 4.4), esa cláusula describe
> una obligación que no puedes cumplir. Si vas a firmar el contrato **antes**
> de habilitar Stripe, ajusta la cláusula o anota en el Anexo I que la
> facturación inicia junto con el primer cobro.


## Principios de redacción que se siguieron

Estos criterios explican por qué los documentos dicen lo que dicen. Si los
cambias, hazlo a conciencia:

1. **El encargado nunca se presenta como responsable.** El contrato y el
   aviso declaran la calidad de cada parte desde el primer párrafo.
2. **Los plazos legales son explícitos y con número.** 72 horas para
   notificar vulneraciones, 3 días hábiles para canalizar ARCO, 20 días
   hábiles para responder al titular, 30 días para devolver datos.
3. **Las medidas de seguridad se declaran con evidencia.** El Anexo B
   distingue lo implementado de lo pendiente en lugar de presentar todo como
   vigente.
4. **No se promete ninguna certificación.** ISO 27001 y el Distintivo de
   Confianza del INAI no se mencionan ni como "en trámite".
5. **Los límites del producto se dicen en el contrato.** Por ejemplo, que el
   cálculo de contribuciones es responsabilidad del cliente y de su contador.
6. **El Anexo III del contrato de servicios lista lo que NO está incluido.** El
   timbrado de CFDI, el finiquito y el ajuste anual están ahí escritos. Si el
   cliente contrata esperando el timbrado y ese anexo no existe, la primera
   factura sin CFDI se convierte en un conflicto.
7. **Los documentos bilaterales prevalecen sobre el unilateral.** El contrato
   de servicios se coloca **por encima** de los Términos, y lo dice
   explícitamente: lo que las Partes negociaron y firmaron no puede quedar
   modificado por una actualización unilateral de los Términos.
8. **La meta de disponibilidad se declara como meta, no como garantía.** El
   contrato separa "realizará sus mejores esfuerzos" de "no genera penalización
   económica", para no prometer un SLA que no se sostiene.
