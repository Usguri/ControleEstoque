import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user || !user.userAtivo) {
    return <Navigate to="/Login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 1 ? "/Tela-principal" : "/Tela-principal-cliente";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user?.userAtivo) {
    const redirectPath = user.role === 1 ? "/Tela-principal" : "/Tela-principal-cliente";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
