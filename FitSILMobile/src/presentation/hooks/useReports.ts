//src/presentation/hooks/useReports.ts
import { useState, useCallback } from 'react';
import { Report, ReportType } from '../../domain/entities/Report';
import { ReportRepositoryImpl } from '../../data/repositories/ReportRepositoryImpl';
import { ReportDataSource } from '../../data/datasources/ReportDataSource';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportDataSource = new ReportDataSource();
  const reportRepository = new ReportRepositoryImpl(reportDataSource);

  const fetchPublicReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportRepository.getPublicReports();
      setReports(data);
    } catch (err: any) {
      console.error('Error loading reports:', err);
      setError(err.message || 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  }, []);

  const generateReport = async (type: ReportType, range: string = '1M') => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      switch (type) {
        case 'mensual':
          data = await reportRepository.generateMonthlyReport();
          break;
        case 'semanal':
          data = await reportRepository.generateWeeklyReport();
          break;
        case 'calorias':
          data = await reportRepository.generateCaloriesReport(range);
          break;
        case 'historial':
          data = await reportRepository.generateFullHistory();
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al generar reporte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (type: ReportType, range: string = '1M') => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportRepository.downloadReport(type, range);
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al descargar reporte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    fetchPublicReports,
    generateReport,
    downloadReport,
  };
};