'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

const priorityBadge: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'bg-gray-100 text-gray-700' },
  ELDERLY: { label: 'Idoso', color: 'bg-orange-100 text-orange-700' },
  PREGNANT: { label: 'Gestante', color: 'bg-pink-100 text-pink-700' },
  DISABLED: { label: 'PCD', color: 'bg-blue-100 text-blue-700' },
};

export default function PacientesPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    fetch('/api/v1/patients').then(r=>r.json()).then(d=>setPatients(d.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const filtered = patients.filter(p=>p.user?.name?.toLowerCase().includes(search.toLowerCase())||p.user?.cpf?.includes(search));

  if(loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (<div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Pacientes</h2>
      <div className="flex gap-3">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nome ou CPF..." className="h-9 w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"/></div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"><Plus size={16}/> Novo Paciente</button>
      </div>
    </div>
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nome</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">CPF</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Telefone</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nascimento</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Prioridade</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acoes</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map(p=>{const pr=priorityBadge[p.priority]||priorityBadge.NORMAL; return (<tr key={p.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium text-gray-900">{p.user?.name||'-'}</td><td className="px-6 py-4 text-sm text-gray-700">{p.user?.cpf||'-'}</td><td className="px-6 py-4 text-sm text-gray-700">{p.user?.phone||'-'}</td><td className="px-6 py-4 text-sm text-gray-700">{p.birthDate?p.birthDate.split('T')[0]:'-'}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${pr.color}`}>{pr.label}</span></td><td className="px-6 py-4"><Link href={`/dashboard/pacientes/${p.id}`} className="rounded-lg p-1.5 text-teal-600 hover:bg-teal-50"><Eye size={16}/></Link></td></tr>);})}</tbody></table></div></div>
  </div>);
}