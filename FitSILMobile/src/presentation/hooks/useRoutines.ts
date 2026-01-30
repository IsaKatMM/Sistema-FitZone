// src/presentation/hooks/useRoutines.ts
import { useState, useEffect } from 'react';
import { Routine, DayOfWeek } from '../../domain/entities/Routine';
import { RoutineRepositoryImpl } from '../../data/repositories/RoutineRepositoryImpl';
import { RoutineDataSource } from '../../data/datasources/RoutineDataSource';
import { UpdateRoutineParams } from '../../domain/repositories/IRoutineRepository';

export const useRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const routineDataSource = new RoutineDataSource();
  const routineRepository = new RoutineRepositoryImpl(routineDataSource);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routineRepository.getUserRoutines();
      setRoutines(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar rutinas');
      console.error('Error fetching routines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  // ✅ SOLUCIÓN: Actualización optimista
  const completeRoutine = async (routineId: number) => {
    // 1. Guardar estado anterior
    const previousRoutines = [...routines];
    
    // 2. Actualizar UI inmediatamente (optimista)
    setRoutines(prev => 
      prev.map(r => 
        r.id === routineId 
          ? { ...r, completado: !r.completado } 
          : r
      )
    );
    
    try {
      // 3. Llamar al backend
      await routineRepository.completeRoutine(routineId);
      
      // 4. Refrescar para sincronizar con el servidor
      await fetchRoutines();
    } catch (err: any) {
      // 5. Si falla, revertir al estado anterior
      console.error('❌ Error al completar rutina:', err);
      setRoutines(previousRoutines);
      throw err;
    }
  };

  const deleteRoutine = async (routineId: number) => {
    await routineRepository.deleteRoutine(routineId);
    await fetchRoutines();
  };

  const updateRoutine = async (routineId: number, params: UpdateRoutineParams) => {
    await routineRepository.updateRoutine(routineId, params);
    await fetchRoutines();
  };

  const getRoutinesByDay = (day: DayOfWeek): Routine[] => {
    return routines.filter(routine => routine.diaSemana === day);
  };

  return {
    routines,
    loading,
    error,
    completeRoutine,
    deleteRoutine,
    updateRoutine,
    getRoutinesByDay,
    refetch: fetchRoutines,
  };
};