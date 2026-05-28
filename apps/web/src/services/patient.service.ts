import { api } from '@/lib/api';
import type { PaginatedResponse } from './types';
import { toQueryString } from './types';

export interface Patient {
  id: string;
  cns?: string;
  birthDate?: string;
  priority: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    cpf?: string;
    phone?: string;
    avatar?: string;
  };
}

export const patientService = {
  getAll(params: { page?: number; perPage?: number; search?: string } = {}) {
    return api.get<PaginatedResponse<Patient>>(`/patients${toQueryString(params)}`);
  },

  getMe() {
    return api.get<Patient | null>('/patients/me');
  },
};
