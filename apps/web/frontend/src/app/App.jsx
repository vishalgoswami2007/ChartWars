
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import DesktopOnly from "../components/DesktopOnly";

export default function App() {
  return (
    <DesktopOnly>
      <RouterProvider router={router} />
    </DesktopOnly>
  );
}
