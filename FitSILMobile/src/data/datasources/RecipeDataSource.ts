import { apiClient } from '../../core/api/apiClient';
import { ENDPOINTS } from '../../core/api/endpoints';
import { RecipeDTO } from '../models/RecipeDTO';

export class RecipeDataSource {
  async getAll(): Promise<RecipeDTO[]> {
    return await apiClient.get(ENDPOINTS.RECIPES.GET_ALL);
  }

  async getById(id: number): Promise<RecipeDTO> {
    return await apiClient.get(ENDPOINTS.RECIPES.GET_BY_ID(id));
  }

  async searchByName(query: string): Promise<RecipeDTO[]> {
    return await apiClient.get(`${ENDPOINTS.RECIPES.SEARCH_NAME}?q=${query}`);
  }

  async searchByIngredient(query: string): Promise<RecipeDTO[]> {
    return await apiClient.get(`${ENDPOINTS.RECIPES.SEARCH_INGREDIENT}?q=${query}`);
  }

  async filterByRestrictions(restrictions: string): Promise<RecipeDTO[]> {
    return await apiClient.get(`${ENDPOINTS.RECIPES.FILTER}?restricciones=${restrictions}`);
  }

  async getRandom(quantity: number = 3): Promise<RecipeDTO[]> {
    return await apiClient.get(`${ENDPOINTS.RECIPES.RANDOM}?cantidad=${quantity}`);
  }
}