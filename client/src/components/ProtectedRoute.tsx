import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasAccessToken, refreshAccessToken } from "../api/axios";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const hasToken = hasAccessToken();
  const [isChecking, setIsChecking] = useState(!hasToken);
  const [isAuthorized, setIsAuthorized] = useState(hasToken);

  useEffect(() => {
    if (hasAccessToken()) return;

    let mounted = true;

    refreshAccessToken().then((token) => {
      if (!mounted) return;
      setIsAuthorized(Boolean(token));
      setIsChecking(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (isChecking) return null;
  return isAuthorized ? <>{children}</> : <Navigate to="/" replace />;
};
