import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import DesktopOnly from "../components/DesktopOnly";
import { AuthProvider } from "../pages/auth/AuthProvider";

export default function App() {
  return (
    <DesktopOnly>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </DesktopOnly>
  );
}