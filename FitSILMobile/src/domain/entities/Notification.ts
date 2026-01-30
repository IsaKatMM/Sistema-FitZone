// src/domain/entities/Notification.ts
export interface UserNotification {  // ✅ Cambiado de Notification a UserNotification
  id: number;
  tipo: string;
  mensaje: string;
  datos: string;
  leida: boolean;
  fecha: string;
}

export type NotificationType = 'NUEVO_REPORTE' | 'ACTUALIZACION' | 'RECORDATORIO' | 'RACHA';