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
import { Plus, Search, CheckCircle, AlertCircle, Clock, DollarSign } from "lucide-react";

interface Invoice {
  id: string;
  fecha: string;
  vencimiento: string;
  cliente: string;
  monto: number;
  pagado: number;
  estado: "pagado" | "pendiente" | "vencido" | "parcial";
}

const initialInvoices: Invoice[] = [
  { id: "FAC-001", fecha: "2024-01-01", vencimiento: "2024-01-31", cliente: "Distribuidora Norte", monto: 2500.00, pagado: 2500.00, estado: "pagado" },
  { id: "FAC-002", fecha: "2024-01-05", vencimiento: "2024-02-05", cliente: "Asadero El Paisa", monto: 1800.00, pagado: 900.00, estado: "parcial" },
  { id: "FAC-003", fecha: "2024-01-10", vencimiento: "2024-02-10", cliente: "Restaurant La Casa", monto: 950.00, pagado: 0, estado: "pendiente" },
  { id: "FAC-004", fecha: "2023-12-15", vencimiento: "2024-01-15", cliente: "Hotel Central", monto: 3200.00, pagado: 0, estado: "vencido" },
  { id: "FAC-005", fecha: "2024-01-12", vencimiento: "2024-02-12", cliente: "Carnicería Don Pedro", monto: 680.00, pagado: 680.00, estado: "pagado" },
  { id: "FAC-006", fecha: "2023-12-20", vencimiento: "2024-01-20", cliente: "Parrilla Los Amigos", monto: 1450.00, pagado: 500.00, estado: "vencido" },
];

const estadoBadgeVariant = {
  pagado: "default",
  pendiente: "secondary",
  parcial: "outline",
  vencido: "destructive",
} as const;

const estadoIcon = {
  pagado: CheckCircle,
  pendiente: Clock,
  parcial: DollarSign,
  vencido: AlertCircle,
};

const Cobranza = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === "todos" || invoice.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const totalPendiente = invoices
    .filter(inv => inv.estado !== "pagado")
    .reduce((acc, inv) => acc + (inv.monto - inv.pagado), 0);

  const totalVencido = invoices
    .filter(inv => inv.estado === "vencido")
    .reduce((acc, inv) => acc + (inv.monto - inv.pagado), 0);

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    
    const formData = new FormData(e.currentTarget);
    const montoPago = Number(formData.get("monto"));
    
    setInvoices(invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        const nuevoPagado = inv.pagado + montoPago;
        const nuevoEstado = nuevoPagado >= inv.monto ? "pagado" : "parcial";
        return { ...inv, pagado: nuevoPagado, estado: nuevoEstado };
      }
      return inv;
    }));
    
    setIsPaymentDialogOpen(false);
    setSelectedInvoice(null);
  };

  const openPaymentDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">Cobranza</h1>
          <p className="text-muted-foreground">Gestión de cuentas por cobrar</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pendiente</p>
                <p className="text-2xl font-display font-bold">${totalPendiente.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vencido</p>
                <p className="text-2xl font-display font-bold text-destructive">${totalVencido.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Facturas Pagadas</p>
                <p className="text-2xl font-display font-bold">{invoices.filter(i => i.estado === "pagado").length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente o factura..."
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
              <SelectItem value="parcial">Parcial</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
              <SelectItem value="pagado">Pagado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const Icon = estadoIcon[invoice.estado];
                const saldo = invoice.monto - invoice.pagado;
                return (
                  <TableRow key={invoice.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                    <TableCell>{invoice.fecha}</TableCell>
                    <TableCell>{invoice.vencimiento}</TableCell>
                    <TableCell className="font-medium">{invoice.cliente}</TableCell>
                    <TableCell>${invoice.monto.toFixed(2)}</TableCell>
                    <TableCell className="text-success">${invoice.pagado.toFixed(2)}</TableCell>
                    <TableCell className={saldo > 0 ? "text-destructive font-semibold" : ""}>
                      ${saldo.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={estadoBadgeVariant[invoice.estado]} className="gap-1">
                        <Icon className="w-3 h-3" />
                        {invoice.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.estado !== "pagado" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openPaymentDialog(invoice)}
                        >
                          Registrar Pago
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Registrar Pago</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><span className="text-muted-foreground">Factura:</span> {selectedInvoice.id}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Cliente:</span> {selectedInvoice.cliente}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Saldo pendiente:</span> <span className="font-semibold">${(selectedInvoice.monto - selectedInvoice.pagado).toFixed(2)}</span></p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monto">Monto a Pagar ($)</Label>
                  <Input 
                    id="monto" 
                    name="monto" 
                    type="number" 
                    step="0.01" 
                    max={selectedInvoice.monto - selectedInvoice.pagado}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full">Confirmar Pago</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Cobranza;
