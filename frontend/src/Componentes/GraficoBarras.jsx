export default function GraficoBarras() {
  const dias = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const valores = [100, 50, 30, 70, 60, 50, 40];

  return (
    <div className="rounded-xl bg-slate-900 p-4 shadow-md">
      <p className="text-white font-medium">Weekly Volume</p>
      <p className="text-orange-500 text-3xl font-bold">8,240 reps</p>

      <div className="grid grid-cols-7 gap-3 items-end h-40 mt-4">
        {valores.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-full rounded-t bg-gradient-to-t from-orange-600 to-orange-400"
              style={{ height: `${v}%` }}
            />
            <span className="text-slate-400 text-xs mt-2">
              {dias[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
