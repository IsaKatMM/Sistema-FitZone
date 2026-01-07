// src/components/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    contrasenia: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar preferencia de tema desde localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    // Aplicar tema al documento
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      console.log('Login exitoso:', response);
      
      // Redirigir según el rol del usuario
      if (response.usuario && response.usuario.rol === 'ADMINISTRADOR') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error('Error de login:', err);
      
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      'Credenciales inválidas';
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`login-container-modern ${darkMode ? 'dark' : ''}`}>
      {/* Botón de cambio de tema */}
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="login-wrapper">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-image">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgyXkwDfXt_C6aH_XP0K1G-Yy8x2axHH4CF8_jzDHIbSyw7De5w04I--q6dtolu11bObd7cgrCSbUwvmxVILrgD7dPJXUcWRpGz2d--Bz5M7wTjNjZRFdm4lrD2udS4fWwgNFkLSOPkM2k3Qqal0nAN806BYUSBv-b9GdhTniQs8XXUnVLn1s6BdOLPZOtLK8y3LxO2pd3iX4IkZ1Ux2Al8lBitlCjxRZ1QFS2u_z8dXSqbzb8ko7bftSBuAvG2hBa68GH0w25Wpo"
              alt="FitSIL Logo"
            />
          </div>
          <p className="logo-text">FitSIL</p>
        </div>

        {/* Título */}
        <h1 className="login-title">Iniciar Sesión</h1>

        {/* Mensaje de Error */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form-modern">
          {/* Campo Email */}
          <div className="form-field">
            <label htmlFor="correo" className="field-label">Email</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Enter your email"
              className="field-input"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div className="form-field">
            <label htmlFor="contrasenia" className="field-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="contrasenia"
                name="contrasenia"
                value={formData.contrasenia}
                onChange={handleChange}
                placeholder="Enter your password"
                className="field-input password-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label="Toggle password visibility"
              >
                <span className="material-icons">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Olvidé mi contraseña */}
          <div className="forgot-password-link">
            <a href="#" className="link-text">Forgot password?</a>
          </div>

          {/* Botón de Login */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Enlace a Registro */}
        <div className="register-link">
          <p className="register-text">
            ¿No tienes una cuenta?
            <Link to="/register" className="register-link-text"> Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;