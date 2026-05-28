'use client';

import { CalendarCheck, Clock, LayoutDashboard, Settings } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { canAccessUserArea } from '@/lib/access-control';

const navItems = [
  { label: 'Dashboard', href: '/usuario', icon: LayoutDashboard },
  { label: 'Historico', href: '/usuario/historico', icon: Clock },
  { label: 'Agendamentos', href: '/usuario/agendamentos', icon: CalendarCheck },
  { label: 'Configuracoes', href: '/usuario/perfil', icon: Settings },
];

export default function UsuarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={navItems} allow={canAccessUserArea}>
      {children}
    </AppShell>
  );
}
