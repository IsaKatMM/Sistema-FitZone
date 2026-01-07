function EjercicioCard({ ejercicio, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-img"></div>

      <div className="card-body">
        <h3>{ejercicio.nombre}</h3>
        <span className="tag">{ejercicio.musculoTrabajado}</span>
      </div>
    </div>
  );
}

export default EjercicioCard;
