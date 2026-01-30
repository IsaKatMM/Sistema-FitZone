// src/domain/usecases/notifications/GetNotificationsUseCase.ts
import { INotificationRepository } from '../../repositories/INotificationRepository';
import { UserNotification } from '../../entities/Notification'; // ✅ Cambiar de Notification a UserNotification

export class GetNotificationsUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async execute(): Promise<UserNotification[]> { // ✅ Cambiar tipo de retorno
    return await this.notificationRepository.getUserNotifications();
  }
}