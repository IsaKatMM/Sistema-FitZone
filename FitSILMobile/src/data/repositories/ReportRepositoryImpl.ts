//src/data/repositories/ReportRepositoryImpl.ts
import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { Report, ReportType } from '../../domain/entities/Report';
import { ReportDataSource } from '../datasources/ReportDataSource';
import { reportMapper } from '../mappers/reportMapper';

export class ReportRepositoryImpl implements IReportRepository {
  constructor(private dataSource: ReportDataSource) {}

  async getPublicReports(): Promise<Report[]> {
    const dtos = await this.dataSource.getPublicReports();
    return reportMapper.toDomainList(dtos);
  }

  async generateMonthlyReport(): Promise<any> {
    return await this.dataSource.generateMonthlyReport();
  }

  async generateWeeklyReport(): Promise<any> {
    return await this.dataSource.generateWeeklyReport();
  }

  async generateCaloriesReport(range: string = '1M'): Promise<any> {
    return await this.dataSource.generateCaloriesReport(range);
  }

  async generateFullHistory(): Promise<any> {
    return await this.dataSource.generateFullHistory();
  }

  async downloadReport(type: ReportType, range: string = '1M'): Promise<any> {
    return await this.dataSource.downloadReport(type, range);
  }

  async downloadAdminReport(id: number, format: string = 'JSON'): Promise<any> {
    return await this.dataSource.downloadAdminReport(id, format);
  }
}