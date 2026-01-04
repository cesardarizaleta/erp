import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DolarDisplay } from "./DolarDisplay";
import { useDolar } from "@/hooks/useDolar";

// Mock del hook useDolar
vi.mock("@/hooks/useDolar", () => ({
  useDolar: vi.fn(),
}));

// Mock de sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("DolarDisplay", () => {
  it("debe mostrar la tasa oficial correctamente", () => {
    vi.mocked(useDolar).mockReturnValue({
      oficialRate: 36.5,
      loading: false,
      error: null,
      refreshRates: vi.fn(),
      showInUSD: true,
      setShowInUSD: vi.fn(),
    } as any);

    render(<DolarDisplay />);

    expect(screen.getByText("Oficial: Bs. 36.50")).toBeInTheDocument();
  });

  it("debe mostrar el estado de carga", () => {
    vi.mocked(useDolar).mockReturnValue({
      oficialRate: null,
      loading: true,
      error: null,
      refreshRates: vi.fn(),
      showInUSD: true,
      setShowInUSD: vi.fn(),
    } as any);

    render(<DolarDisplay />);

    // El componente Loader2 tiene la clase animate-spin
    const loader = document.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("debe mostrar error si falla la carga", () => {
    vi.mocked(useDolar).mockReturnValue({
      oficialRate: null,
      loading: false,
      error: "Error",
      refreshRates: vi.fn(),
      showInUSD: true,
      setShowInUSD: vi.fn(),
    } as any);

    render(<DolarDisplay />);

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("debe llamar a refreshRates al hacer clic en el botón de refrescar", async () => {
    const refreshRates = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDolar).mockReturnValue({
      oficialRate: 36.5,
      loading: false,
      error: null,
      refreshRates,
      showInUSD: true,
      setShowInUSD: vi.fn(),
    } as any);

    render(<DolarDisplay />);

    // El botón de refrescar es el único botón en este componente
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(refreshRates).toHaveBeenCalled();
  });

  it("debe cambiar entre USD y BS al usar el switch", () => {
    const setShowInUSD = vi.fn();
    vi.mocked(useDolar).mockReturnValue({
      oficialRate: 36.5,
      loading: false,
      error: null,
      refreshRates: vi.fn(),
      showInUSD: false,
      setShowInUSD,
    } as any);

    render(<DolarDisplay />);

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);

    expect(setShowInUSD).toHaveBeenCalledWith(true);
  });
});
