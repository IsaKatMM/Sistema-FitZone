// src/data/repositories/ExerciseRepositoryImpl.ts
import { IExerciseRepository } from '../../domain/repositories/IExerciseRepository';
import { Exercise } from '../../domain/entities/Exercise';
import { ExerciseDataSource } from '../datasources/ExerciseDataSource';
import { exerciseMapper } from '../mappers/exerciseMapper';

export class ExerciseRepositoryImpl implements IExerciseRepository {
  constructor(private dataSource: ExerciseDataSource) {}

  async getAll(): Promise<Exercise[]> {
    const dtos = await this.dataSource.getAll();
    return exerciseMapper.toDomainList(dtos);
  }

  async searchByName(name: string): Promise<Exercise> {
    const dto = await this.dataSource.searchByName(name);
    return exerciseMapper.toDomain(dto);
  }

  getImageUrl(filename: string): string {
    return this.dataSource.getImageUrl(filename);
  }
}