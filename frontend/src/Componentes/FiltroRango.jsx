import "./FiltroRango.css";

const opciones = [
  { label: "7 días", value: "7D" },
  { label: "1 mes", value: "1M" },
  { label: "6 meses", value: "6M" },
  { label: "Todo", value: "ALL" },
];

export default function FiltroRango({ rango, setRango }) {
  return (
    <div className="filtro">
      {opciones.map((o) => (
        <button
          key={o.value}
          className={rango === o.value ? "activo" : ""}
          onClick={() => setRango(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
