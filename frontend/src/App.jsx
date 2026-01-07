import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import GlobalNavbar from './components/Navbar/GlobalNavbar';

// Estadísticas
import FitEstadisticas from './Pages/FitEstadisticas';

// Perfil, Rutinas y Recetas
import UserProfile from './components/Profile/UserProfile';
import RutinasDia from './components/Rutinas/RutinasDia';
import RecetasPage from './components/recetas/RecetasPageNew';

import './App.css';

// Componente de prueba para Dashboard
const TestDashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard de Prueba</h1>
      <p>Esta es una vista de prueba para verificar el navbar y el modo oscuro/claro.</p>
      <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
          <h3>Card 1</h3>
          <p>Contenido de ejemplo</p>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
          <h3>Card 2</h3>
          <p>Contenido de ejemplo</p>
        </div>
        <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
          <h3>Card 3</h3>
          <p>Contenido de ejemplo</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <GlobalNavbar />
          <main style={{ minHeight: 'calc(100vh - 70px)', padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<TestDashboard />} />
              <Route path="/user/dashboard" element={<TestDashboard />} />
              <Route path="/admin/dashboard" element={<TestDashboard />} />
              <Route path="/ejercicios" element={<TestDashboard />} />
              <Route path="/estadisticas" element={<FitEstadisticas />} />
              <Route path="/rutinas" element={<RutinasDia />} />
              <Route path="/recetas" element={<RecetasPage />} />
              <Route path="/perfil" element={<UserProfile />} />
                <Route path="/admin/agregar-ejercicio" element={<TestDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
