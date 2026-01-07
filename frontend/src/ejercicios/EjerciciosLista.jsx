import { useState } from "react";
import EjercicioCard from "./EjercicioCard";

function EjerciciosLista({ ejercicios, onSelect }) {
  const [busqueda, setBusqueda] = useState("");

  const ejerciciosFiltrados = ejercicios.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <h2 className="titulo">Exercises</h2>

      {/* Barra de búsqueda */}
      <input
        className="search"
        type="text"
        placeholder="Search exercises..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="grid">
        {ejerciciosFiltrados.map(e => (
          <EjercicioCard
            key={e.id}
            ejercicio={e}
            onClick={() => onSelect(e)}
          />
        ))}
      </div>
    </>
  );
}

export default EjerciciosLista;
