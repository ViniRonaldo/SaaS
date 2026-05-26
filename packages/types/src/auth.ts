export enum Role {
  PATIENT = 'PATIENT',
  RECEPTIONIST = 'RECEPTIONIST',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
  PREFECTURE = 'PREFECTURE',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  role?: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  healthUnitId?: string;
  avatar?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  healthUnitId?: string;
  iat?: number;
  exp?: number;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface NewPasswordRequest {
  token: string;
  password: string;
}
