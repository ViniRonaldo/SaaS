'use client';

import { useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';

const roleBadge: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
  RECEPTIONIST: { label: 'Recepcionista', color: 'bg-blue-100 text-blue-700' },
  DOCTOR: { label: 'Medico', color: 'bg-green-100 text-green-700' },
  NURSE: { label: 'Enfermeiro', color: 'bg-teal-100 text-teal-700' },
  PATIENT: { label: 'Paciente', color: 'bg-gray-100 text-gray-700' },
  PREFECTURE: { label: 'Prefeitura', color: 'bg-orange-100 text-orange-700' },
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    fetch('/api/v1/users').then(r=>r.json()).then(d=>setUsers(d.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const filtered = users.filter(u=>u.name?.toLowerCase().includes(search.toLowerCase())||u.email?.toLowerCase().includes(search.toLowerCase()));

  if(loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (<div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Usuarios do Sistema</h2>
      <div className="flex gap-3">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar usuario..." className="h-9 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"/></div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"><UserPlus size={16}/> Novo Usuario</button>
      </div>
    </div>
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nome</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Perfil</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map(u=>{const r=roleBadge[u.role]||roleBadge.PATIENT; return (<tr key={u.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td><td className="px-6 py-4 text-sm text-gray-600">{u.email}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.color}`}>{r.label}</span></td><td className="px-6 py-4"><span className={`inline-flex h-2 w-2 rounded-full ${u.isActive?'bg-teal-500':'bg-red-500'}`}/></td></tr>);})}</tbody></table></div></div>
  </div>);
}