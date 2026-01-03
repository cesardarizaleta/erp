import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StoreInitializer } from "@/components/StoreInitializer";
import { lazy, Suspense } from "react";

// Lazy loading de páginas para optimizar el tamaño de los chunks
const Dashboard = lazy(() => import("./features/dashboard/pages/Dashboard"));
const Inventario = lazy(() => import("./features/inventario/pages/Inventario"));
const Ventas = lazy(() => import("./features/ventas/pages/Ventas"));
const Cobranza = lazy(() => import("./features/cobranza/pages/Cobranza"));
const Clientes = lazy(() => import("./features/clientes/pages/Clientes"));
const Configuracion = lazy(() => import("./features/configuracion/pages/Configuracion"));
const Logs = lazy(() => import("./features/logs/pages/Logs"));
const Gastos = lazy(() => import("./features/gastos/pages/Gastos"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const NotFound = lazy(() => import("./features/error/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuración simplificada
      staleTime: 5 * 60 * 1000, // 5 minutos por defecto
      gcTime: 30 * 60 * 1000, // 30 minutos en cache
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Deshabilitado por defecto para mejor rendimiento
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <StoreInitializer />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            }
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
              <Route
                path="/gastos"
                element={
                  <AuthGuard>
                    <Gastos />
                  </AuthGuard>
                }
              />

              {/* Ruta 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
