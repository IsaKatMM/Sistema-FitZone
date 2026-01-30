import { IStatisticsRepository } from '../../domain/repositories/IStatisticsRepository';
import { DashboardData, WeeklyData, CategoryData, StatisticsSummary } from '../../domain/entities/Statistics';
import { StatisticsDataSource } from '../datasources/StatisticsDataSource';
import { statisticsMapper } from '../mappers/statisticsMapper';

export class StatisticsRepositoryImpl implements IStatisticsRepository {
  constructor(private dataSource: StatisticsDataSource) {}

  async getDashboard(range: string = '1M'): Promise<DashboardData> {
    const dto = await this.dataSource.getDashboard(range);
    return statisticsMapper.dashboardToDomain(dto);
  }

  async getWeeklyData(): Promise<WeeklyData[]> {
    return await this.dataSource.getWeeklyData();
  }

  async getCategoryData(range: string = '1M'): Promise<CategoryData[]> {
    return await this.dataSource.getCategoryData(range);
  }

  async getSummary(range: string = '1M'): Promise<StatisticsSummary> {
    return await this.dataSource.getSummary(range);
  }
}