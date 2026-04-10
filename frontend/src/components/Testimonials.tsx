import { motion } from "motion/react";

export function Testimonials() {
  const testimonials = [
    {
      text: "This tool transformed how I pitch my idea. What took hours to write now takes seconds.",
      author: "Sarah Chen",
      role: "Founder, EdTech Startup",
      avatar: "SC"
    },
    {
      text: "The structured output is perfect for investor meetings. Everything is clear and compelling.",
      author: "Mike Rodriguez",
      role: "Co-founder, FinTech",
      avatar: "MR"
    },
    {
      text: "I love being able to save and iterate on my plans. This makes ideation so much faster.",
      author: "Alex Kumar",
      role: "Product Manager",
      avatar: "AK"
    }
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Loved by Founders
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          See what founders and entrepreneurs have to say about the AI Business Generator
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-orange-300/30 hover:bg-white/[0.06] transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-emerald-400 text-white font-semibold text-sm">
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{testimonial.author}</p>
                <p className="text-xs text-slate-400">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">"{testimonial.text}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
