// src/components/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Dashboard.css';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    departamento: '',
    codigoAdmin: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setAdmin(currentUser);
      setFormData({
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        telefono: currentUser.telefono || '',
        departamento: currentUser.departamento || '',
        codigoAdmin: currentUser.codigoAdmin || ''
      });
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      authService.logout();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      nombre: admin.nombre || '',
      apellido: admin.apellido || '',
      telefono: admin.telefono || '',
      departamento: admin.departamento || '',
      codigoAdmin: admin.codigoAdmin || ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        departamento: formData.departamento,
        codigoAdmin: parseInt(formData.codigoAdmin)
      };

      const updated = await authService.updatePerfil(admin.correo, updatedData);
      setAdmin(updated);
      setEditMode(false);
      setMessage({ type: 'success', text: '¡Perfil actualizado exitosamente!' });
    } catch (error) {
      console.error('Error al actualizar:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar el perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await authService.deletePerfil(admin.correo);
        alert('Cuenta eliminada exitosamente');
        authService.logout();
      } catch (error) {
        console.error('Error al eliminar:', error);
        setMessage({ 
          type: 'error', 
          text: error.message || 'Error al eliminar la cuenta' 
        });
      }
    }
  };

  if (!admin) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container admin-dashboard">
      <nav className="dashboard-nav admin-nav">
        <div className="nav-brand">
          <h2>⚙️ FitZone Admin</h2>
        </div>
        <div className="nav-user">
          <span className="user-greeting">Admin: {admin.nombre}</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Panel de Administración</h1>
          <span className="user-badge admin-badge">👨‍💼 Administrador</span>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
            {message.text}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Tarjeta de Perfil Admin */}
          <div className="card">
            <div className="card-header">
              <h3>👨‍💼 Información del Administrador</h3>
              {!editMode && (
                <button onClick={handleEdit} className="btn-edit">
                  ✏️ Editar
                </button>
              )}
            </div>
            <div className="card-body">
              {editMode ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="form-control"
                      required
                      minLength="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Apellido:</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Departamento:</label>
                    <input
                      type="text"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Código de Administrador:</label>
                    <input
                      type="number"
                      name="codigoAdmin"
                      value={formData.codigoAdmin}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? 'Guardando...' : '💾 Guardar'}
                    </button>
                    <button type="button" onClick={handleCancel} className="btn-secondary">
                      ❌ Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-list">
                  <div className="info-item">
                    <strong>Nombre:</strong> {admin.nombre} {admin.apellido}
                  </div>
                  <div className="info-item">
                    <strong>Usuario:</strong> @{admin.usuario}
                  </div>
                  <div className="info-item">
                    <strong>Correo:</strong> {admin.correo}
                  </div>
                  <div className="info-item">
                    <strong>Teléfono:</strong> {admin.telefono || 'No registrado'}
                  </div>
                  <div className="info-item">
                    <strong>Departamento:</strong> {admin.departamento}
                  </div>
                  <div className="info-item">
                    <strong>Código Admin:</strong> {admin.codigoAdmin}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="card">
            <div className="card-header">
              <h3>📊 Estadísticas del Sistema</h3>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Usuarios</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🏋️</div>
                  <div className="stat-info">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Rutinas</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">💪</div>
                  <div className="stat-info">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Ejercicios</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Activos Hoy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gestión de Usuarios */}
          <div className="card full-width">
            <div className="card-header">
              <h3>👥 Gestión de Usuarios</h3>
              <button className="btn-primary">➕ Agregar Usuario</button>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <p>📋 Lista de usuarios registrados</p>
                <p className="text-muted">
                  Próximamente podrás ver, editar y gestionar todos los usuarios del sistema
                </p>
              </div>
            </div>
          </div>

          {/* Gestión de Rutinas */}
          <div className="card full-width">
            <div className="card-header">
              <h3>🏋️ Gestión de Rutinas</h3>
              <button className="btn-primary">➕ Crear Rutina</button>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <p>📝 Rutinas de ejercicio del sistema</p>
                <p className="text-muted">
                  Próximamente podrás crear, editar y asignar rutinas a los usuarios
                </p>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="card">
            <div className="card-header">
              <h3>⚡ Accesos Rápidos</h3>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <button className="quick-action-btn">
                  <span className="action-icon">👥</span>
                  <span>Ver Usuarios</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">🏋️</span>
                  <span>Crear Rutina</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">💪</span>
                  <span>Ejercicios</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">📊</span>
                  <span>Reportes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="card">
            <div className="card-header">
              <h3>🕒 Actividad Reciente</h3>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <p>📝 Últimas acciones en el sistema</p>
                <p className="text-muted">
                  Aquí se mostrarán las últimas actividades de usuarios y administradores
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className="danger-zone">
          <h4>⚠️ Zona de Peligro</h4>
          <p>Una vez que elimines tu cuenta de administrador, no hay vuelta atrás.</p>
          <button onClick={handleDelete} className="btn-danger">
            🗑️ Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;