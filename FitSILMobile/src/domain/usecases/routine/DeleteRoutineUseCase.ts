import { IRoutineRepository } from '../../repositories/IRoutineRepository';

export class DeleteRoutineUseCase {
  constructor(private routineRepository: IRoutineRepository) {}

  async execute(routineId: number): Promise<void> {
    if (!routineId) {
      throw new Error('El ID de la rutina es requerido');
    }

    await this.routineRepository.deleteRoutine(routineId);
  }
}