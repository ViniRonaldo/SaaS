export enum HealthUnitType {
  UBS = 'UBS',
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  UPA = 'UPA',
  SPECIALTY_CENTER = 'SPECIALTY_CENTER',
}

export interface HealthUnit {
  id: string;
  name: string;
  type: HealthUnitType;
  cnes: string;
  phone: string;
  email?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  operatingHours: OperatingHours[];
  specialties: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperatingHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface CreateHealthUnitRequest {
  name: string;
  type: HealthUnitType;
  cnes: string;
  phone: string;
  email?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  operatingHours: OperatingHours[];
  specialties: string[];
}

export interface UpdateHealthUnitRequest extends Partial<CreateHealthUnitRequest> {
  isActive?: boolean;
}
