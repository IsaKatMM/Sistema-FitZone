//src/data/mappers/reportMapper.ts
import { Report } from '../../domain/entities/Report';
import { ReportDTO } from '../models/ReportDTO';

export const reportMapper = {
  toDomain(dto: ReportDTO): Report {
    return {
      id: dto.id,
      nombre: dto.nombre,
      tipo: dto.tipo,
      datos: dto.datos,
      filtros: dto.filtros,
      estado: dto.estado,
      fechaCreacion: dto.fechaCreacion,
    };
  },

  toDomainList(dtos: ReportDTO[]): Report[] {
    return dtos.map(this.toDomain);
  },
};