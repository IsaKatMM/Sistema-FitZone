import { IStatisticsRepository } from '../../repositories/IStatisticsRepository';
import { DashboardData } from '../../entities/Statistics';

export class GetDashboardUseCase {
  constructor(private statisticsRepository: IStatisticsRepository) {}

  async execute(range: string = '1M'): Promise<DashboardData> {
    return await this.statisticsRepository.getDashboard(range);
  }
}