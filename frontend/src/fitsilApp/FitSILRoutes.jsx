import React, { useState } from "react";
import FitListaEjercicios from "../fitsilPages/FitListaEjercicios";
import FitEjercicioDetalle from "../fitsilPages/FitEjercicioDetalle";

const FitSILRoutes = () => {
  const [seleccionado, setSeleccionado] = useState(null);

  return seleccionado ? (
    <FitEjercicioDetalle
      ejercicio={seleccionado}
      onBack={() => setSeleccionado(null)}
    />
  ) : (
    <FitListaEjercicios onSelect={setSeleccionado} />
  );
};

export default FitSILRoutes;
