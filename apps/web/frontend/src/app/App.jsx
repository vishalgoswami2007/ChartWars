import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import DesktopOnly from "../components/DesktopOnly";
import { AuthProvider , useAuth } from "../pages/auth/AuthProvider";
import { SocketProvider } from "../context/SocketProvider"; 

function SocketGate({ children }) {                                    
  const { user } = useAuth();
  return <SocketProvider enabled={!!user}>{children}</SocketProvider>;
}

export default function App() {
  return (
    <DesktopOnly>
      <AuthProvider>
        <SocketGate>
        <RouterProvider router={router} />
        </SocketGate>
      </AuthProvider>
    </DesktopOnly>
  );
}