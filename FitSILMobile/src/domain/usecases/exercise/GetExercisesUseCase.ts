// src/domain/usecases/exercise/GetExercisesUseCase.ts
import { IExerciseRepository } from '../../repositories/IExerciseRepository';
import { Exercise } from '../../entities/Exercise';

export class GetExercisesUseCase {
  constructor(private repository: IExerciseRepository) {}

  async execute(): Promise<Exercise[]> {
    return await this.repository.getAll();
  }
}