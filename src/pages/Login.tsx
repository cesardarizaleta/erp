import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import logoZulianita from "@/assets/logo-zulianita.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md relative z-10 animate-slide-up bg-card/95 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={logoZulianita} 
              alt="La Zulianita" 
              className="w-24 h-24 rounded-xl shadow-lg animate-glow"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-display font-bold">
              Bienvenido a <span className="text-primary">La Zulianita</span>
            </CardTitle>
            <CardDescription>
              Sistema ERP - Ingresa tus credenciales para continuar
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="usuario@lazulianita.com"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-muted-foreground">Recordarme</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <Button type="submit" className="w-full h-11 gap-2" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Para crear cuentas de usuario, conecta con Lovable Cloud
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
