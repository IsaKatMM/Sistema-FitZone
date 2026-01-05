// src/components/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setAdmin(currentUser);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      authService.logout();
    }
  };

  if (!admin) {
    return (
      <div className={`admin-dashboard-modern ${darkMode ? 'dark' : ''}`}>
        <div className="loading-state">Cargando...</div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard-modern ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="material-icons logo-icon">fitness_center</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="material-icons">dashboard</span>
            <span className="nav-text">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <span className="material-icons">group</span>
            <span className="nav-text">Usuarios</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'exercises' ? 'active' : ''}`}
            onClick={() => setActiveSection('exercises')}
          >
            <span className="material-icons">exercise</span>
            <span className="nav-text">Ejercicios</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <span className="material-icons">analytics</span>
            <span className="nav-text">Reportes</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Header */}
        <header className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          
          <div className="admin-header-actions">
            <button onClick={toggleTheme} className="theme-toggle-admin">
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <button className="notification-btn">
              <span className="material-icons">notifications</span>
            </button>
            
            <div className="admin-avatar" onClick={() => setShowProfileModal(true)}>
              <span className="avatar-initials">
                {admin.nombre?.charAt(0)}{admin.apellido?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Modal de perfil */}
        {showProfileModal && (
          <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="profile-header-content">
                  <div className="profile-avatar-large admin-profile">
                    <span className="avatar-initials-large">
                      {admin.nombre?.charAt(0)}{admin.apellido?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="profile-header-text">
                    <h3>{admin.nombre} {admin.apellido}</h3>
                    <p className="profile-role">Administrador</p>
                  </div>
                </div>
                <button onClick={() => setShowProfileModal(false)} className="close-btn">
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="profile-modal-body">
                <div className="profile-info-section">
                  <h4 className="section-title">
                    <span className="material-icons">admin_panel_settings</span>
                    Información del Administrador
                  </h4>
                  
                  <div className="profile-info-list">
                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">badge</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Usuario</span>
                        <span className="info-value-profile">@{admin.usuario}</span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">email</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Correo</span>
                        <span className="info-value-profile">{admin.correo}</span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">phone</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Teléfono</span>
                        <span className="info-value-profile">{admin.telefono || 'No registrado'}</span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">business</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Departamento</span>
                        <span className="info-value-profile">{admin.departamento || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <div className="info-icon-wrapper">
                        <span className="material-icons">key</span>
                      </div>
                      <div className="info-text">
                        <span className="info-label-profile">Código Admin</span>
                        <span className="info-value-profile">{admin.codigoAdmin || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-modal-actions">
                  <button onClick={handleLogout} className="btn-logout-profile">
                    <span className="material-icons">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="admin-content">
          {/* Statistics Cards */}
          <section className="stats-section">
            <div className="stat-card-admin">
              <p className="stat-label-admin">Total Usuarios</p>
              <p className="stat-value-admin">0</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Activos Hoy</p>
              <p className="stat-value-admin">0</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Rutinas Creadas</p>
              <p className="stat-value-admin">0</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Total Ejercicios</p>
              <p className="stat-value-admin">0</p>
            </div>
          </section>

          {/* User Management Section */}
          {activeSection === 'users' && (
            <section className="management-section">
              <div className="section-header">
                <h2 className="section-title-main">Gestión de Usuarios</h2>
                <div className="section-actions">
                  <button className="btn-secondary-admin">
                    <span className="material-icons">upload</span>
                    Exportar
                  </button>
                  <button className="btn-primary-admin">
                    <span className="material-icons">add</span>
                    Agregar Usuario
                  </button>
                </div>
              </div>

              <div className="search-bar">
                <span className="material-icons search-icon">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar usuarios..."
                  className="search-input"
                />
              </div>

              <div className="table-container">
                <div className="empty-state-admin">
                  <span className="material-icons empty-icon">group</span>
                  <p>No hay usuarios registrados</p>
                  <p className="empty-subtitle">Los usuarios aparecerán aquí</p>
                </div>
              </div>
            </section>
          )}

          {/* Exercise Management */}
          {activeSection === 'exercises' && (
            <section className="management-section">
              <div className="section-header">
                <h2 className="section-title-main">Biblioteca de Ejercicios</h2>
                <div className="section-actions">
                  <button className="btn-secondary-admin">
                    <span className="material-icons">category</span>
                    Categorías
                  </button>
                  <button className="btn-primary-admin">
                    <span className="material-icons">add</span>
                    Agregar Ejercicio
                  </button>
                </div>
              </div>

              <div className="table-container">
                <div className="empty-state-admin">
                  <span className="material-icons empty-icon">exercise</span>
                  <p>No hay ejercicios registrados</p>
                  <p className="empty-subtitle">Comienza agregando ejercicios</p>
                </div>
              </div>
            </section>
          )}

          {/* Analytics */}
          {activeSection === 'analytics' && (
            <section className="management-section">
              <h2 className="section-title-main">Usuarios Activos (Últimos 30 Días)</h2>
              
              <div className="chart-container">
                <div className="empty-state-admin">
                  <span className="material-icons empty-icon">analytics</span>
                  <p>Estadísticas no disponibles</p>
                  <p className="empty-subtitle">Los datos aparecerán cuando haya actividad</p>
                </div>
              </div>
            </section>
          )}

          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
            <>
              <section className="management-section">
                <h2 className="section-title-main">Resumen del Sistema</h2>
                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <div className="dashboard-card-icon users">
                      <span className="material-icons">group</span>
                    </div>
                    <div className="dashboard-card-content">
                      <h3>Usuarios</h3>
                      <p>Gestionar usuarios del sistema</p>
                      <button onClick={() => setActiveSection('users')} className="card-action-btn">
                        Ver más →
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="dashboard-card-icon exercises">
                      <span className="material-icons">exercise</span>
                    </div>
                    <div className="dashboard-card-content">
                      <h3>Ejercicios</h3>
                      <p>Biblioteca de ejercicios</p>
                      <button onClick={() => setActiveSection('exercises')} className="card-action-btn">
                        Ver más →
                      </button>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <div className="dashboard-card-icon analytics">
                      <span className="material-icons">analytics</span>
                    </div>
                    <div className="dashboard-card-content">
                      <h3>Reportes</h3>
                      <p>Estadísticas y análisis</p>
                      <button onClick={() => setActiveSection('analytics')} className="card-action-btn">
                        Ver más →
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;