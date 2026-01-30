import { Routine, DayOfWeek } from '../../domain/entities/Routine';
import { RoutineDTO } from '../models/RoutineDTO';
import { exerciseMapper } from './exerciseMapper';

export const routineMapper = {
  toDomain(dto: RoutineDTO): Routine {

    if (!dto || !dto.id) {
      console.error('❌ DTO sin ID:', dto);
      throw new Error('Rutina sin ID válido');
    }

    return {
      id: dto.id,
      ejercicio: exerciseMapper.toDomain(dto.ejercicio),
      diaSemana: dto.diaSemana as DayOfWeek,
      series: dto.series,
      repeticiones: dto.repeticiones,
      peso: dto.peso,
      notas: dto.notas,
      completado: dto.completado,
      fechaCreacion: dto.fechaCreacion,
    };
  },

  toDomainList(dtos: RoutineDTO[]): Routine[] {
    // ✅ Filtrar rutinas sin ID
    return dtos
      .filter(dto => dto && dto.id)
      .map(this.toDomain);
  },
};