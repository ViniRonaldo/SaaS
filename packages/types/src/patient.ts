import { Priority } from './common';

export interface Patient {
  id: string;
  userId: string;
  cns?: string;
  birthDate: string;
  gender: Gender;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  observations?: string;
  address: Address;
  emergencyContact?: EmergencyContact;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  NOT_INFORMED = 'NOT_INFORMED',
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface CreatePatientRequest {
  cns?: string;
  birthDate: string;
  gender: Gender;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  observations?: string;
  address: Address;
  emergencyContact?: EmergencyContact;
  priority?: Priority;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {}
