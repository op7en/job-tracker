import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasAccessToken, refreshAccessToken } from "../api/axios";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(!hasAccessToken());
  const [isAuthorized, setIsAuthorized] = useState(hasAccessToken());

  useEffect(() => {
    let mounted = true;
    if (!hasAccessToken()) {
      refreshAccessToken().then((token) => {
        if (!mounted) return;
        setIsAuthorized(Boolean(token));
        setIsChecking(false);
      });
      return () => {
        mounted = false;
      };
    }

    setIsChecking(false);
    setIsAuthorized(true);
    return () => {
      mounted = false;
    };
  }, []);

  if (isChecking) return null;
  return isAuthorized ? <>{children}</> : <Navigate to="/" replace />;
};
