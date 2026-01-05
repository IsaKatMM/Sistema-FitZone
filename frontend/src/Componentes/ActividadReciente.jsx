const actividades = [
  { nombre: "Full Body Strength", fecha: "Oct 26, 2023", valor: "45 min" },
  { nombre: "Morning Run", fecha: "Oct 25, 2023", valor: "5 km" },
  { nombre: "Yoga Flow", fecha: "Oct 24, 2023", valor: "30 min" },
  { nombre: "Leg Day", fecha: "Oct 23, 2023", valor: "60 min" },
];

export default function ActividadReciente() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {actividades.map((a, i) => (
        <div
          key={i}
          className={`flex justify-between items-center p-4 ${
            i % 2 === 1 ? "bg-slate-50" : ""
          }`}
        >
          <div>
            <p className="font-semibold text-slate-900">{a.nombre}</p>
            <p className="text-sm text-slate-500">{a.fecha}</p>
          </div>
          <p className="font-medium text-slate-700">{a.valor}</p>
        </div>
      ))}
    </div>
  );
}
