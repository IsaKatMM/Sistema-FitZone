// src/data/repositories/RoutineRepositoryImpl.ts
import { IRoutineRepository, AddRoutineParams, UpdateRoutineParams } from '../../domain/repositories/IRoutineRepository';
import { Routine, DayOfWeek } from '../../domain/entities/Routine';
import { RoutineDataSource } from '../datasources/RoutineDataSource';
import { routineMapper } from '../mappers/routineMapper';

export class RoutineRepositoryImpl implements IRoutineRepository {
  constructor(private dataSource: RoutineDataSource) {}

  async getUserRoutines(): Promise<Routine[]> {
    const dtos = await this.dataSource.getUserRoutines();
    return routineMapper.toDomainList(dtos);
  }

  async getRoutinesByDay(day: DayOfWeek): Promise<Routine[]> {
    const dtos = await this.dataSource.getRoutinesByDay(day);
    return routineMapper.toDomainList(dtos);
  }

  async addRoutine(params: AddRoutineParams): Promise<Routine> {
    const dto = await this.dataSource.addRoutine(params);
    return routineMapper.toDomain(dto);
  }

  async completeRoutine(id: number): Promise<Routine> {
    const dto = await this.dataSource.completeRoutine(id);
    return routineMapper.toDomain(dto);
  }

  async updateRoutine(id: number, params: UpdateRoutineParams): Promise<Routine> {
    const dto = await this.dataSource.updateRoutine(id, params);
    return routineMapper.toDomain(dto);
  }

  async deleteRoutine(id: number): Promise<void> {
    await this.dataSource.deleteRoutine(id);
  }

  async getStatistics(): Promise<any> {
    return await this.dataSource.getStatistics();
  }

  async completeDayRoutines(day: DayOfWeek): Promise<{ completadas: number; minutosTotal: number }> {
    return await this.dataSource.completeDayRoutines(day);
  }
}