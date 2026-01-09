import Swal from "sweetalert2";

function EjercicioDetalle({ ejercicio, onBack, isAdmin, onEditar, onEliminar }) {

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

      {/* Botones según el rol */}
      <div className="detalle-actions">
        {isAdmin ? (
          // Botones para administradores
          <>
            <button className="btn-editar" onClick={() => onEditar(ejercicio)}>
              <span className="material-icons">edit</span>
              Editar Ejercicio
            </button>
            <button className="btn-eliminar" onClick={() => onEliminar(ejercicio)}>
              <span className="material-icons">delete</span>
              Eliminar Ejercicio
            </button>
          </>
        ) : (
          // Botón para usuarios
          <button className="btn-rutina" onClick={agregarRutina}>
            <span className="material-icons">add</span>
            Agregar a Rutina
          </button>
        )}
      </div>
    </div>
  );
}

export default EjercicioDetalle;