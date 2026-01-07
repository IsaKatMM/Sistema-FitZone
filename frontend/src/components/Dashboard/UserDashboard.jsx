// src/components/Dashboard/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import authService from "../../services/authService";
import "./UserDashboard.css";

import rutinasImg from "../../assets/images/rutinas.png";
import estadisticasImg from "../../assets/images/estadisticas.png";
import nutricionImg from "../../assets/images/nutricion.png";

const UserDashboard = () => {
  const { darkMode } = useTheme(); // ✅ Usar tema global
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    peso: "",
    altura: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        nombre: currentUser.nombre || "",
        apellido: currentUser.apellido || "",
        telefono: currentUser.telefono || "",
        peso: currentUser.peso || "",
        altura: currentUser.altura || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updatedData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        peso: parseFloat(formData.peso) || 0,
        altura: parseFloat(formData.altura) || 0,
      };

      const updated = await authService.updatePerfil(user.correo, updatedData);
      setUser(updated);
      setEditMode(false);
      setMessage({
        type: "success",
        text: "¡Perfil actualizado exitosamente!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMessage({
        type: "error",
        text: error.message || "Error al actualizar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "⚠️ ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await authService.deletePerfil(user.correo);
        alert("Cuenta eliminada exitosamente");
        authService.logout();
      } catch (error) {
        console.error("Error al eliminar:", error);
        setMessage({
          type: "error",
          text: error.message || "Error al eliminar la cuenta",
        });
      }
    }
  };

  const calcularIMC = () => {
    if (user?.peso && user?.altura && user.altura > 0) {
      const imc = user.peso / (user.altura * user.altura);
      return imc.toFixed(1);
    }
    return "N/A";
  };

  const getIMCCategoria = (imc) => {
    if (imc === "N/A") return "Sin datos";
    const valor = parseFloat(imc);
    if (valor < 18.5) return "Bajo peso";
    if (valor < 25) return "Normal";
    if (valor < 30) return "Sobrepeso";
    return "Obesidad";
  };

  if (!user) {
    return (
      <div className={`user-dashboard-modern ${darkMode ? "dark" : ""}`}>
        <div className="loading-state">Cargando...</div>
      </div>
    );
  }

  const imc = calcularIMC();

  return (
    <div className={`user-dashboard-modern ${darkMode ? "dark" : ""}`}>
      {/* Header sin botón de tema (ahora está en navbar) */}
      <div className="dashboard-header-user">
        <div className="header-info">
          <p className="welcome-text">Bienvenido de nuevo,</p>
          <h2 className="user-name">{user.nombre}</h2>
        </div>
        <div className="header-actions">
          <div
            className="user-avatar clickable"
            onClick={() => setEditMode(true)}
          >
            <span className="avatar-initials">
              {user.nombre?.charAt(0)}
              {user.apellido?.charAt(0) || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Mensaje de alerta */}
      {message.text && (
        <div className={`alert-message ${message.type}`}>{message.text}</div>
      )}

      {/* Modal de edición */}
      {editMode && (
        <div className="modal-overlay" onClick={() => setEditMode(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Perfil</h3>
              <button onClick={() => setEditMode(false)} className="close-btn">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    minLength="3"
                  />
                </div>
                <div className="form-field">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="form-field">
                  <label>Altura (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="altura"
                    value={formData.altura}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="btn-save">
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>

              <div className="danger-zone-modal">
                <p>¿Deseas eliminar tu cuenta?</p>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn-delete"
                >
                  Eliminar Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="material-icons stat-icon">monitor_weight</span>
          <div className="stat-content">
            <h3 className="stat-title">Peso</h3>
            <p className="stat-value">
              {user.peso ? `${user.peso} kg` : "N/A"}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <span className="material-icons stat-icon">height</span>
          <div className="stat-content">
            <h3 className="stat-title">Altura</h3>
            <p className="stat-value">
              {user.altura ? `${user.altura} m` : "N/A"}
            </p>
          </div>
        </div>

        <div className="stat-card highlight">
          <span className="material-icons stat-icon">insights</span>
          <div className="stat-content">
            <h3 className="stat-title">IMC</h3>
            <p className="stat-value">{imc}</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="material-icons stat-icon">favorite</span>
          <div className="stat-content">
            <h3 className="stat-title">Estado</h3>
            <p className="stat-value stat-small">{getIMCCategoria(imc)}</p>
          </div>
        </div>
      </div>

      {/* IMC Card */}
      <div className="imc-card">
        <h3 className="card-title">Índice de Masa Corporal</h3>
        <div className="imc-display-large">
          <div className="imc-circle">
            <span className="imc-number-large">{imc}</span>
            <span className="imc-label-small">IMC</span>
          </div>
          <div className="imc-info-text">
            <p className="imc-category">{getIMCCategoria(imc)}</p>
            {imc === "N/A" ? (
              <p className="imc-description">Registra tu peso y altura</p>
            ) : (
              <p className="imc-description">
                Tu IMC está en rango de {getIMCCategoria(imc).toLowerCase()}
              </p>
            )}
          </div>
        </div>

        <div className="imc-ranges-visual">
          <div className="range-bar">
            <div className="range-segment bajo"></div>
            <div className="range-segment normal"></div>
            <div className="range-segment sobrepeso"></div>
            <div className="range-segment obesidad"></div>
          </div>
          <div className="range-labels">
            <span>&lt;18.5</span>
            <span>18.5-24.9</span>
            <span>25-29.9</span>
            <span>≥30</span>
          </div>
        </div>
      </div>

      {/* Progreso Semanal */}
      <div className="weekly-card">
        <div className="weekly-header">
          <h3 className="weekly-title">Progreso Semanal</h3>
          <p className="weekly-subtitle">Total minutos esta semana</p>
          <span className="weekly-time">0h 0m</span>
        </div>

        <div className="weekly-progress">
          {[
            { dia: "Mon", hizoEjercicio: false },
            { dia: "Tue", hizoEjercicio: false },
            { dia: "Wed", hizoEjercicio: false },
            { dia: "Thu", hizoEjercicio: false },
            { dia: "Fri", hizoEjercicio: false },
            { dia: "Sat", hizoEjercicio: false },
            { dia: "Sun", hizoEjercicio: false },
          ].map((dia, index) => (
            <div key={index} className="dia-columna">
              <div
                className={`dia-circulo ${dia.hizoEjercicio ? "activo" : ""}`}
              />
              <span
                className={`dia-texto ${dia.hizoEjercicio ? "activo" : ""}`}
              >
                {dia.dia}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="quick-access-section">
        <div className="quick-card" onClick={() => navigate('/ejercicios')}>
          <div
            className="quick-card-image"
            style={{ backgroundImage: `url(${rutinasImg})` }}
          />
          <div className="quick-card-content">
            <p className="quick-card-title">Mis Rutinas</p>
            <p className="quick-card-subtitle">Gestionar planes</p>
          </div>
        </div>

        <div className="quick-card" onClick={() => navigate('/estadisticas')}>
          <div
            className="quick-card-image"
            style={{ backgroundImage: `url(${estadisticasImg})` }}
          />
          <div className="quick-card-content">
            <p className="quick-card-title">Estadísticas</p>
            <p className="quick-card-subtitle">Ver progreso</p>
          </div>
        </div>

        <div className="quick-card">
          <div
            className="quick-card-image"
            style={{ backgroundImage: `url(${nutricionImg})` }}
          />
          <div className="quick-card-content">
            <p className="quick-card-title">Nutrición</p>
            <p className="quick-card-subtitle">Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;