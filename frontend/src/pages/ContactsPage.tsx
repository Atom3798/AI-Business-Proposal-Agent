import { Navbar } from "../components/Navbar";

export default function ContactsPage() {
  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <span className="eyebrow">Reach Out</span>
        <h1 className="section-title mt-4">Contact</h1>
        <p className="section-copy mt-5 max-w-3xl">
          The contact page now follows the same visual system as the rest of the product and uses calmer forms and information panels.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
          <div className="panel p-8">
            <h2 className="text-2xl font-semibold text-foreground">Contact information</h2>
            <div className="mt-6 space-y-6 text-sm leading-7 text-muted-foreground">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Email</p>
                <a href="mailto:hello@aigenerator.com" className="mt-2 block text-foreground hover:text-accent">
                  hello@aigenerator.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Support</p>
                <a href="mailto:support@aigenerator.com" className="mt-2 block text-foreground hover:text-accent">
                  support@aigenerator.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Location</p>
                <p className="mt-2 text-foreground">San Francisco, California</p>
              </div>
            </div>
          </div>

          <form className="panel p-8">
            <h2 className="text-2xl font-semibold text-foreground">Send a message</h2>
            <div className="mt-6 space-y-5">
              {[
                { label: "Name", type: "text", placeholder: "Your name" },
                { label: "Email", type: "email", placeholder: "you@example.com" }
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-2 block text-sm text-muted-foreground">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-foreground outline-none transition focus:border-cyan-200/40 focus:ring-2 focus:ring-cyan-200/15"
                  />
                </div>
              ))}

              <div>
                <label className="mb-2 block text-sm text-muted-foreground">Message</label>
                <textarea
                  rows={6}
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-foreground outline-none transition focus:border-cyan-200/40 focus:ring-2 focus:ring-cyan-200/15"
                />
              </div>

              <button type="submit" className="hero-button-primary w-full">
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
