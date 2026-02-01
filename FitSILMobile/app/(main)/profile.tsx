// app/(main)/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../src/presentation/context/AuthContext';
import { useRouter } from 'expo-router';
import { RoutineDataSource } from '../../src/data/datasources/RoutineDataSource';
import Ionicons from '@expo/vector-icons/Ionicons';

type TabType = 'info' | 'physical' | 'stats' | 'settings';

interface Statistics {
  rutinasCompletadas: number;
  ejerciciosRealizados: number;
  tiempoTotal: string;
  rachaActual: number;
}

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    peso: '',
    altura: ''
  });
  const [estadisticas, setEstadisticas] = useState<Statistics>({
    rutinasCompletadas: 0,
    ejerciciosRealizados: 0,
    tiempoTotal: '0h 0m',
    rachaActual: 0
  });

  const routineDataSource = new RoutineDataSource();

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || '',
        peso: user.peso?.toString() || '',
        altura: user.altura?.toString() || ''
      });
    }
    cargarEstadisticas();
  }, [user]);

  const cargarEstadisticas = async () => {
    try {
      const rutinas = await routineDataSource.getUserRoutines();
      const completadas = rutinas.filter(r => r.completado).length;
      const tiempoTotal = completadas * 10;
      const horas = Math.floor(tiempoTotal / 60);
      const mins = tiempoTotal % 60;

      setEstadisticas({
        rutinasCompletadas: completadas,
        ejerciciosRealizados: rutinas.length,
        tiempoTotal: `${horas}h ${mins}m`,
        rachaActual: 0
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleUpdate = async () => {
    if (!user?.correo) {
      Alert.alert('Error', 'No se pudo identificar al usuario');
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        peso: parseFloat(formData.peso) || 0,
        altura: parseFloat(formData.altura) || 0
      };

      console.log('📤 Actualizando perfil:', updatedData);
      
      await updateUser(user.correo, updatedData);
      
      Alert.alert('✅ Éxito', 'Perfil actualizado correctamente');
      setEditMode(false);
      
      await cargarEstadisticas();
      
    } catch (error: any) {
      console.error('❌ Error:', error);
      Alert.alert('❌ Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const calcularIMC = () => {
    if (user?.peso && user?.altura && user.altura > 0) {
      const imc = user.peso / (user.altura * user.altura);
      return imc.toFixed(1);
    }
    return 'N/A';
  };

  const getIMCCategoria = (imc: string) => {
    if (imc === 'N/A') return 'Sin datos';
    const valor = parseFloat(imc);
    if (valor < 18.5) return 'Bajo peso';
    if (valor < 25) return 'Normal';
    if (valor < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  const imc = calcularIMC();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FF6B00" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarTextLarge}>
                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0) || ''}
              </Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={14} color="white" />
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.nombre} {user?.apellido}
            </Text>
            <Text style={styles.profileEmail}>{user?.correo}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#FF6B00" />
              <Text style={styles.roleText}>{user?.rol}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.editText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.tabActive]}
            onPress={() => setActiveTab('info')}
          >
            <Ionicons 
              name={activeTab === 'info' ? "person" : "person-outline"} 
              size={20} 
              color={activeTab === 'info' ? '#FF6B00' : '#64748b'} 
            />
            <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
              Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'physical' && styles.tabActive]}
            onPress={() => setActiveTab('physical')}
          >
            <Ionicons 
              name={activeTab === 'physical' ? "fitness" : "fitness-outline"} 
              size={20} 
              color={activeTab === 'physical' ? '#FF6B00' : '#64748b'} 
            />
            <Text style={[styles.tabText, activeTab === 'physical' && styles.tabTextActive]}>
              Físico
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
            onPress={() => setActiveTab('stats')}
          >
            <Ionicons 
              name={activeTab === 'stats' ? "stats-chart" : "stats-chart-outline"} 
              size={20} 
              color={activeTab === 'stats' ? '#FF6B00' : '#64748b'} 
            />
            <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
              Stats
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
            onPress={() => setActiveTab('settings')}
          >
            <Ionicons 
              name={activeTab === 'settings' ? "settings" : "settings-outline"} 
              size={20} 
              color={activeTab === 'settings' ? '#FF6B00' : '#64748b'} 
            />
            <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>
              Config
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {/* Información Personal */}
          {activeTab === 'info' && (
            <View style={styles.infoSection}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="document-text" size={24} color="#FF6B00" />
                  <Text style={styles.cardTitle}>Datos Personales</Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="person" size={20} color="#FF6B00" />
                  <View style={styles.infoDetails}>
                    <Text style={styles.infoLabel}>Nombre</Text>
                    <Text style={styles.infoValue}>{user?.nombre}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="people" size={20} color="#FF6B00" />
                  <View style={styles.infoDetails}>
                    <Text style={styles.infoLabel}>Apellido</Text>
                    <Text style={styles.infoValue}>
                      {user?.apellido || 'No registrado'}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="mail" size={20} color="#FF6B00" />
                  <View style={styles.infoDetails}>
                    <Text style={styles.infoLabel}>Correo</Text>
                    <Text style={styles.infoValue}>{user?.correo}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="call" size={20} color="#FF6B00" />
                  <View style={styles.infoDetails}>
                    <Text style={styles.infoLabel}>Teléfono</Text>
                    <Text style={styles.infoValue}>
                      {user?.telefono || 'No registrado'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Datos Físicos */}
          {activeTab === 'physical' && (
            <View style={styles.physicalSection}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="body" size={24} color="#FF6B00" />
                  <Text style={styles.cardTitle}>Información Física</Text>
                </View>

                <View style={styles.physicalStats}>
                  <View style={styles.physicalCard}>
                    <Ionicons name="scale" size={32} color="#FF6B00" />
                    <Text style={styles.physicalLabel}>Peso</Text>
                    <Text style={styles.physicalValue}>
                      {user?.peso ? `${user.peso} kg` : 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.physicalCard}>
                    <Ionicons name="resize" size={32} color="#FF6B00" />
                    <Text style={styles.physicalLabel}>Altura</Text>
                    <Text style={styles.physicalValue}>
                      {user?.altura ? `${user.altura} m` : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* IMC Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="analytics" size={24} color="#FF6B00" />
                  <Text style={styles.cardTitle}>Índice de Masa Corporal</Text>
                </View>

                <View style={styles.imcDisplay}>
                  <View style={styles.imcCircle}>
                    <Text style={styles.imcNumber}>{imc}</Text>
                    <Text style={styles.imcLabel}>IMC</Text>
                  </View>
                  <View style={styles.imcInfo}>
                    <Text style={styles.imcCategory}>{getIMCCategoria(imc)}</Text>
                    <Text style={styles.imcDescription}>
                      {imc === 'N/A'
                        ? 'Registra tu peso y altura'
                        : `Tu IMC está en rango de ${getIMCCategoria(imc).toLowerCase()}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.imcRanges}>
                  <View style={styles.rangeBar}>
                    <View style={[styles.rangeSegment, { backgroundColor: '#fbbf24' }]} />
                    <View style={[styles.rangeSegment, { backgroundColor: '#10b981' }]} />
                    <View style={[styles.rangeSegment, { backgroundColor: '#f97316' }]} />
                    <View style={[styles.rangeSegment, { backgroundColor: '#ef4444' }]} />
                  </View>
                  <View style={styles.rangeLabels}>
                    <Text style={styles.rangeLabel}>{'<18.5'}</Text>
                    <Text style={styles.rangeLabel}>18.5-24.9</Text>
                    <Text style={styles.rangeLabel}>25-29.9</Text>
                    <Text style={styles.rangeLabel}>{'≥30'}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Estadísticas */}
          {activeTab === 'stats' && (
            <View style={styles.statsSection}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="trending-up" size={24} color="#FF6B00" />
                  <Text style={styles.cardTitle}>Estadísticas de Entrenamiento</Text>
                </View>

                <View style={styles.statsGrid}>
                  <View style={[styles.statCard, { backgroundColor: '#FFF5EB' }]}>
                    <Ionicons name="barbell" size={32} color="#FF6B00" />
                    <Text style={styles.statCardLabel}>Rutinas Completadas</Text>
                    <Text style={styles.statCardValue}>
                      {estadisticas.rutinasCompletadas}
                    </Text>
                  </View>

                  <View style={[styles.statCard, { backgroundColor: '#FFF5EB' }]}>
                    <Ionicons name="fitness" size={32} color="#FF6B00" />
                    <Text style={styles.statCardLabel}>Ejercicios Realizados</Text>
                    <Text style={styles.statCardValue}>
                      {estadisticas.ejerciciosRealizados}
                    </Text>
                  </View>

                  <View style={[styles.statCard, { backgroundColor: '#FFF5EB' }]}>
                    <Ionicons name="time" size={32} color="#FF6B00" />
                    <Text style={styles.statCardLabel}>Tiempo Total</Text>
                    <Text style={styles.statCardValue}>{estadisticas.tiempoTotal}</Text>
                  </View>

                  <View style={[styles.statCard, { backgroundColor: '#FFF5EB' }]}>
                    <Ionicons name="flame" size={32} color="#FF6B00" />
                    <Text style={styles.statCardLabel}>Racha Actual</Text>
                    <Text style={styles.statCardValue}>
                      {estadisticas.rachaActual} días
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Configuración */}
          {activeTab === 'settings' && (
            <View style={styles.settingsSection}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="lock-closed" size={24} color="#FF6B00" />
                  <Text style={styles.cardTitle}>Seguridad</Text>
                </View>

                <TouchableOpacity style={styles.settingItem}>
                  <Ionicons name="key" size={20} color="#FF6B00" />
                  <Text style={styles.settingText}>Cambiar Contraseña</Text>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <Ionicons name="shield-checkmark" size={20} color="#FF6B00" />
                  <Text style={styles.settingText}>Autenticación de dos factores</Text>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <View style={[styles.card, styles.dangerCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="warning" size={24} color="#EF4444" />
                  <Text style={[styles.cardTitle, { color: '#EF4444' }]}>Zona de Peligro</Text>
                </View>

                <Text style={styles.dangerText}>
                  Estas acciones son irreversibles. Procede con precaución.
                </Text>

                <TouchableOpacity style={styles.dangerButton} onPress={handleDelete}>
                  <Ionicons name="trash" size={18} color="white" />
                  <Text style={styles.dangerButtonText}>
                    Eliminar Cuenta Permanentemente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editMode}
        transparent
        animationType="slide"
        onRequestClose={() => setEditMode(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setEditMode(false)} disabled={loading}>
                <Ionicons name="close" size={28} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <Ionicons name="person" size={14} color="#FF6B00" /> Nombre
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  placeholder="Tu nombre"
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <Ionicons name="people" size={14} color="#FF6B00" /> Apellido
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.apellido}
                  onChangeText={(text) => setFormData({ ...formData, apellido: text })}
                  placeholder="Tu apellido"
                  editable={!loading}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  <Ionicons name="call" size={14} color="#FF6B00" /> Teléfono
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.telefono}
                  onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                  placeholder="0987654321"
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>
                    <Ionicons name="scale" size={14} color="#FF6B00" /> Peso (kg)
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.peso}
                    onChangeText={(text) => setFormData({ ...formData, peso: text })}
                    placeholder="70.5"
                    keyboardType="decimal-pad"
                    editable={!loading}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.formLabel}>
                    <Ionicons name="resize" size={14} color="#FF6B00" /> Altura (m)
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.altura}
                    onChangeText={(text) => setFormData({ ...formData, altura: text })}
                    placeholder="1.75"
                    keyboardType="decimal-pad"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditMode(false)}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, loading && { opacity: 0.6 }]}
                  onPress={handleUpdate}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={18} color="white" />
                      <Text style={styles.saveButtonText}>Guardar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: '600',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarSection: {
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarTextLarge: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34C759',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B00',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  editText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 4,
  },
  tabActive: {
    borderBottomColor: '#FF6B00',
  },
  tabText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FF6B00',
  },
  tabContent: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  infoSection: {},
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  infoDetails: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  physicalSection: {},
  physicalStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  physicalCard: {
    flex: 1,
    backgroundColor: '#FFF5EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD1A8',
  },
  physicalLabel: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
  },
  physicalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  imcDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  imcCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  imcNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  imcLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  imcInfo: {
    flex: 1,
  },
  imcCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  imcDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  imcRanges: {
    marginTop: 8,
  },
  rangeBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  rangeSegment: {
    flex: 1,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  statsSection: {},
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD1A8',
  },
  statCardLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  settingsSection: {},
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  dangerCard: {
    borderColor: '#fee2e2',
    borderWidth: 1,
  },
  dangerText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 18,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
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
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  formRow: {
    flexDirection: 'row',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  saveButton: {
    flex: 2,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});