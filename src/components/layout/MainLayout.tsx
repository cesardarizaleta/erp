import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main content */}
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "ml-64" // Default sidebar width
      )}>
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border p-4">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
