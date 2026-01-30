// src/presentation/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { UserNotification } from '../../domain/entities/Notification';
import { NotificationRepositoryImpl } from '../../data/repositories/NotificationRepositoryImpl';
import { NotificationDataSource } from '../../data/datasources/NotificationDataSource';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notificationDataSource = new NotificationDataSource();
  const notificationRepository = new NotificationRepositoryImpl(notificationDataSource);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationRepository.getUserNotifications();
      setNotifications(data);
      
      // Contar no leídas
      const unread = data.filter(n => !n.leida).length;
      setUnreadCount(unread);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      setError(err.message || 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationRepository.markAsRead(notificationId);
      
      // Actualizar localmente
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, leida: true }
            : notification
        )
      );
      
      // Actualizar contador
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      // Obtener IDs de todas las notificaciones no leídas
      const unreadNotifications = notifications.filter(n => !n.leida);
      
      if (unreadNotifications.length === 0) {
        return;
      }

      // Marcar todas como leídas en el backend
      await Promise.all(
        unreadNotifications.map(notification =>
          notificationRepository.markAsRead(notification.id)
        )
      );
      
      // Actualizar localmente todas las notificaciones
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          leida: true,
        }))
      );
      
      // Resetear contador
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all as read:', err);
      throw err;
    }
  };

  // ✅ MÉTODO DELETE QUE FALTABA
  const deleteNotification = async (notificationId: number) => {
    try {
      // Verificar si era no leída antes de eliminar
      const notification = notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.leida;
      
      // Llamar al backend para eliminar
      await notificationRepository.deleteNotification(notificationId);
      
      // Actualizar localmente removiendo la notificación
      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n.id !== notificationId)
      );
      
      // Actualizar contador si era no leída
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification, // ✅ EXPORTAR EL MÉTODO
    refetch: fetchNotifications,
  };
};