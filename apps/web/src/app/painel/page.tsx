'use client';

import { useState, useEffect } from 'react';
import { Volume2, Heart } from 'lucide-react';

const mockCurrentTickets = [
  { displayNumber: 'A001', queueName: 'Clinico Geral', counter: 'Consultorio 1', patientName: 'Maria S.' },
  { displayNumber: 'B003', queueName: 'Pediatria', counter: 'Consultorio 3', patientName: 'Carlos O.' },
  { displayNumber: 'A002', queueName: 'Clinico Geral', counter: 'Consultorio 2', patientName: 'Ana P.' },
];

const mockNextTickets = [
  { displayNumber: 'A003', queueName: 'Clinico Geral', priority: 'ELDERLY' },
  { displayNumber: 'B004', queueName: 'Pediatria', priority: 'NORMAL' },
  { displayNumber: 'A004', queueName: 'Clinico Geral', priority: 'PREGNANT' },
  { displayNumber: 'C001', queueName: 'Vacinas', priority: 'NORMAL' },
  { displayNumber: 'A005', queueName: 'Clinico Geral', priority: 'NORMAL' },
  { displayNumber: 'B005', queueName: 'Pediatria', priority: 'DISABLED' },
];

const priorityLabels: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'bg-gray-600' },
  ELDERLY: { label: 'Idoso', color: 'bg-orange-500' },
  PREGNANT: { label: 'Gestante', color: 'bg-pink-500' },
  DISABLED: { label: 'PCD', color: 'bg-blue-500' },
  EMERGENCY: { label: 'Emergencia', color: 'bg-red-500' },
};

export default function PainelPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const rotator = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % mockCurrentTickets.length);
    }, 5000);
    return () => clearInterval(rotator);
  }, []);

  const activeTicket = mockCurrentTickets[activeIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900/80 px-8 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700">
            <Heart size={24} fill="white" className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FilaSaude</h1>
            <p className="text-xs text-gray-400">UBS Central - Bambui/MG</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums">
            {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-sm text-gray-400">
            {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      <div className="grid h-[calc(100vh-80px)] grid-cols-3 gap-6 p-6">
        {/* Main - Current Called */}
        <div className="col-span-2 flex flex-col gap-6">
          {/* Big Display */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-950/50 to-green-900/20 p-8 shadow-2xl shadow-green-500/10">
            <div className="flex items-center gap-2 text-green-400">
              <Volume2 size={24} className="animate-pulse" />
              <span className="text-lg font-semibold uppercase tracking-wider">Chamando</span>
            </div>
            <p className="mt-4 text-[120px] font-black leading-none tracking-tight text-white">
              {activeTicket.displayNumber}
            </p>
            <p className="mt-2 text-2xl font-medium text-gray-300">{activeTicket.patientName}</p>
            <div className="mt-6 flex items-center gap-4">
              <span className="rounded-full bg-green-600/20 px-6 py-2 text-lg font-semibold text-green-400 ring-1 ring-green-500/30">
                {activeTicket.queueName}
              </span>
              <span className="rounded-full bg-blue-600/20 px-6 py-2 text-lg font-semibold text-blue-400 ring-1 ring-blue-500/30">
                {activeTicket.counter}
              </span>
            </div>
          </div>

          {/* Other Called */}
          <div className="grid grid-cols-3 gap-4">
            {mockCurrentTickets.map((t, i) => (
              <div
                key={t.displayNumber}
                className={`rounded-2xl border p-4 text-center transition-all ${
                  i === activeIndex
                    ? 'border-green-500 bg-green-950/40 shadow-lg shadow-green-500/20'
                    : 'border-gray-800 bg-gray-900/50'
                }`}
              >
                <p className="text-xs uppercase tracking-wider text-gray-500">{t.queueName}</p>
                <p className={`text-3xl font-extrabold ${i === activeIndex ? 'text-green-400' : 'text-white'}`}>
                  {t.displayNumber}
                </p>
                <p className="text-sm text-gray-400">{t.counter}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Next in Line */}
        <div className="rounded-3xl border border-gray-800 bg-gray-900/50 p-6">
          <h2 className="mb-4 text-center text-lg font-semibold uppercase tracking-wider text-gray-400">
            Proximas Senhas
          </h2>
          <div className="space-y-3">
            {mockNextTickets.map((t, i) => {
              const p = priorityLabels[t.priority] || priorityLabels.NORMAL;
              return (
                <div key={t.displayNumber} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-300">{i + 1}</span>
                    <div>
                      <p className="text-xl font-bold text-white">{t.displayNumber}</p>
                      <p className="text-xs text-gray-500">{t.queueName}</p>
                    </div>
                  </div>
                  {t.priority !== 'NORMAL' && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${p.color}`}>
                      {p.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
