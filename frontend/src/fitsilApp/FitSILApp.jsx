// src/fitsilApp/FitSILApp.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import EjerciciosLista from "../ejercicios/EjerciciosLista";
import EjercicioDetalle from "../ejercicios/EjercicioDetalle";
import "../ejercicios/ejercicios.css";

function FitSILApp() {
  const { darkMode } = useTheme();
  const [ejercicios, setEjercicios] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/ejercicios/obtener");
      
      if (!response.ok) {
        throw new Error('Error al cargar ejercicios');
      }
      
      const data = await response.json();
      setEjercicios(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar los ejercicios. Verifica que el backend esté corriendo en http://localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <div className="loading-message">Cargando ejercicios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={cargarEjercicios} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      {!seleccionado ? (
        <EjerciciosLista
          ejercicios={ejercicios}
          onSelect={setSeleccionado}
        />
      ) : (
        <EjercicioDetalle
          ejercicio={seleccionado}
          onBack={() => setSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default FitSILApp;