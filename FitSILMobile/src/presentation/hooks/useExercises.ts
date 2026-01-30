import { useState, useEffect } from 'react';
import { Exercise } from '../../domain/entities/Exercise';
import { GetExercisesUseCase } from '../../domain/usecases/exercise/GetExercisesUseCase';
import { ExerciseRepositoryImpl } from '../../data/repositories/ExerciseRepositoryImpl';
import { ExerciseDataSource } from '../../data/datasources/ExerciseDataSource';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const exerciseDataSource = new ExerciseDataSource();
  const exerciseRepository = new ExerciseRepositoryImpl(exerciseDataSource);
  const getExercisesUseCase = new GetExercisesUseCase(exerciseRepository);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExercisesUseCase.execute();
      setExercises(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ejercicios');
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
  };
};