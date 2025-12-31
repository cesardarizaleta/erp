import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ventaService, clienteService } from "@/services";
import type { Venta, Cliente } from "@/services";

interface RecentSale {
  id: string;
  cliente: string;
  producto: string;
  cantidad: string;
  total: string;
  estado: string;
}

const estadoBadgeVariant = {
  completado: "default",
  pendiente: "secondary",
  procesando: "outline",
  enviado: "outline",
  cancelado: "destructive",
} as const;

export function RecentSalesTable() {
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentSales();
  }, []);

  const loadRecentSales = async () => {
    try {
      setLoading(true);

      // Get recent sales
      const salesResponse = await ventaService.getVentas(1, 10);
      const clientesResponse = await clienteService.getClientes(1, 100);

      if (salesResponse.error || clientesResponse.error) {
        console.error("Error loading recent sales");
        return;
      }

      // Create client map
      const clientesMap = new Map<string, string>();
      clientesResponse.data?.forEach(cliente => {
        clientesMap.set(cliente.id, cliente.nombre);
      });

      // Process sales data
      const sales: RecentSale[] = salesResponse.data?.map(venta => ({
        id: `VTA-${venta.id.slice(-3)}`,
        cliente: venta.cliente_id ? clientesMap.get(venta.cliente_id) || "Cliente desconocido" : "Sin cliente",
        producto: "Múltiples productos", // We don't have product details in venta summary
        cantidad: "N/A", // We don't have quantity in venta summary
        total: `$${venta.total.toLocaleString()}`,
        estado: venta.estado,
      })) || [];

      setRecentSales(sales);
    } catch (error) {
      console.error("Error loading recent sales:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-slide-up">
        <div className="mb-6">
          <h3 className="text-lg font-display font-semibold text-foreground">Ventas Recientes</h3>
          <p className="text-sm text-muted-foreground">Últimas transacciones realizadas</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-muted-foreground">Cargando ventas recientes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">Ventas Recientes</h3>
        <p className="text-sm text-muted-foreground">Últimas transacciones realizadas</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay ventas recientes
                </TableCell>
              </TableRow>
            ) : (
              recentSales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.cliente}</TableCell>
                  <TableCell>{sale.producto}</TableCell>
                  <TableCell>{sale.cantidad}</TableCell>
                  <TableCell className="font-medium">{sale.total}</TableCell>
                  <TableCell>
                    <Badge variant={estadoBadgeVariant[sale.estado as keyof typeof estadoBadgeVariant] || "outline"}>
                      {sale.estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
