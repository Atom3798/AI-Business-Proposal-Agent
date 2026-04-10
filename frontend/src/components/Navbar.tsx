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
      <div className="flex justify-between items-center px-8 lg:px-16 py-5">
        {/* Logo */}
        <Link to="/" className="text-foreground text-xl font-semibold tracking-tight hover:text-primary transition">
          AI GENERATOR
        </Link>

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Get Started Button - Hidden on mobile */}
        <Link to="/chat" className="nav-cta hidden md:inline-flex">
          Try Now
        </Link>
      </div>
    </nav>
  );
}
