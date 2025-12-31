import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { DollarSign, Package, ShoppingCart, AlertCircle, Loader2 } from "lucide-react";
import { ventaService, inventarioService, cobranzaService } from "@/services";

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventasMes: 0,
    inventarioTotal: 0,
    pedidosPendientes: 0,
    cuentasPorCobrar: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current month sales
      const salesResponse = await ventaService.getVentas(1, 1000);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const ventasMes = salesResponse.data
        ?.filter(venta => {
          const ventaDate = new Date(venta.fecha_venta);
          return ventaDate.getMonth() === currentMonth && ventaDate.getFullYear() === currentYear;
        })
        .reduce((acc, venta) => acc + venta.total, 0) || 0;

      // Load inventory data
      const inventoryResponse = await inventarioService.getProductos(1, 1000);
      const inventarioTotal = inventoryResponse.data?.reduce((acc, item) => acc + (item.stock * (item.peso || 0)), 0) || 0;

      // Calculate inventory capacity (assuming 150% of current stock as capacity)
      const inventarioCapacidad = Math.max(inventarioTotal * 1.5, 50000); // Minimum 50,000kg capacity
      const inventarioPercentage = (inventarioTotal / inventarioCapacidad) * 100;

      // Load pending collections
      const cobranzaResponse = await cobranzaService.getCobranzas(1, 1000);
      const cuentasPorCobrar = cobranzaResponse.data?.reduce((acc, cob) => acc + cob.monto_pendiente, 0) || 0;
      const pedidosPendientes = cobranzaResponse.data?.filter(cob => cob.estado !== "pagado").length || 0;

      setStats({
        ventasMes,
        inventarioTotal,
        pedidosPendientes,
        cuentasPorCobrar,
      });
    } catch (err) {
      setError("Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  };
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Bienvenido a <span className="text-primary">La Zulianita</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Resumen general del negocio •{" "}
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando dashboard...</span>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Ventas del Mes"
                value={`$${stats.ventasMes.toLocaleString()}`}
                change="+12.5% vs mes anterior"
                changeType="positive"
                icon={DollarSign}
                iconColor="primary"
              />
              <StatCard
                title="Inventario Total"
                value={`${stats.inventarioTotal.toLocaleString()} kg`}
                change={`${Math.round((stats.inventarioTotal / Math.max(stats.inventarioTotal * 1.5, 50000)) * 100)}% capacidad`}
                changeType="neutral"
                icon={Package}
                iconColor="success"
              />
              <StatCard
                title="Pedidos Pendientes"
                value={stats.pedidosPendientes.toString()}
                change="5 urgentes"
                changeType="negative"
                icon={ShoppingCart}
                iconColor="warning"
              />
              <StatCard
                title="Cuentas por Cobrar"
                value={`$${stats.cuentasPorCobrar.toLocaleString()}`}
                change="8 facturas vencidas"
                changeType="negative"
                icon={AlertCircle}
                iconColor="accent"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SalesChart />
              </div>
              <div>
                <InventoryStatus />
              </div>
            </div>

            {/* Recent Sales */}
            <RecentSalesTable />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
