import { Navbar } from "../components/Navbar";

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 px-6 md:px-16 max-w-6xl mx-auto pb-20">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Have questions? We'd love to hear from you
          </p>

          <div className="grid md:grid-cols-2 gap-12 mt-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-primary font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:hello@aigenerator.com" className="hover:text-foreground transition">
                      hello@aigenerator.com
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-primary font-semibold mb-2">Support</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:support@aigenerator.com" className="hover:text-foreground transition">
                      support@aigenerator.com
                    </a>
                  </p>
                </div>

                <div>
                  <h3 className="text-primary font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>

                <div>
                  <h3 className="text-primary font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">
                    San Francisco, CA<br />
                    USA
                  </p>
                </div>

                <div>
                  <h3 className="text-primary font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-8">
                Send us a Message
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-secondary/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-secondary/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 bg-secondary/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button type="submit" className="hero-button-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
