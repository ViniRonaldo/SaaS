'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ListOrdered, CalendarCheck, Users, Building2, User, BarChart3,
  Settings, LogOut, Bell, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/logo';
import { useAuthStore } from '@/stores/auth-store';

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
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <Logo size="sm" />
      </div>
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white lg:flex dark:border-gray-800 dark:bg-gray-900">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-screen w-64 flex-col bg-white shadow-xl dark:bg-gray-900">
            <button onClick={() => setSidebarOpen(false)} className="absolute right-3 top-4 text-gray-400">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {navItems.find((i) => isActive(i.href))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">
                {user?.name || 'Usuario'}
              </span>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
