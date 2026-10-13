import React from 'react';
import type { Metadata, Viewport } from 'next';
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  absoluteUrl,
} from '../lib/site';
import './globals.css';

/**
 * Dominio canónico: https://chekdor.com.mx (SITE_URL, ver src/lib/site.ts).
 * metadataBase hace que canonical, og:url y las URLs de imágenes sean
 * absolutas sobre el dominio correcto.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: SITE_KEYWORDS,
  category: 'business',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_MX',
    url: absoluteUrl('/'),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#14171f',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Geist+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-marfil-50 font-sans text-tinta-900 antialiased">
        {children}
      </body>
    </html>
  );
}
