import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const TOKEN_KEY = "ai_business_access_token";
const USER_KEY = "ai_business_user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const currentUser = (await response.json()) as AuthUser;
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, [token]);

  const saveSession = (payload: AuthResponse) => {
    setToken(payload.access_token);
    setUser(payload.user);
    localStorage.setItem(TOKEN_KEY, payload.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const submitAuth = async (path: "/auth/login" | "/auth/signup", body: object) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      let message = "Authentication failed.";
      try {
        const payload = (await response.json()) as { detail?: string };
        message = payload.detail ?? message;
      } catch {
        message = response.statusText || message;
      }
      throw new Error(message);
    }

    saveSession((await response.json()) as AuthResponse);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: (email, password) => submitAuth("/auth/login", { email, password }),
        signup: (name, email, password) => submitAuth("/auth/signup", { name, email, password }),
        logout: clearSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
