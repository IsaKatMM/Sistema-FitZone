import { IRoutineRepository, AddRoutineParams } from '../../repositories/IRoutineRepository';
import { Routine } from '../../entities/Routine';

export class AddExerciseToRoutineUseCase {
  constructor(private routineRepository: IRoutineRepository) {}

  async execute(params: AddRoutineParams): Promise<Routine> {
    // Validaciones
    if (!params.ejercicioId) {
      throw new Error('El ID del ejercicio es requerido');
    }

    if (!params.dia) {
      throw new Error('El día es requerido');
    }

    if (!params.series || params.series < 1) {
      throw new Error('Las series deben ser al menos 1');
    }

    if (!params.repeticiones || params.repeticiones < 1) {
      throw new Error('Las repeticiones deben ser al menos 1');
    }

    return await this.routineRepository.addRoutine(params);
  }
}