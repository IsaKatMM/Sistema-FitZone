import { IRecipeRepository } from '../../repositories/IRecipeRepository';
import { Recipe } from '../../entities/Recipe';

export class SearchRecipeUseCase {
  constructor(private recipeRepository: IRecipeRepository) {}

  async execute(query: string, searchBy: 'name' | 'ingredient' = 'name'): Promise<Recipe[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('La búsqueda no puede estar vacía');
    }

    if (searchBy === 'name') {
      return await this.recipeRepository.searchByName(query);
    } else {
      return await this.recipeRepository.searchByIngredient(query);
    }
  }
}