import "./EstadisticaCard.css";

export default function EstadisticaCard({ titulo, valor }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{titulo}</p>
      <p className="stat-value">{valor}</p>
    </div>
  );
}
