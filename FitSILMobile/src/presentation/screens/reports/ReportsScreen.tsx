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
  Platform,
} from 'react-native';
import { useReports } from '../../hooks/useReports';
import { ReportType } from '../../../domain/entities/Report';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

type ReportRange = '1W' | '1M' | '3M' | '6M' | '1Y';

export default function ReportsScreen() {
  const { loading, error, generateReport, downloadReport } = useReports();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState<ReportRange>('1M');
  const [downloading, setDownloading] = useState(false);

  const reportTypes = [
    {
      type: 'semanal' as ReportType,
      title: 'Reporte Semanal',
      description: 'Resumen de tus últimos 7 días',
      icon: '▣',
      color: '#FF6B00',
    },
    {
      type: 'mensual' as ReportType,
      title: 'Reporte Mensual',
      description: 'Estadísticas del último mes',
      icon: '▤',
      color: '#FF9500',
    },
    {
      type: 'calorias' as ReportType,
      title: 'Análisis de Calorías',
      description: 'Seguimiento de calorías quemadas',
      icon: '⚡',
      color: '#FF6B00',
    },
    {
      type: 'historial' as ReportType,
      title: 'Historial Completo',
      description: 'Todas tus actividades',
      icon: '▥',
      color: '#FF9500',
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
      Alert.alert('Error', err.message || 'No se pudo generar el reporte');
    }
  };

  const generateHTMLContent = (data: any, reportName: string) => {
    const resumen = data.resumen || {};
    const analisis = data.analisis || {};
    const detalles = data.detalles || [];

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              padding: 40px;
              background: #ffffff;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #FF6B00;
            }
            .header h1 {
              color: #FF6B00;
              font-size: 32px;
              margin-bottom: 10px;
            }
            .header p {
              color: #666;
              font-size: 14px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #FFE5CC;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            .summary-item {
              background: #FFF5EE;
              padding: 20px;
              border-radius: 10px;
              border-left: 4px solid #FF6B00;
            }
            .summary-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .summary-value {
              font-size: 28px;
              font-weight: bold;
              color: #FF6B00;
            }
            .analysis-item {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .analysis-label {
              color: #666;
              font-size: 14px;
            }
            .analysis-value {
              font-weight: bold;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            th {
              background: #FF6B00;
              color: white;
              padding: 12px;
              text-align: left;
              font-size: 14px;
            }
            td {
              padding: 10px 12px;
              border-bottom: 1px solid #f0f0f0;
              font-size: 13px;
            }
            tr:nth-child(even) {
              background: #FFF5EE;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #f0f0f0;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.titulo || reportName}</h1>
            <p>${data.periodo || 'Período analizado'}</p>
            <p>Generado: ${data.fechaGeneracion || new Date().toLocaleString('es-ES')}</p>
          </div>

          ${Object.keys(resumen).length > 0 ? `
            <div class="section">
              <div class="section-title">Resumen</div>
              <div class="summary-grid">
                ${Object.entries(resumen).map(([key, value]) => `
                  <div class="summary-item">
                    <div class="summary-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div class="summary-value">${typeof value === 'number' ? value.toFixed(0) : value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${Object.keys(analisis).length > 0 ? `
            <div class="section">
              <div class="section-title">Análisis Detallado</div>
              ${Object.entries(analisis).map(([key, value]) => `
                <div class="analysis-item">
                  <span class="analysis-label">${key}</span>
                  <span class="analysis-value">${value}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${detalles.length > 0 ? `
            <div class="section">
              <div class="section-title">Detalles (${detalles.length} registros)</div>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Minutos</th>
                    <th>Calorías</th>
                    ${detalles[0].estres !== undefined ? '<th>Estrés</th>' : ''}
                  </tr>
                </thead>
                <tbody>
                  ${detalles.slice(0, 50).map((det: any) => `
                    <tr>
                      <td>${det.fecha}</td>
                      <td>${det.minutos} min</td>
                      <td>${det.calorias} kcal</td>
                      ${det.estres !== undefined ? `<td>${det.estres}</td>` : ''}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${detalles.length > 50 ? `
                <p style="text-align: center; margin-top: 15px; color: #666;">
                  + ${detalles.length - 50} registros más no mostrados
                </p>
              ` : ''}
            </div>
          ` : ''}

          <div class="footer">
            <p>FitSIL - Sistema de Gestión de Ejercicios y Nutrición</p>
            <p>Este reporte fue generado automáticamente</p>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownloadReport = async (type: ReportType) => {
    setDownloading(true);
    try {
      // Generar el reporte
      const data = await downloadReport(type, selectedRange);
      
      // Generar HTML
      const html = generateHTMLContent(data, reportTypes.find(r => r.type === type)?.title || 'Reporte');
      
      // Crear PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Compartir o guardar
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir reporte PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        // Mover a una ubicación permanente si no se puede compartir
        const fileName = `reporte_${type}_${Date.now()}.pdf`;
        const newUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.moveAsync({
          from: uri,
          to: newUri,
        });
        Alert.alert('Guardado', `Reporte guardado en: ${newUri}`);
      }
    } catch (err: any) {
      console.error('Error al generar PDF:', err);
      Alert.alert('Error', 'No se pudo generar el PDF. Intenta nuevamente.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reportes</Text>
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
              <View style={[
                styles.reportCardIcon,
                { backgroundColor: report.color + '15' }
              ]}>
                <Text style={[
                  styles.reportCardIconText,
                  { color: report.color }
                ]}>
                  {report.icon}
                </Text>
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
                disabled={loading || downloading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <View style={styles.actionIconCircle}>
                      <Text style={styles.actionIconText}>👁</Text>
                    </View>
                    <Text style={styles.actionButtonText}>Ver</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={() => handleDownloadReport(report.type)}
                disabled={loading || downloading}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color="#FF6B00" />
                ) : (
                  <>
                    <View style={styles.actionIconCircleSecondary}>
                      <Text style={styles.actionIconTextSecondary}>↓</Text>
                    </View>
                    <Text style={styles.actionButtonTextSecondary}>
                      PDF
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Info Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Text style={styles.infoIcon}>i</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Sobre los reportes</Text>
            <Text style={styles.infoText}>
              Los reportes se generan en tiempo real basándose en tus
              actividades registradas. Puedes descargarlos en formato PDF cuando
              lo necesites.
            </Text>
          </View>
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
                  <Text style={styles.closeButtonText}>×</Text>
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
                          <View style={styles.detailStat}>
                            <View style={styles.detailStatIcon}>
                              <Text style={styles.detailStatIconText}>⏱</Text>
                            </View>
                            <Text style={styles.detailStatText}>
                              {detalle.minutos} min
                            </Text>
                          </View>
                          <View style={styles.detailStat}>
                            <View style={styles.detailStatIcon}>
                              <Text style={styles.detailStatIconText}>⚡</Text>
                            </View>
                            <Text style={styles.detailStatText}>
                              {detalle.calorias} kcal
                            </Text>
                          </View>
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
    backgroundColor: '#F5F5F5',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  },

  // Range Section
  rangeSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  rangeButtonActive: {
    backgroundColor: '#FF6B00',
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  rangeButtonTextActive: {
    color: '#FFFFFF',
  },

  // Content
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
    color: '#333',
    marginBottom: 16,
  },

  // Report Cards
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportCardIconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reportCardInfo: {
    flex: 1,
  },
  reportCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reportCardDescription: {
    fontSize: 13,
    color: '#666',
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
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewButton: {
    backgroundColor: '#FF6B00',
  },
  downloadButton: {
    backgroundColor: '#FFF5EE',
    borderWidth: 1,
    borderColor: '#FF6B00',
  },
  actionIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconCircleSecondary: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  actionIconTextSecondary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B00',
  },

  // Info Card
  infoCard: {
    backgroundColor: '#FFF5EE',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFE5CC',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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

  // Summary
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#FFF5EE',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
  },

  // Analysis
  analysisSection: {
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  analysisLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Details
  detailsSection: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailItem: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  detailDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detailStats: {
    flexDirection: 'row',
    gap: 16,
  },
  detailStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailStatIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  detailStatIconText: {
    fontSize: 12,
    color: '#FF6B00',
  },
  detailStatText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  moreDetails: {
    fontSize: 13,
    color: '#FF6B00',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },

  // Footer
  modalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});