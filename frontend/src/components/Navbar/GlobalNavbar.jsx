// src/components/Navbar/GlobalNavbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './GlobalNavbar.css';

const GlobalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme, increaseText, decreaseText, textScale, speakOnHover, toggleSpeak } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  // Usuario de prueba para visualización (sin backend)
  const user = {
    nombre: 'Usuario',
    apellido: 'Demo',
    correo: 'demo@fitsil.com',
    rol: 'ADMINISTRADOR'
  };

  const isAdmin = user?.rol === 'ADMINISTRADOR';

  const handleLogout = () => {
    alert('Función de logout (solo prueba visual)');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`global-navbar ${darkMode ? 'dark' : ''}`} aria-label="Barra de navegación">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}>
          <span className="material-icons logo-icon">fitness_center</span>
          <span className="brand-name">FitSIL</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links" role="list">
          <button
            className={`nav-link ${isActive('/user/dashboard') || isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
            aria-label="Ir al dashboard"
            role="listitem"
          >
            <span className="material-icons">dashboard</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-link ${isActive('/ejercicios') ? 'active' : ''}`}
            onClick={() => navigate('/ejercicios')}
            aria-label="Ver ejercicios"
            role="listitem"
          >
            <span className="material-icons">exercise</span>
            <span>Ejercicios</span>
          </button>

          <button
            className={`nav-link ${isActive('/rutinas') ? 'active' : ''}`}
            onClick={() => navigate('/rutinas')}
            aria-label="Ver rutinas del día"
            role="listitem"
          >
            <span className="material-icons">event_note</span>
            <span>Rutinas</span>
          </button>

          <button
            className={`nav-link ${isActive('/recetas') ? 'active' : ''}`}
            onClick={() => navigate('/recetas')}
            aria-label="Ver recetas saludables"
            role="listitem"
          >
            <span className="material-icons">restaurant</span>
            <span>Recetas</span>
          </button>

          <button
            className={`nav-link ${isActive('/estadisticas') ? 'active' : ''}`}
            onClick={() => navigate('/estadisticas')}
            aria-label="Ver estadísticas"
            role="listitem"
          >
            <span className="material-icons">analytics</span>
            <span>Estadísticas</span>
          </button>

          {isAdmin && (
            <button
              className={`nav-link ${isActive('/admin/agregar-ejercicio') ? 'active' : ''}`}
              onClick={() => navigate('/admin/agregar-ejercicio')}
              aria-label="Agregar ejercicio"
              role="listitem"
            >
              <span className="material-icons">add_circle</span>
              <span>Agregar</span>
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema" aria-pressed={darkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Menu */}
          <div className="user-menu">
            <div 
              className="user-avatar"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Abrir menú de usuario"
              aria-haspopup="menu"
              aria-expanded={showMenu}
              role="button"
            >
              <span className="avatar-initials">
                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0) || ''}
              </span>
            </div>

            {showMenu && (
              <div className="dropdown-menu" role="menu">
                <div className="user-info">
                  <p className="user-name">{user?.nombre} {user?.apellido}</p>
                  <p className="user-email">{user?.correo}</p>
                  <span className={`user-role ${isAdmin ? 'admin' : 'user'}`}>
                    {user?.rol}
                  </span>
                </div>

                <div className="menu-divider"></div>

                <div className="text-zoom" aria-label="Controles de tamaño de texto" role="group">
                  <button onClick={decreaseText} className="text-zoom-btn" aria-label="Disminuir tamaño de texto">A-</button>
                  <span className="text-zoom-value" aria-live="polite">{textScale}%</span>
                  <button onClick={increaseText} className="text-zoom-btn" aria-label="Aumentar tamaño de texto">A+</button>
                </div>

                <button 
                  className="menu-item"
                  onClick={() => {
                    toggleSpeak();
                  }}
                  aria-label="Alternar lectura en hover"
                  role="menuitem"
                >
                  <span className="material-icons">record_voice_over</span>
                  {speakOnHover ? 'Desactivar lectura' : 'Activar lectura'}
                </button>

                <div className="menu-divider"></div>

                <button 
                  className="menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard');
                  }}
                  aria-label="Ir a mi perfil"
                  role="menuitem"
                >
                  <span className="material-icons">person</span>
                  Mi Perfil
                </button>

                {isAdmin && (
                  <button 
                    className="menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      navigate('/admin/usuarios');
                    }}
                    aria-label="Gestionar usuarios"
                    role="menuitem"
                  >
                    <span className="material-icons">group</span>
                    Gestionar Usuarios
                  </button>
                )}

                <div className="menu-divider"></div>

                <button 
                  className="menu-item logout"
                  onClick={() => {
                    setShowMenu(false);
                    handleLogout();
                  }}
                  aria-label="Cerrar sesión"
                  role="menuitem"
                >
                  <span className="material-icons">logout</span>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer click fuera */}
      {showMenu && (
        <div 
          className="menu-overlay" 
          onClick={() => setShowMenu(false)}
          aria-label="Cerrar menú de usuario"
        />
      )}
    </nav>
  );
};

export default GlobalNavbar;
