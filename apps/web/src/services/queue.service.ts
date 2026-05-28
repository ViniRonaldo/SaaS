import { api } from '@/lib/api';

export interface QueueTicket {
  id: string;
  displayNumber: string;
  priority: string;
  status: string;
  patient?: {
    user?: {
      name: string;
    };
  };
}

export interface Queue {
  id: string;
  name: string;
  specialty?: string;
  prefix: string;
  tickets?: QueueTicket[];
  _count?: {
    tickets: number;
  };
}

export const queueService = {
  getAll(healthUnitId?: string) {
    const suffix = healthUnitId ? `?healthUnitId=${encodeURIComponent(healthUnitId)}` : '';
    return api.get<Queue[]>(`/queues${suffix}`);
  },

  getById(id: string) {
    return api.get<Queue>(`/queues/${id}`);
  },

  callNext(queueId: string, counter?: string) {
    return api.post<QueueTicket>(`/queues/${queueId}/call-next`, { counter });
  },

  start(ticketId: string) {
    return api.patch<QueueTicket>(`/queues/tickets/${ticketId}/start`);
  },

  complete(ticketId: string) {
    return api.patch<QueueTicket>(`/queues/tickets/${ticketId}/complete`);
  },

  cancel(ticketId: string) {
    return api.patch<QueueTicket>(`/queues/tickets/${ticketId}/cancel`);
  },
};
