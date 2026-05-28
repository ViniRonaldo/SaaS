'use client';

import { useEffect, useState } from 'react';
import { Bell, CalendarCheck, Clock, User } from 'lucide-react';
import { appointmentService, Appointment } from '@/services/appointment.service';
import { patientService, Patient } from '@/services/patient.service';
import { useAuthStore } from '@/stores/auth-store';

export default function UsuarioDashboardPage() {
  const { user } = useAuthStore();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getMe()
      .then(async (data) => {
        setPatient(data);
        if (data?.id) {
          const result = await appointmentService.getAll({ patientId: data.id, perPage: 5 });
          setAppointments(result.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nextAppointment = appointments[0];
  const cards = [
    { label: 'Proxima Consulta', value: nextAppointment ? nextAppointment.date?.split('T')[0] : '-', icon: CalendarCheck, color: 'text-teal-600 bg-teal-100' },
    { label: 'Horario', value: nextAppointment?.startTime || '-', icon: Clock, color: 'text-blue-600 bg-blue-100' },
    { label: 'Historico', value: appointments.length, icon: User, color: 'text-purple-600 bg-purple-100' },
    { label: 'Notificacoes', value: '-', icon: Bell, color: 'text-orange-600 bg-orange-100' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between"><div className={`rounded-xl p-2.5 ${s.color}`}><s.icon size={20}/></div></div>
            <p className="mt-4 text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-gray-900">Resumo pessoal</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="text-sm font-medium text-gray-900">{user?.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Prioridade</p>
            <p className="text-sm font-medium text-gray-900">{patient?.priority || 'NORMAL'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">{user?.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CNS</p>
            <p className="text-sm font-medium text-gray-900">{patient?.cns || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
