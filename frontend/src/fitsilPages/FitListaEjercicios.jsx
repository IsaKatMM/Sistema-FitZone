import React, { useEffect, useState } from "react";
import { obtenerEjercicios } from "../fitsilServices/FitApiEjercicios";
import FitExerciseCard from "../fitsilComponents/FitExerciseCard";

const FitListaEjercicios = ({ onSelect }) => {
  const [ejercicios, setEjercicios] = useState([]);

  useEffect(() => {
    obtenerEjercicios().then(setEjercicios);
  }, []);

  return (
    <div>
      <h2>Lista de Ejercicios</h2>
      {ejercicios.map(e => (
        <FitExerciseCard
          key={e.id}
          ejercicio={e}
          onClick={() => onSelect(e)}
        />
      ))}
    </div>
  );
};

export default FitListaEjercicios;
