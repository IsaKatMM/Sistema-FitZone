// src/data/datasources/RoutineDataSource.ts
import { apiClient } from '../../core/api/apiClient';
import { RoutineDTO } from '../models/RoutineDTO';
import { DayOfWeek } from '../../domain/entities/Routine';

export class RoutineDataSource {
  async getUserRoutines(): Promise<RoutineDTO[]> {
    return await apiClient.get<RoutineDTO[]>('/api/rutinas/usuario');
  }

  async getRoutinesByDay(day: DayOfWeek): Promise<RoutineDTO[]> {
    return await apiClient.get<RoutineDTO[]>(`/api/rutinas/dia/${day}`);
  }

  async addRoutine(data: {
    ejercicioId: number;
    dia: DayOfWeek;
    series: number;
    repeticiones: number;
    peso: number;
    notas: string;
  }): Promise<RoutineDTO> {
    console.log('🔄 Enviando a /api/rutinas/agregar:', data);
    const response = await apiClient.post<any>('/api/rutinas/agregar', data);
    
    // ✅ SOLUCIÓN: Extraer la rutina si viene envuelta
    if (response.rutina) {
      return response.rutina;
    }
    return response;
  }

  async completeRoutine(routineId: number): Promise<RoutineDTO> {
    console.log('✅ Completando rutina con ID:', routineId);
    const response = await apiClient.put<any>(`/api/rutinas/${routineId}/completar`, {});
    
    // ✅ SOLUCIÓN: Extraer la rutina si viene envuelta
    console.log('📦 Response completo:', response);
    if (response.rutina) {
      console.log('✅ Extrayendo rutina del wrapper');
      return response.rutina;
    }
    return response;
  }

  async updateRoutine(routineId: number, data: {
    series: number;
    repeticiones: number;
    peso: number;
    notas: string;
  }): Promise<RoutineDTO> {
    const response = await apiClient.put<any>(`/api/rutinas/${routineId}`, data);
    
    // ✅ SOLUCIÓN: Extraer la rutina si viene envuelta
    if (response.rutina) {
      return response.rutina;
    }
    return response;
  }

  async deleteRoutine(routineId: number): Promise<void> {
    await apiClient.delete(`/api/rutinas/${routineId}`);
  }

  async getStatistics(): Promise<any> {
    return await apiClient.get<any>('/api/rutinas/estadisticas');
  }

  async completeDayRoutines(day: DayOfWeek): Promise<{ completadas: number; minutosTotal: number }> {
    return await apiClient.post<{ completadas: number; minutosTotal: number }>(
      `/api/rutinas/completar-dia/${day}`,
      {}
    );
  }
}