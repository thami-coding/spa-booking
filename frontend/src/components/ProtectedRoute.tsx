import { Navigate, Outlet } from "react-router";
import useSWR from "swr";
import { getUser } from "../api/user";

export default function ProtectedRoute() {
  const { isLoading, data } = useSWR("/users/me", getUser,{
    shouldRetryOnError: false,
  });

  if (isLoading) return;

  if (!data?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
