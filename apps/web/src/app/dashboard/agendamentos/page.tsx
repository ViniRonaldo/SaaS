'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Calendar, X, Trash2, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { appointmentService, Appointment } from '@/services/appointment.service';
import { patientService } from '@/services/patient.service';

const statusBadge = { SCHEDULED: 'bg-blue-100 text-blue-700', CONFIRMED: 'bg-green-100 text-green-700', COMPLETED: 'bg-gray-100 text-gray-600', CANCELLED: 'bg-red-100 text-red-600', NO_SHOW: 'bg-orange-100 text-orange-700' };
const statusLabel = { SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado', COMPLETED: 'Concluido', CANCELLED: 'Cancelado', NO_SHOW: 'Nao Compareceu' };
const nextStatus: Record<string, string[]> = { SCHEDULED: ['CONFIRMED','CANCELLED'], CONFIRMED: ['COMPLETED','NO_SHOW','CANCELLED'], COMPLETED: [], NO_SHOW: [], CANCELLED: [] };
const specialties = ['Clinica Geral','Pediatria','Cardiologia','Ginecologia','Ortopedia','Dermatologia','Oftalmologia','Psiquiatria'];
const types = ['CONSULTATION','EXAM','VACCINE','RETURN'];

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ patientId:'', doctorId:'', healthUnitId:'', type:'CONSULTATION', specialty:'Clinica Geral', date:'', startTime:'', endTime:'', notes:'' });
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const load = async () => { try { const r=await appointmentService.getAll(); setAppointments(r.data||[]); } catch(e){} finally{setLoading(false);} };
  useEffect(()=>{ load(); },[]);

  const openModal = async () => { setShowModal(true); try { const [p,u] = await Promise.all([patientService.getAll(),fetch('/api/v1/health-units').then(r=>r.json())]); setPatients(p.data||[]); setUnits(u.data||[]); fetch('/api/v1/users?role=DOCTOR').then(r=>r.json()).then(d=>setDoctors(d.data||[])); } catch(e){} };
  const submit = async (e:React.FormEvent)=>{ e.preventDefault(); try{await appointmentService.create(form); setShowModal(false); setForm({patientId:'',doctorId:'',healthUnitId:'',type:'CONSULTATION',specialty:'Clinica Geral',date:'',startTime:'',endTime:'',notes:''}); load();}catch(e:any){alert(e.message);} };
  const del = async (id:string)=>{ if(!confirm('Cancelar?'))return; try{await appointmentService.delete(id); load();}catch(e:any){alert(e.message);} };
  const changeStatus = async (id:string, status:string)=>{ try{await appointmentService.update(id,{status}); load();}catch(e:any){alert(e.message);} };
  const filtered = appointments.filter(a=>a.patient?.user?.name?.toLowerCase().includes(search.toLowerCase())||a.specialty?.toLowerCase().includes(search.toLowerCase()));

  if(loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (<div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Agendamentos</h2>
      <div className="flex gap-3">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="h-9 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"/></div>
        <button onClick={openModal} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"><Plus size={16}/> Novo</button>
      </div>
    </div>
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Paciente</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Especialidade</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Medico</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Data/Hora</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acoes</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map(a=>(<tr key={a.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium text-gray-900">{a.patient?.user?.name||'-'}</td><td className="px-6 py-4 text-sm text-gray-700">{a.specialty}</td><td className="px-6 py-4 text-sm text-gray-700">{a.doctor?.name||'-'}</td><td className="px-6 py-4 text-sm text-gray-700"><span className="inline-flex items-center gap-1"><Calendar size={13}/>{a.date?.split('T')[0]} {a.startTime}</span></td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[a.status]||''}`}>{statusLabel[a.status]||a.status}</span></td><td className="px-6 py-4"><div className="flex gap-1">{nextStatus[a.status]?.map(s=>(<button key={s} onClick={()=>changeStatus(a.id,s)} className="rounded-lg p-1.5 text-teal-600 hover:bg-teal-50" title={statusLabel[s]}><Edit3 size={14}/></button>))}<button onClick={()=>del(a.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={14}/></button></div></td></tr>))}</tbody></table></div>
    </div>
    {showModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={()=>setShowModal(false)}><div className="glass rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-900">Novo Agendamento</h3><button onClick={()=>setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={18}/></button></div><form onSubmit={submit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label><select required value={form.patientId} onChange={e=>setForm({...form,patientId:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"><option value="">Selecione...</option>{patients.map(p=>(<option key={p.id} value={p.id}>{p.user?.name} - {p.user?.cpf}</option>))}</select></div>
      <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label><select required value={form.specialty} onChange={e=>setForm({...form,specialty:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm">{specialties.map(s=>(<option key={s} value={s}>{s}</option>))}</select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label><select required value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm">{types.map(t=>(<option key={t} value={t}>{t}</option>))}</select></div></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Medico</label><select required value={form.doctorId} onChange={e=>setForm({...form,doctorId:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"><option value="">Selecione...</option>{doctors.map(d=>(<option key={d.id} value={d.id}>{d.name}</option>))}</select></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label><select required value={form.healthUnitId} onChange={e=>setForm({...form,healthUnitId:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"><option value="">Selecione...</option>{units.map(u=>(<option key={u.id} value={u.id}>{u.name}</option>))}</select></div>
      <div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Data</label><input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label><input required type="time" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Fim</label><input required type="time" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Observacoes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm" rows={2}/></div>
      <button type="submit" className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800">Criar Agendamento</button>
    </form></div></div>)}
  </div>);
}