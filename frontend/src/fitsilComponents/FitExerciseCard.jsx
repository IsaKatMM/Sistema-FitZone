import React from "react";

const FitExerciseCard = ({ ejercicio, onClick }) => {
  return (
    <div className="fit-card" onClick={onClick}>
      <h3>{ejercicio.nombre}</h3>
      <p>💪 {ejercicio.musculoTrabajado}</p>
    </div>
  );
};

export default FitExerciseCard;
