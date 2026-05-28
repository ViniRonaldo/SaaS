'use client';

import {
  LayoutDashboard, ListOrdered, CalendarCheck, Users, Building2, User, BarChart3,
  Settings,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { canAccessAdminArea } from '@/lib/access-control';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Filas', href: '/dashboard/filas', icon: ListOrdered },
  { label: 'Agendamentos', href: '/dashboard/agendamentos', icon: CalendarCheck },
  { label: 'Pacientes', href: '/dashboard/pacientes', icon: Users },
  { label: 'Unidades', href: '/dashboard/unidades', icon: Building2 },
  { label: 'Usuarios', href: '/dashboard/usuarios', icon: User },
  { label: 'Relatorios', href: '/dashboard/relatorios', icon: BarChart3 },
  { label: 'Configuracoes', href: '/dashboard/configuracoes', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={navItems} allow={canAccessAdminArea}>
      {children}
    </AppShell>
  );
}
