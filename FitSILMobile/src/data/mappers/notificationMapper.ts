// src/data/mappers/notificationMapper.ts
import { UserNotification } from '../../domain/entities/Notification';
import { NotificationDTO } from '../models/NotificationDTO';

export const notificationMapper = {
  toDomain(dto: NotificationDTO): UserNotification {
    return {
      id: dto.id,
      tipo: dto.tipo,
      mensaje: dto.mensaje,
      datos: dto.datos,
      leida: dto.leida,
      fecha: dto.fecha,
    };
  },

  toDomainList(dtos: NotificationDTO[]): UserNotification[] {
    return dtos.map(dto => this.toDomain(dto));
  },
};