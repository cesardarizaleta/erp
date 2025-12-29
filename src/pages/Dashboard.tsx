import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentSalesTable } from "@/components/dashboard/RecentSalesTable";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { DollarSign, Package, ShoppingCart, AlertCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Bienvenido a <span className="text-primary">La Zulianita</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Resumen general del negocio • {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Ventas del Mes"
            value="$45,230"
            change="+12.5% vs mes anterior"
            changeType="positive"
            icon={DollarSign}
            iconColor="primary"
          />
          <StatCard
            title="Inventario Total"
            value="6,300 kg"
            change="82% capacidad"
            changeType="neutral"
            icon={Package}
            iconColor="success"
          />
          <StatCard
            title="Pedidos Pendientes"
            value="23"
            change="5 urgentes"
            changeType="negative"
            icon={ShoppingCart}
            iconColor="warning"
          />
          <StatCard
            title="Cuentas por Cobrar"
            value="$12,450"
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
      </div>
    </MainLayout>
  );
};

export default Dashboard;
