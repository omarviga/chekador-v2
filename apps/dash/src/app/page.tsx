import React from 'react';
import type { Metadata } from 'next';
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_CONTADORES,
  CONTACT_EMAIL_PRIVACIDAD,
  CONTACT_LOCATION,
  CONTACT_PHONE,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
} from '../lib/site';

/**
 * Página principal del proyecto: landing pública de Chekdor.
 *
 * · Es la ruta `/` del dashboard (apps/dash), la misma que sirve chekdor.com.mx.
 * · Componente de servidor: cero JavaScript de cliente. El acordeón de preguntas
 *   frecuentes usa <details>/<summary> nativo, así que no hay estado ni hidratación.
 * · Dominio canónico: https://chekdor.com.mx (ver src/lib/site.ts).
 */

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    url: absoluteUrl('/'),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

/* ------------------------------------------------------------------ */
/* Datos de la página                                                  */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: '#contadores', label: 'Para contadores' },
  { href: '#exportacion', label: 'CONTPAQi y Aspel' },
  { href: '#features', label: 'Funciones' },
  { href: '#precios', label: 'Precios' },
  { href: '#despachos', label: 'Despachos' },
  { href: '#faq', label: 'FAQ' },
] as const;

const HERO_BULLETS = [
  'Sin tarjeta de crédito',
  'Sin hardware costoso',
  'Soporte en español',
] as const;

const RECIBO_LINEAS = [
  { concepto: 'Sueldo', importe: '9,000.00', signo: '' },
  { concepto: 'Horas extra', importe: '900.00', signo: '' },
  { concepto: 'Prima dominical', importe: '300.00', signo: '' },
  { concepto: 'ISR retenido', importe: '1,117.82', signo: '-' },
  { concepto: 'IMSS cuotas obreras', importe: '182.67', signo: '-' },
] as const;

const FORMATOS_RECIBO = [
  'CONTPAQi Nóminas · TXT pipe',
  'CONTPAQi Contabilidad · pólizas',
  'Aspel NOI · CSV comillas',
  'Aspel COI · pólizas',
  'CSV genérico · 28 columnas',
] as const;

const PROBLEMAS = [
  {
    titulo: 'La asistencia llega en cualquier formato',
    cuerpo:
      'Un Excel con celdas combinadas, una foto del cuaderno, un audio por WhatsApp. Alguien tiene que convertir eso en algo que el sistema contable entienda.',
  },
  {
    titulo: 'Las horas extra se calculan a mano',
    cuerpo:
      'Separar las primeras 9 horas semanales al doble y el resto al triple es fácil de equivocar, y el error se arrastra al ISR de todo el periodo.',
  },
  {
    titulo: 'El registro no refleja la realidad',
    cuerpo:
      'Los checadores de huella se prestan entre compañeros. Si el patrón reporta 8 horas de alguien que llegó a las 9, tu cálculo parte de un dato falso.',
  },
  {
    titulo: 'CURP, RFC y NSS mal capturados',
    cuerpo:
      'Un dígito cambiado en el NSS o un CURP con el formato equivocado se convierte en un rechazo del IMSS o en un CFDI que el SAT no acepta.',
  },
  {
    titulo: 'El cierre se come el fin de mes',
    cuerpo:
      'Cuando todos los clientes cierran al mismo tiempo, la captura de nómina se vuelve el cuello de botella de todo el despacho.',
  },
  {
    titulo: 'El riesgo legal acaba en tu escritorio',
    cuerpo:
      'No llevar registro de jornada es una violación al Art. 132 fr. VII de la LFT. Las multas de la STPS van de $25,000 a $250,000 MXN.',
  },
] as const;

const FUNCIONES_NUCLEO = [
  {
    titulo: 'Cálculo de nómina',
    cuerpo:
      'Percepciones, exenciones del Art. 93 LISR, ISR con subsidio al empleo, cuotas del IMSS, SAR e INFONAVIT. Todo con la fórmula a la vista.',
  },
  {
    titulo: 'Exportación a CONTPAQi y Aspel',
    cuerpo:
      'Nóminas y pólizas contables en el archivo de importación de tu sistema, con la opción de resumen o de detalle por concepto.',
  },
  {
    titulo: 'Tu catálogo de cuentas',
    cuerpo:
      'Tú mapeas cada concepto a tus cuentas, una vez por empresa. Si falta una cuenta indispensable, el sistema no genera la póliza: te dice qué falta.',
  },
  {
    titulo: 'Marcaje por NFC sin hardware',
    cuerpo:
      'El empleado acerca su celular al tag. Sin app que instalar, sin huella que se preste. Un tag cuesta menos de $10.',
  },
] as const;

const FUNCIONES_RESTO = [
  {
    titulo: 'Cálculo auditable',
    cuerpo:
      'Cada recibo guarda el renglón de la tarifa aplicada, el factor de integración, la exención y las advertencias. Puedes reproducir el número a mano.',
  },
  {
    titulo: 'Jornadas conformes a la LFT',
    cuerpo:
      'Tope de 8 horas diarias, reparto semanal de las horas extra al doble y al triple, y prima dominical solo cuando corresponde.',
  },
  {
    titulo: 'Detección de incidencias',
    cuerpo:
      'Días sin marcaje, entradas sin salida y jornadas que exceden el límite diario se señalan antes de que se conviertan en un problema de nómina.',
  },
  {
    titulo: 'Multi-empresa y multi-sucursal',
    cuerpo:
      'Varias ubicaciones y varias razones sociales desde una cuenta, cada una con su propio catálogo de cuentas y sus parámetros.',
  },
  {
    titulo: 'Reportes para el expediente',
    cuerpo:
      'Jornadas y asistencia en CSV con BOM para Excel, listos para anexar cuando llegue una revisión de la STPS o del IMSS.',
  },
  {
    titulo: 'Cumplimiento de datos personales',
    cuerpo:
      'Aviso de privacidad digital versionado, consentimiento del trabajador con evidencia y flujo de derechos ARCO con su plazo legal.',
  },
  {
    titulo: 'Valuación de riesgos psicosociales',
    cuerpo:
      'Política de prevención, aplicación del cuestionario y registro de medidas de control para la NOM-035, con resultados confidenciales.',
  },
] as const;

const FUNCION_EN_CAMINO = {
  titulo: 'Timbrado del CFDI de nómina 4.0',
  cuerpo:
    'En construcción. Los conceptos ya llevan la clave del catálogo c_TipoPercepcion y c_TipoDeduccion; falta la integración con el PAC.',
  nota:
    'Preferimos decirte qué falta antes de que lo descubras en una demo. Si el timbrado es indispensable para tu operación hoy, escríbenos y te decimos en qué fecha lo tendremos.',
} as const;

const DOLORES_CONTADOR = [
  {
    titulo: 'Horas de captura que no se facturan',
    cuerpo:
      'El patrón manda la asistencia en Excel, en un cuaderno o por WhatsApp. Tú la capturas, la cuadras y luego la vuelves a capturar en CONTPAQi.',
  },
  {
    titulo: 'Horas extra calculadas a mano',
    cuerpo:
      'El reparto de las primeras 9 horas al doble y el resto al triple es fácil de equivocar, y el error se arrastra al ISR de todo el periodo.',
  },
  {
    titulo: 'El riesgo legal no es tuyo, pero te toca',
    cuerpo:
      'Un registro de jornada incompleto, un CURP mal capturado o un subsidio mal aplicado salen a la luz en una revisión del IMSS o del SAT.',
  },
  {
    titulo: 'Cada cliente en su propio formato',
    cuerpo:
      'Quince clientes son quince archivos distintos, quince layouts y quince formas de llamar a lo mismo. Eso no escala.',
  },
] as const;

const PASOS_MES = [
  {
    titulo: 'El empleado marca con el celular',
    cuerpo:
      'Al acercarlo al tag NFC. Sin app, sin huella, sin tarjeta que se preste entre compañeros.',
  },
  {
    titulo: 'El sistema convierte los marcajes en jornadas',
    cuerpo:
      'Aplica los topes de jornada, separa las horas extra al doble y al triple, y paga la prima dominical solo cuando corresponde.',
  },
  {
    titulo: 'Calcula la nómina del periodo',
    cuerpo:
      'Percepciones, exenciones del Art. 93, ISR con subsidio al empleo, cuotas del IMSS, SAR e INFONAVIT.',
  },
  {
    titulo: 'Tú descargas el archivo y la póliza',
    cuerpo:
      'Importas en CONTPAQi o Aspel. Queda tu revisión y tu criterio; la captura ya no es tu trabajo.',
  },
] as const;

const PUESTA_EN_MARCHA = [
  {
    titulo: 'Registra la empresa',
    cuerpo: 'Nombre comercial, RFC y periodicidad de pago. Dos minutos, sin tarjeta de crédito.',
  },
  {
    titulo: 'Mapea las cuentas contables',
    cuerpo:
      'Dices a qué cuenta corresponde sueldos, tiempo extraordinario, ISR por pagar, IMSS obrero. Una sola vez por empresa.',
  },
  {
    titulo: 'Da de alta a los empleados',
    cuerpo:
      'CURP, RFC, NSS y salario diario, con validación de formato. El sistema calcula el factor de integración del SBC.',
  },
  {
    titulo: 'Los empleados marcan',
    cuerpo:
      'Pegas el tag NFC en la entrada. El trabajador acerca el celular y queda registrado. Sin app y sin capacitación.',
  },
] as const;

const CIERRE_PERIODO = [
  {
    titulo: 'Cierras el periodo',
    cuerpo:
      'Eliges el rango de fechas y generas el cálculo. Las jornadas ya vienen de los marcajes: no capturas asistencia.',
  },
  {
    titulo: 'Revisas antes de firmar',
    cuerpo:
      'El sistema te muestra las incidencias y las advertencias: días sin marcaje, salarios faltantes, cuentas sin configurar. Tú decides.',
  },
  {
    titulo: 'Descargas y cuadras',
    cuerpo:
      'Bajas el archivo de nómina y la póliza. La póliza se verifica antes de entregarse: si el debe no cuadra con el haber, no se genera.',
  },
  {
    titulo: 'Pasas al siguiente cliente',
    cuerpo:
      'Cambias de empresa sin cerrar sesión. La misma mecánica para el restaurante de 8 empleados y la constructora de 80.',
  },
] as const;

const POLIZA_MOVIMIENTOS = [
  { cuenta: '510-001', clave: 'sueldos', concepto: 'Sueldo', debe: '9,000.00', haber: '—' },
  { cuenta: '510-002', clave: 'horas_extra', concepto: 'Horas extra', debe: '900.00', haber: '—' },
  {
    cuenta: '510-003',
    clave: 'prima_dominical',
    concepto: 'Prima dominical',
    debe: '300.00',
    haber: '—',
  },
  {
    cuenta: '210-001',
    clave: 'isr_por_pagar',
    concepto: 'ISR retenido',
    debe: '—',
    haber: '1,117.82',
  },
  {
    cuenta: '210-002',
    clave: 'imss_obrero_por_pagar',
    concepto: 'IMSS cuotas obreras',
    debe: '—',
    haber: '182.67',
  },
  {
    cuenta: '210-010',
    clave: 'sueldos_por_pagar',
    concepto: 'Neto a pagar',
    debe: '—',
    haber: '8,899.51',
  },
] as const;

const DESGLOSE_ISR = [
  { concepto: 'Base gravable', valor: '9,523.72' },
  { concepto: 'Cuota fija', valor: '768.16' },
  { concepto: 'Excedente del límite', valor: '1,951.24' },
  { concepto: '× 17.92 % marginal', valor: '349.66' },
  { concepto: 'ISR determinado', valor: '1,117.82' },
] as const;

const POLIZA_TXT = [
  'diario|1|2026-10-16|510-001||Sueldo|9000.00|0.00',
  'diario|1|2026-10-16|510-002||Horas extra|900.00|0.00',
  'diario|1|2026-10-16|510-003||Prima dominical|300.00|0.00',
  'diario|1|2026-10-16|210-001||ISR retenido|0.00|1117.82',
  'diario|1|2026-10-16|210-002||IMSS cuotas obreras|0.00|182.67',
  'diario|1|2026-10-16|210-010||Neto a pagar|0.00|8899.51',
] as const;

const FORMATOS_EXPORTACION = [
  {
    nombre: 'CONTPAQi Nóminas',
    formato: 'TXT delimitado por |',
    cuerpo:
      'Un renglón por empleado con RFC, CURP, NSS, SBC, días pagados, ISR, IMSS obrero y neto. Versión de detalle: un renglón por concepto con la clave SAT.',
  },
  {
    nombre: 'CONTPAQi Contabilidad',
    formato: 'Póliza en TXT',
    cuerpo:
      'Cargos y abonos con tu catálogo de cuentas. Genera la provisión, el pago y las cuotas patronales por separado o consolidadas en una sola póliza.',
  },
  {
    nombre: 'Aspel NOI',
    formato: 'CSV entrecomillado',
    cuerpo:
      'Campos de texto entre comillas y codificación UTF-8 con BOM, para que Excel y NOI lean los acentos correctamente.',
  },
  {
    nombre: 'Aspel COI',
    formato: 'Póliza en TXT',
    cuerpo:
      'Movimientos con tipo de póliza, folio, fecha, cuenta contable, referencia, concepto, debe y haber.',
  },
] as const;

const PLANES = [
  {
    nombre: 'Básico',
    publico: 'Negocios pequeños que necesitan ordenar la asistencia',
    precio: '$299',
    empleados: 'Hasta 10 empleados',
    destacado: false,
    beneficios: [
      'Marcaje por NFC en puntos ilimitados',
      'Jornadas conformes a la LFT',
      'Reportes de asistencia en CSV y PDF',
      'Aviso de privacidad y consentimientos',
      'Exportación de nómina en CSV genérico',
      'Soporte por email',
    ],
  },
  {
    nombre: 'Contable',
    publico: 'El plan que resuelve el cierre de mes',
    precio: '$599',
    empleados: 'Hasta 30 empleados',
    destacado: true,
    beneficios: [
      'Todo lo del plan Básico',
      'Cálculo de nómina: ISR, IMSS, SAR e INFONAVIT',
      'Exportación a CONTPAQi y Aspel',
      'Pólizas contables con tu catálogo de cuentas',
      'Mapeo de cuentas por empresa',
      'Valuación de riesgos psicosociales (NOM-035)',
      'Hasta 3 usuarios administrativos',
    ],
  },
  {
    nombre: 'Despacho',
    publico: 'Constructoras, agroindustria y despachos con cartera',
    precio: '$1,299',
    empleados: 'Hasta 100 empleados por empresa',
    destacado: false,
    beneficios: [
      'Todo lo del plan Contable',
      'Multi-empresa y multi-sucursal',
      'Panel de clientes para el contador',
      'Pólizas consolidadas o separadas',
      'Descuentos por empleado (pensión, préstamos, INFONAVIT)',
      'Soporte prioritario',
    ],
  },
] as const;

const BENEFICIOS_DESPACHO = [
  {
    titulo: 'Cuenta de despacho sin costo',
    cuerpo:
      'Para ti, mientras tus clientes son los que pagan su suscripción. No te cobramos por ser el canal.',
  },
  {
    titulo: 'Tus clientes en un solo panel',
    cuerpo:
      'Cambias de cliente sin cerrar sesión ni recordar quince contraseñas. El mismo flujo para todos.',
  },
  {
    titulo: 'Comisión por referido',
    cuerpo:
      'Un porcentaje de la suscripción de cada cliente que traigas, durante el primer año. Sin letras chiquitas.',
  },
  {
    titulo: 'Voz en el producto',
    cuerpo:
      'Los layouts de importación y el catálogo de conceptos se definen con quien los usa. Si tu versión de CONTPAQi necesita otro orden de columnas, lo agregamos.',
  },
] as const;

const CASOS = [
  {
    iniciales: 'CI',
    cargo: 'Contadora independiente',
    contexto: 'Cartera de 8 PyMEs · Guadalajara, JAL',
    cita:
      'Antes capturaba la nómina de cada cliente desde un Excel de asistencia. Ahora descargo el archivo, lo subo a CONTPAQi y reviso. Lo que me tomaba la tarde son quince minutos.',
  },
  {
    iniciales: 'GA',
    cargo: 'Gerente administrativo',
    contexto: 'Restaurante, 22 empleados · Puebla, PUE',
    cita:
      'Lo que me convenció fue que el cálculo queda documentado. Cuando vino la revisión del IMSS presenté el expediente de jornadas en dos minutos, sin buscar nada.',
  },
  {
    iniciales: 'JN',
    cargo: 'Jefa de nóminas',
    contexto: 'Despacho con 15 clientes · Monterrey, NL',
    cita:
      'El cálculo de las horas extra me ahorra el trabajo que más errores me daba: el reparto de las nueve horas dobles y el triple. Ya no lo hago en Excel.',
  },
] as const;

const FAQ = [
  {
    grupo: 'Integración contable',
    preguntas: [
      {
        q: '¿Qué archivos genera exactamente?',
        a: 'Para nómina: TXT delimitado para CONTPAQi Nóminas y CSV entrecomillado para Aspel NOI, en versión de resumen (un renglón por empleado) o de detalle (un renglón por concepto, con la clave del catálogo del SAT). Para contabilidad: pólizas en TXT para CONTPAQi Contabilidad y Aspel COI, con cargo y abono por cuenta. Además hay un CSV genérico de 28 columnas y un CSV de pólizas, por si tu sistema no está en la lista.',
      },
      {
        q: 'Mi versión de CONTPAQi pide otro orden de columnas. ¿Se puede ajustar?',
        a: 'Sí. Los layouts cambian entre versiones (2020, 2022, 2024) y según cómo esté configurado cada despacho. El formato está documentado y puedes ajustarlo en Configuración → Exportación; si el orden no coincide con tu versión, ajustamos la plantilla y te avisamos.',
      },
      {
        q: '¿Genera las pólizas cuadradas?',
        a: 'La póliza se verifica antes de entregarse: si el debe no cuadra con el haber, no se genera y el sistema te dice qué falta. Puedes revisar el total de cargos y abonos en la misma pantalla.',
      },
      {
        q: '¿Puedo elegir mis propias cuentas contables?',
        a: 'Sí. Chekdor no impone un catálogo: tú mapeas cada concepto (sueldos, tiempo extraordinario, prima dominical, ISR por pagar, IMSS obrero…) a las cuentas de tu sistema, una sola vez por empresa.',
      },
      {
        q: '¿Genera la póliza de pago y la de cuotas patronales?',
        a: 'Sí. Genera la provisión, el pago y las cuotas patronales por separado o consolidadas en una sola póliza, según cómo trabajes el periodo.',
      },
      {
        q: '¿Timbra el CFDI de nómina?',
        a: 'Todavía no. El timbrado del CFDI de nómina 4.0 está en construcción: los conceptos ya llevan la clave del catálogo c_TipoPercepcion y c_TipoDeduccion, falta la integración con el PAC. Preferimos decírtelo antes de que lo descubras en una demo.',
      },
    ],
  },
  {
    grupo: 'El cálculo',
    preguntas: [
      {
        q: '¿Cómo calcula las horas extra?',
        a: 'Aplica el reparto de la LFT: las primeras 9 horas semanales al doble y el resto al triple, con su exención del Art. 109 LISR. El reparto se hace sobre los marcajes del periodo, no sobre un dato capturado a mano.',
      },
      {
        q: '¿Puedo ver de dónde salió cada número?',
        a: 'Sí. Cada recibo guarda la fórmula aplicada, el renglón de la tarifa que se usó, el factor de integración, la exención, la cuota y las advertencias. Puedes reproducir el número a mano para defenderlo.',
      },
      {
        q: '¿Cómo sé que el ISR y el IMSS están bien?',
        a: 'Chekdor aplica las tasas de ISR, las cuotas del IMSS y los parámetros del subsidio al empleo cargados para cada ejercicio fiscal, partiendo de las fuentes oficiales publicadas. El sistema muestra en pantalla cuándo está usando un valor de respaldo y no el cargado en la base de datos. La validación de los valores vigentes y del resultado final corresponde al contador responsable.',
      },
      {
        q: '¿Qué pasa con los días que el empleado no marca?',
        a: 'Se señalan como incidencia antes de cerrar el periodo: días sin marcaje, entradas sin salida y jornadas que exceden el límite diario. Tú decides cómo tratarlas; el sistema no las rellena por su cuenta.',
      },
      {
        q: '¿Calcula aguinaldo, prima vacacional y finiquito?',
        a: 'El alcance de esta versión es la quincena que cuadra. El salario base de cotización sí integra la parte proporcional de aguinaldo y prima vacacional (Art. 27 LSS), pero el cálculo de aguinaldo, prima vacacional y finiquito como conceptos de pago todavía no está. Si lo necesitas para tu operación, escríbenos y lo hablamos.',
      },
    ],
  },
  {
    grupo: 'Cumplimiento y operación',
    preguntas: [
      {
        q: '¿Cumple con la Ley Federal del Trabajo?',
        a: 'El registro de jornada es electrónico y queda con evidencia: un hash por marcaje y una tabla donde no se permite borrar ni editar. Las jornadas respetan el tope de 8 horas diarias, el reparto de horas extra al doble y al triple, y la prima dominical solo cuando corresponde.',
      },
      {
        q: '¿Y con la protección de datos personales?',
        a: 'Chekdor actúa como encargado del tratamiento conforme a la LFPDPPP: los datos son de tu empresa y nosotros los tratamos por su cuenta. Hay aviso de privacidad digital versionado, consentimiento del trabajador con evidencia y flujo de derechos ARCO con su plazo legal.',
      },
      {
        q: '¿Sirve para la NOM-035?',
        a: 'Sí, en el plan Contable y superiores: política de prevención, aplicación del cuestionario, registro de medidas de control y resultados confidenciales.',
      },
      {
        q: '¿Necesito comprar hardware?',
        a: 'No hace falta un checador costoso. El empleado acerca su celular a un tag NFC; un tag cuesta menos de $10. Sin app que instalar y sin huella que se preste entre compañeros.',
      },
      {
        q: 'Si mi cliente deja de usarlo, ¿puedo sacar la información?',
        a: 'Sí. Los reportes de jornada y asistencia se descargan en CSV con BOM para Excel, y los archivos de exportación contable quedan en tu equipo.',
      },
      {
        q: '¿Puedo probar la exportación antes de comprometerme?',
        a: 'Sí, y es lo que recomendamos: descarga un periodo de prueba e impórtalo en tu versión de CONTPAQi o Aspel antes de usarlo con un cliente real. Si el orden de columnas no coincide, ajustamos la plantilla.',
      },
      {
        q: '¿Cuánto cuesta y cómo se paga?',
        a: 'Estamos en etapa de pilotos: hoy no te cobramos y no te pedimos tarjeta al registrarte. Los precios publicados ($299, $599 y $1,299 MXN / mes) son los previstos; antes de empezar a cobrar te avisaremos con antelación y publicaremos los términos y condiciones completos.',
      },
      {
        q: '¿Puedo cancelar cuando quiera?',
        a: 'Sí. No hay contratos forzosos ni costo por empleado adicional, y durante la etapa de pilotos no existe ningún cargo que cancelar.',
      },
    ],
  },
] as const;

const FOOTER_PRODUCTO = [
  { href: '#contadores', label: 'Para contadores' },
  { href: '#exportacion', label: 'CONTPAQi y Aspel' },
  { href: '#features', label: 'Funciones' },
  { href: '#precios', label: 'Precios' },
  { href: '#despachos', label: 'Programa de despachos' },
  { href: '#faq', label: 'Preguntas frecuentes' },
] as const;

/**
 * Enlaces legales.
 * · /privacidad-encargado y /terminos son públicos (docs/LANDING.md §3).
 * · /privacidad y /privacidad/arco se generan por cliente y quedan detrás del
 *   inicio de sesión, por eso no están en las rutas públicas del middleware.
 */
const FOOTER_LEGAL = [
  { href: '/privacidad-encargado', label: 'Aviso de privacidad (encargado)' },
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Aviso de privacidad de tu empresa' },
  { href: '/privacidad/arco', label: 'Solicitudes de derechos ARCO' },
] as const;

const CTA_FINAL_BULLETS = [
  'Calcula con la LFT, no con una hoja de cálculo',
  'Exporta a CONTPAQi y Aspel',
  'Sin hardware costoso ni app que instalar',
] as const;

/* ------------------------------------------------------------------ */
/* Iconos (SVG en línea: sin dependencias de cliente)                  */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string };

function IconCheck({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrowRight({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronDown({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLock({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 20v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" strokeLinecap="round" />
    </svg>
  );
}

function IconClock({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAlert({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

function IconDownload({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo({ className = 'h-9 w-9' }: IconProps) {
  return (
    <span
      className={`${className} inline-flex shrink-0 items-center justify-center rounded-lg bg-sello-600 font-mono text-sm font-bold text-white`}
    >
      Ch
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-sello-600">
      {children}
    </p>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-marfil-300 bg-marfil-100 px-3 py-1 text-xs font-medium text-tinta-600">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organizacion`,
        name: SITE_NAME,
        url: SITE_URL,
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Guadalajara',
          addressRegion: 'Jalisco',
          addressCountry: 'MX',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#sitio`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'es-MX',
        publisher: { '@id': `${SITE_URL}/#organizacion` },
      },
      {
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: 'es-MX',
        offers: PLANES.map((plan) => ({
          '@type': 'Offer',
          name: plan.nombre,
          price: plan.precio.replace(/[^0-9]/g, ''),
          priceCurrency: 'MXN',
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-marfil-50 text-tinta-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------------------------------------------------- */}
      {/* Navegación                                                  */}
      {/* ---------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-marfil-300 bg-marfil-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <a href="#inicio" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-tinta-600 lg:flex" aria-label="Principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-sello-600">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/auth/login"
              className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-tinta-700 transition hover:bg-marfil-200 sm:block"
            >
              Iniciar sesión
            </a>
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-sello-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sello-700"
            >
              Prueba gratis
              <IconArrowRight />
            </a>
          </div>
        </div>
      </header>

      <main id="inicio">
        {/* -------------------------------------------------------- */}
        {/* Hero                                                      */}
        {/* -------------------------------------------------------- */}
        <section className="border-b border-marfil-300 bg-gradient-to-b from-marfil-100 to-marfil-50">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
            <div>
              <Eyebrow>Hecho para contadores y personal administrativo</Eyebrow>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
                Deja de capturar la nómina.{' '}
                <span className="text-sello-600">Descarga la póliza ya hecha.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-tinta-600">
                Chekdor registra la asistencia por NFC y hace el trabajo que hoy te quita horas:
                calcula el tiempo extraordinario conforme a la LFT, retiene ISR y cuotas del IMSS, y
                genera el archivo y la póliza contable que importas en{' '}
                <strong className="font-semibold text-tinta-900">CONTPAQi o Aspel</strong>. Sin
                captura manual y sin fórmulas en Excel.
              </p>
              <p className="mt-4 leading-relaxed text-tinta-600">
                Un despacho que lleva 15 clientes dedica{' '}
                <strong className="font-semibold text-tinta-900">2 a 4 horas por cliente</strong> al
                mes a capturar y cuadrar la nómina. Con la exportación directa, ese trabajo baja a{' '}
                <strong className="font-semibold text-tinta-900">minutos</strong>.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-sello-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-sello-700"
                >
                  Prueba 14 días gratis
                  <IconArrowRight />
                </a>
                <a
                  href="#exportacion"
                  className="inline-flex items-center gap-2 rounded-xl border border-tinta-200 bg-white px-6 py-3 font-semibold text-tinta-800 transition hover:border-tinta-300 hover:bg-marfil-100"
                >
                  Ver los archivos que genera
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {HERO_BULLETS.map((bullet) => (
                  <li key={bullet}>
                    <Pill>
                      <IconCheck className="h-3.5 w-3.5 text-documento-600" />
                      {bullet}
                    </Pill>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recibo calculado */}
            <div className="rounded-2xl border border-marfil-300 bg-white p-5 shadow-lg shadow-tinta-900/5">
              <div className="flex items-center justify-between border-b border-marfil-200 pb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-tinta-500">
                  Recibo calculado
                </span>
                <span className="rounded-full bg-marfil-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-tinta-600">
                  Quincenal
                </span>
              </div>

              <div className="pt-4">
                <p className="font-semibold">Juan Pérez López</p>
                <p className="mt-0.5 font-mono text-[11px] text-tinta-500">
                  PELJ850101ABC · NSS 12345678901 · SBC $629.58
                </p>
              </div>

              <dl className="mt-4 space-y-1.5 text-sm">
                {RECIBO_LINEAS.map((linea) => (
                  <div key={linea.concepto} className="flex items-center justify-between">
                    <dt className="text-tinta-600">{linea.concepto}</dt>
                    <dd className="font-mono tabular-nums text-tinta-900">
                      {linea.signo}
                      {linea.importe}
                    </dd>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-tinta-100 pt-2.5">
                  <dt className="font-semibold">Neto a pagar</dt>
                  <dd className="font-mono text-lg font-bold tabular-nums text-documento-700">
                    $8,899.51
                  </dd>
                </div>
              </dl>

              <p className="mt-3 rounded-xl bg-marfil-100 px-3 py-2 text-xs text-tinta-600">
                Costo para la empresa{' '}
                <strong className="font-mono font-semibold text-tinta-900">$11,101.19</strong> con
                cuotas patronales
              </p>

              <div className="mt-4 border-t border-marfil-200 pt-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-tinta-500">
                  Listo para importar
                </span>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {FORMATOS_RECIBO.map((formato) => (
                    <li
                      key={formato}
                      className="rounded-lg border border-marfil-300 bg-marfil-50 px-2 py-1 font-mono text-[10px] text-tinta-600"
                    >
                      {formato}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-3 flex items-center gap-2 text-xs text-tinta-500">
                <IconClock className="h-3.5 w-3.5" />
                Marcajes del día{' '}
                <strong className="font-mono font-semibold text-tinta-900">14/15</strong> con jornada
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* El problema                                               */}
        {/* -------------------------------------------------------- */}
        <section id="problema" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Eyebrow>El problema</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            El cuello de botella no es el cálculo. Es la captura.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
            El cálculo de la nómina es tu especialidad; ya sabes hacerlo. Lo que te desgasta es el
            camino entre el marcaje del empleado y el dato dentro de tu sistema. Ahí es donde se van
            las horas y donde se cuelan los errores.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMAS.map((problema) => (
              <article
                key={problema.titulo}
                className="rounded-2xl border border-marfil-300 bg-white p-5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-error-50 text-error-600">
                  <IconAlert className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-3 font-semibold">{problema.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-600">{problema.cuerpo}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-2xl border border-laton-200 bg-laton-50 p-5 text-sm leading-relaxed text-tinta-700">
            Una PyME mexicana pierde entre{' '}
            <strong className="font-semibold">$3,000 y $8,000 pesos mensuales</strong> por cada 10
            empleados en problemas de control horario. Ese costo lo termina pagando el patrón, pero
            el trabajo de descubrirlo y arreglarlo recae en el área contable y administrativa.
          </p>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Funciones                                                */}
        {/* -------------------------------------------------------- */}
        <section id="features" className="border-y border-marfil-300 bg-marfil-100">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <Eyebrow>Funciones</Eyebrow>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Lo que tu área contable necesita, en orden
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
              Primero el cálculo y la exportación, que es donde se va el tiempo. Después el resto:
              registro, cumplimiento y reportes.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {FUNCIONES_NUCLEO.map((funcion) => (
                <article
                  key={funcion.titulo}
                  className="rounded-2xl border border-sello-200 bg-white p-6 shadow-sm"
                >
                  <span className="rounded-full bg-sello-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-sello-700">
                    Núcleo
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{funcion.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-tinta-600">{funcion.cuerpo}</p>
                </article>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FUNCIONES_RESTO.map((funcion) => (
                <article
                  key={funcion.titulo}
                  className="rounded-2xl border border-marfil-300 bg-white p-5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-documento-50 text-documento-600">
                    <IconCheck className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 font-semibold">{funcion.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-tinta-600">{funcion.cuerpo}</p>
                </article>
              ))}
            </div>

            <article className="mt-6 rounded-2xl border border-dashed border-tinta-300 bg-white p-6">
              <span className="rounded-full bg-tinta-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-tinta-600">
                En camino
              </span>
              <h3 className="mt-3 text-lg font-bold">{FUNCION_EN_CAMINO.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-600">
                {FUNCION_EN_CAMINO.cuerpo}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-tinta-500">
                {FUNCION_EN_CAMINO.nota}
              </p>
            </article>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Para contadores                                           */}
        {/* -------------------------------------------------------- */}
        <section id="contadores" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Eyebrow>Para el área contable y administrativa</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Tú no deberías ser el capturista de nadie
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
            Chekdor no es un checador con un reporte bonito. Es la pieza que elimina la captura
            entre el patrón y tu sistema contable.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {DOLORES_CONTADOR.map((dolor) => (
              <article
                key={dolor.titulo}
                className="rounded-2xl border border-marfil-300 bg-white p-5"
              >
                <h3 className="font-semibold">{dolor.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-600">{dolor.cuerpo}</p>
              </article>
            ))}
          </div>

          {/* Cómo cambia tu mes */}
          <h3 className="mt-16 text-2xl font-bold tracking-tight">Cómo cambia tu mes</h3>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS_MES.map((paso, indice) => (
              <li key={paso.titulo} className="rounded-2xl border border-marfil-300 bg-white p-5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sello-600 font-mono text-sm font-bold text-white">
                  {indice + 1}
                </span>
                <h4 className="mt-3 font-semibold">{paso.titulo}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-600">{paso.cuerpo}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Cómo funciona                                             */}
        {/* -------------------------------------------------------- */}
        <section id="como-funciona" className="border-y border-marfil-300 bg-marfil-100">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <Eyebrow>Cómo funciona</Eyebrow>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Dos rutinas: la puesta en marcha y el cierre
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
              La primera se hace una vez por cliente. La segunda es la que repites cada periodo, y es
              la que se vuelve corta.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-marfil-300 bg-white p-6">
                <span className="rounded-full bg-tinta-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-tinta-600">
                  Una sola vez
                </span>
                <h3 className="mt-3 text-lg font-bold">Puesta en marcha de un cliente</h3>
                <ol className="mt-5 space-y-4">
                  {PUESTA_EN_MARCHA.map((paso, indice) => (
                    <li key={paso.titulo} className="flex gap-3">
                      <span className="mt-0.5 font-mono text-xs font-bold text-sello-600">
                        {String(indice + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold">{paso.titulo}</h4>
                        <p className="mt-0.5 text-sm leading-relaxed text-tinta-600">
                          {paso.cuerpo}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-sello-200 bg-white p-6 shadow-sm">
                <span className="rounded-full bg-sello-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-sello-700">
                  Cada periodo
                </span>
                <h3 className="mt-3 text-lg font-bold">El cierre que repites con cada cliente</h3>
                <ol className="mt-5 space-y-4">
                  {CIERRE_PERIODO.map((paso, indice) => (
                    <li key={paso.titulo} className="flex gap-3">
                      <span className="mt-0.5 font-mono text-xs font-bold text-sello-600">
                        {String(indice + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold">{paso.titulo}</h4>
                        <p className="mt-0.5 text-sm leading-relaxed text-tinta-600">
                          {paso.cuerpo}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-marfil-300 bg-white p-5">
                <h4 className="font-semibold">El archivo llega listo, no en bruto</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-600">
                  La nómina se calcula en el sistema y baja con el layout que tu CONTPAQi o tu Aspel
                  espera. Tú importas y revisas; no capturas.
                </p>
              </div>
              <div className="rounded-2xl border border-marfil-300 bg-white p-5">
                <h4 className="font-semibold">El cálculo es auditable, no una caja negra</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-600">
                  Cada recibo guarda la fórmula aplicada, el renglón de la tarifa que se usó, la
                  exención y la cuota. Puedes reproducir el número a mano para defenderlo.
                </p>
              </div>
              <div className="rounded-2xl border border-marfil-300 bg-white p-5">
                <h4 className="font-semibold">Un solo lugar para todos tus clientes</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta-600">
                  Entras, eliges el cliente, eliges el periodo y descargas. La misma mecánica para el
                  restaurante de 8 empleados y la constructora de 80.
                </p>
              </div>
            </div>

            {/* Comparativa de tiempo */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-error-100 bg-error-50 p-5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-error-600">
                  Captura y cálculo manual
                </span>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-error-600">
                  2 a 4 h
                </p>
                <p className="mt-2 text-sm text-tinta-600">
                  leer asistencia · calcular extras · capturar en CONTPAQi · generar póliza
                </p>
              </div>
              <div className="rounded-2xl border border-documento-100 bg-documento-50 p-5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-documento-700">
                  Con Chekdor
                </span>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-documento-700">
                  ≈ 15 min
                </p>
                <p className="mt-2 text-sm text-tinta-600">
                  elegir periodo · revisar incidencias · descargar e importar
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-tinta-500">
              El rango de 2 a 4 horas es el que reportan los despachos para un cliente de 10 a 30
              empleados con captura manual desde un archivo de asistencia. Lo medimos contigo en la
              prueba: si tu caso es distinto, queremos saberlo.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* La póliza                                                 */}
        {/* -------------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Eyebrow>La póliza</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            La póliza sale cuadrada. Sin armarla en Excel.
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
            Cada concepto del recibo cae en su cuenta contable, con la clave que configuraste. La
            póliza que ves abajo la generó el motor de Chekdor para un trabajador real: no es una
            ilustración.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-marfil-300 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-marfil-200 bg-marfil-50 px-5 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Diario
                </span>
                <span className="text-sm text-tinta-500">
                  Provisión de nómina · póliza 1 · 2026-10-16
                </span>
              </div>
              <span className="rounded-full bg-documento-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-documento-800">
                Cuadra
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-marfil-200 font-mono text-[11px] uppercase tracking-wider text-tinta-500">
                    <th className="px-5 py-2.5 font-semibold">#</th>
                    <th className="px-3 py-2.5 font-semibold">Cuenta</th>
                    <th className="px-3 py-2.5 font-semibold">Concepto</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Debe</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Haber</th>
                  </tr>
                </thead>
                <tbody>
                  {POLIZA_MOVIMIENTOS.map((movimiento, indice) => (
                    <tr key={movimiento.cuenta} className="border-b border-marfil-100">
                      <td className="px-5 py-2.5 font-mono text-xs text-tinta-500">{indice + 1}</td>
                      <td className="px-3 py-2.5">
                        <span className="font-mono font-semibold">{movimiento.cuenta}</span>
                        <span className="ml-2 font-mono text-[11px] text-tinta-400">
                          {movimiento.clave}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-tinta-700">{movimiento.concepto}</td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                        {movimiento.debe}
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono tabular-nums">
                        {movimiento.haber}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-marfil-50 font-semibold">
                    <td className="px-5 py-3" />
                    <td className="px-3 py-3" />
                    <td className="px-3 py-3 font-mono text-xs uppercase tracking-wider text-tinta-500">
                      Totales
                    </td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums text-documento-700">
                      10,200.00
                    </td>
                    <td className="px-5 py-3 text-right font-mono tabular-nums text-documento-700">
                      10,200.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Desglose del ISR */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-marfil-300 bg-white p-6">
              <h3 className="font-semibold">Cómo se llegó al ISR de $1,117.82</h3>
              <dl className="mt-4 space-y-2 text-sm">
                {DESGLOSE_ISR.map((linea, indice) => (
                  <div
                    key={linea.concepto}
                    className={`flex items-center justify-between ${
                      indice === DESGLOSE_ISR.length - 1
                        ? 'border-t border-tinta-100 pt-2 font-semibold'
                        : ''
                    }`}
                  >
                    <dt className={indice === DESGLOSE_ISR.length - 1 ? '' : 'text-tinta-600'}>
                      {linea.concepto}
                    </dt>
                    <dd className="font-mono tabular-nums">{linea.valor}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-tinta-500">
                Subsidio al empleo aplicado: $0.00. Con un salario menor, el subsidio supera al
                impuesto y el patrón debe entregar la diferencia al trabajador (Art. 97 LISR).
              </p>
            </div>

            <div className="rounded-2xl border border-marfil-300 bg-white p-6">
              <h3 className="font-semibold">Bases de cotización</h3>
              <p className="mt-3 text-sm leading-relaxed text-tinta-600">
                SBC $629.58 · 15 días pagados · 6 h extra dobles · 2 domingos. El salario base de
                cotización integra la parte proporcional del aguinaldo, la prima vacacional y la
                prima dominical (Art. 27 LSS).
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-marfil-100 p-4">
                  <dt className="text-xs text-tinta-500">Percepciones</dt>
                  <dd className="mt-1 font-mono font-semibold tabular-nums">$10,200.00</dd>
                  <p className="mt-1 text-[11px] text-tinta-500">
                    Gravado 9,523.72 · exento 676.28
                  </p>
                </div>
                <div className="rounded-xl bg-marfil-100 p-4">
                  <dt className="text-xs text-tinta-500">Neto a pagar</dt>
                  <dd className="mt-1 font-mono font-semibold tabular-nums">$8,899.51</dd>
                  <p className="mt-1 text-[11px] text-tinta-500">
                    Después de 1,300.49 de deducciones
                  </p>
                </div>
                <div className="col-span-2 rounded-xl bg-marfil-100 p-4">
                  <dt className="text-xs text-tinta-500">Costo para la empresa</dt>
                  <dd className="mt-1 font-mono font-semibold tabular-nums">$11,101.19</dd>
                  <p className="mt-1 text-[11px] text-tinta-500">
                    Con 2,201.68 de cuotas patronales
                  </p>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Exportación contable                                      */}
        {/* -------------------------------------------------------- */}
        <section id="exportacion" className="border-y border-marfil-300 bg-marfil-100">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <Eyebrow>Exportación contable</Eyebrow>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Archivos que ya sabes importar
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
              Nada de reportes en PDF que luego hay que transcribir. Lo que bajas es el archivo de
              importación, y la póliza viene cuadrada.
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              {/* Ejemplo de archivo */}
              <div className="overflow-hidden rounded-2xl border border-tinta-800 bg-tinta-900 text-tinta-50">
                <div className="flex items-center justify-between border-b border-tinta-800 px-5 py-3">
                  <span className="font-mono text-xs font-semibold text-tinta-100">
                    poliza-contpaqi.txt
                  </span>
                  <span className="font-mono text-[11px] text-tinta-400">334 bytes · 6 líneas</span>
                </div>
                <div className="space-y-3 px-5 py-4">
                  <dl className="grid grid-cols-3 gap-3 font-mono text-[11px]">
                    <div>
                      <dt className="text-tinta-500">Separador</dt>
                      <dd className="text-tinta-50">|</dd>
                    </div>
                    <div>
                      <dt className="text-tinta-500">Codificación</dt>
                      <dd className="text-tinta-50">UTF-8-BOM</dd>
                    </div>
                    <div>
                      <dt className="text-tinta-500">Encabezado</dt>
                      <dd className="text-tinta-50">no</dd>
                    </div>
                  </dl>
                  <pre className="overflow-x-auto text-[11px] leading-relaxed">
                    <code>
                      {POLIZA_TXT.map((linea, indice) => (
                        <span key={linea} className="block">
                          <span className="mr-2 inline-block w-3 select-none text-tinta-600">
                            {indice + 1}
                          </span>
                          {linea}
                        </span>
                      ))}
                    </code>
                  </pre>
                </div>
                <p className="border-t border-tinta-800 px-5 py-3 text-[11px] text-tinta-400">
                  Generado por el motor de Chekdor. Los importes corresponden al recibo de ejemplo de
                  esta página.
                </p>
              </div>

              {/* Formatos */}
              <div className="grid gap-4 sm:grid-cols-2">
                {FORMATOS_EXPORTACION.map((formato) => (
                  <article
                    key={formato.nombre}
                    className="rounded-2xl border border-marfil-300 bg-white p-5"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-documento-50 text-documento-600">
                      <IconDownload className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3 font-semibold">{formato.nombre}</h3>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-sello-600">
                      {formato.formato}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-tinta-600">{formato.cuerpo}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-laton-200 bg-laton-50 p-6">
              <h3 className="font-semibold">Valida la primera importación con nosotros</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-700">
                Los layouts de CONTPAQi y Aspel cambian entre versiones (2020, 2022, 2024) y según
                cómo esté configurado cada despacho. Antes de que lo uses con un cliente real,
                descarga un periodo de prueba e impórtalo. Si el orden de las columnas no coincide
                con tu versión, ajustamos la plantilla y te avisamos: no tienes que capturar nada a
                mano mientras tanto.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-marfil-300 bg-white p-6">
              <h3 className="font-semibold">Tus cuentas, tu catálogo</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-600">
                Chekdor no impone un catálogo de cuentas. Tú mapeas cada concepto (sueldos, tiempo
                extraordinario, prima dominical, ISR por pagar, IMSS obrero…) a las cuentas de tu
                sistema, una sola vez por empresa. Y si algo no está configurado, el sistema{' '}
                <strong className="font-semibold text-tinta-900">no genera el archivo</strong>: te
                dice qué falta en lugar de entregarte una póliza descuadrada.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Precios                                                   */}
        {/* -------------------------------------------------------- */}
        <section id="precios" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Eyebrow>Precios</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Un costo fijo que cabe en el presupuesto del cliente
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
            Sin costo por empleado adicional y sin contratos forzosos. Todos los planes incluyen 14
            días de prueba.
          </p>

          <p className="mt-6 max-w-3xl rounded-2xl border border-documento-100 bg-documento-50 p-5 text-sm leading-relaxed text-tinta-700">
            <strong className="font-semibold text-documento-800">
              Estamos en etapa de pilotos: hoy no te cobramos.
            </strong>{' '}
            Los precios de abajo son los que tenemos previstos, pero el cobro todavía no está
            habilitado y no te pedimos tarjeta al registrarte. Mientras trabajemos juntos en la
            validación, el uso es gratuito. Antes de empezar a cobrar te avisaremos con antelación y
            publicaremos los términos y condiciones completos. No vas a recibir un cargo sorpresa.
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {PLANES.map((plan) => (
              <article
                key={plan.nombre}
                className={`flex flex-col rounded-2xl border bg-white p-6 ${
                  plan.destacado
                    ? 'border-sello-400 shadow-lg shadow-sello-600/10'
                    : 'border-marfil-300'
                }`}
              >
                {plan.destacado ? (
                  <span className="mb-3 inline-flex w-fit items-center rounded-full bg-sello-600 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-white">
                    ⭐ El que eligen los contadores
                  </span>
                ) : (
                  <span className="mb-3 font-mono text-[11px] uppercase tracking-wider text-tinta-400">
                    &nbsp;
                  </span>
                )}

                <h3 className="text-xl font-bold">{plan.nombre}</h3>
                <p className="mt-1 text-sm leading-relaxed text-tinta-600">{plan.publico}</p>

                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-bold tabular-nums">{plan.precio}</span>
                  <span className="text-sm text-tinta-500">MXN / mes</span>
                </p>
                <p className="mt-1 text-sm font-semibold text-sello-600">{plan.empleados}</p>

                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {plan.beneficios.map((beneficio) => (
                    <li key={beneficio} className="flex gap-2.5">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-documento-600" />
                      <span className="text-tinta-700">{beneficio}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/auth/signup"
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                    plan.destacado
                      ? 'bg-sello-600 text-white hover:bg-sello-700'
                      : 'border border-tinta-200 bg-marfil-50 text-tinta-800 hover:bg-marfil-100'
                  }`}
                >
                  Empezar gratis
                </a>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-marfil-300 bg-white p-6">
              <h3 className="font-semibold">¿Eres contador o despacho?</h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-600">
                El plan Despacho no lo pagas tú: es tu herramienta de trabajo mientras tus clientes
                pagan su suscripción, y además ganas comisión por cada uno que traigas.
              </p>
              <a
                href="#despachos"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sello-600 hover:text-sello-700"
              >
                Ver el programa de despachos
                <IconArrowRight />
              </a>
            </div>
            <div className="rounded-2xl border border-marfil-300 bg-white p-6">
              <h3 className="font-semibold">
                ¿Más de 100 empleados o un caso especial (obra, destajo, jornaleros)?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-tinta-600">
                Cotizamos a tu medida. Escríbenos a{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-sello-600 hover:text-sello-700"
                >
                  {CONTACT_EMAIL}
                </a>{' '}
                y lo revisamos con tu caso concreto.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Programa de despachos                                     */}
        {/* -------------------------------------------------------- */}
        <section id="despachos" className="border-y border-marfil-300 bg-tinta-900 text-tinta-50">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-laton-300">
              Programa para despachos contables
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              Si tú lo recomiendas, tú ganas
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-200">
              Nuestro mejor canal de venta no son los anuncios: son los contadores. Tú ya tienes la
              confianza del dueño de la PyME y ya conoces su nómina. Nosotros te quitamos el trabajo
              de captura y te pagamos por traerlo.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {BENEFICIOS_DESPACHO.map((beneficio) => (
                <article
                  key={beneficio.titulo}
                  className="rounded-2xl border border-tinta-800 bg-tinta-800/60 p-5"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-laton-400/15 text-laton-300">
                    <IconUsers className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 font-semibold text-white">{beneficio.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-tinta-200">
                    {beneficio.cuerpo}
                  </p>
                </article>
              ))}
            </div>

            {/* El caso típico */}
            <div className="mt-10 rounded-2xl border border-tinta-800 bg-tinta-950/60 p-6">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-laton-300">
                El caso típico
              </span>
              <h3 className="mt-3 text-xl font-bold text-white">
                Un despacho con 15 clientes PyME
              </h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-3xl font-bold tabular-nums text-laton-300">10</p>
                  <p className="mt-2 text-sm leading-relaxed text-tinta-200">
                    de tus clientes no tienen un control de asistencia formal: libreta, Excel o un
                    checador de huella que se presta entre compañeros.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-bold text-laton-300">×</p>
                  <p className="mt-2 text-sm leading-relaxed text-tinta-200">
                    Chekdor hace el cálculo y entrega el{' '}
                    <strong className="font-semibold text-white">archivo de importación</strong>. Tú
                    revisas, importas y firmas.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-bold text-laton-300">$</p>
                  <p className="mt-2 text-sm leading-relaxed text-tinta-200">
                    Cada cliente que pasa a un plan de pago deja{' '}
                    <strong className="font-semibold text-white">comisión para ti</strong>, mes con
                    mes durante el primer año.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-tinta-800 pt-5">
                <span className="font-mono text-xs uppercase tracking-wider text-tinta-400">
                  El tiempo que recuperas
                </span>
                <span className="font-mono text-sm text-tinta-200">
                  Hoy, por cliente: <strong className="text-white">2–4 h</strong>
                </span>
                <span className="text-tinta-500">→</span>
                <span className="font-mono text-sm text-tinta-200">
                  Con Chekdor: <strong className="text-white">minutos</strong>
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-tinta-300">
                Multiplicado por 10 clientes, son entre 20 y 40 horas al mes que puedes dedicar a
                trabajo que sí facturas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-laton-400 px-5 py-3 font-semibold text-tinta-950 transition hover:bg-laton-300"
                >
                  Quiero el programa de despachos
                  <IconArrowRight />
                </a>
                <a
                  href="#precios"
                  className="inline-flex items-center gap-2 rounded-xl border border-tinta-700 px-5 py-3 font-semibold text-tinta-100 transition hover:bg-tinta-800"
                >
                  Probar el sistema primero
                </a>
              </div>
              <p className="mt-4 text-sm text-tinta-300">
                ¿Dudas del programa? Escríbenos a{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL_CONTADORES}?subject=Programa%20de%20despachos`}
                  className="font-semibold text-laton-300 underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAIL_CONTADORES}
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Casos de uso                                              */}
        {/* -------------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <Eyebrow>Casos de uso</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Cómo se ve el mes cuando la captura desaparece
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-tinta-600">
            Tres perfiles que viven el mismo problema desde lugares distintos.
          </p>

          <p className="mt-6 rounded-2xl border border-laton-200 bg-laton-50 p-5 text-sm leading-relaxed text-tinta-700">
            <strong className="font-semibold">Nota de transparencia:</strong> Chekdor está en etapa
            de pilotos. Los siguientes son escenarios representativos, no testimonios de clientes
            verificados. Cuando tengamos clientes en producción, publicaremos sus casos con nombre y
            apellido, con su autorización.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {CASOS.map((caso) => (
              <figure
                key={caso.iniciales}
                className="flex flex-col rounded-2xl border border-marfil-300 bg-white p-6"
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-tinta-700">
                  “{caso.cita}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-marfil-200 pt-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marfil-200 font-mono text-sm font-bold text-tinta-700">
                    {caso.iniciales}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold">{caso.cargo}</span>
                    <span className="block text-xs text-tinta-500">{caso.contexto}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Preguntas frecuentes                                      */}
        {/* -------------------------------------------------------- */}
        <section id="faq" className="border-y border-marfil-300 bg-marfil-100">
          <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Lo que preguntan antes de proponerlo
            </h2>

            <div className="mt-10 space-y-8">
              {FAQ.map((grupo) => (
                <div key={grupo.grupo}>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-tinta-500">
                    {grupo.grupo}
                  </h3>
                  <div className="mt-3 space-y-2">
                    {grupo.preguntas.map((item) => (
                      <details
                        key={item.q}
                        className="group rounded-2xl border border-marfil-300 bg-white px-5 py-4"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                          <span>{item.q}</span>
                          <IconChevronDown className="h-5 w-5 shrink-0 text-tinta-400 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-tinta-600">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-tinta-600">
              ¿No encuentras lo que buscas?{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-sello-600 hover:text-sello-700"
              >
                Escríbenos
              </a>
              .
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* CTA final                                                 */}
        {/* -------------------------------------------------------- */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="rounded-2xl border border-marfil-300 bg-white p-8 sm:p-12">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Prueba el cierre de un cliente esta semana
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-tinta-600">
              Crea la cuenta, da de alta dos o tres empleados de prueba, calcula un periodo y baja
              los archivos. Si tu versión de CONTPAQi o Aspel pide otro orden de columnas, nos lo
              dices y lo ajustamos.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-sello-600 px-6 py-3 font-semibold text-white transition hover:bg-sello-700"
              >
                Crear cuenta gratis
                <IconArrowRight />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Demo%20de%2015%20minutos`}
                className="inline-flex items-center gap-2 rounded-xl border border-tinta-200 bg-marfil-50 px-6 py-3 font-semibold text-tinta-800 transition hover:bg-marfil-100"
              >
                Agendar una demo de 15 min
              </a>
            </div>

            <ul className="mt-8 grid gap-3 border-t border-marfil-200 pt-6 sm:grid-cols-3">
              {CTA_FINAL_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-sm text-tinta-700">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-documento-600" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/* Pie de página                                               */}
      {/* ---------------------------------------------------------- */}
      <footer className="border-t border-marfil-300 bg-marfil-100">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Logo className="h-8 w-8" />
                <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-tinta-600">
                Control horario por NFC con cálculo de nómina y exportación contable para CONTPAQi y
                Aspel. Para el personal contable y administrativo de las PyMEs mexicanas.
              </p>
              <ul className="mt-5 space-y-1.5 text-sm text-tinta-600">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="transition hover:text-sello-600"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="transition hover:text-sello-600">
                    {CONTACT_PHONE}
                  </a>
                </li>
                <li className="text-tinta-500">{CONTACT_LOCATION}</li>
              </ul>
            </div>

            <nav aria-label="Producto">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-tinta-500">
                Producto
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {FOOTER_PRODUCTO.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-tinta-600 transition hover:text-sello-600">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Privacidad y cumplimiento">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-tinta-500">
                Privacidad y cumplimiento
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {FOOTER_LEGAL.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-tinta-600 transition hover:text-sello-600">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-tinta-500">
                Chekdor actúa como encargado del tratamiento conforme a la LFPDPPP: los datos son de
                tu empresa y nosotros los tratamos por su cuenta. Para reportes de titulares y
                solicitudes de derechos ARCO:{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL_PRIVACIDAD}`}
                  className="font-semibold text-sello-600 hover:text-sello-700"
                >
                  {CONTACT_EMAIL_PRIVACIDAD}
                </a>
                .
              </p>
            </nav>
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-marfil-300 bg-white p-5">
            <IconLock className="mt-0.5 h-5 w-5 shrink-0 text-tinta-400" />
            <p className="text-xs leading-relaxed text-tinta-600">
              <strong className="font-semibold text-tinta-900">Sobre los cálculos fiscales:</strong>{' '}
              Chekdor aplica las tasas de ISR, las cuotas del IMSS y los parámetros del subsidio al
              empleo cargados para cada ejercicio fiscal, partiendo de las fuentes oficiales
              publicadas. La validación de los valores vigentes y del resultado final antes de
              timbrar cualquier nómina corresponde al contador responsable. El sistema muestra en
              pantalla cuándo está usando un valor de respaldo y no el cargado en la base de datos.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-marfil-300 pt-6 text-xs text-tinta-500 sm:flex-row sm:items-center">
            <p>© 2026 {SITE_NAME}. Todos los derechos reservados.</p>
            <p>
              Hecho con ❤️ en México ·{' '}
              <a href={SITE_URL} className="font-mono transition hover:text-sello-600">
                {SITE_DOMAIN}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
