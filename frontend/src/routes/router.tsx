import { createBrowserRouter } from "react-router";
import AuthPage from "../pages/auth/AuthPage";
import BookingPage from "../pages/booking/BookingPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import HomePage from "../pages/home/HomePage";
import AdminDashboard from "../pages/list-dashboard/AdminDashboard";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  { index: true, element: <HomePage /> },
  { path: "login", element: <AuthPage mode="login" /> },
  { path: "signup", element: <AuthPage mode="signup" /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "book", element: <BookingPage /> },
      { path: "checkout/:id", element: <CheckoutPage /> },
      { path: "bookings", element: <AdminDashboard /> },
      { path: "bookings/:id", element: <Dashboard /> },
    ],
  },
]);
