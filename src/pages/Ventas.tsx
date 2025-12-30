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
  DialogDescription,
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
import { Plus, Search, Eye, ShoppingCart, Loader2, CheckCircle, Trash2 } from "lucide-react";
import { ventaService, clienteService, cobranzaService, inventarioService } from "@/services";
import type { Venta, Cliente, Producto, VentaItem } from "@/services";
import { supabase } from "@/integrations/supabase/client";
import { useConfirm } from "@/hooks/useConfirm";

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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [ventaItems, setVentaItems] = useState<Omit<VentaItem, "id" | "venta_id">[]>([]);
  const [selectedProducto, setSelectedProducto] = useState<string>("");
  const [cantidad, setCantidad] = useState<string>("1");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleItems, setSaleItems] = useState<VentaItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { formatPrice, formatPriceDual } = usePriceFormatter();
  const { convertToUSD, oficialRate } = useDolar();
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    loadSales();
    loadClientes();
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoadingProductos(true);
      const response = await inventarioService.getProductos(1, 100);
      if (response.error) {
        console.error("Error loading products:", response.error);
      } else {
        setProductos(response.data || []);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoadingProductos(false);
    }
  };

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
    setVentaItems([]);
    setSelectedProducto("");
    setCantidad("1");
  };

  const handleViewSaleDetails = async (sale: Sale) => {
    setSelectedSale(sale);
    setLoadingDetails(true);
    setIsDetailsModalOpen(true);

    try {
      // Obtener los items de la venta
      const response = await ventaService.getVentaById(sale.id);
      if (response.data && response.data.items) {
        setSaleItems(response.data.items);
      } else {
        setSaleItems([]);
      }
    } catch (err) {
      console.error("Error loading sale details:", err);
      setSaleItems([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleAddItem = () => {
    if (!selectedProducto || !cantidad) return;

    const producto = productos.find(p => p.id === parseInt(selectedProducto));
    if (!producto) return;

    const qty = parseInt(cantidad);
    if (qty <= 0 || qty > producto.stock) return;

    const precioUnitario = isInDollars ? producto.precio : producto.precio_bs;
    const subtotal = precioUnitario * qty;
    const precioUnitarioBS = producto.precio_bs;
    const subtotalBS = precioUnitarioBS * qty;

    const newItem: Omit<VentaItem, "id" | "venta_id"> = {
      producto_id: producto.id,
      cantidad: qty,
      precio_unitario: precioUnitario,
      precio_unitario_bs: precioUnitarioBS,
      subtotal: subtotal,
      subtotal_bs: subtotalBS,
    };

    setVentaItems([...ventaItems, newItem]);
    setSelectedProducto("");
    setCantidad("1");
  };

  const handleRemoveItem = (index: number) => {
    setVentaItems(ventaItems.filter((_, i) => i !== index));
  };

  const handleAddSale = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (ventaItems.length === 0) {
      setError("Debes agregar al menos un producto a la venta");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No se pudo identificar al usuario actual");
        setLoading(false);
        return;
      }

      // Calcular totales
      const totalUSD = ventaItems.reduce((sum, item) => sum + item.subtotal, 0);
      const totalBS = ventaItems.reduce((sum, item) => sum + item.subtotal_bs, 0);

      const saleData = {
        cliente_id: selectedCliente ? parseInt(selectedCliente) : undefined,
        fecha_venta: new Date().toISOString(),
        total: totalUSD,
        total_bs: totalBS,
        tasa_cambio_aplicada: oficialRate,
        estado: "pendiente",
        user_id: user.id,
      };

      const response = await ventaService.createVenta(saleData, ventaItems);
      if (response.error) {
        setError(response.error);
      } else {
        setSales([response.data!, ...sales]);
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (err) {
      setError("Error al crear venta");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSale = async (sale: Sale) => {
    const confirmed = await confirm({
      title: "Confirmar Aprobación",
      description: "¿Estás seguro de aprobar esta venta? Se generará una cuenta por cobrar.",
    });
    if (!confirmed) return;

    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No se pudo identificar al usuario actual");
        setLoading(false);
        return;
      }

      // 1. Actualizar estado de la venta
      const updateResponse = await ventaService.updateVenta(sale.id, { estado: "completado" });

      if (updateResponse.error) {
        setError("Error al actualizar la venta: " + updateResponse.error);
        setLoading(false);
        return;
      }

      // 2. Crear registro de cobranza
      const cobranzaData = {
        venta_id: sale.id,
        monto_pendiente: sale.total,
        monto_pendiente_bs: sale.total_bs,
        estado: "pendiente",
        user_id: user.id,
      };

      const cobranzaResponse = await cobranzaService.createCobranza(cobranzaData);

      if (cobranzaResponse.error) {
        setError("Venta actualizada pero error al crear cobranza: " + cobranzaResponse.error);
      } else {
        // Actualizar lista local
        setSales(sales.map(s => (s.id === sale.id ? { ...s, estado: "completado" } : s)));
      }
    } catch (err) {
      setError("Error inesperado al aprobar venta");
      console.error(err);
    } finally {
      setLoading(false);
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
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">Registrar Nueva Venta</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSale} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente (opcional)..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(cliente => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sección de productos */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Productos</Label>

                  {/* Agregar producto */}
                  <div className="flex gap-2">
                    <Select value={selectedProducto} onValueChange={setSelectedProducto}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar producto..." />
                      </SelectTrigger>
                      <SelectContent>
                        {productos
                          .filter(p => p.stock > 0)
                          .map(producto => (
                            <SelectItem key={producto.id} value={producto.id.toString()}>
                              {producto.nombre_producto} (Stock: {producto.stock})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={cantidad}
                      onChange={e => setCantidad(e.target.value)}
                      type="number"
                      min="1"
                      placeholder="Cant."
                      className="w-20"
                    />
                    <Button type="button" onClick={handleAddItem} variant="outline">
                      Agregar
                    </Button>
                  </div>

                  {/* Lista de productos agregados */}
                  {ventaItems.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Productos en la venta:</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {ventaItems.map((item, index) => {
                          const producto = productos.find(p => p.id === item.producto_id);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted rounded"
                            >
                              <div className="flex-1">
                                <p className="font-medium">{producto?.nombre_producto}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.cantidad} x{" "}
                                  {formatPriceDual(item.precio_unitario, item.precio_unitario_bs)} ={" "}
                                  {formatPriceDual(item.subtotal, item.subtotal_bs)}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  {ventaItems.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>
                          {formatPriceDual(
                            ventaItems.reduce((sum, item) => sum + item.subtotal, 0),
                            ventaItems.reduce((sum, item) => sum + item.subtotal_bs, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={ventaItems.length === 0}>
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
                        <div className="flex justify-end gap-2">
                          {sale.estado === "pendiente" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApproveSale(sale)}
                              title="Aprobar y generar cobranza"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewSaleDetails(sale)}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {ConfirmDialog}

      {/* Modal de detalles de venta */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de Venta #{selectedSale?.id}</DialogTitle>
            <DialogDescription>Información completa de la venta realizada</DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : selectedSale ? (
            <div className="space-y-6">
              {/* Información general de la venta */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fecha</Label>
                  <p className="text-sm">
                    {new Date(selectedSale.fecha_venta).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Cliente</Label>
                  <p className="text-sm">{selectedSale.cliente || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <p className="text-sm capitalize">{selectedSale.estado}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tasa de Cambio
                  </Label>
                  <p className="text-sm">
                    {selectedSale.tasa_cambio_aplicada?.toFixed(2) || "N/A"}
                  </p>
                </div>
              </div>

              {/* Productos vendidos */}
              <div>
                <Label className="text-base font-medium mb-3 block">Productos Vendidos</Label>
                {saleItems.length > 0 ? (
                  <div className="space-y-3">
                    {saleItems.map((item, index) => {
                      const producto = productos.find(p => p.id === item.producto_id);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {producto?.nombre_producto || `Producto ${item.producto_id}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Cantidad: {item.cantidad} ×{" "}
                              {formatPriceDual(item.precio_unitario, item.precio_unitario_bs)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPriceDual(item.subtotal, item.subtotal_bs)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Total */}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total de la venta:</span>
                        <span>{formatPriceDual(selectedSale.total, selectedSale.total_bs)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No se encontraron productos para esta venta
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Ventas;
