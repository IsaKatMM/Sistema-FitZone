import axios from 'axios';

const API_URL = 'http://localhost:8080/api/estadisticas';

// Obtener el token del localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const EstadisticaService = {
  // Obtener todas las estadísticas del usuario autenticado
  obtenerPorUsuario: async () => {
    try {
      const response = await axios.get(`${API_URL}/usuario`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del usuario:', error);
      throw error;
    }
  },

  // Obtener estadísticas por rango de tiempo
  obtenerPorRango: async (rango) => {
    try {
      const response = await axios.get(`${API_URL}/usuario/rango`, {
        params: { rango },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas por rango:', error);
      throw error;
    }
  },

  // Obtener resumen de estadísticas
  obtenerResumen: async (rango = '1M') => {
    try {
      const response = await axios.get(`${API_URL}/usuario/resumen`, {
        params: { rango },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      throw error;
    }
  },

  // Obtener promedio de estrés
  obtenerPromedioEstres: async (rango = '1M') => {
    try {
      const response = await axios.get(`${API_URL}/usuario/promedio-estres`, {
        params: { rango },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener promedio de estrés:', error);
      throw error;
    }
  },

  // Agregar nueva estadística manualmente
  agregar: async (estadistica) => {
    try {
      const response = await axios.post(API_URL, estadistica, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al agregar estadística:', error);
      throw error;
    }
  },

  // Obtener estadísticas agrupadas por semana
  obtenerPorSemana: async (rango = '1M') => {
    try {
      const response = await axios.get(`${API_URL}/usuario/por-semana`, {
        params: { rango },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas por semana:', error);
      throw error;
    }
  },

  // Funciones auxiliares locales para procesar datos
  calcularTotalWorkouts: (estadisticas) => {
    return estadisticas.length;
  },

  calcularPromedioDuracion: (estadisticas) => {
    if (estadisticas.length === 0) return 0;
    const total = estadisticas.reduce((sum, e) => sum + e.minutosEjercicio, 0);
    return Math.round(total / estadisticas.length);
  },

  calcularTotalCalorias: (estadisticas) => {
    return Math.round(estadisticas.reduce((sum, e) => sum + e.caloriasQuemadas, 0));
  },

  // Agrupar estadísticas por día de la semana (últimos 7 días)
  agruparPorDiaSemana: (estadisticas) => {
    const hoy = new Date();
    const diasSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const ultimos7Dias = [];

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      fecha.setHours(0, 0, 0, 0);

      const estadisticasDia = estadisticas.filter(e => {
        const fechaEstadistica = new Date(e.fecha);
        fechaEstadistica.setHours(0, 0, 0, 0);
        return fechaEstadistica.getTime() === fecha.getTime();
      });

      const totalMinutos = estadisticasDia.reduce((sum, e) => sum + e.minutosEjercicio, 0);
      
      ultimos7Dias.push({
        dia: diasSemana[fecha.getDay()],
        valor: totalMinutos,
        fecha: fecha.toISOString()
      });
    }

    return ultimos7Dias;
  },

  // Obtener datos para gráfico de línea (últimos 30 días)
  obtenerDatosGraficoLinea: (estadisticas) => {
    const datosOrdenados = [...estadisticas]
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(-30);

    return datosOrdenados.map(e => e.nivelEstres || 0);
  },

  // Calcular cambio porcentual
  calcularCambio: (estadisticas, campo) => {
    if (estadisticas.length < 2) return 0;

    const mitad = Math.floor(estadisticas.length / 2);
    const primeraMetad = estadisticas.slice(0, mitad);
    const segundaMetad = estadisticas.slice(mitad);

    const promedioAnterior = primeraMetad.reduce((sum, e) => sum + (e[campo] || 0), 0) / primeraMetad.length;
    const promedioActual = segundaMetad.reduce((sum, e) => sum + (e[campo] || 0), 0) / segundaMetad.length;

    if (promedioAnterior === 0) return 0;
    return ((promedioActual - promedioAnterior) / promedioAnterior) * 100;
  }
};