// src/domain/repositories/IRoutineRepository.ts
import { Routine, DayOfWeek } from '../entities/Routine';

export interface AddRoutineParams {
  ejercicioId: number;
  dia: DayOfWeek;
  series: number;
  repeticiones: number;
  peso: number;
  notas: string;
}

export interface UpdateRoutineParams {
  series: number;
  repeticiones: number;
  peso: number;
  notas: string;
}

export interface IRoutineRepository {
  getUserRoutines(): Promise<Routine[]>;
  getRoutinesByDay(day: DayOfWeek): Promise<Routine[]>;
  addRoutine(params: AddRoutineParams): Promise<Routine>;
  completeRoutine(id: number): Promise<Routine>;
  updateRoutine(id: number, params: UpdateRoutineParams): Promise<Routine>;
  deleteRoutine(id: number): Promise<void>;
  getStatistics(): Promise<any>;
  completeDayRoutines(day: DayOfWeek): Promise<{ completadas: number; minutosTotal: number }>;
}