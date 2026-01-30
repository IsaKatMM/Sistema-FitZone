// src/data/repositories/RecipeRepositoryImpl.ts
import { IRecipeRepository } from '../../domain/repositories/IRecipeRepository';
import { Recipe } from '../../domain/entities/Recipe';
import { RecipeDataSource } from '../datasources/RecipeDataSource';

export class RecipeRepositoryImpl implements IRecipeRepository {
  constructor(private dataSource: RecipeDataSource) {}

  async getAll(): Promise<Recipe[]> {
    return await this.dataSource.getAll();
  }

  async getById(id: number): Promise<Recipe> {
    return await this.dataSource.getById(id);
  }

  async searchByName(query: string): Promise<Recipe[]> {
    return await this.dataSource.searchByName(query);
  }

  async searchByIngredient(query: string): Promise<Recipe[]> {
    return await this.dataSource.searchByIngredient(query);
  }

  async filterByRestrictions(restrictions: string): Promise<Recipe[]> {
    return await this.dataSource.filterByRestrictions(restrictions);
  }

  async getRandom(quantity: number): Promise<Recipe[]> {
    return await this.dataSource.getRandom(quantity);
  }
}