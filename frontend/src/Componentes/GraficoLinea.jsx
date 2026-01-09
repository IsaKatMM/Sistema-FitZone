import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

/**
 * data esperada:
 * [
 *   { fecha: "Lun", valor: 120 },
 *   { fecha: "Mar", valor: 200 }
 * ]
 */

const datosDefault = [
  { fecha: "Lun", valor: 0 },
  { fecha: "Mar", valor: 0 },
  { fecha: "Mié", valor: 0 },
  { fecha: "Jue", valor: 0 },
  { fecha: "Vie", valor: 0 },
  { fecha: "Sáb", valor: 0 },
  { fecha: "Dom", valor: 0 },
];

export default function GraficoLinea({ data }) {
  const datosFinales =
    Array.isArray(data) && data.length > 0 ? data : datosDefault;

  const sinDatos = !data || data.length === 0;

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={datosFinales}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="fecha" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {sinDatos && (
        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#64748b" }}>
          Aún no hay actividad registrada
        </p>
      )}
    </div>
  );
}
