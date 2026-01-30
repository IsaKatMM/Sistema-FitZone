// src/presentation/screens/routines/RoutinesScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Modal,
  TextInput,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRoutines } from '../../hooks/useRoutines';
import { DayOfWeek } from '../../../domain/entities/Routine';
import { UpdateRoutineParams } from '../../../domain/repositories/IRoutineRepository';
import { eventBus } from '../../../core/events/EventBus';

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'LUNES', label: 'Lunes', short: 'L' },
  { key: 'MARTES', label: 'Martes', short: 'M' },
  { key: 'MIERCOLES', label: 'Miércoles', short: 'X' },
  { key: 'JUEVES', label: 'Jueves', short: 'J' },
  { key: 'VIERNES', label: 'Viernes', short: 'V' },
  { key: 'SABADO', label: 'Sábado', short: 'S' },
  { key: 'DOMINGO', label: 'Domingo', short: 'D' }
];

const safeString = (value: any): string => {
  if (value === null || value === undefined) return '0';
  return String(value);
};

export default function RoutinesScreen() {
  const { routines, loading, error, completeRoutine, deleteRoutine, updateRoutine, getRoutinesByDay, refetch } = useRoutines();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('LUNES');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completingIds, setCompletingIds] = useState<Set<number>>(new Set());
  const [editForm, setEditForm] = useState<UpdateRoutineParams>({
    series: 3,
    repeticiones: 12,
    peso: 0,
    notas: ''
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const handleRoutinesUpdated = () => {
      console.log('🔄 Evento recibido: routines-updated');
      Alert.alert(
        'Rutina actualizada',
        'Puedes actualizar la lista deslizando hacia abajo',
        [{ text: 'OK' }]
      );
    };

    console.log('📡 Registrando listener para routines-updated');
    eventBus.on('routines-updated', handleRoutinesUpdated);

    return () => {
      console.log('📡 Limpiando listener para routines-updated');
      eventBus.off('routines-updated', handleRoutinesUpdated);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('📱 RoutinesScreen enfocada, cargando rutinas...');
      if (routines.length === 0 || error) {
        refetch();
      }
    }, [refetch, routines.length, error])
  );

  const dayRoutines = getRoutinesByDay(selectedDay);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.log('Error al actualizar:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleComplete = async (routineId: number) => {
    try {
      if (!routineId || completingIds.has(routineId)) {
        return;
      }

      console.log('🔘 Toggle rutina ID:', routineId);
      setCompletingIds(prev => new Set(prev).add(routineId));
      
      await completeRoutine(routineId);
      
      setCompletingIds(prev => {
        const next = new Set(prev);
        next.delete(routineId);
        return next;
      });
    } catch (err: any) {
      setCompletingIds(prev => {
        const next = new Set(prev);
        next.delete(routineId);
        return next;
      });
      
      if (err.response?.status === 403) {
        Alert.alert(
          'Sesión expirada',
          'Por favor, vuelve a iniciar sesión',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', err.message || 'No se pudo actualizar la rutina');
      }
    }
  };

  const handleDelete = async (routineId: number) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar esta rutina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRoutine(routineId);
              Alert.alert('Éxito', 'Rutina eliminada');
              refetch();
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleEdit = (routine: any) => {
    setEditingRoutine(routine);
    setEditForm({
      series: routine.series,
      repeticiones: routine.repeticiones,
      peso: routine.peso || 0,
      notas: routine.notas || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingRoutine) return;

    setSaving(true);
    try {
      await updateRoutine(editingRoutine.id, editForm);
      Alert.alert('Éxito', 'Rutina actualizada correctamente');
      setShowEditModal(false);
      setEditingRoutine(null);
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo actualizar la rutina');
    } finally {
      setSaving(false);
    }
  };

  const calculateDayProgress = () => {
    if (dayRoutines.length === 0) return 0;
    const completed = dayRoutines.filter(r => r.completado).length;
    return Math.round((completed / dayRoutines.length) * 100);
  };

  const calculateWeekProgress = () => {
    const weekStats = DAYS.map(day => {
      const routinesForDay = getRoutinesByDay(day.key);
      const completed = routinesForDay.filter(r => r.completado).length;
      return {
        day: day.short,
        hasRoutines: routinesForDay.length > 0,
        completed: completed,
        total: routinesForDay.length
      };
    });
    return weekStats;
  };

  const getTodayString = () => {
    return new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatsData = () => {
    const totalRoutines = routines.length;
    const completedRoutines = routines.filter(r => r.completado).length;
    const pendingRoutines = totalRoutines - completedRoutines;
    const completionPercentage = totalRoutines > 0 
      ? Math.round((completedRoutines / totalRoutines) * 100) 
      : 0;

    return {
      totalRoutines,
      completedRoutines,
      pendingRoutines,
      completionPercentage
    };
  };

  const weekProgress = calculateWeekProgress();
  const dayProgress = calculateDayProgress();

  if (loading && !refreshing && routines.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Cargando rutinas...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Mis Rutinas</Text>
            <Text style={styles.subtitle}>{getTodayString()}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#FF6B00" />
              ) : (
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>↻</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statsButtonHeader}
              onPress={() => setShowStatsModal(true)}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>≡</Text>
              </View>
              <Text style={styles.statsButtonLabel}>Estadísticas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Day Selector - CON MEJORA */}
      <View style={styles.daysWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daysContainer}
          contentContainerStyle={styles.daysContent}
        >
          {DAYS.map(day => (
            <TouchableOpacity
              key={day.key}
              style={[
                styles.dayButton,
                selectedDay === day.key && styles.dayButtonActive,
              ]}
              onPress={() => setSelectedDay(day.key)}
            >
              <Text style={[
                styles.dayShort,
                selectedDay === day.key && styles.dayShortActive,
              ]}>
                {day.short}
              </Text>
              <Text style={[
                styles.dayLabel,
                selectedDay === day.key && styles.dayLabelActive,
              ]}>
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>
            {DAYS.find(d => d.key === selectedDay)?.label}
          </Text>
          <Text style={styles.progressPercentage}>{dayProgress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${dayProgress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {dayRoutines.filter(r => r.completado).length} de {dayRoutines.length} ejercicios completados
        </Text>
      </View>

      {/* Weekly Progress Indicator */}
      <View style={styles.weeklyProgressSection}>
        <Text style={styles.weeklyProgressTitle}>Progreso Semanal</Text>
        <View style={styles.weeklyProgressDots}>
          {weekProgress.map((dayData, index) => (
            <View key={index} style={styles.dayProgressContainer}>
              <View style={[
                styles.dayDot,
                dayData.hasRoutines && dayData.completed > 0 && styles.dayDotActive,
                !dayData.hasRoutines && styles.dayDotEmpty
              ]}>
                {dayData.hasRoutines && dayData.completed > 0 && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </View>
              <Text style={styles.dayDotLabel}>{dayData.day}</Text>
              {dayData.hasRoutines && (
                <Text style={styles.dayDotCount}>
                  {dayData.completed}/{dayData.total}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Routines List */}
      {dayRoutines.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>+</Text>
            </View>
          </View>
          <Text style={styles.emptyTitle}>
            No hay ejercicios para {DAYS.find(d => d.key === selectedDay)?.label}
          </Text>
          <Text style={styles.emptyDescription}>
            Ve a la sección de Ejercicios y selecciona "Agregar a Rutina"
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleRefresh}>
            <Text style={styles.primaryButtonText}>Actualizar lista</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={dayRoutines}
          keyExtractor={(item) => `routine-${item.id}`}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF6B00']}
              tintColor="#FF6B00"
            />
          }
          renderItem={({ item }) => {
            if (!item || !item.id) {
              console.warn('⚠️ Rutina sin ID:', item);
              return null;
            }
            
            const isCompleted = item.completado;
            const isProcessing = completingIds.has(item.id);
            
            const seriesStr = safeString(item.series);
            const repsStr = safeString(item.repeticiones);
            const pesoStr = safeString(item.peso);
            const pesoNum = parseFloat(pesoStr);
            
            return (
              <View style={[styles.exerciseCard, isCompleted && styles.exerciseCardCompleted]}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => handleComplete(item.id)}
                  disabled={isProcessing}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkboxBox, 
                    isCompleted && styles.checkboxBoxChecked,
                    isProcessing && styles.checkboxLoading
                  ]}>
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      isCompleted && <Text style={styles.checkboxCheck}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>

                <View style={styles.exerciseContent}>
                  <Text style={[styles.exerciseName, isCompleted && styles.exerciseNameCompleted]}>
                    {item.ejercicio?.nombre || 'Ejercicio'}
                  </Text>
                  <View style={styles.muscleTag}>
                    <Text style={styles.muscleTagText}>
                      {item.ejercicio?.musculoTrabajado || 'General'}
                    </Text>
                  </View>
                  
                  <View style={styles.exerciseDetails}>
                    <View style={styles.detailItem}>
                      <View style={styles.detailIconContainer}>
                        <Text style={styles.detailIcon}>●</Text>
                      </View>
                      <Text style={styles.detailText}>{seriesStr} series</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <View style={styles.detailIconContainer}>
                        <Text style={styles.detailIcon}>●</Text>
                      </View>
                      <Text style={styles.detailText}>{repsStr} reps</Text>
                    </View>
                    {pesoNum > 0 && (
                      <View style={styles.detailItem}>
                        <View style={styles.detailIconContainer}>
                          <Text style={styles.detailIcon}>●</Text>
                        </View>
                        <Text style={styles.detailText}>{pesoStr} kg</Text>
                      </View>
                    )}
                  </View>

                  {item.notas && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesText}>{String(item.notas)}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEdit(item)}
                    disabled={isProcessing}
                  >
                    <Text style={styles.actionIcon}>✎</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDelete(item.id)}
                    disabled={isProcessing}
                  >
                    <Text style={styles.actionIcon}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingRoutine && (
        <Modal
          visible={showEditModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Rutina</Text>
                <TouchableOpacity 
                  onPress={() => setShowEditModal(false)}
                  style={styles.closeButton}
                  disabled={saving}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalExerciseName}>{editingRoutine.ejercicio?.nombre}</Text>
                
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Series</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="number-pad"
                    value={editForm.series.toString()}
                    onChangeText={(text) => setEditForm({...editForm, series: parseInt(text) || 1})}
                    editable={!saving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Repeticiones</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="number-pad"
                    value={editForm.repeticiones.toString()}
                    onChangeText={(text) => setEditForm({...editForm, repeticiones: parseInt(text) || 1})}
                    editable={!saving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Peso (kg)</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="decimal-pad"
                    value={editForm.peso.toString()}
                    onChangeText={(text) => setEditForm({...editForm, peso: parseFloat(text) || 0})}
                    placeholder="0 para peso corporal"
                    editable={!saving}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Notas</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    multiline
                    numberOfLines={4}
                    value={editForm.notas}
                    onChangeText={(text) => setEditForm({...editForm, notas: text})}
                    placeholder="Añade notas personales..."
                    editable={!saving}
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.btnCancel}
                    onPress={() => setShowEditModal(false)}
                    disabled={saving}
                  >
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.btnSave, saving && styles.btnSaveDisabled]}
                    onPress={handleSaveEdit}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.btnSaveText}>Guardar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <Modal
          visible={showStatsModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStatsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Estadísticas</Text>
                <TouchableOpacity 
                  onPress={() => setShowStatsModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statIconContainer}>
                    <Text style={styles.statNumber}>{getStatsData().totalRoutines}</Text>
                  </View>
                  <Text style={styles.statLabel}>Total Rutinas</Text>
                </View>

                <View style={[styles.statCard, styles.statCardSuccess]}>
                  <View style={[styles.statIconContainer, styles.statIconSuccess]}>
                    <Text style={[styles.statNumber, styles.statNumberWhite]}>{getStatsData().completedRoutines}</Text>
                  </View>
                  <Text style={styles.statLabel}>Completadas</Text>
                </View>

                <View style={[styles.statCard, styles.statCardWarning]}>
                  <View style={[styles.statIconContainer, styles.statIconWarning]}>
                    <Text style={[styles.statNumber, styles.statNumberWhite]}>{getStatsData().pendingRoutines}</Text>
                  </View>
                  <Text style={styles.statLabel}>Pendientes</Text>
                </View>

                <View style={[styles.statCard, styles.statCardHighlight]}>
                  <View style={[styles.statIconContainer, styles.statIconHighlight]}>
                    <Text style={[styles.statNumber, styles.statNumberWhite]}>{getStatsData().completionPercentage}%</Text>
                  </View>
                  <Text style={styles.statLabel}>Progreso Total</Text>
                </View>
              </View>

              <View style={styles.progressBarLarge}>
                <View 
                  style={[styles.progressFillLarge, { width: `${getStatsData().completionPercentage}%` }]}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  
  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    padding: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  statsButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EE',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statsButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B00',
  },

  // Days - CON MEJORA
  daysWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  daysContainer: {
    // Sin fondo aquí
  },
  daysContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: 20,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayButtonActive: {
    backgroundColor: '#FF6B00',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dayShort: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 2,
  },
  dayShortActive: {
    color: '#FFFFFF',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
  },
  dayLabelActive: {
    color: '#FFFFFF',
  },

  // Progress
  progressSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },

  // Weekly Progress
  weeklyProgressSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 1,
  },
  weeklyProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  weeklyProgressDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayProgressContainer: {
    alignItems: 'center',
  },
  dayDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayDotActive: {
    backgroundColor: '#FF6B00',
  },
  dayDotEmpty: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayDotLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  dayDotCount: {
    fontSize: 9,
    color: '#999',
    marginTop: 2,
  },

  // Exercise Cards
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  exerciseCardCompleted: {
    backgroundColor: '#FFF5EE',
    borderColor: '#FF6B00',
    borderWidth: 1,
  },
  checkbox: {
    marginRight: 12,
    paddingTop: 2,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxChecked: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  checkboxLoading: {
    backgroundColor: '#999',
    borderColor: '#999',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseContent: {
    flex: 1,
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  exerciseNameCompleted: {
    color: '#666',
  },
  muscleTag: {
    backgroundColor: '#FFF5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  muscleTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6B00',
  },
  exerciseDetails: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 16,
    alignItems: 'center',
    marginRight: 4,
  },
  detailIcon: {
    fontSize: 8,
    color: '#FF6B00',
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  notesContainer: {
    marginTop: 10,
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  notesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'column',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  emptyIconText: {
    fontSize: 36,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },

  // Loading & Error
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#666',
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  modalBody: {
    padding: 20,
  },
  modalExerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  btnCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  btnSave: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
  },
  btnSaveDisabled: {
    backgroundColor: '#FFAB70',
  },
  btnSaveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Stats Modal
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statCardSuccess: {
    backgroundColor: '#FFF5EE',
  },
  statCardWarning: {
    backgroundColor: '#F5F5F5',
  },
  statCardHighlight: {
    backgroundColor: '#FFF5EE',
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconSuccess: {
    backgroundColor: '#FF6B00',
  },
  statIconWarning: {
    backgroundColor: '#999',
  },
  statIconHighlight: {
    backgroundColor: '#FF6B00',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statNumberWhite: {
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 6,
  },
});