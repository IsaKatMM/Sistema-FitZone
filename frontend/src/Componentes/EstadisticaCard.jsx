export default function EstadisticaCard({ titulo, valor }) {
  return (
    <div className="flex min-w-[100px] flex-1 flex-col gap-2 rounded-xl bg-slate-900 p-4 shadow-md">
      <p className="text-slate-400 text-sm font-medium">{titulo}</p>
      <p className="text-orange-500 text-2xl font-bold">
        {valor}
      </p>
    </div>
  );
}
