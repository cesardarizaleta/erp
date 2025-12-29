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
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

interface Product {
  id: string;
  nombre: string;
  sku: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  precio: number;
  unidad: string;
}

const initialProducts: Product[] = [
  { id: "1", nombre: "Carbón Vegetal Premium", sku: "CVP-001", categoria: "Carbón Vegetal", stock: 2500, stockMinimo: 500, precio: 2.50, unidad: "kg" },
  { id: "2", nombre: "Carbón Mineral", sku: "CM-001", categoria: "Carbón Mineral", stock: 1800, stockMinimo: 400, precio: 2.40, unidad: "kg" },
  { id: "3", nombre: "Briquetas de Carbón", sku: "BC-001", categoria: "Briquetas", stock: 800, stockMinimo: 300, precio: 2.40, unidad: "kg" },
  { id: "4", nombre: "Carbón para Parrilla", sku: "CP-001", categoria: "Carbón Vegetal", stock: 1200, stockMinimo: 250, precio: 2.20, unidad: "kg" },
  { id: "5", nombre: "Carbón Activado", sku: "CA-001", categoria: "Especial", stock: 150, stockMinimo: 50, precio: 8.50, unidad: "kg" },
];

const Inventario = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number, minimo: number) => {
    if (stock <= minimo * 0.5) return { label: "Crítico", variant: "destructive" as const };
    if (stock <= minimo) return { label: "Bajo", variant: "secondary" as const };
    return { label: "Normal", variant: "default" as const };
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: Date.now().toString(),
      nombre: formData.get("nombre") as string,
      sku: formData.get("sku") as string,
      categoria: formData.get("categoria") as string,
      stock: Number(formData.get("stock")),
      stockMinimo: Number(formData.get("stockMinimo")),
      precio: Number(formData.get("precio")),
      unidad: formData.get("unidad") as string,
    };
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p));
    } else {
      setProducts([...products, newProduct]);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Inventario</h1>
            <p className="text-muted-foreground">Gestión de productos y stock</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingProduct(null); }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingProduct ? "Editar Producto" : "Agregar Producto"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" defaultValue={editingProduct?.nombre} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" name="sku" defaultValue={editingProduct?.sku} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Input id="categoria" name="categoria" defaultValue={editingProduct?.categoria} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidad">Unidad</Label>
                    <Input id="unidad" name="unidad" defaultValue={editingProduct?.unidad || "kg"} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Actual</Label>
                    <Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                    <Input id="stockMinimo" name="stockMinimo" type="number" defaultValue={editingProduct?.stockMinimo} required />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="precio">Precio por Unidad ($)</Label>
                    <Input id="precio" name="precio" type="number" step="0.01" defaultValue={editingProduct?.precio} required />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingProduct ? "Guardar Cambios" : "Agregar Producto"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-4 py-2">
              <Package className="w-4 h-4 mr-2" />
              {products.length} productos
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm animate-slide-up">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.stock, product.stockMinimo);
                return (
                  <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{product.nombre}</TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{product.categoria}</TableCell>
                    <TableCell>{product.stock.toLocaleString()} {product.unidad}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>${product.precio.toFixed(2)}/{product.unidad}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Inventario;
