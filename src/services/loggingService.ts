import { supabase } from "@/integrations/supabase/client";

export interface LogEntry {
  id?: string;
  timestamp?: string;
  user_id?: string;
  table_name: string;
  operation: "INSERT" | "UPDATE" | "DELETE" | "SELECT" | "LOGIN" | "LOGOUT" | "ERROR";
  record_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  query_text?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  execution_time_ms?: number;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

class LoggingService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Logging manual para operaciones SELECT (cuando no hay trigger)
  async logSelect(
    tableName: string,
    queryText?: string,
    recordIds?: string[],
    executionTime?: number
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const logEntry: LogEntry = {
        table_name: tableName,
        operation: "SELECT",
        query_text: queryText,
        session_id: this.sessionId,
        execution_time_ms: executionTime,
        metadata: {
          record_ids: recordIds,
          user_agent: navigator.userAgent,
          url: window.location.href,
        },
      };

      // Insertar directamente en logs (el sistema simplificado usa triggers para DML)
      const { error } = await supabase.from("logs").insert([
        {
          user_id: user?.id,
          table_name: tableName,
          operation: "SELECT",
          query_text: queryText,
          session_id: this.sessionId,
          execution_time_ms: executionTime,
          metadata: logEntry.metadata,
        },
      ]);

      if (error) {
        console.warn("Error logging SELECT operation:", error);
      }
    } catch (err) {
      console.warn("Error in logSelect:", err);
    }
  }

  // Logging de errores
  async logError(
    tableName: string,
    operation: LogEntry["operation"],
    errorMessage: string,
    queryText?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("logs").insert([
        {
          user_id: user?.id,
          table_name: tableName,
          operation,
          error_message: errorMessage,
          query_text: queryText,
          session_id: this.sessionId,
          metadata: {
            ...metadata,
            user_agent: navigator.userAgent,
            url: window.location.href,
          },
        },
      ]);

      if (error) {
        console.warn("Error logging error:", error);
      }
    } catch (err) {
      console.warn("Error in logError:", err);
    }
  }

  // Logging de eventos de autenticación
  async logAuthEvent(operation: "LOGIN" | "LOGOUT", metadata?: Record<string, any>): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Insertar directamente en logs
      const { error } = await supabase.from("logs").insert([
        {
          user_id: user?.id,
          table_name: "auth",
          operation,
          session_id: this.sessionId,
          metadata: {
            ...metadata,
            user_agent: navigator.userAgent,
            url: window.location.href,
          },
        },
      ]);

      if (error) {
        console.warn("Error logging auth event:", error);
      }
    } catch (err) {
      console.warn("Error in logAuthEvent:", err);
    }
  }

  // Función helper para medir tiempo de ejecución
  async measureExecutionTime<T>(
    operation: () => Promise<T>,
    tableName: string,
    operationType: LogEntry["operation"] = "SELECT"
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await operation();
      const executionTime = Date.now() - startTime;

      // Log successful operation
      if (operationType === "SELECT") {
        await this.logSelect(tableName, undefined, undefined, executionTime);
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Log error
      await this.logError(
        tableName,
        operationType,
        error instanceof Error ? error.message : "Unknown error",
        undefined,
        { execution_time_ms: executionTime }
      );

      throw error;
    }
  }

  // Obtener estadísticas de logs
  async getLogStatistics(days: number = 30): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc("get_log_statistics", {
        p_days: days,
      });

      if (error) {
        console.warn("Error getting log statistics:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.warn("Error in getLogStatistics:", err);
      return [];
    }
  }

  // Obtener logs recientes
  async getRecentLogs(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("recent_logs")
        .select("*")
        .limit(limit)
        .order("timestamp", { ascending: false });

      if (error) {
        console.warn("Error getting recent logs:", error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.warn("Error in getRecentLogs:", err);
      return [];
    }
  }

  // Obtener logs con paginación
  async getLogs(page: number = 1, pageSize: number = 20): Promise<{ data: any[]; count: number }> {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await supabase
        .from("logs")
        .select("*", { count: "exact" })
        .order("timestamp", { ascending: false })
        .range(from, to);

      if (error) {
        console.warn("Error getting logs:", error);
        return { data: [], count: 0 };
      }

      return { data: data || [], count: count || 0 };
    } catch (err) {
      console.warn("Error in getLogs:", err);
      return { data: [], count: 0 };
    }
  }

  // Obtener total de operaciones
  async getTotalOperations(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("logs")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.warn("Error getting total operations:", error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.warn("Error in getTotalOperations:", err);
      return 0;
    }
  }
}

// Instancia singleton del servicio de logging
export const loggingService = new LoggingService();

// Helper functions para facilitar el uso
export const logSelect = (
  tableName: string,
  queryText?: string,
  recordIds?: string[],
  executionTime?: number
) => loggingService.logSelect(tableName, queryText, recordIds, executionTime);

export const logError = (
  tableName: string,
  operation: LogEntry["operation"],
  errorMessage: string,
  queryText?: string,
  metadata?: Record<string, any>
) => loggingService.logError(tableName, operation, errorMessage, queryText, metadata);

export const logAuthEvent = (operation: "LOGIN" | "LOGOUT", metadata?: Record<string, any>) =>
  loggingService.logAuthEvent(operation, metadata);

export const measureExecutionTime = <T>(
  operation: () => Promise<T>,
  tableName: string,
  operationType?: LogEntry["operation"]
) => loggingService.measureExecutionTime(operation, tableName, operationType);
