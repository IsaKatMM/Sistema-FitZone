// src/components/Dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Dashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    peso: '',
    altura: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        telefono: currentUser.telefono || '',
        peso: currentUser.peso || '',
        altura: currentUser.altura || ''
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
    // Restaurar datos originales
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      telefono: user.telefono || '',
      peso: user.peso || '',
      altura: user.altura || ''
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
        peso: parseFloat(formData.peso) || 0,
        altura: parseFloat(formData.altura) || 0
      };

      const updated = await authService.updatePerfil(user.correo, updatedData);
      setUser(updated);
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
        await authService.deletePerfil(user.correo);
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

  const calcularIMC = () => {
    if (user?.peso && user?.altura && user.altura > 0) {
      const imc = user.peso / (user.altura * user.altura);
      return imc.toFixed(2);
    }
    return 'N/A';
  };

  const getIMCCategoria = (imc) => {
    if (imc === 'N/A') return '';
    const valor = parseFloat(imc);
    if (valor < 18.5) return 'Bajo peso';
    if (valor < 25) return 'Normal';
    if (valor < 30) return 'Sobrepeso';
    return 'Obesidad';
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  const imc = calcularIMC();

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>💪 FitZone</h2>
        </div>
        <div className="nav-user">
          <span className="user-greeting">Hola, {user.nombre}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Panel de Usuario</h1>
          <span className="user-badge">👤 Usuario</span>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
            {message.text}
          </div>
        )}

        <div className="dashboard-grid">
          {/* Tarjeta de Perfil */}
          <div className="card">
            <div className="card-header">
              <h3>📋 Información Personal</h3>
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
                    <label>Peso (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      name="peso"
                      value={formData.peso}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Altura (m):</label>
                    <input
                      type="number"
                      step="0.01"
                      name="altura"
                      value={formData.altura}
                      onChange={handleChange}
                      className="form-control"
                      min="0"
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
                    <strong>Nombre:</strong> {user.nombre} {user.apellido}
                  </div>
                  <div className="info-item">
                    <strong>Usuario:</strong> @{user.usuario}
                  </div>
                  <div className="info-item">
                    <strong>Correo:</strong> {user.correo}
                  </div>
                  <div className="info-item">
                    <strong>Teléfono:</strong> {user.telefono || 'No registrado'}
                  </div>
                  <div className="info-item">
                    <strong>Peso:</strong> {user.peso ? `${user.peso} kg` : 'No registrado'}
                  </div>
                  <div className="info-item">
                    <strong>Altura:</strong> {user.altura ? `${user.altura} m` : 'No registrado'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tarjeta de IMC */}
          <div className="card">
            <div className="card-header">
              <h3>📊 Índice de Masa Corporal</h3>
            </div>
            <div className="card-body">
              <div className="imc-display">
                <div className="imc-value">
                  <span className="imc-number">{imc}</span>
                  <span className="imc-label">IMC</span>
                </div>
                <div className="imc-categoria">
                  {getIMCCategoria(imc)}
                </div>
                {imc === 'N/A' && (
                  <p className="imc-info">
                    Registra tu peso y altura para calcular tu IMC
                  </p>
                )}
              </div>
              <div className="imc-ranges">
                <small>
                  <strong>Referencia:</strong><br/>
                  &lt; 18.5: Bajo peso<br/>
                  18.5 - 24.9: Normal<br/>
                  25 - 29.9: Sobrepeso<br/>
                  ≥ 30: Obesidad
                </small>
              </div>
            </div>
          </div>

          {/* Tarjeta de Rutinas */}
          <div className="card">
            <div className="card-header">
              <h3>🏋️ Mis Rutinas</h3>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <p>🎯 Aún no tienes rutinas asignadas</p>
                <p className="text-muted">
                  Pronto podrás ver y seguir tus rutinas de ejercicio aquí
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Progreso */}
          <div className="card">
            <div className="card-header">
              <h3>📈 Mi Progreso</h3>
            </div>
            <div className="card-body">
              <div className="empty-state">
                <p>📊 Estadísticas de progreso</p>
                <p className="text-muted">
                  Aquí podrás ver tu evolución y estadísticas de entrenamiento
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className="danger-zone">
          <h4>⚠️ Zona de Peligro</h4>
          <p>Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
          <button onClick={handleDelete} className="btn-danger">
            🗑️ Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;