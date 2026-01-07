import "./ActividadReciente.css";
import { useTheme } from '../context/ThemeContext';

function MiComponente() {
  const { darkMode } = useTheme();
  
  return (
    <div className={`mi-componente ${darkMode ? 'dark' : ''}`}>
      {/* contenido */}
    </div>
  );
}

const actividades = [
  { nombre: "Fuerza cuerpo completo", fecha: "2023-10-26", valor: "45 min" },
  { nombre: "Carrera matutina", fecha: "2023-10-25", valor: "5 km" },
  { nombre: "Yoga fluido", fecha: "2023-10-24", valor: "30 min" },
  { nombre: "Día de piernas", fecha: "2023-10-23", valor: "60 min" },
];

export default function ActividadReciente() {
  return (
    <div className="actividad">
      {actividades.map((a, i) => (
        <div key={i} className="actividad-item">
          <div>
            <strong>{a.nombre}</strong>
            <p>{a.fecha}</p>
          </div>
          <span>{a.valor}</span>
        </div>
      ))}
    </div>
  );
}
