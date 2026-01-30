import { ExerciseDTO } from './ExerciseDTO';

export interface RoutineDTO {
  id: number;
  ejercicio: ExerciseDTO;
  diaSemana: string;
  series: number;
  repeticiones: number;
  peso?: number;
  notas?: string;
  completado: boolean;
  fechaCreacion: string;
}