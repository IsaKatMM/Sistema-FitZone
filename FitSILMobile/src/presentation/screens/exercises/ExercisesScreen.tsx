// src/presentation/screens/exercises/ExercisesScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ExerciseDataSource } from '../../../data/datasources/ExerciseDataSource';
import { RoutineDataSource } from '../../../data/datasources/RoutineDataSource';
import { ExerciseDTO } from '../../../data/models/ExerciseDTO';
import { DayOfWeek } from '../../../domain/entities/Routine';
import { SafeScrollView } from '../../components/common/SafeScrollView';
import { eventBus } from '../../../core/events/EventBus';
import Ionicons from '@expo/vector-icons/Ionicons';

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'LUNES', label: 'Lunes' },
  { key: 'MARTES', label: 'Martes' },
  { key: 'MIERCOLES', label: 'Miércoles' },
  { key: 'JUEVES', label: 'Jueves' },
  { key: 'VIERNES', label: 'Viernes' },
  { key: 'SABADO', label: 'Sábado' },
  { key: 'DOMINGO', label: 'Domingo' }
];

export default function ExercisesScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDTO | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [routineForm, setRoutineForm] = useState({
    dia: 'LUNES' as DayOfWeek,
    series: 3,
    repeticiones: 12,
    peso: 0,
    notas: ''
  });
  
  const exerciseDataSource = new ExerciseDataSource();
  const routineDataSource = new RoutineDataSource();

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchQuery, exercises]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseDataSource.getAll();
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
      Alert.alert('Error', 'No se pudieron cargar los ejercicios');
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    if (!searchQuery.trim()) {
      setFilteredExercises(exercises);
      return;
    }

    const filtered = exercises.filter(exercise =>
      exercise.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.musculoTrabajado?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  };

  const handleSelectExercise = (exercise: ExerciseDTO) => {
    setSelectedExercise(exercise);
  };

  const handleOpenAddModal = (exercise: ExerciseDTO) => {
    setSelectedExercise(exercise);
    setRoutineForm({
      dia: 'LUNES',
      series: 3,
      repeticiones: 12,
      peso: 0,
      notas: ''
    });
    setShowAddModal(true);
  };

  const handleAddToRoutine = async () => {
    if (!selectedExercise) return;

    setSaving(true);
    try {
      const routineData = {
        ejercicioId: selectedExercise.id,
        dia: routineForm.dia,
        series: routineForm.series,
        repeticiones: routineForm.repeticiones,
        peso: routineForm.peso,
        notas: routineForm.notas
      };

      console.log('📤 Enviando rutina:', routineData);
      await routineDataSource.addRoutine(routineData);
      
      console.log('📢 Emitiendo evento: routines-updated');
      eventBus.emit('routines-updated');
      
      Alert.alert(
        '✅ ¡Agregado!',
        `${selectedExercise.nombre} agregado a tu rutina del ${routineForm.dia.toLowerCase()}`,
        [
          { text: 'Seguir viendo ejercicios', style: 'cancel' },
          { 
            text: 'Ir a mis rutinas', 
            onPress: () => router.push('/(main)/routines')
          }
        ]
      );
      
      setShowAddModal(false);
      setSelectedExercise(null);
    } catch (error: any) {
      console.error('❌ Error al agregar:', error);
      Alert.alert('Error', error.message || 'No se pudo agregar a la rutina');
    } finally {
      setSaving(false);
    }
  };

  const renderExerciseCard = (item: ExerciseDTO) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.exerciseCard}
      onPress={() => handleSelectExercise(item)}
    >
      <View style={styles.cardImage}>
        {item.imagenUrl ? (
          <Image
            source={{ uri: exerciseDataSource.getImageUrl(item.imagenUrl) }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="barbell" size={48} color="white" />
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.exerciseName} numberOfLines={2}>{item.nombre}</Text>
        <View style={styles.muscleTag}>
          <Text style={styles.muscleTagText}>{item.musculoTrabajado || 'General'}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={(e) => {
            e.stopPropagation();
            handleOpenAddModal(item);
          }}
        >
          <Ionicons name="add-circle" size={18} color="white" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderExercisesGrid = () => {
    const rows = [];
    for (let i = 0; i < filteredExercises.length; i += 2) {
      const row = (
        <View key={i} style={styles.row}>
          {renderExerciseCard(filteredExercises[i])}
          {filteredExercises[i + 1] && renderExerciseCard(filteredExercises[i + 1])}
        </View>
      );
      rows.push(row);
    }
    return rows;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Cargando ejercicios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="barbell" size={32} color="#FF6B00" />
          <Text style={styles.title}>Ejercicios</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicios..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SafeScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {filteredExercises.length > 0 ? (
            renderExercisesGrid()
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={64} color="#94a3b8" />
              <Text style={styles.emptyText}>No se encontraron ejercicios</Text>
              {searchQuery && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearButtonText}>Limpiar búsqueda</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </SafeScrollView>

      {/* Modal */}
      {showAddModal && selectedExercise && (
        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Agregar a Rutina</Text>
                <TouchableOpacity 
                  onPress={() => setShowAddModal(false)}
                  style={styles.closeButton}
                  disabled={saving}
                >
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.exerciseInfoModal}>
                  <Ionicons name="barbell" size={40} color="#FF6B00" />
                  <Text style={styles.modalExerciseName}>{selectedExercise.nombre}</Text>
                  <View style={styles.muscleTag}>
                    <Text style={styles.muscleTagText}>{selectedExercise.musculoTrabajado}</Text>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    <Ionicons name="calendar" size={14} color="#FF6B00" /> Día de la semana
                  </Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.daysScroll}
                  >
                    {DAYS.map(day => (
                      <TouchableOpacity
                        key={day.key}
                        style={[
                          styles.dayPill,
                          routineForm.dia === day.key && styles.dayPillActive
                        ]}
                        onPress={() => setRoutineForm({...routineForm, dia: day.key})}
                        disabled={saving}
                      >
                        <Text style={[
                          styles.dayPillText,
                          routineForm.dia === day.key && styles.dayPillTextActive
                        ]}>
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>
                      <Ionicons name="repeat" size={14} color="#FF6B00" /> Series
                    </Text>
                    <TextInput
                      style={styles.formInput}
                      keyboardType="number-pad"
                      value={routineForm.series.toString()}
                      onChangeText={(text) => setRoutineForm({
                        ...routineForm, 
                        series: parseInt(text) || 1
                      })}
                      placeholder="3"
                      editable={!saving}
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.formLabel}>
                      <Ionicons name="fitness" size={14} color="#FF6B00" /> Repeticiones
                    </Text>
                    <TextInput
                      style={styles.formInput}
                      keyboardType="number-pad"
                      value={routineForm.repeticiones.toString()}
                      onChangeText={(text) => setRoutineForm({
                        ...routineForm, 
                        repeticiones: parseInt(text) || 1
                      })}
                      placeholder="12"
                      editable={!saving}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    <Ionicons name="barbell-outline" size={14} color="#FF6B00" /> Peso (kg) - Opcional
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="decimal-pad"
                    value={routineForm.peso.toString()}
                    onChangeText={(text) => setRoutineForm({
                      ...routineForm, 
                      peso: parseFloat(text) || 0
                    })}
                    placeholder="0 para solo peso corporal"
                    editable={!saving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    <Ionicons name="document-text" size={14} color="#FF6B00" /> Notas - Opcional
                  </Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    multiline
                    numberOfLines={4}
                    value={routineForm.notas}
                    onChangeText={(text) => setRoutineForm({
                      ...routineForm, 
                      notas: text
                    })}
                    placeholder="Ej: Mantener espalda recta, 60s de descanso..."
                    editable={!saving}
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.btnCancel}
                    onPress={() => setShowAddModal(false)}
                    disabled={saving}
                  >
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnSave, saving && styles.btnSaveDisabled]}
                    onPress={handleAddToRoutine}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Ionicons name="add-circle" size={20} color="white" />
                        <Text style={styles.btnSaveText}>Agregar</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    padding: 10,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  exerciseCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 12,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
    minHeight: 40,
  },
  muscleTag: {
    backgroundColor: '#FFF5EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFD1A8',
  },
  muscleTagText: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 20,
  },
  exerciseInfoModal: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalExerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  daysScroll: {
    marginTop: 8,
  },
  dayPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayPillActive: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  dayPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  dayPillTextActive: {
    color: 'white',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  formInput: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  btnCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  btnCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  btnSave: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  btnSaveDisabled: {
    backgroundColor: '#FFB380',
  },
  btnSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});