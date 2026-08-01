import { Navigate, Outlet } from "react-router";
import { getUser } from "../api/user";
import useSWR from "swr";

export default function AdminProtectedRoute() {
  const { isLoading, data } = useSWR("/users/me", getUser, {
    shouldRetryOnError: false,
  });

  if (isLoading) return null;

  if(!data?.user) return <Navigate to="/login" replace />;
  
  if (data?.user.role !== "admin") {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
