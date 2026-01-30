import { IExerciseRepository } from '../../repositories/IExerciseRepository';
import { Exercise } from '../../entities/Exercise';

export class SearchExerciseUseCase {
  constructor(private exerciseRepository: IExerciseRepository) {}

  async execute(name: string): Promise<Exercise> {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre del ejercicio es requerido');
    }

    return await this.exerciseRepository.searchByName(name);
  }
}