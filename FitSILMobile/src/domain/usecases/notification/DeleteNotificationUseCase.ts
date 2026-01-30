// src/domain/usecases/notifications/DeleteNotificationUseCase.ts
import { INotificationRepository } from '../../repositories/INotificationRepository';

export class DeleteNotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(notificationId: number): Promise<void> {
    await this.notificationRepository.deleteNotification(notificationId);
  }
}