import { Exercise } from '../../domain/entities/Exercise';
import { ExerciseDTO } from '../models/ExerciseDTO';

export const exerciseMapper = {
  toDomain(dto: ExerciseDTO): Exercise {
    return {
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      musculoTrabajado: dto.musculoTrabajado,
      imagenUrl: dto.imagenUrl,
    };
  },

  toDomainList(dtos: ExerciseDTO[]): Exercise[] {
    return dtos.map(this.toDomain);
  },
};