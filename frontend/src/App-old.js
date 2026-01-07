// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';

// Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Dashboards
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

// Ejercicios
import FitSILApp from './fitsilApp/FitSILApp';
import AdminAgregarEjercicio from './admin/AdminAgregarEjercicio';

// Estadísticas
import FitEstadisticas from './Pages/FitEstadisticas';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas (sin navbar) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas (con navbar) */}
            <Route 
              path="/user/dashboard" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <UserDashboard />
                  </MainLayout>
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute requireAdmin={true}>
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            {/* Ejercicios - Accesible para todos los usuarios autenticados */}
            <Route 
              path="/ejercicios" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <FitSILApp />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            {/* Estadísticas - Accesible para todos los usuarios autenticados */}
            <Route 
              path="/estadisticas" 
              element={
                <PrivateRoute>
                  <MainLayout>
                    <FitEstadisticas />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            {/* Admin: Agregar Ejercicio */}
            <Route 
              path="/admin/agregar-ejercicio" 
              element={
                <PrivateRoute requireAdmin={true}>
                  <MainLayout>
                    <AdminAgregarEjercicio />
                  </MainLayout>
                </PrivateRoute>
              } 
            />

            {/* Rutas por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;