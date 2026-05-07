import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../utils/auth";

type AuthPageProps = {
  mode: "login" | "signup";
};

export default function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup";
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/plan" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }

      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/plan";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell-page">
      <Navbar />

      <section className="page-hero">
        <div className="mx-auto max-w-xl">
          <div className="panel p-8">
            <span className="eyebrow">{isSignup ? "Create Account" : "Welcome Back"}</span>
            <h1 className="section-title mt-4">
              {isSignup ? "Sign up to save plans" : "Log in to your workspace"}
            </h1>
            <p className="section-copy mt-4">
              {isSignup
                ? "Your generated plans, feedback, and exports stay tied to your account."
                : "Access your saved plans and generate new business drafts."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {isSignup && (
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
                    Name
                  </label>
                  <input
                    id="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-orange-400/80 focus:ring-2 focus:ring-orange-400/30"
                />
              </div>

              {errorMessage && (
                <div className="rounded-[1.25rem] border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="hero-button-primary w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "Need an account?"}{" "}
              <Link to={isSignup ? "/login" : "/signup"} className="text-accent hover:text-foreground">
                {isSignup ? "Log in" : "Sign up"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
