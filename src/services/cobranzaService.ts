import { supabase } from "@/integrations/supabase/client";
import type { Cobranza, ApiResponse, PaginatedResponse } from "./types";
import { dolarService } from "./dolarService";

class CobranzaService {
  // Obtener todas las cobranzas (con paginación)
  async getCobranzas(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Cobranza>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("cobranza")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("id", { ascending: false });

      if (error) {
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: data || [],
        count: count || 0,
        error: null,
      };
    } catch (err) {
      return { data: [], count: 0, error: "Error al obtener cobranzas" };
    }
  }

  // Obtener cobranza por ID
  async getCobranzaById(id: string): Promise<ApiResponse<Cobranza>> {
    try {
      const { data, error } = await supabase.from("cobranza").select("*").eq("id", id).single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Error al obtener cobranza" };
    }
  }

  // Crear cobranza
  async createCobranza(cobranzaData: Omit<Cobranza, "id">): Promise<ApiResponse<Cobranza>> {
    try {
      // Obtener la tasa de cambio actual
      const dolarResponse = await dolarService.getDolarRates();
      const tasaActual = dolarResponse.data
        ? dolarService.getOficialRate(dolarResponse.data)
        : 298.14;

      // Calcular monto pendiente en bolívares
      const cobranzaDataConBS = {
        ...cobranzaData,
        monto_pendiente_bs: cobranzaData.monto_pendiente * tasaActual,
      };

      const { data, error } = await supabase
        .from("cobranza")
        .insert([cobranzaDataConBS])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Error al crear cobranza" };
    }
  }

  // Actualizar cobranza
  async updateCobranza(id: string, updates: Partial<Cobranza>): Promise<ApiResponse<Cobranza>> {
    try {
      const { data, error } = await supabase
        .from("cobranza")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Error al actualizar cobranza" };
    }
  }

  // Eliminar cobranza
  async deleteCobranza(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from("cobranza").delete().eq("id", id);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: "Error al eliminar cobranza" };
    }
  }

  // Buscar cobranzas
  async searchCobranzas(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Cobranza>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("cobranza")
        .select("*", { count: "exact" })
        .or(`notas.ilike.%${query}%,estado.ilike.%${query}%`)
        .range(from, to)
        .order("id", { ascending: false });

      if (error) {
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: data || [],
        count: count || 0,
        error: null,
      };
    } catch (err) {
      return { data: [], count: 0, error: "Error al buscar cobranzas" };
    }
  }

  // Obtener cobranzas pendientes
  async getCobranzasPendientes(): Promise<ApiResponse<Cobranza[]>> {
    try {
      const { data, error } = await supabase
        .from("cobranza")
        .select("*")
        .eq("estado", "pendiente")
        .order("fecha_vencimiento", { ascending: true });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Error al obtener cobranzas pendientes" };
    }
  }

  // Marcar como pagada
  async marcarComoPagada(id: string): Promise<ApiResponse<Cobranza>> {
    try {
      const { data, error } = await supabase
        .from("cobranza")
        .update({ estado: "pagada" })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: "Error al marcar cobranza como pagada" };
    }
  }
}

export const cobranzaService = new CobranzaService();
