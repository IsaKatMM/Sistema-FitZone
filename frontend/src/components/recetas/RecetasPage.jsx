import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import "./recetas.css";

// IMÁGENES
import arrozPollo from "./imagenesRecetas/arroz_pollo.avif";
import pastaCarne from "./imagenesRecetas/pasta_carne.jpeg";
import batidoProteina from "./imagenesRecetas/batido_proteina.jpg";
import avenaHuevo from "./imagenesRecetas/avena_huevo.webp";

import ensaladaPollo from "./imagenesRecetas/ensalada_pollo.jpg";
import salmonVegetales from "./imagenesRecetas/salmon_vegetales.avif";
import smoothieVerde from "./imagenesRecetas/smoothie_verde.webp";
import sopaVerduras from "./imagenesRecetas/sopa_verduras.jpg";

export default function RecetasPage() {
  const { darkMode } = useTheme();
  const [recetaActiva, setRecetaActiva] = useState(null);

  const recetasPorObjetivo = [
    {
      titulo: "💪 Ganar masa muscular",
      recetas: [
        {
          nombre: "Arroz con pollo",
          descripcion: "Alta en proteínas y carbohidratos",
          imagen: arrozPollo,
          ingredientes: [
            "1 taza de arroz",
            "200 g de pechuga de pollo",
            "Zanahoria",
            "Sal y especias"
          ],
          preparacion: [
            "Cocinar el arroz.",
            "Saltear el pollo con especias.",
            "Mezclar y servir."
          ]
        },
        {
          nombre: "Pasta con carne",
          descripcion: "Ideal post-entreno",
          imagen: pastaCarne,
          ingredientes: [
            "200 g de pasta",
            "150 g de carne molida",
            "Salsa de tomate"
          ],
          preparacion: [
            "Cocer la pasta.",
            "Preparar la carne.",
            "Mezclar con la salsa."
          ]
        },
        {
          nombre: "Batido de proteína",
          descripcion: "Recuperación muscular",
          imagen: batidoProteina,
          ingredientes: [
            "Proteína en polvo",
            "Banana",
            "Leche"
          ],
          preparacion: [
            "Licuar todos los ingredientes.",
            "Servir frío."
          ]
        },
        {
          nombre: "Avena con huevo",
          descripcion: "Energía completa para el día",
          imagen: avenaHuevo,
          ingredientes: [
            "Avena",
            "2 huevos",
            "Canela"
          ],
          preparacion: [
            "Cocer la avena.",
            "Añadir huevos revueltos.",
            "Mezclar y servir."
          ]
        }
      ]
    },
    {
      titulo: "🔥 Perder peso",
      recetas: [
        {
          nombre: "Ensalada de pollo",
          descripcion: "Ligera y nutritiva",
          imagen: ensaladaPollo,
          ingredientes: [
            "Pechuga de pollo",
            "Lechuga",
            "Tomate"
          ],
          preparacion: [
            "Cocer el pollo.",
            "Cortar vegetales.",
            "Mezclar."
          ]
        },
        {
          nombre: "Salmón con vegetales",
          descripcion: "Grasas saludables",
          imagen: salmonVegetales,
          ingredientes: [
            "Salmón",
            "Brócoli",
            "Zanahoria"
          ],
          preparacion: [
            "Cocinar el salmón.",
            "Hervir vegetales.",
            "Servir."
          ]
        },
        {
          nombre: "Smoothie verde",
          descripcion: "Desintoxicante natural",
          imagen: smoothieVerde,
          ingredientes: [
            "Espinaca",
            "Manzana verde",
            "Agua"
          ],
          preparacion: [
            "Licuar todo.",
            "Servir frío."
          ]
        },
        {
          nombre: "Sopa de verduras",
          descripcion: "Saciante y baja en calorías",
          imagen: sopaVerduras,
          ingredientes: [
            "Zanahoria",
            "Apio",
            "Calabacín"
          ],
          preparacion: [
            "Hervir los vegetales.",
            "Licuar parcialmente.",
            "Servir caliente."
          ]
        }
      ]
    }
  ];

  return (
    <section className={`recetas-page ${darkMode ? "dark" : ""}`}>
      <h2 className="recetas-title">🍽 Recetas saludables</h2>

      {recetasPorObjetivo.map(seccion => (
        <div key={seccion.titulo} className="recetas-section">
          <h3 className="section-title">{seccion.titulo}</h3>

          <div className="recetas-row">
            {seccion.recetas.map(receta => (
              <article key={receta.nombre} className="receta-card">
                <img src={receta.imagen} alt={receta.nombre} />
                <h4>{receta.nombre}</h4>
                <p className="receta-desc">{receta.descripcion}</p>

                <button
                  className="btn"
                  onClick={() => setRecetaActiva(receta)}
                >
                  Ver preparación
                </button>
              </article>
            ))}
          </div>
        </div>
      ))}

      {/* MODAL */}
      {recetaActiva && (
        <div className="modal-overlay" onClick={() => setRecetaActiva(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{recetaActiva.nombre}</h3>

            <strong>Ingredientes:</strong>
            <ul>
              {recetaActiva.ingredientes.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>

            <strong>Preparación:</strong>
            <ol>
              {recetaActiva.preparacion.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ol>

            <button className="btn close" onClick={() => setRecetaActiva(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
