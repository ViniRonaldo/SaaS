'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Logo } from '@/components/logo';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recuperar senha</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Informe seu email para receber o link de recuperacao
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Mail size={24} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">Email enviado!</h2>
            <p className="mt-2 text-sm text-green-700 dark:text-green-300">
              Verifique sua caixa de entrada em <strong>{email}</strong>. O link expira em 30 minutos.
            </p>
            <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700">
              <ArrowLeft size={16} />
              Voltar ao login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="seu@email.com" />
              </div>
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-green-600/25 hover:bg-green-700 disabled:opacity-50">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Enviar link de recuperacao'
                )}
              </button>
            </form>
            <p className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700">
                <ArrowLeft size={14} />
                Voltar ao login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
