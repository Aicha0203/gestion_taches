import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const { role } = user;

  if (role === "ETUDIANT" && location.pathname !== "/dashboard-etudiant") {
    return <Navigate to="/dashboard-etudiant" replace />;
  }
  if (role === "PROFESSEUR" && location.pathname !== "/dashboard-professeur") {
    return <Navigate to="/dashboard-professeur" replace />;
  }
  if (role === "ADMIN" && location.pathname !== "/dashboard-admin") {
    return <Navigate to="/dashboard-admin" replace />;
  }

  return <Outlet />;
}
