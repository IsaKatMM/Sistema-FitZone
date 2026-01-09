// src/components/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import adminService from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [admin, setAdmin] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    administradores: 0,
    usuarios: 0,
    promedioPeso: 0,
    promedioAltura: 0
  });
  const [loading, setLoading] = useState(false);
  const [usuariosActivos, setUsuariosActivos] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setAdmin(currentUser);
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar usuarios
      let usuariosData = [];
      try {
        usuariosData = await adminService.listarUsuarios();
        console.log('✅ Usuarios cargados:', usuariosData.length);
      } catch (error) {
        console.error('⚠️ Error al cargar usuarios:', error.response?.status);
      }
      
      // Cargar estadísticas del backend
      let statsData = { total: 0, administradores: 0, usuarios: 0 };
      try {
        statsData = await adminService.obtenerEstadisticas();
        console.log('✅ Estadísticas del backend:', statsData);
      } catch (error) {
        console.error('⚠️ Error al cargar estadísticas:', error);
      }
      
      // ✅ CALCULAR PROMEDIOS LOCALMENTE
      let promedioPeso = 0;
      let promedioAltura = 0;
      
      if (usuariosData.length > 0) {
        const usuariosConPeso = usuariosData.filter(u => u.peso && u.peso > 0);
        const usuariosConAltura = usuariosData.filter(u => u.altura && u.altura > 0);
        
        if (usuariosConPeso.length > 0) {
          const totalPeso = usuariosConPeso.reduce((sum, u) => sum + u.peso, 0);
          promedioPeso = totalPeso / usuariosConPeso.length;
        }
        
        if (usuariosConAltura.length > 0) {
          const totalAltura = usuariosConAltura.reduce((sum, u) => sum + u.altura, 0);
          promedioAltura = totalAltura / usuariosConAltura.length;
        }
      }
      
      setUsuarios(usuariosData);
      setUsuariosFiltrados(usuariosData);
      setEstadisticas({
        ...statsData,
        promedioPeso,
        promedioAltura
      });
      setUsuariosActivos(adminService.calcularUsuariosActivos(usuariosData));
      
    } catch (error) {
      console.error('❌ Error general al cargar datos:', error);
      alert('Error al cargar los datos del sistema.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const resultados = adminService.buscarUsuarios(usuarios, searchTerm);
    setUsuariosFiltrados(resultados);
  }, [searchTerm, usuarios]);

  const handleEliminarUsuario = async (email) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${email}?`)) {
      try {
        await adminService.eliminarUsuario(email);
        alert('Usuario eliminado exitosamente');
        cargarDatos();
      } catch (error) {
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleCambiarRol = async (email, nuevoRol) => {
    try {
      await adminService.cambiarRol(email, nuevoRol);
      alert('Rol actualizado exitosamente');
      cargarDatos();
    } catch (error) {
      alert('Error al cambiar rol');
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
            onClick={() => navigate('/admin/usuarios')}
          >
            <span className="material-icons">group</span>
            <span className="nav-text">Usuarios</span>
          </button>
          
          <button 
            className={`nav-item ${activeSection === 'exercises' ? 'active' : ''}`}
            onClick={() => navigate('/ejercicios')}
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
                        <span className="info-value-profile">@{admin.usuario || 'N/A'}</span>
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
                  </div>
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
              <p className="stat-value-admin">{estadisticas.total || 0}</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Administradores</p>
              <p className="stat-value-admin">{estadisticas.administradores || 0}</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Peso Promedio</p>
              <p className="stat-value-admin">
                {estadisticas.promedioPeso > 0 ? estadisticas.promedioPeso.toFixed(1) : '0'} kg
              </p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Altura Promedio</p>
              <p className="stat-value-admin">
                {estadisticas.promedioAltura > 0 ? estadisticas.promedioAltura.toFixed(2) : '0'} m
              </p>
            </div>
          </section>

          {/* Dashboard Overview */}
          {activeSection === 'dashboard' && (
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
                    <p className="card-stat">{estadisticas.usuarios || 0} usuarios</p>
                    <p className="card-stat">{estadisticas.administradores || 0} administradores</p>
                    <button onClick={() => navigate('/admin/usuarios')} className="card-action-btn">
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
                    <button onClick={() => navigate('/ejercicios')} className="card-action-btn">
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
                    <p className="card-stat">{usuariosActivos} activos hoy</p>
                    <button onClick={() => setActiveSection('analytics')} className="card-action-btn">
                      Ver más →
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Analytics */}
          {activeSection === 'analytics' && (
            <section className="management-section">
              <h2 className="section-title-main">Estadísticas del Sistema</h2>
              <div className="stats-grid">
                <div className="stat-card-large">
                  <h3>Total de Usuarios</h3>
                  <p className="stat-large-value">{estadisticas.total || 0}</p>
                  <div className="stat-breakdown">
                    <p>{estadisticas.usuarios || 0} Usuarios regulares</p>
                    <p>{estadisticas.administradores || 0} Administradores</p>
                  </div>
                </div>

                <div className="stat-card-large">
                  <h3>Promedios Físicos</h3>
                  <div className="stat-breakdown">
                    <p>Peso: {estadisticas.promedioPeso > 0 ? estadisticas.promedioPeso.toFixed(1) : '0'} kg</p>
                    <p>Altura: {estadisticas.promedioAltura > 0 ? estadisticas.promedioAltura.toFixed(2) : '0'} m</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;