import { AppointmentStatus, AppointmentType } from './common';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  healthUnitId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  healthUnitId: string;
  type: AppointmentType;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  status?: AppointmentStatus;
  date?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
}

export interface ScheduleBlock {
  id: string;
  doctorId: string;
  healthUnitId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}
