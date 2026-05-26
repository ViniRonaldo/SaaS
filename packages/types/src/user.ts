import { Role } from './auth';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  role: Role;
  avatar?: string;
  healthUnitId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  role: Role;
  healthUnitId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  healthUnitId?: string;
  isActive?: boolean;
}
