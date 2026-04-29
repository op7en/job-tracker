import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AuthRestoreScreen } from "./AuthRestoreScreen";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, isRestoring } = useAuth();

  if (isRestoring) return <AuthRestoreScreen />;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};
