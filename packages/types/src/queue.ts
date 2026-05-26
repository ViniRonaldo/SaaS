import { Priority, TicketStatus } from './common';

export interface Queue {
  id: string;
  name: string;
  healthUnitId: string;
  specialty?: string;
  isActive: boolean;
  currentTicket?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueueTicket {
  id: string;
  queueId: string;
  patientId: string;
  ticketNumber: string;
  priority: Priority;
  status: TicketStatus;
  position: number;
  estimatedWaitTime?: number;
  calledAt?: string;
  completedAt?: string;
  counter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQueueRequest {
  name: string;
  healthUnitId: string;
  specialty?: string;
}

export interface CreateTicketRequest {
  queueId: string;
  patientId: string;
  priority?: Priority;
}

export interface CallNextTicketRequest {
  queueId: string;
  counter?: string;
}

export interface QueueDisplayData {
  currentTickets: QueueTicket[];
  nextTickets: QueueTicket[];
  queueName: string;
  healthUnitName: string;
}
