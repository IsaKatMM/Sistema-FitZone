import React from "react";

const FitEjercicioDetalle = ({ ejercicio, onBack }) => {
  if (!ejercicio) return null;

  return (
    <div>
      <button onClick={onBack}>Volver</button>
      <h2>{ejercicio.nombre}</h2>
      <p><strong>Músculo:</strong> {ejercicio.musculoTrabajado}</p>
      <p>{ejercicio.descripcion}</p>
    </div>
  );
};

export default FitEjercicioDetalle;
