'use client';

import { useEffect, useState } from 'react';
import { Edit3, RotateCcw, Search, Trash2, UserPlus, X } from 'lucide-react';
import { AppUser, UserPayload, userService } from '@/services/user.service';

const roleBadge: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
  RECEPTIONIST: { label: 'Recepcionista', color: 'bg-blue-100 text-blue-700' },
  DOCTOR: { label: 'Medico', color: 'bg-green-100 text-green-700' },
  NURSE: { label: 'Enfermeiro', color: 'bg-teal-100 text-teal-700' },
  PATIENT: { label: 'Paciente', color: 'bg-gray-100 text-gray-700' },
  PREFECTURE: { label: 'Prefeitura', color: 'bg-orange-100 text-orange-700' },
};

const roles = [
  { value: 'PATIENT', label: 'Paciente' },
  { value: 'RECEPTIONIST', label: 'Recepcionista' },
  { value: 'DOCTOR', label: 'Medico' },
  { value: 'NURSE', label: 'Enfermeiro' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'PREFECTURE', label: 'Prefeitura' },
];

const emptyForm: UserPayload = {
  name: '',
  email: '',
  cpf: '',
  phone: '',
  password: '',
  role: 'PATIENT',
  isActive: true,
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [form, setForm] = useState<UserPayload>(emptyForm);

  const load = async () => {
    try {
      const result = await userService.getAll();
      setUsers(result.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (user: AppUser) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      cpf: user.cpf || '',
      phone: user.phone || '',
      role: user.role,
      password: '',
      healthUnitId: user.healthUnitId,
      isActive: user.isActive ?? true,
    });
    setShowModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editing) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await userService.update(editing.id, payload);
      } else {
        await userService.create(form);
      }

      setShowModal(false);
      await load();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar usuario');
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (id: string) => {
    if (!confirm('Desativar usuario?')) return;
    try {
      await userService.deactivate(id);
      await load();
    } catch (error: any) {
      alert(error.message || 'Erro ao desativar usuario');
    }
  };

  const activate = async (id: string) => {
    try {
      await userService.activate(id);
      await load();
    } catch (error: any) {
      alert(error.message || 'Erro ao ativar usuario');
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if(loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Usuarios do Sistema</h2>
        <div className="flex gap-3">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar usuario..." className="h-9 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"/></div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"><UserPlus size={16}/> Novo Usuario</button>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => {
                const r = roleBadge[u.role] || roleBadge.PATIENT;
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.color}`}>{r.label}</span></td>
                    <td className="px-6 py-4"><span className={`inline-flex h-2 w-2 rounded-full ${u.isActive?'bg-teal-500':'bg-red-500'}`}/></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-teal-600 hover:bg-teal-50" title="Editar"><Edit3 size={14}/></button>
                        {u.isActive ? (
                          <button onClick={() => deactivate(u.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Desativar"><Trash2 size={14}/></button>
                        ) : (
                          <button onClick={() => activate(u.id)} className="rounded-lg p-1.5 text-teal-600 hover:bg-teal-50" title="Ativar"><RotateCcw size={14}/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="glass rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Editar Usuario' : 'Novo Usuario'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={18}/></button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">CPF</label><input required value={form.cpf} onChange={e=>setForm({...form,cpf:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label><input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label><select required value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm">{roles.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Senha</label><input required={!editing} type="password" value={form.password || ''} onChange={e=>setForm({...form,password:e.target.value})} placeholder={editing ? 'Manter atual' : ''} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm"/></div>
              </div>
              <label className="flex items-center justify-between cursor-pointer"><span className="text-sm text-gray-700">Usuario ativo</span><input type="checkbox" checked={!!form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" /></label>
              <button type="submit" disabled={saving} className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50">{saving ? 'Salvando...' : 'Salvar Usuario'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
