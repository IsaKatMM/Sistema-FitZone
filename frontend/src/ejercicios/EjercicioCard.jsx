import "./ejercicios.css";

// Importar imágenes estáticas
import aperturas from "./ejerciciosImagenes/aperturas_mancuernas.jpg";
import curlBiceps from "./ejerciciosImagenes/curl_biceps_barra.webp";
import dominadas from "./ejerciciosImagenes/dominadas.webp";
import extensionTriceps from "./ejerciciosImagenes/extencion_triceps_polea.png";
import pesoMuerto from "./ejerciciosImagenes/peso_muerto.jpg";
import pressBanca from "./ejerciciosImagenes/press_banca.jpg";
import pressMilitar from "./ejerciciosImagenes/press_militar.webp";
import remoBarra from "./ejerciciosImagenes/remo_barra.webp";
import sentadilla from "./ejerciciosImagenes/sentadilla.webp";

// Relación nombre → imagen
const imagenes = {
  "Aperturas con mancuernas": aperturas,
  "Curl de bíceps con barra": curlBiceps,
  "Dominadas": dominadas,
  "Extensión de tríceps en polea": extensionTriceps,
  "Peso muerto": pesoMuerto,
  "Press de banca": pressBanca,
  "Press militar": pressMilitar,
  "Remo con barra": remoBarra,
  "Sentadillas": sentadilla,
};

function EjercicioCard({ ejercicio, onClick, isAdmin, onEditar, onEliminar }) {
  const imagen = imagenes[ejercicio.nombre];

  return (
    <div className="card" onClick={onClick}>
      {/* IMAGEN */}
      <div
        className="card-img"
        style={{
          backgroundImage: imagen ? `url(${imagen})` : "none",
        }}
      />

      {/* CONTENIDO */}
      <div className="card-body">
        <div>
          <h3>{ejercicio.nombre}</h3>
          <span className="tag">{ejercicio.musculoTrabajado}</span>
        </div>

        {/* BOTONES ADMIN (ESTÉTICA RESTAURADA) */}
        {isAdmin && (
          <div className="card-admin-actions">
            <button
              className="btn-editar-card"
              title="Editar ejercicio"
              onClick={(e) => {
                e.stopPropagation();
                onEditar(ejercicio);
              }}
            >
              <span className="material-icons">edit</span>
            </button>

            <button
              className="btn-eliminar-card"
              title="Eliminar ejercicio"
              onClick={(e) => {
                e.stopPropagation();
                onEliminar(ejercicio);
              }}
            >
              <span className="material-icons">delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EjercicioCard;
