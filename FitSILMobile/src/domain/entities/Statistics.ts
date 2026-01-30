export interface Statistics {
  id: number;
  fecha: string;
  caloriasQuemadas: number;
  minutosEjercicio: number;
  nivelEstres: number;
}

export interface StatisticsSummary {
  entrenamientos: number;
  duracionPromedio: number;
  calorias: number;
}

export interface DashboardData {
  resumen: StatisticsSummary;
  datosSemana: WeeklyData[];
  datosCategoria: CategoryData[];
  minutosMes: number;
  rachaActual: number;
}

export interface WeeklyData {
  fecha: string;
  valor: number;
  dia: string;
}

export interface CategoryData {
  nombre: string;
  valor: number;
}