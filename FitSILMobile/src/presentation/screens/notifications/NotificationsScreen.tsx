// src/presentation/screens/notifications/NotificationsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';
import { UserNotification } from '../../../domain/entities/Notification';

export default function NotificationsScreen() {
  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead, deleteNotification, refetch } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    if (processingIds.has(notificationId)) return;

    setProcessingIds(prev => new Set(prev).add(notificationId));
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Error al marcar como leída:', err);
      Alert.alert('Error', 'No se pudo marcar como leída');
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(notificationId);
        return next;
      });
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (processingIds.has(notificationId)) return;

    Alert.alert(
      'Eliminar notificación',
      '¿Estás seguro de que deseas eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setProcessingIds(prev => new Set(prev).add(notificationId));
            try {
              await deleteNotification(notificationId);
            } catch (err) {
              console.error('Error al eliminar:', err);
              Alert.alert('Error', 'No se pudo eliminar la notificación');
            } finally {
              setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(notificationId);
                return next;
              });
            }
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    Alert.alert(
      'Marcar todas como leídas',
      `¿Deseas marcar ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} como leída${unreadCount > 1 ? 's' : ''}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Marcar todas',
          style: 'default',
          onPress: async () => {
            setMarkingAll(true);
            try {
              await markAllAsRead();
            } catch (err) {
              console.error('Error al marcar todas como leídas:', err);
              Alert.alert('Error', 'No se pudieron marcar todas como leídas');
            } finally {
              setMarkingAll(false);
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'NUEVO_REPORTE':
        return '▣';
      case 'ACTUALIZACION':
        return '↻';
      case 'RECORDATORIO':
        return '⏰';
      case 'RACHA':
        return '⚡';
      default:
        return '●';
    }
  };

  const getNotificationColor = (tipo: string) => {
    switch (tipo) {
      case 'NUEVO_REPORTE':
        return '#FF6B00';
      case 'ACTUALIZACION':
        return '#007AFF';
      case 'RECORDATORIO':
        return '#34C759';
      case 'RACHA':
        return '#FF9500';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorIconContainer}>
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>!</Text>
          </View>
        </View>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Notificaciones</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
              disabled={markingAll}
            >
              {markingAll ? (
                <ActivityIndicator size="small" color="#FF6B00" />
              ) : (
                <>
                  <View style={styles.markAllIcon}>
                    <Text style={styles.markAllIconText}>✓</Text>
                  </View>
                  <Text style={styles.markAllText}>Marcar todas</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subtitle}>
          {unreadCount > 0 
            ? `${unreadCount} nueva${unreadCount > 1 ? 's' : ''}`
            : 'Todo al día'}
        </Text>
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>✓</Text>
            </View>
          </View>
          <Text style={styles.emptyTitle}>No tienes notificaciones</Text>
          <Text style={styles.emptyDescription}>
            Aquí aparecerán los recordatorios y actualizaciones importantes
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => `notification-${item.id}`}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF6B00']}
              tintColor="#FF6B00"
            />
          }
          renderItem={({ item }) => {
            const isProcessing = processingIds.has(item.id);
            
            return (
              <View
                style={[
                  styles.notificationCard,
                  !item.leida && styles.notificationCardUnread,
                ]}
              >
                <View style={[
                  styles.notificationIconContainer,
                  { backgroundColor: getNotificationColor(item.tipo) + '15' }
                ]}>
                  <Text style={[
                    styles.notificationIconText,
                    { color: getNotificationColor(item.tipo) }
                  ]}>
                    {getNotificationIcon(item.tipo)}
                  </Text>
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    {/* Solo mostrar tag si NO está leída */}
                    {!item.leida && (
                      <View style={[
                        styles.typeTag,
                        { backgroundColor: getNotificationColor(item.tipo) }
                      ]}>
                        <Text style={styles.typeTagText}>
                          {item.tipo.replace('_', ' ')}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.notificationDate}>
                      {formatDate(item.fecha)}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.notificationMessage,
                      !item.leida && styles.notificationMessageUnread,
                    ]}
                    numberOfLines={3}
                  >
                    {item.mensaje}
                  </Text>

                  {!item.leida && (
                    <View style={styles.unreadIndicator}>
                      <View style={styles.unreadDot} />
                      <Text style={styles.unreadText}>Nueva</Text>
                    </View>
                  )}
                </View>

                {/* Botones de acción */}
                <View style={styles.actionButtons}>
                  {/* Botón marcar como leída - solo si no está leída */}
                  {!item.leida && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleMarkAsRead(item.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <ActivityIndicator size="small" color="#34C759" />
                      ) : (
                        <View style={[styles.actionIcon, styles.actionIconCheck]}>
                          <Text style={styles.actionIconText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}

                  {/* Botón eliminar */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#FF3B30" />
                    ) : (
                      <View style={[styles.actionIcon, styles.actionIconDelete]}>
                        <Text style={styles.actionIconText}>×</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Indicador visual de no leída */}
                {!item.leida && (
                  <View style={styles.unreadBadge} />
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },

  // Mark All Button
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  markAllIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markAllIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B00',
  },

  // List
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },

  // Notification Card
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  notificationCardUnread: {
    backgroundColor: '#FFF5EE',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B00',
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  notificationMessageUnread: {
    color: '#333',
    fontWeight: '500',
  },
  unreadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B00',
    marginRight: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B00',
  },
  unreadBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B00',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconCheck: {
    backgroundColor: '#E8F5E9',
  },
  actionIconDelete: {
    backgroundColor: '#FFEBEE',
  },
  actionIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  emptyIconText: {
    fontSize: 36,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Loading
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#666',
  },

  // Error
  errorIconContainer: {
    marginBottom: 20,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  errorIconText: {
    fontSize: 36,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});