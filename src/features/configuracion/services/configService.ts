import { supabase } from "@/integrations/supabase/client";
import type {
  ConfiguracionEmpresa,
  ConfiguracionNotificaciones,
  ConfiguracionSistema,
  ApiResponse,
} from "@/services/types";

class ConfigService {
  // Obtener configuración de empresa
  async getEmpresaConfig(userId: string): Promise<ApiResponse<ConfiguracionEmpresa>> {
    try {
      const { data, error } = await supabase
        .from("configuracion_empresa")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!data) {
        // Si no existe, devolver valores por defecto pero no guardar aún
        return {
          data: {
            id: "",
            user_id: userId,
            nombre_empresa: "EXAMPLE",
            rif_nit: "J-123456789",
            telefono: "+58 412 123 4567",
            email: "info@example.com",
            direccion: "Av. Principal, Ciudad Bolívar, Venezuela",
            logo_url: "/logo.jpg",
          },
          error: null,
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || "Error al obtener configuración de empresa" };
    }
  }

  // Actualizar configuración de empresa
  async updateEmpresaConfig(
    config: Partial<ConfiguracionEmpresa>
  ): Promise<ApiResponse<ConfiguracionEmpresa>> {
    try {
      const { data, error } = await supabase
        .from("configuracion_empresa")
        .upsert({
          ...config,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || "Error al actualizar configuración de empresa" };
    }
  }

  // Obtener configuración de notificaciones
  async getNotificacionesConfig(userId: string): Promise<ApiResponse<ConfiguracionNotificaciones>> {
    try {
      const { data, error } = await supabase
        .from("configuracion_notificaciones")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!data) {
        return {
          data: {
            id: "",
            user_id: userId,
            stock_bajo: true,
            facturas_vencidas: true,
            nuevas_ventas: false,
          },
          error: null,
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Error al obtener configuración de notificaciones",
      };
    }
  }

  // Actualizar configuración de notificaciones
  async updateNotificacionesConfig(
    config: Partial<ConfiguracionNotificaciones>
  ): Promise<ApiResponse<ConfiguracionNotificaciones>> {
    try {
      const { data, error } = await supabase
        .from("configuracion_notificaciones")
        .upsert({
          ...config,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: error.message || "Error al actualizar configuración de notificaciones",
      };
    }
  }

  // Obtener configuración del sistema
  async getSistemaConfig(userId: string): Promise<ApiResponse<ConfiguracionSistema>> {
    try {
      // El sistema es mayormente estático por ahora
      const mockData: ConfiguracionSistema = {
        id: "1",
        user_id: userId,
        version: "1.0.0",
        db_conectada: true,
        ultima_actualizacion: new Date().toISOString(),
        estado: "Operativo",
      };

      return { data: mockData, error: null };
    } catch {
      return { data: null, error: "Error al obtener configuración del sistema" };
    }
  }

  // Actualizar configuración del sistema
  async updateSistemaConfig(
    config: Partial<ConfiguracionSistema>
  ): Promise<ApiResponse<ConfiguracionSistema>> {
    try {
      const updatedData: ConfiguracionSistema = {
        id: "1",
        user_id: config.user_id || "",
        version: config.version || "1.0.0",
        db_conectada: config.db_conectada ?? true,
        ultima_actualizacion: new Date().toISOString(),
        estado: config.estado || "Operativo",
      };

      return { data: updatedData, error: null };
    } catch {
      return { data: null, error: "Error al actualizar configuración del sistema" };
    }
  }
}

export const configService = new ConfigService();
