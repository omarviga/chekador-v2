/**
 * Configuración del sitio — fuente única de verdad del dominio.
 *
 * Dominio de marca verificado: chekdor.com.mx
 *   · DNS en Cloudflare, servido por Vercel (www.chekdor.com.mx → vercel-dns).
 *   · chekador.com.mx NO es nuestro: pertenece a un tercero (NS cfdimail.com.mx).
 *     No debe usarse en ningún canonical, og:url, sitemap ni enlace.
 *
 * El prefijo www se controla por entorno para poder alinear el canonical con
 * el redirect real del dominio sin tocar código:
 *   NEXT_PUBLIC_SITE_URL=https://www.chekdor.com.mx
 */

export const SITE_DOMAIN = 'chekdor.com.mx';

/** URL canónica sin barra final. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? `https://${SITE_DOMAIN}`;

export const SITE_NAME = 'Chekdor';

export const SITE_TITLE =
  'Chekdor — Control horario NFC con nómina y pólizas para CONTPAQi y Aspel';

export const SITE_DESCRIPTION =
  'Registra la asistencia por NFC, calcula la nómina conforme a la LFT (ISR, IMSS, SAR e INFONAVIT) y descarga el archivo y la póliza contable que importas en CONTPAQi o Aspel. Para contadores y personal administrativo de PyMEs mexicanas.';

export const SITE_KEYWORDS = [
  'chekdor',
  'checador',
  'control horario',
  'checador NFC',
  'control de asistencia',
  'nómina',
  'cálculo de nómina',
  'pólizas contables',
  'CONTPAQi',
  'Aspel NOI',
  'Aspel COI',
  'exportar nómina CONTPAQi',
  'contadores',
  'despacho contable',
  'PyME México',
  'LFT',
  'LFPDPPP',
  'NOM-035',
  'ISR',
  'IMSS',
];

export const CONTACT_EMAIL = 'hola@chekdor.com.mx';
/** Recibe las solicitudes del programa de despachos (docs/LANDING.md §2). */
export const CONTACT_EMAIL_CONTADORES = 'contadores@chekdor.com.mx';
/** Recibe reportes de titulares y solicitudes de derechos ARCO (docs/legal/README.md §3). */
export const CONTACT_EMAIL_PRIVACIDAD = 'privacidad@chekdor.com.mx';
export const CONTACT_PHONE = '+52 33 1234 5678';
export const CONTACT_LOCATION = 'Guadalajara, Jalisco, México';

/** Convierte una ruta relativa en URL absoluta sobre el dominio canónico. */
export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
