import { useState, useCallback, useEffect, useRef } from "react";
import type { ApiResponse, PaginatedResponse } from "@/services/types";

/**
 * Opciones para el hook useApi
 */
export interface UseApiOptions<T> {
  /** Función que ejecuta la llamada a la API */
  apiFunction: () => Promise<ApiResponse<T> | PaginatedResponse<T>>;
  /** Si es true, ejecuta la función automáticamente al montar */
  immediate?: boolean;
  /** Tiempo de cache en milisegundos (0 = sin cache) */
  cacheTime?: number;
  /** Si es true, refetch cuando la ventana recupera el foco */
  refetchOnWindowFocus?: boolean;
  /** Intervalo de refetch en milisegundos (0 = sin refetch automático) */
  refetchInterval?: number;
  /** Callback cuando la llamada es exitosa */
  onSuccess?: (data: T | T[]) => void;
  /** Callback cuando hay un error */
  onError?: (error: string) => void;
}

/**
 * Estado del hook useApi
 */
export interface UseApiState<T> {
  data: T | T[] | null;
  loading: boolean;
  error: string | null;
  /** Función para ejecutar la llamada manualmente */
  execute: () => Promise<void>;
  /** Función para resetear el estado */
  reset: () => void;
}

/**
 * Hook genérico para manejar llamadas a API
 * Proporciona loading, error handling y caching automático
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useApi({
 *   apiFunction: () => inventarioService.getProductos(1, 10),
 *   immediate: true,
 *   cacheTime: 60000, // 1 minuto
 * });
 * ```
 */
export function useApi<T>(options: UseApiOptions<T>): UseApiState<T> {
  const {
    apiFunction,
    immediate = false,
    cacheTime = 0,
    refetchOnWindowFocus = false,
    refetchInterval = 0,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache
  const cacheRef = useRef<{
    data: T | T[] | null;
    timestamp: number;
  } | null>(null);

  // Refs para limpiar intervalos
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  /**
   * Ejecuta la llamada a la API
   */
  const execute = useCallback(async () => {
    // Verificar cache
    if (cacheRef.current && cacheTime > 0) {
      const now = Date.now();
      const cacheAge = now - cacheRef.current.timestamp;
      if (cacheAge < cacheTime) {
        setData(cacheRef.current.data);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction();

      if (!mountedRef.current) return;

      if (response.error) {
        setError(response.error);
        setLoading(false);
        onError?.(response.error);
        return;
      }

      // Extraer data según el tipo de respuesta
      const responseData = "count" in response ? response.data : response.data;

      setData(responseData as T | T[]);
      setLoading(false);

      // Guardar en cache
      if (cacheTime > 0) {
        cacheRef.current = {
          data: responseData as T | T[],
          timestamp: Date.now(),
        };
      }

      onSuccess?.(responseData as T | T[]);
    } catch (err) {
      if (!mountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setLoading(false);
      onError?.(errorMessage);
    }
  }, [apiFunction, cacheTime, onSuccess, onError]);

  /**
   * Resetea el estado
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    cacheRef.current = null;
  }, []);

  // Ejecutar inmediatamente si está configurado
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  // Refetch en intervalo
  useEffect(() => {
    if (refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        execute();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [refetchInterval, execute]);

  // Refetch cuando la ventana recupera el foco
  useEffect(() => {
    if (refetchOnWindowFocus) {
      const handleFocus = () => {
        execute();
      };

      window.addEventListener("focus", handleFocus);
      return () => {
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [refetchOnWindowFocus, execute]);

  // Cleanup al desmontar
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook especializado para respuestas paginadas
 */
export function usePaginatedApi<T>(
  options: Omit<UseApiOptions<T[]>, "apiFunction"> & {
    apiFunction: () => Promise<PaginatedResponse<T>>;
  }
) {
  const apiState = useApi<T[]>(options);

  return {
    ...apiState,
    // El data ya es un array en este caso
    data: apiState.data as T[] | null,
  };
}
