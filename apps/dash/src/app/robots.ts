import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';

/**
 * robots.txt generado por Next.
 * Dominio canónico: https://chekdor.com.mx (ver src/lib/site.ts).
 *
 * Ojo: el middleware de la app intercepta todas las rutas, así que estas rutas
 * están declaradas como públicas ahí; si no, el rastreador recibiría un redirect
 * a /auth/login.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/empresas',
          '/trabajadores',
          '/asistencia',
          '/nomina',
          '/contabilidad',
          '/configuracion',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
