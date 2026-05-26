export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export type SortOrder = 'asc' | 'desc';

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
}

export enum Priority {
  NORMAL = 'NORMAL',
  ELDERLY = 'ELDERLY',
  PREGNANT = 'PREGNANT',
  DISABLED = 'DISABLED',
  EMERGENCY = 'EMERGENCY',
}

export enum TicketStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  EXAM = 'EXAM',
  VACCINE = 'VACCINE',
  RETURN = 'RETURN',
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
  QUEUE_POSITION = 'QUEUE_POSITION',
  QUEUE_CALLED = 'QUEUE_CALLED',
  DELAY_NOTICE = 'DELAY_NOTICE',
  SATISFACTION_SURVEY = 'SATISFACTION_SURVEY',
  GENERAL = 'GENERAL',
}

export enum NotificationChannel {
  APP = 'APP',
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}
