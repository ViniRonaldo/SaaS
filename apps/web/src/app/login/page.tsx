'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Logo } from '@/components/logo';
import { canAccessAdminArea, canAccessUserArea, getDefaultRoute } from '@/lib/access-control';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setRedirect(new URLSearchParams(window.location.search).get('redirect'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      const canUseRedirect =
        !!redirect &&
        ((redirect.startsWith('/dashboard') && canAccessAdminArea(user.role)) ||
          (redirect.startsWith('/usuario') && canAccessUserArea(user.role)));

      router.push(canUseRedirect ? redirect : getDefaultRoute(user.role));
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Logo size="lg" className="[&_span]:text-white [&_span.text-green-600]:text-green-200 [&_span.font-medium]:text-green-200" />
        <div>
          <h2 className="text-3xl font-bold text-white">
            Bem-vindo ao FilaSaude
          </h2>
          <p className="mt-4 text-lg text-green-100">
            O sistema oficial da Prefeitura de Bambui para gestao inteligente
            de filas e agendamentos na saude publica municipal.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">-70%</p>
              <p className="text-sm text-green-200">Tempo de espera</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">98%</p>
              <p className="text-sm text-green-200">Satisfacao</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-green-200">
          &copy; {new Date().getFullYear()} Prefeitura Municipal de Bambui - MG
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Entrar na sua conta</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Acesse o sistema de saude de Bambui
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 shadow-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Lembrar de mim</span>
              </label>
              <Link href="/esqueci-senha" className="text-sm font-medium text-green-600 hover:text-green-700">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Nao tem conta?{' '}
            <Link href="/cadastro" className="font-semibold text-green-600 hover:text-green-700">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
