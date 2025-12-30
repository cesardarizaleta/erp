import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePriceFormatter } from "@/hooks/usePriceFormatter";
import { useDolar } from "@/contexts/DolarContext";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, ShoppingCart, Loader2 } from "lucide-react";
import { ventaService, clienteService } from "@/services";
import type { Venta, Cliente } from "@/services";

interface Sale extends Venta {
  cliente_nombre?: string;
}

const estadoBadgeVariant = {
  completado: "default",
  pendiente: "secondary",
  procesando: "outline",
  enviado: "outline",
  cancelado: "destructive",
} as const;

const Ventas = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [isInDollars, setIsInDollars] = useState<boolean>(true);

  const { formatPrice, formatPriceDual } = usePriceFormatter();
  const { convertToUSD, oficialRate } = useDolar();

  useEffect(() => {
    loadSales();
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoadingClientes(true);
      const response = await clienteService.getClientes();
      if (response.error) {
        console.error("Error loading clients:", response.error);
      } else {
        setClientes(response.data || []);
      }
    } catch (err) {
      console.error("Error loading clients:", err);
    } finally {
      setLoadingClientes(false);
    }
  };

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ventaService.getVentas();
      if (response.error) {
        setError(response.error);
      } else {
        setSales(response.data || []);
      }
    } catch (err) {
      setError("Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch =
      (sale.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === "todos" || sale.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const totalVentas = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalVentasBS = filteredSales.reduce((acc, sale) => acc + (sale.total_bs || 0), 0);

  const resetForm = () => {
    setSelectedCliente("");
    setTotal("");
    setIsInDollars(true);
  };

  const handleAddSale = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCliente || !total) {
      setError("Por favor complete todos los campos");
      return;
    }

    const numericTotal = Number(total);
    let totalInUSD: number;

    // Convertir a USD si está en bolívares
    if (isInDollars) {
      totalInUSD = numericTotal;
    } else {
      totalInUSD = convertToUSD(numericTotal);
    }

    const saleData = {
      cliente_id: selectedCliente,
      total: totalInUSD,
      estado: "pendiente",
    };

    try {
      // For now, create a simple sale without items
      const response = await ventaService.createVenta(saleData, []);
      if (response.error) {
        setError(response.error);
      } else {
        setSales([response.data!, ...sales]);
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (err) {
      setError("Error al crear venta");
    }
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
          <Dialog
            open={isDialogOpen}
            onOpenChange={open => {
              setIsDialogOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
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
                  <Select value={selectedCliente} onValueChange={setSelectedCliente} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total ({isInDollars ? "USD" : "BS"})</Label>
                  <Input
                    id="total"
                    value={total}
                    onChange={e => setTotal(e.target.value)}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                  {total && oficialRate && (
                    <p className="text-sm text-muted-foreground">
                      Equivalente:{" "}
                      {isInDollars
                        ? `Bs. ${(Number(total) * oficialRate).toFixed(2)}`
                        : `$${(Number(total) / oficialRate).toFixed(2)} USD`}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="currency-mode"
                    checked={isInDollars}
                    onCheckedChange={setIsInDollars}
                  />
                  <Label htmlFor="currency-mode" className="text-sm">
                    Registrar en {isInDollars ? "dólares" : "bolívares"}
                  </Label>
                </div>
                <Button type="submit" className="w-full">
                  Registrar Venta
                </Button>
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
              onChange={e => setSearchTerm(e.target.value)}
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
            Total: {formatPriceDual(totalVentas, totalVentasBS)}
          </Badge>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Loading or Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando ventas...</span>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[120px]">Fecha</TableHead>
                  <TableHead className="min-w-[150px]">Cliente</TableHead>
                  <TableHead className="min-w-[100px]">Total</TableHead>
                  <TableHead className="min-w-[100px]">Estado</TableHead>
                  <TableHead className="min-w-[120px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No se encontraron ventas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map(sale => (
                    <TableRow key={sale.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                      <TableCell>{new Date(sale.fecha_venta).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{sale.cliente || "N/A"}</TableCell>
                      <TableCell className="font-semibold">
                        {formatPriceDual(sale.total, sale.total_bs)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoBadgeVariant[sale.estado] || "secondary"}>
                          {sale.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Ventas;
