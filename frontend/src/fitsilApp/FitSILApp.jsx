import { useState, useEffect } from "react";
import EjerciciosLista from "../ejercicios/EjerciciosLista";
import EjercicioDetalle from "../ejercicios/EjercicioDetalle";
import "../ejercicios/ejercicios.css";

function FitSILApp() {
  const [ejercicios, setEjercicios] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/ejercicios/obtener")
      .then(res => res.json())
      .then(data => setEjercicios(data));
  }, []);

  return (
    <div className="app-container">
      {!seleccionado ? (
        <EjerciciosLista
          ejercicios={ejercicios}
          onSelect={setSeleccionado}
        />
      ) : (
        <EjercicioDetalle
          ejercicio={seleccionado}
          onBack={() => setSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default FitSILApp;
