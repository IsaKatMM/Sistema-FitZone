// src/admin/AdminAgregarEjercicio.jsx
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "./admin.css";

function AdminAgregarEjercicio() {
  const { darkMode } = useTheme();
  const [nombre, setNombre] = useState("");
  const [musculo, setMusculo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!nombre || !musculo || !descripcion) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("musculoTrabajado", musculo);
      formData.append("descripcion", descripcion);
      if (imagen) formData.append("imagen", imagen);

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/ejercicios/guardar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("✅ Ejercicio guardado correctamente");
        // Limpiar campos
        setNombre("");
        setMusculo("");
        setDescripcion("");
        setImagen(null);
      } else {
        const error = await response.text();
        alert("❌ Error: " + error);
      }
    } catch (error) {
      alert("❌ Error al guardar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-wrapper ${darkMode ? 'dark' : ''}`}>
      <div className="admin-card">
        <h2 className="admin-title">Panel de Administrador</h2>
        <p className="admin-subtitle">Agregar nuevo ejercicio</p>

        <div className="admin-form">
          <input
            type="text"
            placeholder="Nombre del ejercicio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <select value={musculo} onChange={(e) => setMusculo(e.target.value)}>
            <option value="">Músculo trabajado</option>
            <option>Pecho</option>
            <option>Espalda</option>
            <option>Piernas</option>
            <option>Brazos</option>
            <option>Hombros</option>
            <option>Abdomen</option>
          </select>

          <textarea
            placeholder="Descripción del ejercicio"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
          />

          <button 
            className="admin-btn" 
            onClick={handleGuardar}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar ejercicio'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAgregarEjercicio;