import { api } from '@/lib/api';
import type { PaginatedResponse } from './types';
import { toQueryString } from './types';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  role: string;
  avatar?: string;
  healthUnitId?: string;
  isActive?: boolean;
}

export interface UserPayload {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: string;
  password?: string;
  healthUnitId?: string;
  isActive?: boolean;
}

export const userService = {
  getAll(params: { page?: number; perPage?: number; search?: string; role?: string } = {}) {
    return api.get<PaginatedResponse<AppUser>>(`/users${toQueryString(params)}`);
  },

  create(data: UserPayload) {
    return api.post<AppUser>('/users', data);
  },

  update(id: string, data: Partial<UserPayload>) {
    return api.patch<AppUser>(`/users/${id}`, data);
  },

  deactivate(id: string) {
    return api.delete<AppUser>(`/users/${id}`);
  },

  activate(id: string) {
    return api.patch<AppUser>(`/users/${id}/activate`);
  },
};
