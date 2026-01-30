import { Exercise } from "./Exercise";

export type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

export interface Routine {
  id: number;
  ejercicio: Exercise;
  diaSemana: DayOfWeek;
  series: number;
  repeticiones: number;
  peso?: number;
  notas?: string;
  completado: boolean;
  fechaCreacion: string;
}