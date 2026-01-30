// src/data/datasources/NotificationDataSource.ts
import { apiClient } from '../../core/api/apiClient';
import { NotificationDTO } from '../models/NotificationDTO';

export class NotificationDataSource {
  /**
   * Obtener notificaciones del usuario
   */
  async getUserNotifications(): Promise<NotificationDTO[]> {
    return await apiClient.get<NotificationDTO[]>('/api/notificaciones-usuario');
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.put(`/api/notificaciones-usuario/${notificationId}/leer`);
  }

  /**
   * Eliminar notificación
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/api/notificaciones-usuario/${notificationId}`);
  }

  /**
   * Contar notificaciones no leídas
   */
  async countUnread(): Promise<number> {
    const response = await apiClient.get<{ cantidad: number }>('/api/admin/notificaciones/no-leidas/contar');
    return response.cantidad;
  }
}