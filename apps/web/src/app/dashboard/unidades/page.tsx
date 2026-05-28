'use client';

import { useEffect, useState } from 'react';
import { Building2, MapPin, Phone, Clock } from 'lucide-react';
import { healthUnitService } from '@/services/health-unit.service';

const typeBadge: Record<string, string> = { UBS: 'bg-teal-100 text-teal-700', UPA: 'bg-red-100 text-red-700', PSF: 'bg-blue-100 text-blue-700', CAPS: 'bg-purple-100 text-purple-700' };

export default function UnidadesPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    healthUnitService.getAll().then(d=>setUnits(d.data||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  if(loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (<div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-gray-900">Unidades de Saude</h2></div>
    <div className="grid gap-6 sm:grid-cols-2">{units.map(u=>(<div key={u.id} className={`rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${u.isActive?'border-gray-200':'border-red-200 opacity-60'}`}><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600"><Building2 size={20}/></div><div><h3 className="font-semibold text-gray-900">{u.name}</h3><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge[u.type]||''}`}>{u.type}</span></div></div><span className={`h-2.5 w-2.5 rounded-full ${u.isActive?'bg-teal-500':'bg-red-500'}`}/></div><div className="mt-4 space-y-2 text-sm text-gray-600"><p className="flex items-center gap-2"><MapPin size={14}/> {u.street}, {u.addressNumber} - {u.neighborhood}</p><p className="flex items-center gap-2"><Phone size={14}/> {u.phone}</p><p className="flex items-center gap-2"><Clock size={14}/> {u._count?.queues||0} filas ativas</p></div></div>))}</div>
  </div>);
}
