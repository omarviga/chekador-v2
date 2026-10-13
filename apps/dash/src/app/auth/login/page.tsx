import React from 'react';
import type { Metadata } from 'next';
import AuthForm from '../../../components/AuthForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Acceso al despacho contable en Chekdor.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthForm modoInicial="login" />;
}
