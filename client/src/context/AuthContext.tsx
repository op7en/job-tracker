import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  clearAccessToken,
  fetchCurrentUser,
  hasAccessToken,
  refreshAccessToken,
} from "../api/axios";
import {
  AuthContext,
  type AuthStatus,
  type AuthContextValue,
} from "./authContextValue";
import type { AuthUser } from "../api/axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const token = hasAccessToken() ? "existing" : await refreshAccessToken();
        if (!token) {
          if (!mounted) return;
          setUser(null);
          setStatus("anonymous");
          return;
        }

        const currentUser = await fetchCurrentUser();
        if (!mounted) return;
        setUser(currentUser);
        setStatus("authenticated");
      } catch {
        clearAccessToken();
        if (!mounted) return;
        setUser(null);
        setStatus("anonymous");
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isRestoring: status === "checking",
      setSession: (nextUser) => {
        setUser(nextUser);
        setStatus("authenticated");
      },
      clearSession: () => {
        clearAccessToken();
        setUser(null);
        setStatus("anonymous");
      },
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
