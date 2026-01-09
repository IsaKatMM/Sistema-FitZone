import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import PrivateLayout from "./components/layouts/PrivateLayout";
import AuthLayout from "./components/layouts/AuthLayout";

// Auth
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// User pages
import UserDashboard from "./components/Dashboard/UserDashboard";
import UserProfile from "./components/Profile/UserProfile";
import RutinasDia from "./components/Rutinas/RutinasDia";
import FitEstadisticas from "./Pages/FitEstadisticas";
import FitSILApp from "./fitsilApp/FitSILApp"; // ✅ ESTE es tu sistema de ejercicios
import RecetasPage from "./components/Recetas/RecetasPage";

// Admin pages
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import AdminUsuarios from "./components/Admin/AdminUsuarios";

function App() {
  return (
    <Routes>

      {/* ===================== */}
      {/* RUTAS PÚBLICAS */}
      {/* ===================== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ===================== */}
      {/* RUTAS PRIVADAS */}
      {/* ===================== */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>

          {/* ----- USUARIO ----- */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/ejercicios" element={<FitSILApp />} />
          <Route path="/rutinas" element={<RutinasDia />} />
          <Route path="/estadisticas" element={<FitEstadisticas />} />
          <Route path="/recetas" element={<RecetasPage />} />
          <Route path="/perfil" element={<UserProfile />} />

          {/* ----- ADMIN ----- */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/ejercicios" element={<FitSILApp />} /> {/* ✅ USAR EL MISMO COMPONENTE */}

        </Route>
      </Route>

      {/* ===================== */}
      {/* RUTA POR DEFECTO */}
      {/* ===================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;