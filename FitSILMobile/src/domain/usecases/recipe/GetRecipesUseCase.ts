import { IRecipeRepository } from '../../repositories/IRecipeRepository';
import { Recipe } from '../../entities/Recipe';

export class GetRecipesUseCase {
  constructor(private recipeRepository: IRecipeRepository) {}

  async execute(): Promise<Recipe[]> {
    return await this.recipeRepository.getAll();
  }
}