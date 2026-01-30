import { IStatisticsRepository } from '../../repositories/IStatisticsRepository';
import { WeeklyData } from '../../entities/Statistics';

export class GetWeeklyDataUseCase {
  constructor(private statisticsRepository: IStatisticsRepository) {}

  async execute(): Promise<WeeklyData[]> {
    return await this.statisticsRepository.getWeeklyData();
  }
}