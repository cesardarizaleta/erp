import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  X,
  Database,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import logoZulianita from "@/assets/logo-zulianita.jpg";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Inventario", path: "/inventario" },
  { icon: ShoppingCart, label: "Ventas", path: "/ventas" },
  { icon: CreditCard, label: "Cobranza", path: "/cobranza" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Database, label: "Logs", path: "/logs" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border",
        "w-64 lg:w-64" // Fixed width for mobile, collapsible for desktop
      )}
    >
      {/* Mobile close button */}
      <div className="lg:hidden flex justify-end p-2">
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b border-sidebar-border">
        <img
          src={logoZulianita}
          alt="La Zulianita"
          className={cn(
            "transition-all duration-300 rounded-lg",
            collapsed && !isMobile ? "w-12 h-12" : "w-16 h-16 lg:w-20 lg:h-20"
          )}
        />
        {(!collapsed || isMobile) && (
          <div className="ml-3">
            <h1 className="font-display font-bold text-sidebar-primary text-lg leading-tight">
              LA ZULIANITA
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Sistema ERP</p>
          </div>
        )}
      </div>

      {/* User Info */}
      {user && (!collapsed || isMobile) && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.nombre}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "animate-pulse")} />
              {(!collapsed || isMobile) && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors mb-2"
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
        )}

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {(!collapsed || isMobile) && <span className="text-sm">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
