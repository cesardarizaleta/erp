import { describe, it, expect, vi, beforeEach } from "vitest";
import { dolarService } from "./dolarService";

describe("dolarService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("debe obtener las tasas de cambio exitosamente", async () => {
    const mockData = [
      { fuente: "oficial", promedio: 36.5 },
      { fuente: "paralelo", promedio: 42.0 },
    ];

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await dolarService.getDolarRates();

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith("https://ve.dolarapi.com/v1/dolares");
  });

  it("debe manejar errores de red", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const result = await dolarService.getDolarRates();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Error al obtener tasas de dólar");
  });

  it("debe manejar respuestas HTTP no exitosas", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const result = await dolarService.getDolarRates();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Error al obtener tasas de dólar");
  });

  it("debe extraer la tasa oficial correctamente", () => {
    const rates = [
      { fuente: "oficial", promedio: 36.5 } as any,
      { fuente: "paralelo", promedio: 42.0 } as any,
    ];

    const rate = dolarService.getOficialRate(rates);
    expect(rate).toBe(36.5);
  });

  it("debe retornar null si no encuentra la tasa oficial", () => {
    const rates = [{ fuente: "paralelo", promedio: 42.0 } as any];

    const rate = dolarService.getOficialRate(rates);
    expect(rate).toBeNull();
  });
});
