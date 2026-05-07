import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const t = localStorage.getItem("taskflow_token");

    const u = localStorage.getItem("taskflow_user");

    if (t && u) {
      setToken(t);

      try {
        setUser(JSON.parse(u));
      } catch {
        /* noop */
      }
    }

    setLoading(false);
  }, []);

  const persist = (t: string, u: User) => {
    localStorage.setItem("taskflow_token", t);

    localStorage.setItem(
      "taskflow_user",
      JSON.stringify(u)
    );

    setToken(t);

    setUser(u);
  };

  const login = async (
    email: string,
    password: string
  ) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    persist(data.token, data.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    persist(data.token, data.user);
  };

  const logout = () => {
    localStorage.removeItem("taskflow_token");

    localStorage.removeItem("taskflow_user");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx)
    throw new Error(
      "useAuth must be used within AuthProvider"
    );

  return ctx;
}