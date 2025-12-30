import { supabase } from '@/integrations/supabase/client';
import type { ConfiguracionEmpresa, ConfiguracionNotificaciones, ConfiguracionSistema, ApiResponse } from './types';

class ConfigService {
  // Obtener configuración de empresa
  async getEmpresaConfig(userId: string): Promise<ApiResponse<ConfiguracionEmpresa>> {
    try {
      const { data, error } = await supabase
        .from('configuracion_empresa')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: 'Error al obtener configuración de empresa' };
    }
  }

  // Actualizar configuración de empresa
  async updateEmpresaConfig(config: Partial<ConfiguracionEmpresa>): Promise<ApiResponse<ConfiguracionEmpresa>> {
    try {
      const { data, error } = await supabase
        .from('configuracion_empresa')
        .upsert(config)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: 'Error al actualizar configuración de empresa' };
    }
  }

  // Obtener configuración de notificaciones
  async getNotificacionesConfig(userId: string): Promise<ApiResponse<ConfiguracionNotificaciones>> {
    try {
      const { data, error } = await supabase
        .from('configuracion_notificaciones')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: 'Error al obtener configuración de notificaciones' };
    }
  }

  // Actualizar configuración de notificaciones
  async updateNotificacionesConfig(config: Partial<ConfiguracionNotificaciones>): Promise<ApiResponse<ConfiguracionNotificaciones>> {
    try {
      const { data, error } = await supabase
        .from('configuracion_notificaciones')
        .upsert(config)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: 'Error al actualizar configuración de notificaciones' };
    }
  }

  // Obtener configuración del sistema
  async getSistemaConfig(userId: string): Promise<ApiResponse<ConfiguracionSistema>> {
    try {
      const { data, error } = await supabase
        .from('configuracion_sistema')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: 'Error al obtener configuración del sistema' };
    }
  }

  // Actualizar configuración del sistema
  async updateSistemaConfig(config: Partial<ConfiguracionSistema>): Promise<ApiResponse<ConfiguracionSistema>> {
    try {
      const { data, error } = await supabase
        .from('configuracion_sistema')
        .upsert(config)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: 'Error al actualizar configuración del sistema' };
    }
  }
}

export const configService = new ConfigService();