// src/domain/repositories/IExerciseRepository.ts
import { Exercise } from '../entities/Exercise';

export interface IExerciseRepository {
  getAll(): Promise<Exercise[]>;
  searchByName(name: string): Promise<Exercise>;
  getImageUrl(filename: string): string;
}