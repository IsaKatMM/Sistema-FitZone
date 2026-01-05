export default function GraficoLinea() {
  return (
    <div className="rounded-xl bg-slate-900 p-4 shadow-md">
      <p className="text-white font-medium">Weight Trend</p>
      <p className="text-orange-500 text-3xl font-bold">165.3 lbs</p>

      <p className="text-slate-400 text-sm mb-4">
        Last 30 Days <span className="text-red-500 font-medium">-1.2%</span>
      </p>

      <div className="h-40 bg-slate-800 rounded flex items-center justify-center text-slate-400">
        SVG / Chart aquí
      </div>
    </div>
  );
}
