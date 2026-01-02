import { SupabaseWrapper } from "@/services/supabaseWrapper";
import type { Cliente, ApiResponse, PaginatedResponse } from "@/services/types";

class ClienteService {
  private readonly tableName = "clientes";

  // Obtener todos los clientes (con paginación)
  async getClientes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Cliente>> {
    return SupabaseWrapper.selectPaginated<Cliente>(SupabaseWrapper.from(this.tableName), {
      tableName: this.tableName,
      operation: "SELECT",
      pagination: {
        page,
        limit,
        orderBy: "fecha_creacion",
        orderDirection: "desc",
      },
      logQuery: true,
      queryDescription: `getClientes page=${page} limit=${limit}`,
    });
  }

  // Obtener cliente por ID
  async getClienteById(id: string): Promise<ApiResponse<Cliente>> {
    return SupabaseWrapper.select<Cliente>(
      SupabaseWrapper.from(this.tableName).select("*").eq("id", id).single(),
      {
        tableName: this.tableName,
        operation: "SELECT",
        logQuery: true,
        queryDescription: `getClienteById id=${id}`,
      }
    );
  }

  // Crear cliente
  async createCliente(clienteData: Omit<Cliente, "id">): Promise<ApiResponse<Cliente>> {
    return SupabaseWrapper.insert<Cliente>(
      SupabaseWrapper.from(this.tableName).insert([clienteData]).select().single(),
      {
        tableName: this.tableName,
        operation: "INSERT",
        logQuery: true,
        queryDescription: "createCliente",
      }
    );
  }

  // Actualizar cliente
  async updateCliente(id: string, updates: Partial<Cliente>): Promise<ApiResponse<Cliente>> {
    return SupabaseWrapper.update<Cliente>(
      SupabaseWrapper.from(this.tableName).update(updates).eq("id", id).select().single(),
      {
        tableName: this.tableName,
        operation: "UPDATE",
        logQuery: true,
        queryDescription: `updateCliente id=${id}`,
      }
    );
  }

  // Eliminar cliente
  async deleteCliente(id: string): Promise<ApiResponse<null>> {
    return SupabaseWrapper.delete(SupabaseWrapper.from(this.tableName).delete().eq("id", id), {
      tableName: this.tableName,
      operation: "DELETE",
      logQuery: true,
      queryDescription: `deleteCliente id=${id}`,
    });
  }

  // Buscar clientes
  async searchClientes(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Cliente>> {
    return SupabaseWrapper.selectPaginated<Cliente>(
      SupabaseWrapper.from(this.tableName).or(
        `nombre.ilike.%${query}%,email.ilike.%${query}%,telefono.ilike.%${query}%`
      ),
      {
        tableName: this.tableName,
        operation: "SELECT",
        pagination: {
          page,
          limit,
          orderBy: "fecha_creacion",
          orderDirection: "desc",
        },
        logQuery: true,
        queryDescription: `searchClientes query=${query}`,
      }
    );
  }
}

export const clienteService = new ClienteService();
