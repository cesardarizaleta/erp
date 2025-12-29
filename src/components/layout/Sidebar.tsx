import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import logoZulianita from "@/assets/logo-zulianita.jpg";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Inventario", path: "/inventario" },
  { icon: ShoppingCart, label: "Ventas", path: "/ventas" },
  { icon: CreditCard, label: "Cobranza", path: "/cobranza" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b border-sidebar-border">
        <img 
          src={logoZulianita} 
          alt="La Zulianita" 
          className={cn(
            "transition-all duration-300 rounded-lg",
            collapsed ? "w-12 h-12" : "w-20 h-20"
          )}
        />
        {!collapsed && (
          <div className="ml-3">
            <h1 className="font-display font-bold text-sidebar-primary text-lg leading-tight">
              LA ZULIANITA
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Sistema ERP</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "animate-pulse")} />
              {!collapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Colapsar</span>
            </>
          )}
        </button>
        
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-sidebar-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Cerrar Sesión</span>}
        </NavLink>
      </div>
    </aside>
  );
}
