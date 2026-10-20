import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/landing/LandingPage";
import PlaceholderPage from "./PlaceholderPage";
import NotFoundPage from "./NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <PlaceholderPage title="Welcome back" />,
  },
  {
    path: "/signup",
    element: <PlaceholderPage title="Create your account" />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);