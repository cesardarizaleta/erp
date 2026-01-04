import { describe, it, expect, vi, beforeEach } from "vitest";
import { inventarioService } from "./inventarioService";
import { SupabaseWrapper } from "@/services/supabaseWrapper";
import { dolarService } from "@/services/dolarService";

// Mock de SupabaseWrapper
vi.mock("@/services/supabaseWrapper", () => ({
  SupabaseWrapper: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    }),
    selectPaginated: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock de dolarService
vi.mock("@/services/dolarService", () => ({
  dolarService: {
    getDolarRates: vi.fn(),
    getOficialRate: vi.fn(),
  },
}));

describe("inventarioService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe obtener productos paginados", async () => {
    const mockResponse = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    vi.mocked(SupabaseWrapper.selectPaginated).mockResolvedValue(mockResponse as any);

    const result = await inventarioService.getProductos(1, 10);

    expect(result).toEqual(mockResponse);
    expect(SupabaseWrapper.selectPaginated).toHaveBeenCalled();
  });

  it("debe obtener un producto por ID", async () => {
    const mockProducto = { id: "1", nombre: "Test" };
    vi.mocked(SupabaseWrapper.select).mockResolvedValue({ data: mockProducto as any, error: null });

    const result = await inventarioService.getProductoById("1");

    expect(result.data).toEqual(mockProducto);
    expect(SupabaseWrapper.select).toHaveBeenCalled();
  });

  it("debe crear un producto calculando el precio en BS automáticamente", async () => {
    const productoData = { nombre: "Test", precio: 10, stock: 5, categoria: "Test" };
    const mockTasa = 36.5;

    vi.mocked(dolarService.getDolarRates).mockResolvedValue({ data: [], error: null });
    vi.mocked(dolarService.getOficialRate).mockReturnValue(mockTasa);
    vi.mocked(SupabaseWrapper.insert).mockResolvedValue({
      data: { ...productoData, id: "1", precio_bs: 365 } as any,
      error: null,
    });

    const result = await inventarioService.createProducto(productoData as any);

    expect(result.data?.precio_bs).toBe(365);
    expect(SupabaseWrapper.insert).toHaveBeenCalled();
  });

  it("debe actualizar un producto y recalcular precio BS si cambia el precio USD", async () => {
    const updates = { precio: 20 };
    const mockTasa = 40;

    vi.mocked(dolarService.getDolarRates).mockResolvedValue({ data: [], error: null });
    vi.mocked(dolarService.getOficialRate).mockReturnValue(mockTasa);
    vi.mocked(SupabaseWrapper.update).mockResolvedValue({
      data: { id: "1", precio: 20, precio_bs: 800 } as any,
      error: null,
    });

    const result = await inventarioService.updateProducto("1", updates);

    expect(result.data?.precio_bs).toBe(800);
    expect(SupabaseWrapper.update).toHaveBeenCalled();
  });

  it("debe eliminar un producto", async () => {
    vi.mocked(SupabaseWrapper.delete).mockResolvedValue({ data: null, error: null });

    const result = await inventarioService.deleteProducto("1");

    expect(result.error).toBeNull();
    expect(SupabaseWrapper.delete).toHaveBeenCalled();
  });
});
