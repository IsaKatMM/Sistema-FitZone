//src/domain/repositories/IReportRepository.ts
import { Report, ReportType } from '../entities/Report';

export interface IReportRepository {
  getPublicReports(): Promise<Report[]>;
  generateMonthlyReport(): Promise<any>;
  generateWeeklyReport(): Promise<any>;
  generateCaloriesReport(range?: string): Promise<any>;
  generateFullHistory(): Promise<any>;
  downloadReport(type: ReportType, range?: string): Promise<any>;
  downloadAdminReport(id: number, format?: string): Promise<any>;
}