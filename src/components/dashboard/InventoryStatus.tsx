import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { inventarioService } from "@/services";
import type { Producto } from "@/services";

interface InventoryItem {
  nombre: string;
  stock: number;
  capacidad: number;
  unidad: string;
}

export function InventoryStatus() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const response = await inventarioService.getProductos(1, 100);

      if (response.error) {
        console.error("Error loading inventory data");
        return;
      }

      // Group products by category and calculate totals
      const categoryTotals = new Map<string, { stock: number; productos: Producto[] }>();

      response.data?.forEach(producto => {
        const category = producto.categoria || "Sin categoría";
        if (!categoryTotals.has(category)) {
          categoryTotals.set(category, { stock: 0, productos: [] });
        }
        const categoryData = categoryTotals.get(category)!;
        categoryData.stock += producto.stock * (producto.peso || 0);
        categoryData.productos.push(producto);
      });

      // Convert to inventory items with estimated capacity
      const items: InventoryItem[] = Array.from(categoryTotals.entries()).map(([category, data]) => {
        // Estimate capacity as 2x current stock for display purposes
        const capacidad = Math.max(data.stock * 2, 5000); // Minimum 5000kg capacity
        return {
          nombre: category,
          stock: data.stock,
          capacidad,
          unidad: "kg",
        };
      });

      // Sort by stock level (lowest first)
      items.sort((a, b) => (a.stock / a.capacidad) - (b.stock / b.capacidad));

      setInventoryItems(items.slice(0, 4)); // Show top 4 categories
    } catch (error) {
      console.error("Error loading inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-slide-up">
        <div className="mb-6">
          <h3 className="text-lg font-display font-semibold text-foreground">
            Estado del Inventario
          </h3>
          <p className="text-sm text-muted-foreground">Cargando datos...</p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-muted-foreground">Cargando inventario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Estado del Inventario
        </h3>
        <p className="text-sm text-muted-foreground">Niveles de stock actuales</p>
      </div>
      <div className="space-y-5">
        {inventoryItems.map(item => {
          const percentage = (item.stock / item.capacidad) * 100;
          const isLow = percentage < 30;
          const isMedium = percentage >= 30 && percentage < 60;

          return (
            <div key={item.nombre} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{item.nombre}</span>
                <span className="text-sm text-muted-foreground">
                  {item.stock.toLocaleString()} / {item.capacidad.toLocaleString()} {item.unidad}
                </span>
              </div>
              <Progress
                value={percentage}
                className={`h-2 ${isLow ? "[&>div]:bg-destructive" : isMedium ? "[&>div]:bg-warning" : "[&>div]:bg-success"}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
