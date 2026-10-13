'use client';

import React, { useState } from 'react';
import { createClient } from '../lib/supabase/client';

/**
 * Formulario de acceso compartido.
 *
 * Se usa desde dos rutas:
 *   /auth/login   → abre en la pestaña "Iniciar Sesión"
 *   /auth/signup  → abre en la pestaña "Registrar Despacho" (destino de los CTA
 *                   de la landing)
 *
 * El alta de despacho se delega al route handler POST /api/auth/signup, que es
 * donde vive la creación del despacho por trigger en Postgres.
 */
export default function AuthForm({
  modoInicial = 'login',
}: {
  modoInicial?: 'login' | 'registro';
}) {
  const [isSignUp, setIsSignUp] = useState(modoInicial === 'registro');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [despachoNombre, setDespachoNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (isSignUp) {
        // Registro con creación automática de despacho mediante trigger en Supabase
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            despacho_nombre: despachoNombre || `Despacho ${email.split('@')[0]}`,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrarse');

        setMessage('Cuenta creada con éxito. Despacho inicializado por trigger. Iniciando sesión...');
        // Iniciar sesión
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        window.location.href = '/dashboard';
      } else {
        // Login con email + password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error durante la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-tinta-900 p-4 text-tinta-50">
      <div className="w-full max-w-md rounded-xl border border-tinta-700 bg-tinta-800 p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sello-600 font-mono font-bold text-white">
            Ch
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-white">Chekdor v2.0</h1>
            <p className="font-mono text-xs text-tinta-300">
              Autenticación Despacho · Supabase RLS
            </p>
          </div>
        </div>

        <div className="mb-6 flex border-b border-tinta-700">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 border-b-2 py-2 text-sm font-medium transition-colors ${
              !isSignUp ? 'border-sello-500 text-white' : 'border-transparent text-tinta-400'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 border-b-2 py-2 text-sm font-medium transition-colors ${
              isSignUp ? 'border-sello-500 text-white' : 'border-transparent text-tinta-400'
            }`}
          >
            Registrar Despacho
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded border border-error-500/60 bg-error-600/20 p-3 font-mono text-xs text-error-100">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded border border-documento-500/60 bg-documento-800/40 p-3 font-mono text-xs text-documento-100">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="mb-1 block font-mono text-xs text-tinta-200">
                Nombre del Despacho Contable
              </label>
              <input
                type="text"
                required
                value={despachoNombre}
                onChange={(e) => setDespachoNombre(e.target.value)}
                placeholder="Ej. Sánchez & Asociados S.C."
                className="w-full rounded border border-tinta-700 bg-tinta-900 px-3 py-2 text-sm text-white focus:border-sello-500 focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-tinta-300">
                * El trigger en Postgres creará el despacho asignando el rol de titular `contador`.
              </span>
            </div>
          )}

          <div>
            <label className="mb-1 block font-mono text-xs text-tinta-200">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contador@despacho.com.mx"
              className="w-full rounded border border-tinta-700 bg-tinta-900 px-3 py-2 text-sm text-white focus:border-sello-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-tinta-200">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded border border-tinta-700 bg-tinta-900 px-3 py-2 text-sm text-white focus:border-sello-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-sello-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sello-700 disabled:opacity-50"
          >
            {loading
              ? 'Procesando...'
              : isSignUp
                ? 'Crear Despacho y Registrarse'
                : 'Entrar al Despacho'}
          </button>
        </form>

        <div className="mt-6 border-t border-tinta-700 pt-4 text-center font-mono text-[11px] text-tinta-400">
          LFT Art. 132 Fr. XXXIV · Integridad Inalterable SHA-256 · Supabase RLS
        </div>
      </div>
    </div>
  );
}
