import { Link } from "react-router-dom";

export function Navbar() {
  const navLinks = [
    { label: "Services", path: "/services" },
    { label: "About Us", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Team", path: "/team" },
    { label: "Contacts", path: "/contacts" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#11202b]/80 px-6 py-4 shadow-[0_24px_60px_rgba(4,10,18,0.28)] backdrop-blur-xl md:px-8">
        <Link to="/" className="flex items-center gap-3 text-foreground transition hover:text-accent">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-accent">
            AI
          </span>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] sm:text-base">
            Business Generator
          </span>
        </Link>

        <div className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link to="/plan" className="nav-cta hidden md:inline-flex">
          Open Workspace
        </Link>
      </div>
    </nav>
  );
}
