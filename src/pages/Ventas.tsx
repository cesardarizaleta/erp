import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, ShoppingCart } from "lucide-react";

interface Sale {
  id: string;
  fecha: string;
  cliente: string;
  productos: string;
  cantidad: string;
  total: number;
  estado: "pendiente" | "procesando" | "enviado" | "completado" | "cancelado";
  metodoPago: string;
}

const initialSales: Sale[] = [
  { id: "VTA-001", fecha: "2024-01-15", cliente: "Distribuidora Norte", productos: "Carbón Vegetal Premium", cantidad: "500 kg", total: 1250.00, estado: "completado", metodoPago: "Transferencia" },
  { id: "VTA-002", fecha: "2024-01-15", cliente: "Asadero El Paisa", productos: "Carbón Mineral", cantidad: "200 kg", total: 480.00, estado: "pendiente", metodoPago: "Crédito" },
  { id: "VTA-003", fecha: "2024-01-14", cliente: "Restaurant La Casa", productos: "Carbón Vegetal Premium", cantidad: "150 kg", total: 375.00, estado: "completado", metodoPago: "Efectivo" },
  { id: "VTA-004", fecha: "2024-01-14", cliente: "Hotel Central", productos: "Briquetas de Carbón", cantidad: "300 kg", total: 720.00, estado: "enviado", metodoPago: "Transferencia" },
  { id: "VTA-005", fecha: "2024-01-13", cliente: "Carnicería Don Pedro", productos: "Carbón Vegetal", cantidad: "100 kg", total: 220.00, estado: "completado", metodoPago: "Efectivo" },
  { id: "VTA-006", fecha: "2024-01-13", cliente: "Parrilla Los Amigos", productos: "Carbón para Parrilla", cantidad: "250 kg", total: 550.00, estado: "procesando", metodoPago: "Crédito" },
];

const estadoBadgeVariant = {
  completado: "default",
  pendiente: "secondary",
  procesando: "outline",
  enviado: "outline",
  cancelado: "destructive",
} as const;

const Ventas = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = 
      sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === "todos" || sale.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const totalVentas = filteredSales.reduce((acc, sale) => acc + sale.total, 0);

  const handleAddSale = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSale: Sale = {
      id: `VTA-${String(sales.length + 1).padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      cliente: formData.get("cliente") as string,
      productos: formData.get("productos") as string,
      cantidad: formData.get("cantidad") as string,
      total: Number(formData.get("total")),
      estado: "pendiente",
      metodoPago: formData.get("metodoPago") as string,
    };
    setSales([newSale, ...sales]);
    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Ventas</h1>
            <p className="text-muted-foreground">Gestión de pedidos y transacciones</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Venta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Registrar Nueva Venta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSale} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input id="cliente" name="cliente" placeholder="Nombre del cliente" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productos">Productos</Label>
                  <Input id="productos" name="productos" placeholder="Descripción de productos" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input id="cantidad" name="cantidad" placeholder="Ej: 100 kg" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total">Total ($)</Label>
                    <Input id="total" name="total" type="number" step="0.01" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodoPago">Método de Pago</Label>
                  <Select name="metodoPago" defaultValue="Efectivo">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Transferencia">Transferencia</SelectItem>
                      <SelectItem value="Crédito">Crédito</SelectItem>
                      <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Registrar Venta</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Stats */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente o ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="procesando">Procesando</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="px-4 py-2 h-10 flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Total: ${totalVentas.toLocaleString()}
          </Badge>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                  <TableCell>{sale.fecha}</TableCell>
                  <TableCell className="font-medium">{sale.cliente}</TableCell>
                  <TableCell>{sale.productos}</TableCell>
                  <TableCell>{sale.cantidad}</TableCell>
                  <TableCell className="font-semibold">${sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={estadoBadgeVariant[sale.estado]}>{sale.estado}</Badge>
                  </TableCell>
                  <TableCell>{sale.metodoPago}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Ventas;
