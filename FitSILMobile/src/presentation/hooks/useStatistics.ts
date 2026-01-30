import { useState, useEffect } from 'react';
import { DashboardData } from '../../domain/entities/Statistics';
import { GetDashboardUseCase } from '../../domain/usecases/statistics/GetDashboardUseCase';
import { StatisticsRepositoryImpl } from '../../data/repositories/StatisticsRepositoryImpl';
import { StatisticsDataSource } from '../../data/datasources/StatisticsDataSource';

export const useStatistics = (range: string = '1M') => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statisticsDataSource = new StatisticsDataSource();
  const statisticsRepository = new StatisticsRepositoryImpl(statisticsDataSource);
  const getDashboardUseCase = new GetDashboardUseCase(statisticsRepository);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardUseCase.execute(range);
      setDashboard(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
};