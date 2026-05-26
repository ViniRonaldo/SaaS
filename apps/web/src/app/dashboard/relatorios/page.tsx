'use client';

import { Download, Calendar, TrendingUp, Users, Clock } from 'lucide-react';

const kpis = [
  { label: 'Total Atendimentos (Mes)', value: '2.847', icon: Users, change: '+8%' },
  { label: 'Tempo Medio de Espera', value: '22min', icon: Clock, change: '-15%' },
  { label: 'Taxa de Absenteismo', value: '4.2%', icon: TrendingUp, change: '-32%' },
  { label: 'Consultas Agendadas (Mes)', value: '1.523', icon: Calendar, change: '+12%' },
];

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Relatorios e Indicadores</h2>
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
          <Download size={16} /> Exportar PDF
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <k.icon size={20} className="text-green-600" />
              <span className="text-xs font-medium text-green-600">{k.change}</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{k.value}</p>
            <p className="text-sm text-gray-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="font-semibold text-gray-900 dark:text-white">Graficos em breve</h3>
        <p className="mt-2 text-sm text-gray-500">
          Integre os dados reais da API para exibir graficos de atendimento por especialidade,
          distribuicao horaria e indicadores de performance usando Recharts.
        </p>
        <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-gray-50 text-gray-400 dark:bg-gray-800">
          Graficos serao renderizados aqui com dados da API
        </div>
      </div>
    </div>
  );
}
