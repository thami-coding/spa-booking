import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const token = sessionStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
