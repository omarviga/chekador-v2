import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';

/**
 * sitemap.xml generado por Next.
 * Dominio canónico: https://chekdor.com.mx (ver src/lib/site.ts).
 *
 * Solo se listan rutas que existen de verdad. Cuando se publiquen las páginas
 * legales (/privacidad, /terminos) hay que agregarlas aquí.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
