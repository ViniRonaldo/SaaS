'use client';

import { useState } from 'react';
import { Save, Check } from 'lucide-react';

export default function ConfiguracoesPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    cityName: 'Bambui - MG',
    maxWaitTime: 60,
    patientsPerPage: 20,
    whatsapp: true,
    sms: false,
    reminder24h: true,
    callAlert: true,
    elderlyMode: false,
    highContrast: false,
    elderlyWeight: 3,
    pregnantWeight: 3,
    disabledWeight: 3,
  });

  const handleSave = () => {
    localStorage.setItem('filasaude-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Configuracoes</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900">Geral</h3>
          <div className="mt-4 space-y-4">
            <div><label className="block text-sm font-medium text-gray-700">Nome do municipio</label><input type="text" value={settings.cityName} onChange={e=>setSettings({...settings,cityName:e.target.value})} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Tempo maximo de espera (min)</label><input type="number" value={settings.maxWaitTime} onChange={e=>setSettings({...settings,maxWaitTime:+e.target.value})} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Pacientes por pagina</label><input type="number" value={settings.patientsPerPage} onChange={e=>setSettings({...settings,patientsPerPage:+e.target.value})} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm" /></div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900">Notificacoes</h3>
          <div className="mt-4 space-y-4">
            {[{key:'whatsapp',label:'Notificacoes por WhatsApp'},{key:'sms',label:'Notificacoes por SMS'},{key:'reminder24h',label:'Lembrete de consulta (24h antes)'},{key:'callAlert',label:'Aviso de chamada na fila'}].map(item=>(<label key={item.key} className="flex items-center justify-between cursor-pointer"><span className="text-sm text-gray-700">{item.label}</span><input type="checkbox" checked={(settings as any)[item.key]} onChange={e=>setSettings({...settings,[item.key]:e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" /></label>))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900">Acessibilidade</h3>
          <div className="mt-4 space-y-4">
            {[{key:'elderlyMode',label:'Modo idoso (fonte grande)'},{key:'highContrast',label:'Alto contraste'}].map(item=>(<label key={item.key} className="flex items-center justify-between cursor-pointer"><span className="text-sm text-gray-700">{item.label}</span><input type="checkbox" checked={(settings as any)[item.key]} onChange={e=>setSettings({...settings,[item.key]:e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" /></label>))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900">Prioridades de Fila</h3>
          <div className="mt-4 space-y-4">
            {[{key:'elderlyWeight',label:'Idoso (peso)'},{key:'pregnantWeight',label:'Gestante (peso)'},{key:'disabledWeight',label:'PCD (peso)'}].map(item=>(<div key={item.key}><label className="block text-sm font-medium text-gray-700">{item.label}</label><input type="number" value={(settings as any)[item.key]} onChange={e=>setSettings({...settings,[item.key]:+e.target.value})} className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm" /></div>))}
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