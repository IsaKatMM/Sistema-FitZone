// src/domain/repositories/INotificationRepository.ts
import { UserNotification } from '../entities/Notification';

export interface INotificationRepository {
  getUserNotifications(): Promise<UserNotification[]>;
  markAsRead(notificationId: number): Promise<void>;
  deleteNotification(notificationId: number): Promise<void>; // ✅ NUEVO
  countUnread(): Promise<number>;
}