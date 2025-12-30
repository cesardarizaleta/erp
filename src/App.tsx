import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DolarProvider } from "@/contexts/DolarContext";
import { AuthGuard } from "@/components/AuthGuard";
import Dashboard from "./pages/Dashboard";
import Inventario from "./pages/Inventario";
import Ventas from "./pages/Ventas";
import Cobranza from "./pages/Cobranza";
import Clientes from "./pages/Clientes";
import Configuracion from "./pages/Configuracion";
import Logs from "./pages/Logs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DolarProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              {/* Rutas públicas */}
              <Route
                path="/login"
                element={
                  <AuthGuard requireAuth={false}>
                    <Login />
                  </AuthGuard>
                }
              />

              {/* Rutas protegidas */}
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/inventario"
                element={
                  <AuthGuard>
                    <Inventario />
                  </AuthGuard>
                }
              />
              <Route
                path="/ventas"
                element={
                  <AuthGuard>
                    <Ventas />
                  </AuthGuard>
                }
              />
              <Route
                path="/cobranza"
                element={
                  <AuthGuard>
                    <Cobranza />
                  </AuthGuard>
                }
              />
              <Route
                path="/clientes"
                element={
                  <AuthGuard>
                    <Clientes />
                  </AuthGuard>
                }
              />
              <Route
                path="/configuracion"
                element={
                  <AuthGuard>
                    <Configuracion />
                  </AuthGuard>
                }
              />
              <Route
                path="/logs"
                element={
                  <AuthGuard>
                    <Logs />
                  </AuthGuard>
                }
              />

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </DolarProvider>
  </QueryClientProvider>
);

export default App;
