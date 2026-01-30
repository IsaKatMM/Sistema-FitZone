export interface StatisticsDTO {
  id: number;
  fecha: string;
  caloriasQuemadas: number;
  minutosEjercicio: number;
  nivelEstres: number;
}

export interface DashboardDTO {
  resumen: {
    entrenamientos: number;
    duracionPromedio: number;
    calorias: number;
  };
  datosSemana: Array<{
    fecha: string;
    valor: number;
    dia: string;
  }>;
  datosCategoria: Array<{
    nombre: string;
    valor: number;
  }>;
  minutosMes: number;
  rachaActual: number;
}