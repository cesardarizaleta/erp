import { Progress } from "@/components/ui/progress";

const inventoryItems = [
  { nombre: "Carbón Vegetal Premium", stock: 2500, capacidad: 5000, unidad: "kg" },
  { nombre: "Carbón Mineral", stock: 1800, capacidad: 3000, unidad: "kg" },
  { nombre: "Briquetas de Carbón", stock: 800, capacidad: 2000, unidad: "kg" },
  { nombre: "Carbón para Parrilla", stock: 1200, capacidad: 2500, unidad: "kg" },
];

export function InventoryStatus() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">Estado del Inventario</h3>
        <p className="text-sm text-muted-foreground">Niveles de stock actuales</p>
      </div>
      <div className="space-y-5">
        {inventoryItems.map((item) => {
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
                className={`h-2 ${isLow ? '[&>div]:bg-destructive' : isMedium ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
