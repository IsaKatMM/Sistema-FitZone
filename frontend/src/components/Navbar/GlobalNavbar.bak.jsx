// src/components/Navbar/GlobalNavbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './GlobalNavbar.css';

const GlobalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  
  // Usuario de prueba para visualización
  const user = {
    nombre: 'Usuario',
    apellido: 'Demo',
    const { darkMode, toggleTheme, increaseText, decreaseText, textScale } = useTheme();
    rol: 'ADMINISTRADOR'
  };
  
  const isAdmin = user?.rol === 'ADMINISTRADOR';

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      alert('Función de logout (solo prueba visual)');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`global-navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}>
          <span className="material-icons logo-icon">fitness_center</span>
          <span className="brand-name">FitSIL</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <button
            className={`nav-link ${isActive('/user/dashboard') || isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard')}
          >
            <span className="material-icons">dashboard</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-link ${isActive('/ejercicios') ? 'active' : ''}`}
            onClick={() => navigate('/ejercicios')}
          >
            <span className="material-icons">exercise</span>
            <span>Ejercicios</span>
          </button>

          <button
            className={`nav-link ${isActive('/rutinas') ? 'active' : ''}`}
            onClick={() => navigate('/rutinas')}
          >
            <span className="material-icons">event_note</span>
            <span>Rutinas</span>
          </button>

          <button
            className={`nav-link ${isActive('/estadisticas') ? 'active' : ''}`}
            onClick={() => navigate('/estadisticas')}
          >
            <span className="material-icons">analytics</span>
            <span>Estadísticas</span>
          </button>

          {isAdmin && (
            <button
              className={`nav-link ${isActive('/admin/agregar-ejercicio') ? 'active' : ''}`}
              onClick={() => navigate('/admin/agregar-ejercicio')}
            >
              <span className="material-icons">add_circle</span>
              <span>Agregar</span>
            </button>
          )}
        </div>

        {/* Right Actions */}
            <div className="text-zoom" aria-label="Controles de tamaño de texto" role="group">
              <button onClick={decreaseText} className="text-zoom-btn" aria-label="Disminuir tamaño de texto">A-</button>
              <span className="text-zoom-value" aria-live="polite">{textScale}%</span>
              <button onClick={increaseText} className="text-zoom-btn" aria-label="Aumentar tamaño de texto">A+</button>
            </div>
        <div className="navbar-actions">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Cambiar tema" aria-pressed={darkMode}>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Menu */}
          <div className="user-menu">
            <div 
              className="user-avatar"
                aria-label="Abrir menú de usuario"
                aria-haspopup="menu"
                aria-expanded={showMenu}
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="avatar-initials">
                {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0) || ''}
              </span>
            </div>

                <div className="dropdown-menu" role="menu">
              <div className="dropdown-menu">
                <div className="user-info">
                  <p className="user-name">{user?.nombre} {user?.apellido}</p>
                  <p className="user-email">{user?.correo}</p>
                  <span className={`user-role ${isAdmin ? 'admin' : 'user'}`}>
                    {user?.rol}
                  </span>
                </div>
                
                <div className="menu-divider"></div>
                
                <button 
                  className="menu-item"
                  onClick={() => {
                    setShowMenu(false);
                    navigate('/perfil');
                    aria-label="Ir a mi perfil"
                  }}
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
                      aria-label="Gestionar usuarios"
                    }}
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
                    aria-label="Cerrar sesión"
                  }}
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
        />
      )}
    </nav>
  );
};

export default GlobalNavbar;