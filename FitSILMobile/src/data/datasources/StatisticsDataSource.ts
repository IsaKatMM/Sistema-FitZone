import { apiClient } from '../../core/api/apiClient';
import { ENDPOINTS } from '../../core/api/endpoints';
import { DashboardDTO } from '../models/StatisticsDTO';

export class StatisticsDataSource {
  async getDashboard(range: string = '1M'): Promise<DashboardDTO> {
    return await apiClient.get(`${ENDPOINTS.STATISTICS.DASHBOARD}?rango=${range}`);
  }

  async getWeeklyData(): Promise<any[]> {
    return await apiClient.get(ENDPOINTS.STATISTICS.WEEK);
  }

  async getCategoryData(range: string = '1M'): Promise<any[]> {
    return await apiClient.get(`${ENDPOINTS.STATISTICS.BY_CATEGORY}?rango=${range}`);
  }

  async getSummary(range: string = '1M'): Promise<any> {
    return await apiClient.get(`${ENDPOINTS.STATISTICS.SUMMARY}?rango=${range}`);
  }
}