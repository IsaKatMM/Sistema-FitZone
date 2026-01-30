import { IRoutineRepository } from '../../repositories/IRoutineRepository';
import { Routine } from '../../entities/Routine';

export class GetRoutinesUseCase {
  constructor(private routineRepository: IRoutineRepository) {}

  async execute(): Promise<Routine[]> {
    return await this.routineRepository.getUserRoutines();
  }
}