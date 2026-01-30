// src/domain/repositories/IRecipeRepository.ts
import { Recipe } from '../entities/Recipe';

export interface IRecipeRepository {
  getAll(): Promise<Recipe[]>;
  getById(id: number): Promise<Recipe>;
  searchByName(query: string): Promise<Recipe[]>;
  searchByIngredient(query: string): Promise<Recipe[]>;
  filterByRestrictions(restrictions: string): Promise<Recipe[]>;
  getRandom(quantity: number): Promise<Recipe[]>;
}