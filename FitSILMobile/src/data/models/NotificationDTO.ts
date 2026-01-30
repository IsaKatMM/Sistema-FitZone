// src/data/models/NotificationDTO.ts
export interface NotificationDTO {
  id: number;
  tipo: string;
  mensaje: string;
  datos: string;
  leida: boolean;
  fecha: string;
}