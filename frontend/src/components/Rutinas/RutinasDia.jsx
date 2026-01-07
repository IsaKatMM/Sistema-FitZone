// src/components/Rutinas/RutinasDia.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './RutinasDia.css';

const RutinasDia = () => {
  const { darkMode } = useTheme();
  const [completedExercises, setCompletedExercises] = useState([]);

  // Datos de ejemplo de la rutina del día
  const rutinaDelDia = {
    fecha: new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    nombre: 'Entrenamiento de Fuerza - Día 3',
    duracion: '45 min',
    nivel: 'Intermedio',
    ejercicios: [
      {
        id: 1,
        nombre: 'Press de Banca',
        series: 4,
        repeticiones: 12,
        descanso: '90s',
        icono: 'fitness_center',
        musculo: 'Pecho'
      },
      {
        id: 2,
        nombre: 'Sentadillas',
        series: 4,
        repeticiones: 15,
        descanso: '120s',
        icono: 'accessibility',
        musculo: 'Piernas'
      },
      {
        id: 3,
        nombre: 'Dominadas',
        series: 3,
        repeticiones: 10,
        descanso: '90s',
        icono: 'sports_gymnastics',
        musculo: 'Espalda'
      },
      {
        id: 4,
        nombre: 'Press Militar',
        series: 3,
        repeticiones: 12,
        descanso: '90s',
        icono: 'sports',
        musculo: 'Hombros'
      },
      {
        id: 5,
        nombre: 'Curl de Bíceps',
        series: 3,
        repeticiones: 15,
        descanso: '60s',
        icono: 'strong',
        musculo: 'Brazos'
      },
      {
        id: 6,
        nombre: 'Plancha',
        series: 3,
        repeticiones: '60s',
        descanso: '60s',
        icono: 'self_improvement',
        musculo: 'Core'
      }
    ]
  };

  const toggleExerciseComplete = (id) => {
    if (completedExercises.includes(id)) {
      setCompletedExercises(completedExercises.filter(exerciseId => exerciseId !== id));
    } else {
      setCompletedExercises([...completedExercises, id]);
    }
  };

  const progreso = (completedExercises.length / rutinaDelDia.ejercicios.length) * 100;

  return (
    <div className={`rutina-dia-container ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="rutina-header">
        <div className="rutina-title">
          <span className="material-icons rutina-icon">calendar_today</span>
          <div>
            <h1>Rutina del Día</h1>
            <p className="rutina-fecha">{rutinaDelDia.fecha}</p>
          </div>
        </div>
        <div className="rutina-stats">
          <div className="stat-badge">
            <span className="material-icons">schedule</span>
            {rutinaDelDia.duracion}
          </div>
          <div className="stat-badge">
            <span className="material-icons">trending_up</span>
            {rutinaDelDia.nivel}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">Progreso del Día</span>
          <span className="progress-percentage">{Math.round(progreso)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progreso}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {completedExercises.length} de {rutinaDelDia.ejercicios.length} ejercicios completados
        </p>
      </div>

      {/* Exercise List */}
      <div className="ejercicios-list">
        {rutinaDelDia.ejercicios.map((ejercicio) => {
          const isCompleted = completedExercises.includes(ejercicio.id);
          
          return (
            <div 
              key={ejercicio.id} 
              className={`ejercicio-card ${isCompleted ? 'completed' : ''}`}
            >
              <div className="ejercicio-checkbox">
                <input 
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleExerciseComplete(ejercicio.id)}
                  id={`ejercicio-${ejercicio.id}`}
                />
                <label htmlFor={`ejercicio-${ejercicio.id}`}></label>
              </div>

              <div className="ejercicio-icon">
                <span className="material-icons">{ejercicio.icono}</span>
              </div>

              <div className="ejercicio-info">
                <h3>{ejercicio.nombre}</h3>
                <span className="musculo-tag">{ejercicio.musculo}</span>
              </div>

              <div className="ejercicio-details">
                <div className="detail-item">
                  <span className="material-icons">repeat</span>
                  <span>{ejercicio.series} series</span>
                </div>
                <div className="detail-item">
                  <span className="material-icons">fitness_center</span>
                  <span>{ejercicio.repeticiones} reps</span>
                </div>
                <div className="detail-item">
                  <span className="material-icons">timer</span>
                  <span>{ejercicio.descanso}</span>
                </div>
              </div>

              <button className="btn-detalles">
                <span className="material-icons">info</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="rutina-actions">
        {progreso === 100 ? (
          <button className="btn-primary success">
            <span className="material-icons">check_circle</span>
            ¡Rutina Completada!
          </button>
        ) : (
          <button className="btn-primary">
            <span className="material-icons">play_arrow</span>
            Comenzar Entrenamiento
          </button>
        )}
        <button className="btn-secondary">
          <span className="material-icons">history</span>
          Ver Historial
        </button>
      </div>
    </div>
  );
};

export default RutinasDia;
