import { DashboardData, WeeklyData, CategoryData, StatisticsSummary } from '../entities/Statistics';

export interface IStatisticsRepository {
  getDashboard(range?: string): Promise<DashboardData>;
  getWeeklyData(): Promise<WeeklyData[]>;
  getCategoryData(range?: string): Promise<CategoryData[]>;
  getSummary(range?: string): Promise<StatisticsSummary>;
}