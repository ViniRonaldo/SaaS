'use client';

import { useEffect, useState } from 'react';
import { Check, Save } from 'lucide-react';
import { patientService, Patient } from '@/services/patient.service';
import { useAuthStore } from '@/stores/auth-store';

export default function UsuarioPerfilPage() {
  const { user } = useAuthStore();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    patientService.getMe().then(setPatient).catch(() => {});
  }, []);

  const handleSave = () => {
    localStorage.setItem('filasaude-user-profile', JSON.stringify({ patientId: patient?.id, savedAt: new Date().toISOString() }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Perfil e Configuracoes</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900">Dados pessoais</h3>
          <div className="mt-4 space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Nome</label><input type="text" value={user?.name || ''} readOnly className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={user?.email || ''} readOnly className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">CNS</label><input type="text" value={patient?.cns || ''} readOnly className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm" /></div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900">Preferencias</h3>
          <div className="mt-4 space-y-4">
            {[{key:'appointmentReminder',label:'Lembretes de consulta'},{key:'queueAlert',label:'Avisos de fila'},{key:'emailNotifications',label:'Notificacoes por email'}].map(item=>(<label key={item.key} className="flex items-center justify-between cursor-pointer"><span className="text-sm text-gray-700">{item.label}</span><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" /></label>))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-all">
          {saved ? <><Check size={16}/> Salvo!</> : <><Save size={16}/> Salvar Configuracoes</>}
        </button>
      </div>
    </div>
  );
}
