import { supabase } from "@/integrations/supabase/client";
import type { Venta, VentaItem, ApiResponse, PaginatedResponse } from "./types";
import { dolarService } from "./dolarService";
import { loggingService, measureExecutionTime } from "./loggingService";

class VentaService {
  // Obtener todas las ventas (con paginación)
  async getVentas(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Venta>> {
    return measureExecutionTime(async () => {
      try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
          .from("ventas")
          .select(
            `
            *,
            clientes:cliente_id (
              nombre
            )
          `,
            { count: "exact" }
          )
          .range(from, to)
          .order("fecha_venta", { ascending: false });

        if (error) {
          await loggingService.logError("ventas", "SELECT", error.message, "getVentas with pagination");
          return { data: [], count: 0, error: error.message };
        }

        // Transformar los datos para incluir el nombre del cliente
        const transformedData = (data || []).map(venta => ({
          ...venta,
          cliente: venta.clientes?.nombre || "Cliente desconocido",
        }));

        // Log successful query with record count
        await loggingService.logSelect("ventas", `getVentas page=${page} limit=${limit}`, transformedData.map(v => v.id));

        return {
          data: transformedData,
          count: count || 0,
          error: null,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al obtener ventas";
        await loggingService.logError("ventas", "SELECT", errorMessage, "getVentas catch block");
        return { data: [], count: 0, error: errorMessage };
      }
    }, "ventas", "SELECT");
  }

  // Obtener venta por ID con items
  async getVentaById(id: string): Promise<ApiResponse<{ venta: Venta; items: VentaItem[] }>> {
    try {
      // Obtener la venta con información del cliente
      const { data: ventaData, error: ventaError } = await supabase
        .from("ventas")
        .select(
          `
          *,
          clientes:cliente_id (
            nombre
          )
        `
        )
        .eq("id", id)
        .single();

      if (ventaError) {
        return { data: null, error: ventaError.message };
      }

      // Obtener los items de la venta
      const { data: itemsData, error: itemsError } = await supabase
        .from("venta_items")
        .select("*")
        .eq("venta_id", id);

      if (itemsError) {
        return { data: null, error: itemsError.message };
      }

      const venta = {
        ...ventaData,
        cliente: ventaData.clientes?.nombre || "Cliente desconocido",
      };

      return { data: { venta, items: itemsData || [] }, error: null };
    } catch (err) {
      return { data: null, error: "Error al obtener venta" };
    }
  }

  // Crear venta
  async createVenta(
    ventaData: Omit<Venta, "id">,
    items: Omit<VentaItem, "id" | "venta_id">[]
  ): Promise<ApiResponse<Venta>> {
    return measureExecutionTime(async () => {
      try {
        // Obtener la tasa de cambio actual
        const dolarResponse = await dolarService.getDolarRates();
        const tasaActual = dolarResponse.data ?
          dolarService.getOficialRate(dolarResponse.data) : 298.14; // fallback a 298.14

        // Calcular montos en bolívares
        const ventaDataConBS = {
          ...ventaData,
          total_bs: ventaData.total * tasaActual,
          tasa_cambio_aplicada: tasaActual,
        };

        // Preparar items con montos en bolívares
        const itemsConBS = items.map(item => ({
          ...item,
          precio_unitario_bs: item.precio_unitario * tasaActual,
          subtotal_bs: item.subtotal * tasaActual,
        }));

        // Crear la venta
        const { data: venta, error: ventaError } = await supabase
          .from("ventas")
          .insert([ventaDataConBS])
          .select(
            `
            *,
            clientes:cliente_id (
              nombre
            )
          `
          )
          .single();

        if (ventaError) {
          return { data: null, error: ventaError.message };
        }

        // Crear los items de la venta
        if (itemsConBS.length > 0) {
          const itemsWithVentaId = itemsConBS.map(item => ({
            ...item,
            venta_id: venta.id,
          }));

          const { error: itemsError } = await supabase.from("venta_items").insert(itemsWithVentaId);

          if (itemsError) {
            // Si falla la creación de items, eliminar la venta
            await supabase.from("ventas").delete().eq("id", venta.id);
            return { data: null, error: itemsError.message };
          }
        }

        const transformedVenta = {
          ...venta,
          cliente: venta.clientes?.nombre || "Cliente desconocido",
        };

        return { data: transformedVenta, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al crear venta";
        await loggingService.logError("ventas", "INSERT", errorMessage, "createVenta catch block");
        return { data: null, error: errorMessage };
      }
    }, "ventas", "INSERT");
  }

  // Actualizar venta
  async updateVenta(id: string, updates: Partial<Venta>): Promise<ApiResponse<Venta>> {
    try {
      const { data, error } = await supabase
        .from("ventas")
        .update(updates)
        .eq("id", id)
        .select(
          `
          *,
          clientes:cliente_id (
            nombre
          )
        `
        )
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      const transformedVenta = {
        ...data,
        cliente: data.clientes?.nombre || "Cliente desconocido",
      };

      return { data: transformedVenta, error: null };
    } catch (err) {
      return { data: null, error: "Error al actualizar venta" };
    }
  }

  // Eliminar venta
  async deleteVenta(id: string): Promise<ApiResponse<null>> {
    try {
      // Primero eliminar los items de la venta
      const { error: itemsError } = await supabase.from("venta_items").delete().eq("venta_id", id);

      if (itemsError) {
        return { data: null, error: itemsError.message };
      }

      // Luego eliminar la venta
      const { error: ventaError } = await supabase.from("ventas").delete().eq("id", id);

      if (ventaError) {
        return { data: null, error: ventaError.message };
      }

      return { data: null, error: null };
    } catch (err) {
      return { data: null, error: "Error al eliminar venta" };
    }
  }

  // Buscar ventas
  async searchVentas(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Venta>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("ventas")
        .select(
          `
          *,
          clientes:cliente_id (
            nombre
          )
        `,
          { count: "exact" }
        )
        .or(`id.ilike.%${query}%`)
        .range(from, to)
        .order("fecha_venta", { ascending: false });

      if (error) {
        return { data: [], count: 0, error: error.message };
      }

      // Transformar los datos para incluir el nombre del cliente
      const transformedData = (data || []).map(venta => ({
        ...venta,
        cliente: venta.clientes?.nombre || "Cliente desconocido",
      }));

      return {
        data: transformedData,
        count: count || 0,
        error: null,
      };
    } catch (err) {
      return { data: [], count: 0, error: "Error al buscar ventas" };
    }
  }
}

export const ventaService = new VentaService();
