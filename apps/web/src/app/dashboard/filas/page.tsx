'use client';

import { useEffect, useState } from 'react';
import { Plus, Play, CheckCircle, XCircle, PhoneCall } from 'lucide-react';
import { queueService } from '@/services/queue.service';

const priorityBadge: Record<string, string> = { NORMAL: 'bg-gray-100 text-gray-700', ELDERLY: 'bg-orange-100 text-orange-700', PREGNANT: 'bg-pink-100 text-pink-700', DISABLED: 'bg-blue-100 text-blue-700', EMERGENCY: 'bg-red-100 text-red-700' };
const statusBadge: Record<string, string> = { WAITING: 'bg-yellow-100 text-yellow-700', CALLED: 'bg-green-100 text-green-700', IN_PROGRESS: 'bg-blue-100 text-blue-700', COMPLETED: 'bg-gray-100 text-gray-500', CANCELLED: 'bg-red-100 text-red-500' };
const statusLabel: Record<string, string> = { WAITING: 'Aguardando', CALLED: 'Chamado', IN_PROGRESS: 'Em Atendimento', COMPLETED: 'Concluido', CANCELLED: 'Cancelado' };

export default function FilasPage() {
  const [queues, setQueues] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  const loadQueues = async () => { try { const r=await queueService.getAll(); setQueues(r||[]); if(r?.[0]) setSelected(r[0].id); } catch(e){} finally{setLoading(false);} };
  const loadTickets = async (qid:string) => { if(!qid) return; try { const r=await queueService.getById(qid); setTickets(r.tickets||[]); } catch(e){} };

  useEffect(()=>{ loadQueues(); },[]);
  useEffect(()=>{ if(selected) loadTickets(selected); },[selected]);

  const callNext = async () => { if(!selected) return; try { await queueService.callNext(selected); loadTickets(selected); } catch(e){} };
  const start = async (tid:string) => { try { await queueService.start(tid); if(selected) loadTickets(selected); } catch(e){} };
  const complete = async (tid:string) => { try { await queueService.complete(tid); if(selected) loadTickets(selected); } catch(e){} };
  const cancel = async (tid:string) => { if(!confirm('Cancelar senha?'))return; try { await queueService.cancel(tid); if(selected) loadTickets(selected); } catch(e){} };

  if(loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (<div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-gray-900">Filas Ativas</h2><button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"><Plus size={16}/> Nova Fila</button></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{queues.map(q=>(<button key={q.id} onClick={()=>{setSelected(q.id); loadTickets(q.id);}} className={`rounded-2xl border p-5 text-left transition-all ${selected===q.id?'border-teal-500 bg-teal-50 shadow-md':'border-gray-200 bg-white hover:border-teal-200'}`}><div className="flex items-center justify-between"><span className="text-2xl font-extrabold text-teal-600">{q.prefix}</span><span className="text-xs text-gray-500">{q.specialty}</span></div><p className="mt-1 font-semibold text-gray-900">{q.name}</p><div className="mt-3 flex gap-4 text-xs"><span className="text-yellow-600">{(q._count?.tickets||0)} aguardando</span></div></button>))}</div>
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-gray-200 px-6 py-4"><h3 className="font-semibold text-gray-900">Senhas</h3><div className="flex gap-2"><button onClick={callNext} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"><PhoneCall size={14}/> Chamar Proximo</button><button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"><Plus size={14}/> Nova Senha</button></div></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Senha</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Paciente</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Prioridade</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th><th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acoes</th></tr></thead><tbody className="divide-y divide-gray-100">{tickets.map(t=>(<tr key={t.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-bold text-gray-900">{t.displayNumber}</td><td className="px-6 py-4 text-sm text-gray-700">{t.patient?.user?.name||'-'}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[t.priority]||''}`}>{t.priority}</span></td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[t.status]||''}`}>{statusLabel[t.status]||t.status}</span></td><td className="px-6 py-4"><div className="flex gap-1">{t.status==='WAITING' && <button title="Iniciar" onClick={()=>start(t.id)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"><Play size={14}/></button>}{t.status==='IN_PROGRESS' && <button title="Concluir" onClick={()=>complete(t.id)} className="rounded-lg p-1.5 text-teal-600 hover:bg-teal-50"><CheckCircle size={14}/></button>}{(t.status==='WAITING'||t.status==='CALLED') && <button title="Cancelar" onClick={()=>cancel(t.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><XCircle size={14}/></button>}</div></td></tr>))}</tbody></table></div></div>
  </div>);
}
