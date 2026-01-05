import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FitEstadisticas from './Pages/FitEstadisticas';

// Importa tus otros componentes aquí
// import Home from './pages/Home';
// import Login from './pages/Login';
// etc...

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de estadísticas */}
        <Route path="/estadisticas" element={<FitEstadisticas />} />
        
        {/* Tus otras rutas existentes */}
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/workouts" element={<Workouts />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;