import { DashboardData } from '../../domain/entities/Statistics';
import { DashboardDTO } from '../models/StatisticsDTO';

export const statisticsMapper = {
  dashboardToDomain(dto: DashboardDTO): DashboardData {
    return {
      resumen: dto.resumen,
      datosSemana: dto.datosSemana,
      datosCategoria: dto.datosCategoria,
      minutosMes: dto.minutosMes,
      rachaActual: dto.rachaActual,
    };
  },
};