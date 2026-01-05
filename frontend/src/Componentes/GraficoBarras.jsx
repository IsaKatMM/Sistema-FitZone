import "./Graficos.css";

export default function GraficoBarras() {
  return (
    <div className="grafico-card">
      <h3>Volumen semanal</h3>
      <p className="valor">8,240 repeticiones</p>
      <div className="barras">
        {[100, 60, 40, 80, 70, 60, 50].map((v, i) => (
          <div key={i} style={{ height: `${v}%` }} />
        ))}
      </div>
    </div>
  );
}
