'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { appointmentService, Appointment } from '@/services/appointment.service';
import { patientService } from '@/services/patient.service';

const statusBadge: Record<string, string> = { SCHEDULED: 'bg-blue-100 text-blue-700', CONFIRMED: 'bg-green-100 text-green-700', COMPLETED: 'bg-gray-100 text-gray-600', CANCELLED: 'bg-red-100 text-red-600', NO_SHOW: 'bg-orange-100 text-orange-700' };
const statusLabel: Record<string, string> = { SCHEDULED: 'Agendado', CONFIRMED: 'Confirmado', COMPLETED: 'Concluido', CANCELLED: 'Cancelado', NO_SHOW: 'Nao Compareceu', WAITING: 'Aguardando', IN_PROGRESS: 'Em Atendimento' };

export default function UsuarioHistoricoPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getMe()
      .then((patient) => patient?.id ? appointmentService.getAll({ patientId: patient.id, perPage: 50 }) : null)
      .then((result) => setAppointments(result?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"/></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Historico</h2>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Especialidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Unidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{a.specialty}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{a.healthUnit?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700"><span className="inline-flex items-center gap-1"><Calendar size={13}/>{a.date?.split('T')[0]} <Clock size={13}/>{a.startTime}</span></td>
                  <td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[a.status] || ''}`}>{statusLabel[a.status] || a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
