import Swal from "sweetalert2";

function EjercicioDetalle({ ejercicio, onBack }) {

  const agregarRutina = () => {
    Swal.fire({
      icon: "success",
      title: "Agregado",
      text: "Ejercicio agregado a la rutina",
      confirmButtonColor: "#2ecc71"
    });
  };

  return (
    <div className="detalle">
      <button className="back" onClick={onBack}>←</button>

      <div className="video-placeholder">▶</div>

      <h2>{ejercicio.nombre}</h2>
      <p className="sub">{ejercicio.musculoTrabajado}</p>

      <h3>Instrucciones</h3>
      <p>{ejercicio.descripcion}</p>

      <button className="btn-rutina" onClick={agregarRutina}>
        Agregar a Rutina
      </button>
    </div>
  );
}

export default EjercicioDetalle;
