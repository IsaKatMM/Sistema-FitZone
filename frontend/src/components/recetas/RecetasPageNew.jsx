import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./recetas.css";

export default function RecetasPage() {
  const { darkMode } = useTheme();
  const [recetas, setRecetas] = useState([]);
  const [fontScale, setFontScale] = useState(1);
  const [mensajeAccesible, setMensajeAccesible] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const mockRecetas = [
      { id: 1, nombre: "Ensalada griega", descripcion: "Ensalada fresca con tomate, pepino y queso feta", imagenUrl: "https://via.placeholder.com/240x160?text=Ensalada" },
      { id: 2, nombre: "Pechuga a la plancha", descripcion: "Pechuga de pollo marinada y a la plancha", imagenUrl: "https://via.placeholder.com/240x160?text=Pechuga" },
      { id: 3, nombre: "Smoothie de frutas", descripcion: "Batido nutritivo con platano, fresas y yogur", imagenUrl: "https://via.placeholder.com/240x160?text=Smoothie" }
    ];
    setTimeout(() => {
      setRecetas(mockRecetas);
      setMensajeAccesible(`Se cargaron ${mockRecetas.length} recetas`);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <section
      className={`recetas-page ${darkMode ? 'dark' : ''}`}
      style={{ fontSize: `${fontScale}rem` }}
      aria-labelledby="recetas-title"
    >
      <div aria-live="polite" className="sr-only">
        {mensajeAccesible}
      </div>

      <header className="recetas-header">
        <h2 id="recetas-title">Recetas saludables</h2>

        <div className="zoom-controls" role="group" aria-label="Control de tamaño de texto">
          <button onClick={() => setFontScale(f => Math.max(0.8, f - 0.1))} aria-label="Disminuir tamaño">A-</button>
          <button onClick={() => setFontScale(1)} aria-label="Restablecer tamaño">A</button>
          <button onClick={() => setFontScale(f => Math.min(1.5, f + 0.1))} aria-label="Aumentar tamaño">A+</button>
        </div>
      </header>

      {loading && <p className="recetas-loading">Cargando recetas...</p>}
      
      {!loading && recetas.length > 0 && (
        <div className="recetas-grid" role="list" aria-label="Listado de recetas">
          {recetas.map(receta => (
            <article key={receta.id} className="receta-card" role="listitem" tabIndex="0" aria-labelledby={`receta-${receta.id}`}>
              <img src={receta.imagenUrl} alt={`Imagen de ${receta.nombre}`} />
              <h3 id={`receta-${receta.id}`}>{receta.nombre}</h3>
              <p>{receta.descripcion}</p>
            </article>
          ))}
        </div>
      )}
      
      {!loading && recetas.length === 0 && <p className="recetas-empty">No hay recetas</p>}
    </section>
  );
}
