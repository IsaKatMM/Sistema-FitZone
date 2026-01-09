import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

/**
 * data esperada:
 * [
 *   { nombre: "Fuerza", valor: 10 },
 *   { nombre: "Cardio", valor: 5 }
 * ]
 */

const datosDefault = [
  { nombre: "Fuerza", valor: 0 },
  { nombre: "Cardio", valor: 0 },
  { nombre: "Flexibilidad", valor: 0 },
];

export default function GraficoBarras({ data }) {
  const datosFinales =
    Array.isArray(data) && data.length > 0 ? data : datosDefault;

  const sinDatos = !data || data.length === 0;

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={datosFinales}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="nombre" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="valor"
            fill="#f97316"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {sinDatos && (
        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#64748b" }}>
          No hay entrenamientos por categoría
        </p>
      )}
    </div>
  );
}
