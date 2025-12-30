// Tipos genéricos para la API, independientes de la implementación (Supabase, etc.)
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  avatar_url?: string;
  role?: 'admin' | 'vendedor' | 'cobrador';
}

export interface Cliente {
  id: string;
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  fecha_creacion: string;
  user_id: string;
}

export interface Producto {
  id: string;
  nombre_producto: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  categoria?: string | null;
  fecha_creacion: string;
  user_id: string;
}

export interface Venta {
  id: string;
  cliente_id?: string;
  cliente?: string; // Nombre del cliente para búsqueda
  fecha_venta: string;
  total: number;
  estado: string;
  user_id: string;
}

export interface VentaItem {
  id: string;
  venta_id: string;
  producto_id?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Cobranza {
  id: string;
  venta_id: string;
  monto_pendiente: number;
  fecha_vencimiento?: string;
  estado: string;
  notas?: string;
  user_id: string;
}

export interface ConfiguracionEmpresa {
  id: string;
  nombre_empresa: string;
  rif_nit: string;
  telefono: string;
  email: string;
  direccion: string;
  logo_url?: string;
  user_id: string;
}

export interface ConfiguracionNotificaciones {
  id: string;
  stock_bajo: boolean;
  facturas_vencidas: boolean;
  nuevas_ventas: boolean;
  user_id: string;
}

export interface ConfiguracionSistema {
  id: string;
  version: string;
  db_conectada: boolean;
  ultima_actualizacion: string;
  estado: string;
  user_id: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: string | null;
}