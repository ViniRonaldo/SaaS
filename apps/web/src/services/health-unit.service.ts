import { api } from '@/lib/api';
import type { PaginatedResponse } from './types';
import { toQueryString } from './types';

export interface HealthUnit {
  id: string;
  name: string;
  type: string;
  cnes: string;
  phone: string;
  isActive: boolean;
  street: string;
  addressNumber: string;
  neighborhood: string;
  _count?: {
    users: number;
    queues: number;
  };
}

export const healthUnitService = {
  getAll(params: { page?: number; perPage?: number; search?: string; type?: string } = {}) {
    return api.get<PaginatedResponse<HealthUnit>>(`/health-units${toQueryString(params)}`);
  },
};
