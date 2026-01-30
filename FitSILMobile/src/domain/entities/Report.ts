//src/domain/entities/Report.ts
export interface Report {
  id: number;
  nombre: string;
  tipo: string;
  datos: string;
  filtros?: string;
  estado: string;
  fechaCreacion: string;
}

export type ReportType = 'mensual' | 'semanal' | 'calorias' | 'historial';