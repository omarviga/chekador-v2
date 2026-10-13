import React from 'react';
import type { Metadata } from 'next';
import AuthForm from '../../../components/AuthForm';

/**
 * Página de registro: es el destino de los CTA de la landing
 * ("Prueba gratis", "Empezar gratis", "Crear cuenta gratis").
 *
 * El alta se ejecuta contra POST /api/auth/signup (ver api/auth/signup/route.ts).
 */
export const metadata: Metadata = {
  title: 'Crear cuenta de despacho',
  description:
    'Crea tu cuenta de despacho contable en Chekdor y prueba 14 días gratis, sin tarjeta de crédito.',
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <AuthForm modoInicial="registro" />;
}
