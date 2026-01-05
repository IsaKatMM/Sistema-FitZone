import "./FiltroRango.css";

export default function FiltroRango() {
  return (
    <div className="filtro">
      {["7D", "1M", "6M", "All"].map((r) => (
        <button key={r} className={r === "1M" ? "activo" : ""}>
          {r}
        </button>
      ))}
    </div>
  );
}
