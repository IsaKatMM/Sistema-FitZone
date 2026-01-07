// src/components/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import authService from '../../services/authService';
import adminService from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { darkMode } = useTheme(); // ✅ Usar tema global
  const [admin, setAdmin] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
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
      let usuariosData = [];
      try {
        usuariosData = await adminService.listarUsuarios();
      } catch (error) {
        console.error('⚠️ Error al cargar usuarios:', error.response?.status);
      }
      
      let statsData = { totalUsuarios: 0, promedioPeso: 0, promedioAltura: 0 };
      try {
        statsData = await adminService.obtenerEstadisticas();
      } catch (error) {
        if (usuariosData.length > 0) {
          const totalPeso = usuariosData.reduce((sum, u) => sum + (u.peso || 0), 0);
          const totalAltura = usuariosData.reduce((sum, u) => sum + (u.altura || 0), 0);
          statsData = {
            totalUsuarios: usuariosData.length,
            promedioPeso: usuariosData.length > 0 ? totalPeso / usuariosData.length : 0,
            promedioAltura: usuariosData.length > 0 ? totalAltura / usuariosData.length : 0
          };
        }
      }
      
      setUsuarios(usuariosData);
      setUsuariosFiltrados(usuariosData);
      setEstadisticas(statsData);
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
            onClick={() => setActiveSection('users')}
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
        {/* Header sin botón de tema */}
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
              <p className="stat-value-admin">{estadisticas.totalUsuarios}</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Activos Hoy</p>
              <p className="stat-value-admin">{usuariosActivos}</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Peso Promedio</p>
              <p className="stat-value-admin">{estadisticas.promedioPeso.toFixed(1)} kg</p>
            </div>
            
            <div className="stat-card-admin">
              <p className="stat-label-admin">Altura Promedio</p>
              <p className="stat-value-admin">{estadisticas.promedioAltura.toFixed(2)} m</p>
            </div>
          </section>

          {/* User Management Section */}
          {activeSection === 'users' && (
            <section className="management-section">
              <div className="section-header">
                <h2 className="section-title-main">Gestión de Usuarios</h2>
                <div className="section-actions">
                  <button className="btn-secondary-admin" onClick={cargarDatos}>
                    <span className="material-icons">refresh</span>
                    Actualizar
                  </button>
                </div>
              </div>

              <div className="search-bar">
                <span className="material-icons search-icon">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, correo o usuario..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="table-container">
                {loading ? (
                  <div className="loading-state">Cargando usuarios...</div>
                ) : usuariosFiltrados.length === 0 ? (
                  <div className="empty-state-admin">
                    <span className="material-icons empty-icon">group</span>
                    <p>{searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}</p>
                  </div>
                ) : (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Correo</th>
                        <th>Peso</th>
                        <th>Altura</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>{usuario.nombre} {usuario.apellido}</td>
                          <td>@{usuario.usuario}</td>
                          <td>{usuario.correo}</td>
                          <td>{usuario.peso} kg</td>
                          <td>{usuario.altura} m</td>
                          <td>
                            <span className={`badge badge-${usuario.rol?.toLowerCase()}`}>
                              {usuario.rol}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-action edit"
                                title="Cambiar rol"
                                onClick={() => {
                                  const nuevoRol = usuario.rol === 'USUARIO' ? 'ENTRENADOR' : 'USUARIO';
                                  handleCambiarRol(usuario.correo, nuevoRol);
                                }}
                              >
                                <span className="material-icons">swap_horiz</span>
                              </button>
                              <button 
                                className="btn-action delete"
                                title="Eliminar"
                                onClick={() => handleEliminarUsuario(usuario.correo)}
                              >
                                <span className="material-icons">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          )}

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
                    <p className="card-stat">{estadisticas.totalUsuarios} registrados</p>
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
                  <h3>Usuarios Registrados</h3>
                  <p className="stat-large-value">{estadisticas.totalUsuarios}</p>
                  <p className="stat-subtitle">Total de usuarios en el sistema</p>
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