import { IRoutineRepository } from '../../repositories/IRoutineRepository';
import { Routine } from '../../entities/Routine';

export class CompleteRoutineUseCase {
  constructor(private routineRepository: IRoutineRepository) {}

  async execute(routineId: number): Promise<Routine> {
    if (!routineId) {
      throw new Error('El ID de la rutina es requerido');
    }

    return await this.routineRepository.completeRoutine(routineId);
  }
}