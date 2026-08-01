import { createBrowserRouter } from "react-router";
import AuthPage from "../pages/auth/AuthPage";
import BookingPage from "../pages/booking/BookingPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import HomePage from "../pages/home/HomePage";
import AdminDashboard from "../pages/list-dashboard/AdminDashboard";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import ErrorPage from "../pages/error/ErrorPages";

export const router = createBrowserRouter([
  { index: true, element: <HomePage /> },
  { path: "login", element: <AuthPage mode="login" /> },
  { path: "signup", element: <AuthPage mode="signup" /> },
  { path: "access-denied", element: <ErrorPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "book", element: <BookingPage /> },
      { path: "checkout/:id", element: <CheckoutPage /> },
    ],
  },
  {
    element: <AdminProtectedRoute />,
    children: [
      { path: "bookings", element: <AdminDashboard /> },
      { path: "bookings/:id", element: <Dashboard /> },
    ],
  },
  {
    path: "*",
    element: (
      <ErrorPage
        statusCode={404}
        statusText="Page Not Found"
        statusLabel="Missing Resource"
        message="Sorry, the page you are looking for does not exist or has been moved."
      />
    ),
  },
]);
