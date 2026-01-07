// src/components/Profile/UserProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const user = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className={`user-profile-container ${darkMode ? 'dark' : ''}`}>
      <div className="profile-header">
        <div className="profile-avatar-large">
          <span className="avatar-initials-large">
            {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0) || ''}
          </span>
        </div>
        <div className="profile-info-header">
          <h1>{user?.nombre} {user?.apellido}</h1>
          <p className="profile-email">{user?.correo}</p>
          <span className={`profile-badge ${user?.rol === 'ADMINISTRADOR' ? 'admin' : 'user'}`}>
            {user?.rol}
          </span>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <span className="material-icons">person</span>
          Información Personal
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="material-icons">bar_chart</span>
          Estadísticas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="material-icons">settings</span>
          Configuración
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="info-section">
            <div className="info-card">
              <h3>
                <span className="material-icons">badge</span>
                Datos Personales
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre</label>
                  <p>{user?.nombre}</p>
                </div>
                <div className="info-item">
                  <label>Apellido</label>
                  <p>{user?.apellido}</p>
                </div>
                <div className="info-item">
                  <label>Correo</label>
                  <p>{user?.correo}</p>
                </div>
                <div className="info-item">
                  <label>Rol</label>
                  <p>{user?.rol}</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>
                <span className="material-icons">fitness_center</span>
                Información de Entrenamiento
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Rutinas Completadas</label>
                  <p className="stat-value">12</p>
                </div>
                <div className="info-item">
                  <label>Ejercicios Realizados</label>
                  <p className="stat-value">156</p>
                </div>
                <div className="info-item">
                  <label>Tiempo Total</label>
                  <p className="stat-value">24h 30min</p>
                </div>
                <div className="info-item">
                  <label>Racha Actual</label>
                  <p className="stat-value">7 días</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <div className="stats-card">
              <h3>
                <span className="material-icons">trending_up</span>
                Progreso Semanal
              </h3>
              <p>Próximamente: Gráficos de progreso y estadísticas detalladas</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-card">
              <h3>
                <span className="material-icons">security</span>
                Seguridad
              </h3>
              <button className="settings-btn">
                <span className="material-icons">lock</span>
                Cambiar Contraseña
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
