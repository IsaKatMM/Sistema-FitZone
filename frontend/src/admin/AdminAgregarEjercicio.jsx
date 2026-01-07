import { useState } from "react";

function AdminAgregarEjercicio() {
  const [nombre, setNombre] = useState("");
  const [musculo, setMusculo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleGuardar = async () => {
    if (!nombre || !musculo || !descripcion) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("musculoTrabajado", musculo);
      formData.append("descripcion", descripcion);
      if (imagen) formData.append("imagen", imagen);

      const token = localStorage.getItem("token"); // si usas JWT
      const response = await fetch("http://localhost:8080/ejercicios/guardar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Ejercicio guardado correctamente");
        // Limpiar campos
        setNombre("");
        setMusculo("");
        setDescripcion("");
        setImagen(null);
      } else {
        alert("Error: " + data);
      }
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  return (
    <div className="admin-wrapper">
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

          <button className="admin-btn" onClick={handleGuardar}>
            Guardar ejercicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAgregarEjercicio;
