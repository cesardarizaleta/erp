import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Bell, Shield, Palette, Users, Database } from "lucide-react";
import logoZulianita from "@/assets/logo-zulianita.jpg";

const Configuracion = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">Ajustes del sistema y preferencias</p>
        </div>

        {/* Company Info */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">Información de la Empresa</CardTitle>
                <CardDescription>Datos generales del negocio</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <img 
                src={logoZulianita} 
                alt="Logo" 
                className="w-24 h-24 rounded-xl object-cover border-2 border-primary"
              />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre de la Empresa</Label>
                    <Input defaultValue="Carbón La Zulianita" />
                  </div>
                  <div className="space-y-2">
                    <Label>RIF / NIT</Label>
                    <Input defaultValue="J-12345678-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input defaultValue="+58 412-1234567" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="contacto@lazulianita.com" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input defaultValue="Zona Industrial, Galpón 15, Estado Zulia" />
            </div>
            <Button className="mt-4">Guardar Cambios</Button>
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">Gestión de Usuarios</CardTitle>
                <CardDescription>Administrar accesos y permisos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">admin@lazulianita.com</p>
                  <p className="text-sm text-muted-foreground">Administrador</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">Admin</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">ventas@lazulianita.com</p>
                  <p className="text-sm text-muted-foreground">Vendedor</p>
                </div>
                <Badge variant="outline">Vendedor</Badge>
              </div>
              <Button variant="outline" className="w-full">
                + Agregar Usuario
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Para gestionar usuarios completa, conecta Lovable Cloud
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">Notificaciones</CardTitle>
                <CardDescription>Configurar alertas del sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stock bajo</p>
                <p className="text-sm text-muted-foreground">Alerta cuando el inventario esté bajo</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Facturas vencidas</p>
                <p className="text-sm text-muted-foreground">Recordatorios de cobranza</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nuevas ventas</p>
                <p className="text-sm text-muted-foreground">Notificar cada nueva venta</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display">Sistema</CardTitle>
                <CardDescription>Información técnica</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Versión</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Base de Datos</p>
                <p className="font-medium text-warning">No conectada</p>
              </div>
              <div>
                <p className="text-muted-foreground">Última actualización</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <p className="font-medium text-success">Operativo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// Need to import Badge
import { Badge } from "@/components/ui/badge";

export default Configuracion;
