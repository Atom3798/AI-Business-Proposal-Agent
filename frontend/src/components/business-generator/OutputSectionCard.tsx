type OutputSectionCardProps = {
  title: string;
  content: string | string[];
};

export function OutputSectionCard({ title, content }: OutputSectionCardProps) {
  const items = Array.isArray(content) ? content : [content];

  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 shadow-premium backdrop-blur-xl transition hover:-translate-y-1 hover:border-orange-300/30">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-heading text-2xl font-semibold text-white">{title}</h3>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
          AI Draft
        </span>
      </div>

      <div className="space-y-3 text-sm leading-7 text-slate-300 sm:text-base">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </article>
  );
}
