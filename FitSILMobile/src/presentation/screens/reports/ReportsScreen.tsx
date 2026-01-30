// src/presentation/screens/reports/ReportsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useReports } from '../../hooks/useReports';
import { ReportType } from '../../../domain/entities/Report';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

type ReportRange = '1W' | '1M' | '3M' | '6M' | '1Y';

export default function ReportsScreen() {
  const { loading, error, generateReport, downloadReport } = useReports();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState<ReportRange>('1M');

  const reportTypes = [
    {
      type: 'semanal' as ReportType,
      title: 'Reporte Semanal',
      description: 'Resumen de tus últimos 7 días',
      icon: '📅',
      color: '#007AFF',
    },
    {
      type: 'mensual' as ReportType,
      title: 'Reporte Mensual',
      description: 'Estadísticas del último mes',
      icon: '📊',
      color: '#34C759',
    },
    {
      type: 'calorias' as ReportType,
      title: 'Análisis de Calorías',
      description: 'Seguimiento de calorías quemadas',
      icon: '🔥',
      color: '#FF9500',
    },
    {
      type: 'historial' as ReportType,
      title: 'Historial Completo',
      description: 'Todas tus actividades',
      icon: '📈',
      color: '#5856D6',
    },
  ];

  const ranges = [
    { value: '1W' as ReportRange, label: '1 Semana' },
    { value: '1M' as ReportRange, label: '1 Mes' },
    { value: '3M' as ReportRange, label: '3 Meses' },
    { value: '6M' as ReportRange, label: '6 Meses' },
    { value: '1Y' as ReportRange, label: '1 Año' },
  ];

  const handleGenerateReport = async (type: ReportType) => {
    try {
      const data = await generateReport(type, selectedRange);
      setSelectedReport(data);
      setShowReportModal(true);
    } catch (err: any) {
      Alert.alert('❌ Error', err.message || 'No se pudo generar el reporte');
    }
  };

  const handleDownloadReport = async (type: ReportType) => {
    try {
      Alert.alert(
        'Descargar Reporte',
        '¿En qué formato deseas descargar el reporte?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'JSON',
            onPress: async () => {
              const data = await downloadReport(type, selectedRange);
              await saveAndShareReport(data, type, 'json');
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('❌ Error', 'No se pudo descargar el reporte');
    }
  };

  const saveAndShareReport = async (data: any, type: string, format: string) => {
    try {
      const fileName = `reporte_${type}_${Date.now()}.${format}`;
      // ✅ CORRECCIÓN: Usar cacheDirectory para almacenar archivos
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      const content = JSON.stringify(data, null, 2);
      
      // ✅ CORRECCIÓN: Escribir archivo con la sintaxis correcta
      await FileSystem.writeAsStringAsync(fileUri, content);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('✅ Guardado', `Reporte guardado en: ${fileUri}`);
      }
    } catch (err) {
      console.error('Error al guardar reporte:', err);
      Alert.alert('❌ Error', 'No se pudo guardar el reporte');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Reportes</Text>
        <Text style={styles.subtitle}>
          Genera y descarga tus estadísticas
        </Text>
      </View>

      {/* Range Selector */}
      <View style={styles.rangeSection}>
        <Text style={styles.rangeLabel}>Período de análisis</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rangeScroll}
          contentContainerStyle={styles.rangeContent}
        >
          {ranges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.rangeButton,
                selectedRange === range.value && styles.rangeButtonActive,
              ]}
              onPress={() => setSelectedRange(range.value)}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  selectedRange === range.value && styles.rangeButtonTextActive,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Report Types */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Tipos de Reportes</Text>

        {reportTypes.map((report) => (
          <View
            key={report.type}
            style={[
              styles.reportCard,
              { borderLeftColor: report.color },
            ]}
          >
            <View style={styles.reportCardHeader}>
              <View style={styles.reportCardIcon}>
                <Text style={styles.reportCardIconText}>{report.icon}</Text>
              </View>
              <View style={styles.reportCardInfo}>
                <Text style={styles.reportCardTitle}>{report.title}</Text>
                <Text style={styles.reportCardDescription}>
                  {report.description}
                </Text>
              </View>
            </View>

            <View style={styles.reportCardActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => handleGenerateReport(report.type)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text style={styles.actionButtonText}>Ver</Text>
                    <Text style={styles.actionButtonIcon}>👁️</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={() => handleDownloadReport(report.type)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#007AFF" />
                ) : (
                  <>
                    <Text style={styles.actionButtonTextSecondary}>
                      Descargar
                    </Text>
                    <Text style={styles.actionButtonIcon}>📥</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoTitle}>Sobre los reportes</Text>
          <Text style={styles.infoText}>
            Los reportes se generan en tiempo real basándose en tus
            actividades registradas. Puedes descargarlos y compartirlos cuando
            lo necesites.
          </Text>
        </View>
      </ScrollView>

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <Modal
          visible={showReportModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedReport.titulo || 'Reporte'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowReportModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Resumen */}
                {selectedReport.resumen && (
                  <View style={styles.summarySection}>
                    <Text style={styles.summaryTitle}>Resumen</Text>
                    <View style={styles.summaryGrid}>
                      {Object.entries(selectedReport.resumen).map(
                        ([key, value]) => (
                          <View key={key} style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Text>
                            <Text style={styles.summaryValue}>
                              {typeof value === 'number'
                                ? value.toFixed(0)
                                : String(value)}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  </View>
                )}

                {/* Análisis */}
                {selectedReport.analisis && (
                  <View style={styles.analysisSection}>
                    <Text style={styles.analysisTitle}>Análisis Detallado</Text>
                    {Object.entries(selectedReport.analisis).map(
                      ([key, value]) => (
                        <View key={key} style={styles.analysisItem}>
                          <Text style={styles.analysisLabel}>{key}</Text>
                          <Text style={styles.analysisValue}>{String(value)}</Text>
                        </View>
                      )
                    )}
                  </View>
                )}

                {/* Detalles */}
                {selectedReport.detalles && Array.isArray(selectedReport.detalles) && selectedReport.detalles.length > 0 && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.detailsTitle}>
                      Detalles ({selectedReport.detalles.length} registros)
                    </Text>
                    {selectedReport.detalles.slice(0, 10).map((detalle: any, index: number) => (
                      <View key={index} style={styles.detailItem}>
                        <Text style={styles.detailDate}>{String(detalle.fecha)}</Text>
                        <View style={styles.detailStats}>
                          <Text style={styles.detailStat}>
                            ⏱️ {detalle.minutos} min
                          </Text>
                          <Text style={styles.detailStat}>
                            🔥 {detalle.calorias} kcal
                          </Text>
                        </View>
                      </View>
                    ))}
                    {selectedReport.detalles.length > 10 && (
                      <Text style={styles.moreDetails}>
                        + {selectedReport.detalles.length - 10} registros más
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.modalFooter}>
                  <Text style={styles.footerText}>
                    Generado: {selectedReport.fechaGeneracion || 'Ahora'}
                  </Text>
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
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  rangeSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  rangeScroll: {
    marginRight: 20,
  },
  rangeContent: {
    paddingRight: 20,
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  rangeButtonActive: {
    backgroundColor: '#007AFF',
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  rangeButtonTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportCardIconText: {
    fontSize: 24,
  },
  reportCardInfo: {
    flex: 1,
  },
  reportCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  reportCardDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  reportCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  viewButton: {
    backgroundColor: '#007AFF',
  },
  downloadButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  infoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },

  // Modal styles
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
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#64748b',
  },
  modalBody: {
    padding: 20,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  analysisSection: {
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  analysisLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailItem: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  detailStats: {
    flexDirection: 'row',
    gap: 16,
  },
  detailStat: {
    fontSize: 12,
    color: '#64748b',
  },
  moreDetails: {
    fontSize: 13,
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  modalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});