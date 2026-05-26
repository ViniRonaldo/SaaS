import { NotificationChannel, NotificationType } from './common';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  sentAt?: string;
  createdAt: string;
}

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}
