// src/data/repositories/NotificationRepositoryImpl.ts
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { UserNotification } from '../../domain/entities/Notification';
import { NotificationDataSource } from '../datasources/NotificationDataSource';
import { notificationMapper } from '../mappers/notificationMapper';

export class NotificationRepositoryImpl implements INotificationRepository {
  constructor(private dataSource: NotificationDataSource) {}

  async getUserNotifications(): Promise<UserNotification[]> {
    const dtos = await this.dataSource.getUserNotifications();
    return notificationMapper.toDomainList(dtos);
  }

  async markAsRead(notificationId: number): Promise<void> {
    await this.dataSource.markAsRead(notificationId);
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await this.dataSource.deleteNotification(notificationId);
  }

  async countUnread(): Promise<number> {
    return await this.dataSource.countUnread();
  }
}