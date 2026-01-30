// src/presentation/hooks/useRecipes.ts
import { useState, useEffect } from 'react';
import { Recipe } from '../../domain/entities/Recipe';
import { RecipeRepositoryImpl } from '../../data/repositories/RecipeRepositoryImpl';
import { RecipeDataSource } from '../../data/datasources/RecipeDataSource';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recipeDataSource = new RecipeDataSource();
  const recipeRepository = new RecipeRepositoryImpl(recipeDataSource);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recipeRepository.getAll();
      setRecipes(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar recetas');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
  };
};