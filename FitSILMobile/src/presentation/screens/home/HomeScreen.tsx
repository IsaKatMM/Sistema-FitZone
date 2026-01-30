// src/presentation/screens/home/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { RoutineDataSource } from '../../../data/datasources/RoutineDataSource';
import { RoutineDTO } from '../../../data/models/RoutineDTO';
import { eventBus } from '../../../core/events/EventBus';
import { useNotifications } from '../../hooks/useNotifications';
import Ionicons from '@expo/vector-icons/Ionicons';

type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

interface DayProgress {
  dia: string;
  diaCompleto: DayOfWeek;
  hizoEjercicio: boolean;
  completadas: number;
  total: number;
  minutos: number;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const [progresoSemanal, setProgresoSemanal] = useState<DayProgress[]>([]);
  const [minutosSemanales, setMinutosSemanales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const routineDataSource = new RoutineDataSource();

  useEffect(() => {
    if (!user || !user.nombre || user.nombre === 'Usuario sin datos') return;
    
    cargarProgresoSemanal();

    const handleRoutinesUpdated = () => {
      console.log('🔔 HomeScreen: Rutinas actualizadas, recargando...');
      cargarProgresoSemanal();
    };

    eventBus.on('routines-updated', handleRoutinesUpdated);

    return () => {
      eventBus.off('routines-updated', handleRoutinesUpdated);
    };
  }, [user]);

  const cargarProgresoSemanal = async () => {
    try {
      setLoading(true);
      const diasSemana: DayOfWeek[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
      const diasAbreviados = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
      
      const progreso = await Promise.all(
        diasSemana.map(async (dia, index) => {
          try {
            const rutinas = await routineDataSource.getRoutinesByDay(dia);
            const completadas = rutinas.filter((r: RoutineDTO) => r.completado).length;
            const total = rutinas.length;
            const minutosCompletados = completadas * 10;
            
            return {
              dia: diasAbreviados[index],
              diaCompleto: dia,
              hizoEjercicio: completadas > 0,
              completadas: completadas,
              total: total,
              minutos: minutosCompletados
            };
          } catch (error) {
            return {
              dia: diasAbreviados[index],
              diaCompleto: dia,
              hizoEjercicio: false,
              completadas: 0,
              total: 0,
              minutos: 0
            };
          }
        })
      );
      
      setProgresoSemanal(progreso);
      const totalMinutos = progreso.reduce((sum, dia) => sum + dia.minutos, 0);
      setMinutosSemanales(totalMinutos);
    } catch (error) {
      console.error('Error al cargar progreso semanal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Salir', 
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

  const formatearTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
  };

  const imc = calcularIMC();

  if (!user || !user.nombre || user.nombre === 'Usuario sin datos') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Redirigiendo al login...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.welcomeText}>Bienvenido de nuevo,</Text>
            <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
          </View>
          
          <View style={styles.headerActions}>
            {/* Notificaciones */}
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => router.push('/(main)/notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color="#64748b" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Reportes */}
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => router.push('/(main)/reports')}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#64748b" />
            </TouchableOpacity>

            {/* Avatar con menú */}
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowMenu(!showMenu)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.nombre?.charAt(0) || 'U'}{user?.apellido?.charAt(0) || ''}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="scale-outline" size={28} color="#FF6B00" />
            <Text style={styles.statLabel}>Peso</Text>
            <Text style={styles.statValue}>
              {user?.peso ? `${user.peso} kg` : 'N/A'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="resize-outline" size={28} color="#FF6B00" />
            <Text style={styles.statLabel}>Altura</Text>
            <Text style={styles.statValue}>
              {user?.altura ? `${user.altura} m` : 'N/A'}
            </Text>
          </View>

          <View style={[styles.statCard, styles.statCardHighlight]}>
            <Ionicons name="fitness-outline" size={28} color="#FFFFFF" />
            <Text style={[styles.statLabel, styles.statLabelWhite]}>IMC</Text>
            <Text style={[styles.statValue, styles.statValueWhite]}>{imc}</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="heart-outline" size={28} color="#FF6B00" />
            <Text style={styles.statLabel}>Estado</Text>
            <Text style={styles.statValueSmall}>{getIMCCategoria(imc)}</Text>
          </View>
        </View>

        {/* IMC Card */}
        <View style={styles.imcCard}>
          <Text style={styles.cardTitle}>Índice de Masa Corporal</Text>
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

        {/* Weekly Progress */}
        <View style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.weeklyTitle}>Progreso Semanal</Text>
            <Text style={styles.weeklySubtitle}>Total minutos esta semana</Text>
            <Text style={styles.weeklyTime}>{formatearTiempo(minutosSemanales)}</Text>
          </View>

          <View style={styles.weeklyProgress}>
            {progresoSemanal.map((dia, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.diaColumna}
                onPress={() => router.push('/(main)/routines')}
              >
                <View style={[
                  styles.diaCirculo,
                  dia.hizoEjercicio && styles.diaCirculoActivo
                ]}>
                  {dia.hizoEjercicio && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </View>
                <Text style={[
                  styles.diaTexto,
                  dia.hizoEjercicio && styles.diaTextoActivo
                ]}>
                  {dia.dia}
                </Text>
                {dia.total > 0 && (
                  <Text style={styles.diaCount}>
                    {dia.completadas}/{dia.total}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.btnVerRutinas}
            onPress={() => router.push('/(main)/routines')}
          >
            <Ionicons name="calendar-outline" size={20} color="white" />
            <Text style={styles.btnText}>Ver mis rutinas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Menu Desplegable */}
      {showMenu && (
        <Modal
          transparent
          visible={showMenu}
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <View style={styles.dropdownMenu}>
              <View style={styles.menuUserInfo}>
                <View style={styles.menuAvatar}>
                  <Text style={styles.menuAvatarText}>
                    {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0) || ''}
                  </Text>
                </View>
                <View style={styles.menuUserDetails}>
                  <Text style={styles.menuUserName}>
                    {user?.nombre} {user?.apellido}
                  </Text>
                  <Text style={styles.menuUserEmail}>{user?.correo}</Text>
                  <View style={styles.menuUserBadge}>
                    <Text style={styles.menuUserBadgeText}>{user?.rol}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  router.push('/(main)/profile');
                }}
              >
                <Ionicons name="person-outline" size={20} color="#1e293b" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>Mi Perfil</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={[styles.menuItem, styles.menuItemDanger]}
                onPress={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  headerInfo: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerActionButton: {
    position: 'relative',
    padding: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 4,
  },
  avatarContainer: {
    marginLeft: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardHighlight: {
    backgroundColor: '#FF6B00',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    marginTop: 8,
  },
  statLabelWhite: {
    color: '#FFFFFF',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statValueWhite: {
    color: '#FFFFFF',
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  imcCard: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  imcDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 2,
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
  weeklyCard: {
    backgroundColor: 'white',
    margin: 15,
    marginTop: 5,
    marginBottom: 100,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weeklyHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  weeklySubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  weeklyTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  diaColumna: {
    alignItems: 'center',
  },
  diaCirculo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#FFD1A8',
  },
  diaCirculoActivo: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  diaTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  diaTextoActivo: {
    color: '#FF6B00',
  },
  diaCount: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  btnVerRutinas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    padding: 14,
    borderRadius: 8,
    gap: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  
  // Estilos del menú desplegable
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    backgroundColor: 'white',
    marginTop: 100,
    marginRight: 20,
    borderRadius: 12,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuUserInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  menuAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuUserDetails: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  menuUserEmail: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  menuUserBadge: {
    backgroundColor: '#FFF5EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  menuUserBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6B00',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemIcon: {
    width: 24,
  },
  menuItemText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  menuItemDanger: {
    backgroundColor: '#fef2f2',
  },
  menuItemTextDanger: {
    color: '#EF4444',
    fontWeight: '600',
  },
});