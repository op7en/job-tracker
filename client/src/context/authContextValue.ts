import { createContext } from "react";
import type { AuthUser } from "../api/axios";

export type AuthStatus = "checking" | "authenticated" | "anonymous";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isRestoring: boolean;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
