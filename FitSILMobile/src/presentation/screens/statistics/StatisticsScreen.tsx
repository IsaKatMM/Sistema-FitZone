// src/presentation/screens/statistics/StatisticsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useStatistics } from '../../hooks/useStatistics';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { SafeScrollView } from '../../components/common/SafeScrollView';

type TimeRange = '1W' | '1M' | '3M' | '1Y';

const RANGES: { key: TimeRange; label: string }[] = [
  { key: '1W', label: 'Semana' },
  { key: '1M', label: 'Mes' },
  { key: '3M', label: '3 Meses' },
  { key: '1Y', label: 'Año' },
];

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const { dashboard, loading, error } = useStatistics(selectedRange);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 11,
      fontWeight: '600',
    },
  };

  const chartConfigOrange = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(255, 107, 0, ${opacity})`,
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>No hay datos disponibles</Text>
      </View>
    );
  }

  // Preparar datos para gráfico de línea (semana)
  const lineChartData = {
    labels: dashboard.datosSemana.length > 0 
      ? dashboard.datosSemana.map(d => d.dia.substring(0, 3))
      : ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    datasets: [{
      data: dashboard.datosSemana.length > 0
        ? dashboard.datosSemana.map(d => d.valor)
        : [0, 0, 0, 0, 0, 0, 0],
    }],
  };

  // Preparar datos para gráfico de barras (categorías)
  const barChartData = {
    labels: dashboard.datosCategoria.length > 0
      ? dashboard.datosCategoria.map(c => c.nombre.substring(0, 8))
      : ['Fuerza', 'Cardio', 'Flex'],
    datasets: [{
      data: dashboard.datosCategoria.length > 0
        ? dashboard.datosCategoria.map(c => c.valor)
        : [0, 0, 0],
    }],
  };

  return (
    <SafeScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Estadísticas</Text>
        <Text style={styles.subtitle}>Resumen de tu progreso</Text>
        
        {/* Range Selector */}
        <View style={styles.rangeSelector}>
          {RANGES.map((range) => (
            <TouchableOpacity
              key={range.key}
              style={[
                styles.rangeButton,
                selectedRange === range.key && styles.rangeButtonActive,
              ]}
              onPress={() => setSelectedRange(range.key)}
            >
              <Text
                style={[
                  styles.rangeText,
                  selectedRange === range.key && styles.rangeTextActive,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconSymbol}>↑</Text>
            </View>
          </View>
          <Text style={styles.summaryValue}>{dashboard.resumen.entrenamientos}</Text>
          <Text style={styles.summaryLabel}>Entrenamientos</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, styles.iconCircleSecondary]}>
              <Text style={styles.iconSymbol}>⏱</Text>
            </View>
          </View>
          <Text style={styles.summaryValue}>{Math.round(dashboard.resumen.duracionPromedio)}</Text>
          <Text style={styles.summaryLabel}>Min. Promedio</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, styles.iconCircleTertiary]}>
              <Text style={styles.iconSymbol}>⚡</Text>
            </View>
          </View>
          <Text style={styles.summaryValue}>{Math.round(dashboard.resumen.calorias)}</Text>
          <Text style={styles.summaryLabel}>Calorías</Text>
        </View>
      </View>

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <View style={styles.streakIconContainer}>
          <View style={styles.streakCircle}>
            <Text style={styles.streakNumber}>{dashboard.rachaActual}</Text>
          </View>
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakValue}>Racha actual</Text>
          <Text style={styles.streakLabel}>{dashboard.rachaActual} días consecutivos</Text>
        </View>
      </View>

      {/* Monthly Minutes */}
      <View style={styles.monthCard}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthLabel}>Minutos totales del mes</Text>
          <Text style={styles.monthValue}>{dashboard.minutosMes}</Text>
        </View>
        <View style={styles.monthProgress}>
          <View 
            style={[
              styles.monthProgressFill, 
              { width: `${Math.min((dashboard.minutosMes / 600) * 100, 100)}%` }
            ]} 
          />
        </View>
        <View style={styles.monthFooter}>
          <Text style={styles.monthGoal}>Meta: 600 min</Text>
          <Text style={styles.monthPercentage}>
            {Math.round((dashboard.minutosMes / 600) * 100)}%
          </Text>
        </View>
      </View>

      {/* Weekly Chart */}
      {dashboard.datosSemana.length > 0 && (
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <View style={styles.chartIconCircle}>
                <Text style={styles.chartIcon}>─</Text>
              </View>
              <Text style={styles.chartTitle}>Actividad Semanal</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <LineChart
              data={lineChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              yAxisSuffix=" min"
              withInnerLines={false}
              withOuterLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              withDots={true}
              withShadow={false}
              fromZero={true}
            />
          </View>
        </View>
      )}

      {/* Category Chart */}
      {dashboard.datosCategoria.length > 0 && (
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <View style={styles.chartIconCircle}>
                <Text style={styles.chartIcon}>▌</Text>
              </View>
              <Text style={styles.chartTitle}>Por Categoría</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <BarChart
              data={barChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfigOrange}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix=" min"
              showValuesOnTopOfBars={true}
              withInnerLines={false}
              fromZero={true}
            />
          </View>
        </View>
      )}

      {/* Category Details */}
      {dashboard.datosCategoria.length > 0 && (
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Desglose por Categoría</Text>
          {dashboard.datosCategoria.map((cat, index) => {
            const percentage = dashboard.minutosMes > 0 
              ? (cat.valor / dashboard.minutosMes) * 100 
              : 0;
            
            return (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{cat.nombre}</Text>
                  <Text style={styles.categoryValue}>{cat.valor} min</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryBarFill,
                      { width: `${percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.categoryPercentage}>{Math.round(percentage)}%</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Weekly Details */}
      {dashboard.datosSemana.length > 0 && (
        <View style={styles.weekSection}>
          <Text style={styles.sectionTitle}>Últimos 7 Días</Text>
          {dashboard.datosSemana.map((day, index) => {
            const maxValue = Math.max(...dashboard.datosSemana.map((d) => d.valor));
            const percentage = maxValue > 0 ? (day.valor / maxValue) * 100 : 0;
            
            return (
              <View key={index} style={styles.weekItem}>
                <Text style={styles.weekDay}>{day.dia}</Text>
                <View style={styles.weekBar}>
                  <View
                    style={[
                      styles.weekBarFill,
                      { width: `${percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.weekValue}>{day.valor} min</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Recomendaciones</Text>
        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <Text style={styles.tipIcon}>●</Text>
          </View>
          <Text style={styles.tipText}>
            Mantén una racha de {dashboard.rachaActual + 1} días para mejorar tu consistencia
          </Text>
        </View>
        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <Text style={styles.tipIcon}>●</Text>
          </View>
          <Text style={styles.tipText}>
            Intenta aumentar tu promedio de {Math.round(dashboard.resumen.duracionPromedio)} min por sesión
          </Text>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </SafeScrollView>
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
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 20,
  },
  rangeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  rangeButtonActive: {
    backgroundColor: '#FF6B00',
  },
  rangeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  rangeTextActive: {
    color: '#FFFFFF',
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleSecondary: {
    backgroundColor: '#F5F5F5',
  },
  iconCircleTertiary: {
    backgroundColor: '#FFF5EE',
  },
  iconSymbol: {
    fontSize: 22,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Streak Card
  streakCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  streakIconContainer: {
    marginRight: 16,
  },
  streakCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 13,
    color: '#666',
  },

  // Month Card
  monthCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  monthValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  monthProgress: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  monthProgressFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 5,
  },
  monthFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthGoal: {
    fontSize: 12,
    color: '#999',
  },
  monthPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B00',
  },

  // Charts
  chartSection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    marginBottom: 15,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  chartIcon: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: 'bold',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },

  // Category Section
  categorySection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  categoryBar: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  categoryBarFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 5,
  },
  categoryPercentage: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },

  // Week Section
  weekSection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  weekItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekDay: {
    fontSize: 13,
    fontWeight: '600',
    width: 80,
    color: '#333',
  },
  weekBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  weekBarFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 5,
  },
  weekValue: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    width: 50,
    textAlign: 'right',
  },

  // Tips Section
  tipsSection: {
    margin: 15,
    marginTop: 5,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  tipIcon: {
    fontSize: 12,
    color: '#FF6B00',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
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
  },
  bottomSpacer: {
    height: 30,
  },
});