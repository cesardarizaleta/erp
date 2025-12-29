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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin } from "lucide-react";

interface Client {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo: "regular" | "mayorista" | "vip";
  totalCompras: number;
  ultimaCompra: string;
}

const initialClients: Client[] = [
  { id: "CLI-001", nombre: "Distribuidora Norte", email: "contacto@distnorte.com", telefono: "+58 424-1234567", direccion: "Av. Principal, Local 45", tipo: "mayorista", totalCompras: 45000, ultimaCompra: "2024-01-15" },
  { id: "CLI-002", nombre: "Asadero El Paisa", email: "elpaisa@gmail.com", telefono: "+58 412-9876543", direccion: "Calle 10, #23", tipo: "regular", totalCompras: 12500, ultimaCompra: "2024-01-15" },
  { id: "CLI-003", nombre: "Restaurant La Casa", email: "lacasa@restaurant.com", telefono: "+58 414-5551234", direccion: "Centro Comercial Plaza, L-12", tipo: "vip", totalCompras: 78000, ultimaCompra: "2024-01-14" },
  { id: "CLI-004", nombre: "Hotel Central", email: "compras@hotelcentral.com", telefono: "+58 416-7778899", direccion: "Av. Bolívar, Edificio Central", tipo: "vip", totalCompras: 125000, ultimaCompra: "2024-01-14" },
  { id: "CLI-005", nombre: "Carnicería Don Pedro", email: "donpedro@gmail.com", telefono: "+58 424-3332211", direccion: "Mercado Municipal, P-8", tipo: "regular", totalCompras: 8500, ultimaCompra: "2024-01-13" },
];

const tipoBadgeVariant = {
  regular: "secondary",
  mayorista: "outline",
  vip: "default",
} as const;

const Clientes = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient: Client = {
      id: editingClient?.id || `CLI-${String(clients.length + 1).padStart(3, '0')}`,
      nombre: formData.get("nombre") as string,
      email: formData.get("email") as string,
      telefono: formData.get("telefono") as string,
      direccion: formData.get("direccion") as string,
      tipo: formData.get("tipo") as "regular" | "mayorista" | "vip",
      totalCompras: editingClient?.totalCompras || 0,
      ultimaCompra: editingClient?.ultimaCompra || "-",
    };
    
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? newClient : c));
    } else {
      setClients([...clients, newClient]);
    }
    setIsDialogOpen(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gestión de cartera de clientes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingClient(null); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingClient ? "Editar Cliente" : "Agregar Cliente"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddClient} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre / Razón Social</Label>
                  <Input id="nombre" name="nombre" defaultValue={editingClient?.nombre} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={editingClient?.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" defaultValue={editingClient?.telefono} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" name="direccion" defaultValue={editingClient?.direccion} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Cliente</Label>
                  <select 
                    id="tipo" 
                    name="tipo" 
                    defaultValue={editingClient?.tipo || "regular"}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  >
                    <option value="regular">Regular</option>
                    <option value="mayorista">Mayorista</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  {editingClient ? "Guardar Cambios" : "Agregar Cliente"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Badge variant="outline" className="px-4 py-2 h-10 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {clients.length} clientes
          </Badge>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Total Compras</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(client.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.nombre}</p>
                        <p className="text-xs text-muted-foreground">{client.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {client.telefono}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {client.direccion}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tipoBadgeVariant[client.tipo]}>{client.tipo}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">${client.totalCompras.toLocaleString()}</TableCell>
                  <TableCell>{client.ultimaCompra}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
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

export default Clientes;
