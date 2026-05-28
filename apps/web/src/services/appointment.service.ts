import { api } from '@/lib/api';
import type { Patient } from './patient.service';
import type { PaginatedResponse } from './types';
import { toQueryString } from './types';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  healthUnitId: string;
  type: string;
  status: string;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  patient?: Patient;
  doctor?: { name: string };
  healthUnit?: { name: string };
}

export type AppointmentPayload = {
  patientId: string;
  doctorId: string;
  healthUnitId: string;
  type: string;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};

export const appointmentService = {
  getAll(params: Record<string, string | number | undefined> = {}) {
    return api.get<PaginatedResponse<Appointment>>(`/appointments${toQueryString(params)}`);
  },

  create(data: AppointmentPayload) {
    return api.post<Appointment>('/appointments', data);
  },

  update(id: string, data: Partial<AppointmentPayload> & { status?: string }) {
    return api.patch<Appointment>(`/appointments/${id}`, data);
  },

  delete(id: string) {
    return api.delete<Appointment>(`/appointments/${id}`);
  },
};
