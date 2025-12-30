import { supabase } from "@/integrations/supabase/client";
import type { Producto, ApiResponse, PaginatedResponse } from "./types";
import { dolarService } from "./dolarService";
import { loggingService, measureExecutionTime } from "./loggingService";

class InventarioService {
  // Obtener todos los productos (con paginación)
  async getProductos(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Producto>> {
    return measureExecutionTime(
      async () => {
        try {
          const from = (page - 1) * limit;
          const to = from + limit - 1;

          const { data, error, count } = await supabase
            .from("inventario")
            .select("*", { count: "exact" })
            .range(from, to)
            .order("fecha_creacion", { ascending: false });

          if (error) {
            await loggingService.logError(
              "inventario",
              "SELECT",
              error.message,
              "getProductos with pagination"
            );
            return { data: [], count: 0, error: error.message };
          }

          await loggingService.logSelect(
            "inventario",
            `getProductos page=${page} limit=${limit}`,
            data?.map(p => p.id)
          );

          return {
            data: data || [],
            count: count || 0,
            error: null,
          };
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Error al obtener productos";
          await loggingService.logError(
            "inventario",
            "SELECT",
            errorMessage,
            "getProductos catch block"
          );
          return { data: [], count: 0, error: errorMessage };
        }
      },
      "inventario",
      "SELECT"
    );
  }

  // Obtener producto por ID
  async getProductoById(id: string): Promise<ApiResponse<Producto>> {
    try {
      const { data, error } = await supabase.from("inventario").select("*").eq("id", id).single();

      if (error) {
        console.error("Error fetching producto:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Error in getProductoById:", err);
      return { data: null, error: "Error al obtener producto" };
    }
  }

  // Crear producto
  async createProducto(productoData: Omit<Producto, "id">): Promise<ApiResponse<Producto>> {
    return measureExecutionTime(
      async () => {
        try {
          // Obtener la tasa de cambio actual
          const dolarResponse = await dolarService.getDolarRates();
          const tasaActual = dolarResponse.data
            ? dolarService.getOficialRate(dolarResponse.data)
            : 298.14; // fallback

          // Calcular precio en bolívares
          const productoDataConBS = {
            ...productoData,
            precio_bs: productoData.precio * tasaActual,
          };

          const { data, error } = await supabase
            .from("inventario")
            .insert([productoDataConBS])
            .select()
            .single();

          if (error) {
            await loggingService.logError(
              "inventario",
              "INSERT",
              error.message,
              "createProducto insert"
            );
            return { data: null, error: error.message };
          }

          return { data, error: null };
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Error al crear producto";
          await loggingService.logError(
            "inventario",
            "INSERT",
            errorMessage,
            "createProducto catch block"
          );
          return { data: null, error: errorMessage };
        }
      },
      "inventario",
      "INSERT"
    );
  }

  // Actualizar producto
  async updateProducto(id: string, updates: Partial<Producto>): Promise<ApiResponse<Producto>> {
    try {
      let updatesConBS = { ...updates };

      // Si se está actualizando el precio en USD, recalcular el precio en BS
      if (updates.precio !== undefined) {
        const dolarResponse = await dolarService.getDolarRates();
        const tasaActual = dolarResponse.data
          ? dolarService.getOficialRate(dolarResponse.data)
          : 298.14;
        updatesConBS.precio_bs = updates.precio * tasaActual;
      }

      const { data, error } = await supabase
        .from("inventario")
        .update(updatesConBS)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating producto:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Error in updateProducto:", err);
      return { data: null, error: "Error al actualizar producto" };
    }
  }

  // Eliminar producto
  async deleteProducto(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from("inventario").delete().eq("id", id);

      if (error) {
        console.error("Error deleting producto:", error);
        return { data: null, error: error.message };
      }

      return { data: null, error: null };
    } catch (err) {
      console.error("Error in deleteProducto:", err);
      return { data: null, error: "Error al eliminar producto" };
    }
  }

  // Buscar productos
  async searchProductos(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Producto>> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("inventario")
        .select("*", { count: "exact" })
        .or(
          `nombre_producto.ilike.%${query}%,descripcion.ilike.%${query}%,categoria.ilike.%${query}%`
        )
        .range(from, to)
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("Error searching productos:", error);
        return { data: [], count: 0, error: error.message };
      }

      return {
        data: data || [],
        count: count || 0,
        error: null,
      };
    } catch (err) {
      console.error("Error in searchProductos:", err);
      return { data: [], count: 0, error: "Error al buscar productos" };
    }
  }

  // Obtener productos con stock bajo
  async getProductosStockBajo(): Promise<ApiResponse<Producto[]>> {
    try {
      const { data, error } = await supabase.from("inventario").select("*").lte("stock", 5); // Considerar stock bajo como <= 5

      if (error) {
        console.error("Error fetching productos stock bajo:", error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error("Error in getProductosStockBajo:", err);
      return { data: null, error: "Error al obtener productos con stock bajo" };
    }
  }

  // Actualizar stock
  async updateStock(id: string, nuevoStock: number): Promise<ApiResponse<Producto>> {
    try {
      const { data, error } = await supabase
        .from("inventario")
        .update({ stock: nuevoStock })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating stock:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Error in updateStock:", err);
      return { data: null, error: "Error al actualizar stock" };
    }
  }
}

export const inventarioService = new InventarioService();
