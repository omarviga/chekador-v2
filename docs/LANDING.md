# Landing pública

La landing vive en `/` y su audiencia es el **personal contable y
administrativo** de las PyMEs, no el dueño del negocio. Cada decisión de
copy parte de ahí: se habla de captura, cierre de mes, pólizas, layouts de
importación y riesgo ante una revisión, no de "ahorrar dinero".

## Composición

`src/components/landing/LandingApp.jsx` es el punto de entrada y define el
orden narrativo. Todos los componentes son `.jsx` (la landing no usa
TypeScript, a diferencia del resto del proyecto).

| Orden | Componente | Ancla | Qué resuelve |
|---|---|---|---|
| 1 | `Hero` | — | La promesa: dejar de capturar y bajar la póliza hecha |
| 2 | `Problema` | `#problema` | Dónde se va el tiempo hoy |
| 3 | `Features` | `#features` | Funciones, con el cálculo y la exportación al frente |
| 4 | `ParaContadores` | `#contadores` | Por qué le conviene a quien captura |
| 5 | `ComoFunciona` | `#como-funciona` | Puesta en marcha (una vez) y cierre (cada periodo) |
| 6 | `Exportacion` | `#exportacion` | Los archivos que va a importar, con muestras |
| 7 | `Precios` | `#precios` | Planes Básico / Contable / Despacho |
| 8 | `ParaDespachos` | `#despachos` | Programa para contadores: cuenta gratis y comisión |
| 9 | `Testimonios` | — | Casos de uso (ver aviso abajo) |
| 10 | `FAQ` | `#faq` | Dudas agrupadas por tema |
| 11 | `CTAFinal` | — | Cierre con las tres garantías |
| 12 | `Footer` | — | Enlaces y aviso sobre cálculos fiscales |

## ⚠️ Pendientes antes de promocionar la landing

### 1. Los testimonios son escenarios, no clientes

`Testimonios.jsx` muestra una **nota de transparencia** que dice
explícitamente que son escenarios representativos y no testimonios
verificados. Está así a propósito: Chekdor está en etapa de pilotos y
publicar testimonios inventados como si fueran reales es publicidad
engañosa.

**Acción:** cuando tengas clientes en producción, sustitúyelos por citas
reales con autorización por escrito (nombre, puesto y, si se puede,
despacho). Entonces elimina la nota de transparencia.

### 2. Los datos de contacto son de ejemplo

En `Footer.jsx` y `CTAFinal.jsx`:

- `hola@chekdor.com.mx` y `contadores@chekdor.com.mx`
- `+52 33 1234 5678`
- Guadalajara, Jalisco

**Acción:** cámbialos por los reales. El correo `contadores@` es el que
recibe las solicitudes del programa de despachos: asegúrate de que exista y
de que alguien lo lea.

### 3. El aviso de privacidad público ya existe

El aviso de privacidad de Chekdor **como encargado** está publicado en
`/privacidad-encargado` (`src/app/privacidad-encargado/page.tsx`) y
enlazado desde el pie de página. Se sirve sin requerir inicio de sesión, que
es lo que permite a un prospecto evaluarlo antes de crear cuenta.

Los módulos de aviso por empresa y derechos ARCO (`/privacidad` y
`/privacidad/arco`) siguen **detrás del inicio de sesión**, porque se generan
para cada cliente.

> **Ojo con las dos copias.** El aviso vive en el `.docx` revisable
> (`docs/legal/Aviso_Privacidad_Encargado_Chekdor.docx`) y en la página
> pública. Si cambias uno, cambia el otro. Ver `docs/legal/README.md`.

Aún falta, para operar comercialmente:

1. Un **contrato de encargo de tratamiento** con cada cliente — ya redactado
   en `docs/legal/Contrato_Encargo_Tratamiento_Chekdor.docx`.
2. **Términos y condiciones** del servicio (no existen).
3. Sustituir el correo `privacidad@chekdor.com.mx` por uno real y con
   alguien que lo lea, tanto en la página como en el contrato.

### 4. La imagen de Open Graph ya está

`public/og-image.png` existe y mide 1200×630, que es lo que espera
`src/app/layout.tsx`. **Revisa que diga lo que ahora dice la landing**
(cálculo de nómina y exportación contable); si es la imagen antigua de
"control horario", actualízala.

### 5. Las cifras de ejemplo salen del motor, no de la imaginación

El recibo del Hero, la póliza de `Exportacion.jsx` y los totales del
mockup de `ComoFunciona.jsx` son **salidas reales del motor** para un
salario diario de $600 en la quincena del 1 al 15 de octubre de 2026, con 6
horas extra dobles y 2 domingos trabajados:

| Concepto | Importe |
|---|---|
| Sueldo (15 días) | $9,000.00 |
| Horas extra dobles (6 h) | $900.00 |
| Prima dominical (2) | $300.00 |
| ISR retenido | −$1,117.82 |
| IMSS cuotas obreras | −$182.67 |
| **Neto a pagar** | **$8,899.51** |
| Costo para la empresa | $11,101.19 |
| SBC | $629.58 (factor 1.0493) |
| Cuadre de la póliza | debe = haber = $10,200.00 |

**Si cambias un catálogo fiscal, vuelve a calcular estas cifras y
actualízalas.** Un contador detecta un número inconsistente en segundos, y
la landing pierde toda credibilidad. Los comentarios en `Hero.jsx` y
`Exportacion.jsx` lo advierten.

### 6. Las cifras de "2 a 4 horas" y "$3,000 a $8,000"

Son los rangos que usamos en la conversación de venta y están presentados
como lo que son: rangos reportados, con la fuente a la vista. El bloque de
`ComoFunciona.jsx` lo dice explícitamente ("lo medimos contigo en la
prueba"). **Si haces una encuesta entre los pilotos, reemplaza el rango por
tu propio dato**, que es mucho más vendible.

### 7. Honestidad sobre lo que falta

`Features.jsx` marca el timbrado del CFDI como **"En camino"** y el FAQ
dice que no está disponible. `Testimonios` y el FAQ también aclaran que la
valuación NOM-035 es orientativa y no el instrumento oficial.

No cambies esas etiquetas para "mejorar la conversión". Un contador que
descubre en la demo que el producto prometía algo que no existe no vuelve,
y es el peor canal posible para perder: el que recomienda a otros.

## Cómo agregar o mover secciones

1. Crea el componente en `src/components/landing/`.
2. Importalo y colócalo en el orden deseado dentro de `LandingApp.jsx`.
3. Si tiene ancla, agrégala al arreglo `links` de `Navbar.jsx` y al bloque
   correspondiente del `Footer.jsx`.
4. Verifica que la ancla exista de verdad: el HTML debe contener
   `id="tu-ancla"`. Las anclas rotas son silenciosas.

## Verificación

```bash
npm run dev
# luego, en otra terminal:
curl -s http://localhost:3000/ | grep -c "Deja de capturar la nómina"
```

O revisa que el HTML generado contenga los `id` de todas las anclas del
navbar. Es lo que se hizo para validar esta versión: las 8 anclas
(`problema`, `features`, `contadores`, `como-funciona`, `exportacion`,
`precios`, `despachos`, `faq`) están definidas y todos los enlaces
internos resuelven.
