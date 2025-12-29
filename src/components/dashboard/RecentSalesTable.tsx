import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentSales = [
  { id: "VTA-001", cliente: "Distribuidora Norte", producto: "Carbón Vegetal Premium", cantidad: "500 kg", total: "$1,250.00", estado: "completado" },
  { id: "VTA-002", cliente: "Asadero El Paisa", producto: "Carbón Mineral", cantidad: "200 kg", total: "$480.00", estado: "pendiente" },
  { id: "VTA-003", cliente: "Restaurant La Casa", producto: "Carbón Vegetal Premium", cantidad: "150 kg", total: "$375.00", estado: "completado" },
  { id: "VTA-004", cliente: "Hotel Central", producto: "Briquetas de Carbón", cantidad: "300 kg", total: "$720.00", estado: "enviado" },
  { id: "VTA-005", cliente: "Carnicería Don Pedro", producto: "Carbón Vegetal", cantidad: "100 kg", total: "$220.00", estado: "completado" },
];

const estadoBadgeVariant = {
  completado: "default",
  pendiente: "secondary",
  enviado: "outline",
} as const;

export function RecentSalesTable() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-display font-semibold text-foreground">Ventas Recientes</h3>
        <p className="text-sm text-muted-foreground">Últimas 5 transacciones</p>
      </div>
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
          {recentSales.map((sale) => (
            <TableRow key={sale.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-mono text-sm">{sale.id}</TableCell>
              <TableCell className="font-medium">{sale.cliente}</TableCell>
              <TableCell>{sale.producto}</TableCell>
              <TableCell>{sale.cantidad}</TableCell>
              <TableCell className="font-semibold">{sale.total}</TableCell>
              <TableCell>
                <Badge variant={estadoBadgeVariant[sale.estado as keyof typeof estadoBadgeVariant]}>
                  {sale.estado}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
