import { apiClient } from '../../core/api/apiClient';
import { ENDPOINTS, API_BASE_URL } from '../../core/api/endpoints';
import { ExerciseDTO } from '../models/ExerciseDTO';

export class ExerciseDataSource {
  async getAll(): Promise<ExerciseDTO[]> {
    return await apiClient.get(ENDPOINTS.EXERCISES.GET_ALL);
  }

  async searchByName(name: string): Promise<ExerciseDTO> {
    return await apiClient.get(`${ENDPOINTS.EXERCISES.SEARCH}?nombre=${name}`);
  }

  getImageUrl(filename: string): string {
    return `${API_BASE_URL}${ENDPOINTS.EXERCISES.IMAGE(filename)}`;
  }
}