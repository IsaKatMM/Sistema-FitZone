//src/data/models/ReportDTO.ts
export interface ReportDTO {
  id: number;
  nombre: string;
  tipo: string;
  datos: string;
  filtros?: string;
  estado: string;
  fechaCreacion: string;
}