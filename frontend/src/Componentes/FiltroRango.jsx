export default function FiltroRango() {
  return (
    <div className="flex h-10 items-center justify-between rounded-lg bg-slate-100 p-1">
      {["7D", "1M", "6M", "All"].map((r, i) => (
        <button
          key={i}
          className={`flex-1 h-full rounded-md text-sm font-medium transition-colors
            ${r === "1M"
              ? "bg-orange-500 text-white"
              : "text-slate-500 hover:bg-white"
            }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
