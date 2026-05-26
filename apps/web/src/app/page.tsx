'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, CalendarCheck, Bell, Monitor, Shield, Accessibility, ArrowRight, MapPin, Activity, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/logo';

const features = [
  { icon: Clock, title: 'Fila em Tempo Real', desc: 'Acompanhe sua posição na fila com atualizações instantâneas.' },
  { icon: CalendarCheck, title: 'Agendamento Digital', desc: 'Marque consultas e exames de qualquer dispositivo.' },
  { icon: Bell, title: 'Lembretes Automáticos', desc: 'Notificações por WhatsApp e SMS sobre seus atendimentos.' },
  { icon: Monitor, title: 'Painel de Chamadas', desc: 'Monitore senhas em tempo real nas TVs das unidades.' },
  { icon: Shield, title: 'Dados Protegidos', desc: 'Criptografia de ponta e conformidade total com a LGPD.' },
  { icon: Accessibility, title: 'Acesso Universal', desc: 'Interface adaptada para idosos com alto contraste.' },
];

const units = [
  { name: 'UBS Central', type: 'UBS', addr: 'R. São José, 100', status: 'Aberto' },
  { name: 'UPA 24h', type: 'UPA', addr: 'Av. Brasil, 500', status: 'Aberto' },
  { name: 'PSF Bairro Novo', type: 'PSF', addr: 'R. das Flores, 200', status: 'Fechado' },
  { name: 'CAPS', type: 'CAPS', addr: 'R. Minas Gerais, 80', status: 'Aberto' },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-teal-500/30 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/40 via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Header */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-black/50 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Logo size="sm" />
          <nav className="hidden md:flex items-center gap-8">
            {['Serviços', 'Unidades', 'Acesso'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
            <Link href="/login" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-gray-200 transition-all hover:scale-105">
              Entrar
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400 mb-8 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            Prefeitura Municipal de Bambui — MG
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
            Gestão de
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-200 bg-clip-text text-transparent">
                Saúde Digital
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-gray-400 leading-relaxed">
            Sistema oficial de filas e agendamentos. Acesse suas consultas, 
            filas em tempo real e unidades de saúde do município.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="group inline-flex h-14 items-center gap-2 rounded-2xl bg-white px-8 text-base font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Acessar Sistema
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/painel" className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
              <Monitor size={18} />
              Painel de Senhas
            </Link>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 hidden lg:block">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'UBS Central', sub: 'Fila A — 3 min', color: 'border-teal-500/30 bg-teal-500/5' },
              { label: 'UPA 24h', sub: 'Fila B — 12 min', color: 'border-yellow-500/30 bg-yellow-500/5' },
              { label: 'PSF B. Novo', sub: 'Fila C — 25 min', color: 'border-gray-500/30 bg-gray-500/5' },
            ].map((card) => (
              <div key={card.label} className={`rounded-2xl border ${card.color} p-5 backdrop-blur-xl`}>
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold">{card.label}</p>
                    <p className="text-xs text-gray-500">{card.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ChevronDown className="absolute bottom-8 text-gray-600 animate-bounce" size={24} />
      </section>

      {/* Services */}
      <section id="serviços" className="mx-auto max-w-7xl px-6 lg:px-8 py-32">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Serviços</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl">Tudo integrado em uma única plataforma oficial do município.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-teal-500/30 hover:bg-teal-500/[0.03] transition-all duration-500">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 group-hover:bg-teal-500/20 transition-colors">
                <f.icon size={20} className="text-gray-400 group-hover:text-teal-400 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Units Bento Grid */}
      <section id="unidades" className="mx-auto max-w-7xl px-6 lg:px-8 py-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Unidades</h2>
            <p className="mt-4 text-lg text-gray-500">Encontre a unidade mais próxima</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {units.map((u) => (
            <div key={u.name} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                    <MapPin size={18} className="text-gray-500 group-hover:text-teal-400" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.status === 'Aberto' ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {u.status}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{u.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{u.addr}</p>
                <span className="inline-block mt-3 text-xs font-medium text-gray-600 bg-white/5 px-2 py-1 rounded">{u.type}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="acesso" className="mx-auto max-w-7xl px-6 lg:px-8 py-32">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-gray-950 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(20,184,166,0.15),_transparent_50%)]" />
          <div className="relative px-8 py-20 sm:px-16 sm:py-24 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Acesse agora
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
              Entre ou crie sua conta para consultar filas, agendar atendimentos e acompanhar sua saúde.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="inline-flex h-14 items-center gap-2 rounded-2xl bg-white px-8 text-base font-semibold text-black hover:bg-gray-100 transition-all hover:scale-105">
                Entrar
                <ArrowRight size={18} />
              </Link>
              <Link href="/cadastro" className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/10 px-8 text-base font-semibold text-white hover:bg-white/5 transition-all">
                Criar Conta
              </Link>
            </div>
            <p className="mt-8 text-sm text-gray-600">
              Dúvidas? Procure a recepção da sua unidade de saúde
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-sm text-gray-600">Prefeitura de Bambui — Secretaria de Saúde</span>
            </div>
            <span className="text-sm text-gray-600">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
