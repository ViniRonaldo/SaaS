'use client';

import { useEffect, useState } from 'react';
import { Users, Clock, CalendarCheck, AlertTriangle, Activity } from 'lucide-react';
import Link from 'next/link';
import { dashboardService, DashboardStats } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then(setStats).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const cards = [
    { label: 'Pacientes Hoje', value: stats?.todayPatients ?? '-', icon: Users, color: 'text-teal-600 bg-teal-100' },
    { label: 'Tempo Medio Espera', value: stats?.avgWaitTime ? stats.avgWaitTime+'min' : '-', icon: Clock, color: 'text-blue-600 bg-blue-100' },
    { label: 'Consultas Agendadas', value: stats?.scheduledAppointments ?? '-', icon: CalendarCheck, color: 'text-purple-600 bg-purple-100' },
    { label: 'Filas Ativas', value: stats?.activeQueues ?? '-', icon: AlertTriangle, color: 'text-orange-600 bg-orange-100' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (<>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(s=>(<div key={s.label} className="glass rounded-2xl p-6 card-hover"><div className="flex items-center justify-between"><div className={`rounded-xl p-2.5 ${s.color}`}><s.icon size={20}/></div></div><p className="mt-4 text-2xl font-bold text-gray-900">{s.value}</p><p className="text-sm text-gray-500">{s.label}</p></div>))}
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4"><Activity size={18} className="text-teal-600"/><h2 className="font-semibold text-gray-900">Consultas por Especialidade</h2></div>
        <div className="space-y-3">{(stats?.appointmentsBySpecialty||[]).map((a:any)=>(<div key={a.specialty} className="flex items-center justify-between"><span className="text-sm text-gray-600">{a.specialty}</span><div className="flex items-center gap-2"><div className="h-2 rounded-full bg-teal-500" style={{width:Math.max(a.count*4,8)+'px'}}/><span className="text-sm font-medium text-gray-900">{a.count}</span></div></div>))}</div>
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4"><Clock size={18} className="text-teal-600"/><h2 className="font-semibold text-gray-900">Distribuicao Horaria</h2></div>
        <div className="space-y-3">{(stats?.hourlyDistribution||[]).map((h:any)=>(<div key={h.hour} className="flex items-center justify-between"><span className="text-sm text-gray-600">{h.hour}</span><div className="flex items-center gap-2"><div className="h-2 rounded-full bg-teal-500" style={{width:Math.max(h.count*3,6)+'px'}}/><span className="text-sm font-medium text-gray-900">{h.count}</span></div></div>))}</div>
      </div>
    </div>
  </>);
}