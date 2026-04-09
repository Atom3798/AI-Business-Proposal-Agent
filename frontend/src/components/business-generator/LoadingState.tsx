export function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-orange-400/20 bg-orange-400/10 p-6 text-slate-100 shadow-premium backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-orange-300" />
        <div>
          <p className="font-heading text-xl font-semibold">Generating your business plan</p>
          <p className="mt-1 text-sm text-slate-300">
            Mapping your startup concept into positioning, personas, monetization, and launch strategy.
          </p>
        </div>
      </div>
    </div>
  );
}
