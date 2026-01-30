//src/data/datasources/ReportDataSource.ts
import { apiClient } from '../../core/api/apiClient';
import { ReportDTO } from '../models/ReportDTO';
import { ReportType } from '../../domain/entities/Report';

export class ReportDataSource {
  /**
   * Obtener reportes públicos del admin
   */
  async getPublicReports(): Promise<ReportDTO[]> {
    return await apiClient.get<ReportDTO[]>('/api/reportes-admin/publicos');
  }

  /**
   * Generar reporte mensual
   */
  async generateMonthlyReport(): Promise<any> {
    return await apiClient.get('/api/reportes/mensual');
  }

  /**
   * Generar reporte semanal
   */
  async generateWeeklyReport(): Promise<any> {
    return await apiClient.get('/api/reportes/semanal');
  }

  /**
   * Generar reporte de calorías
   */
  async generateCaloriesReport(range: string = '1M'): Promise<any> {
    return await apiClient.get('/api/reportes/calorias', { rango: range });
  }

  /**
   * Generar historial completo
   */
  async generateFullHistory(): Promise<any> {
    return await apiClient.get('/api/reportes/historial');
  }

  /**
   * Descargar reporte
   */
  async downloadReport(type: ReportType, range: string = '1M'): Promise<any> {
    return await apiClient.get(`/api/reportes/descargar/${type}`, { rango: range });
  }

  /**
   * Descargar reporte del admin
   */
  async downloadAdminReport(id: number, format: string = 'JSON'): Promise<any> {
    return await apiClient.get(`/api/reportes-admin/${id}/descargar`, { formato: format });
  }
}