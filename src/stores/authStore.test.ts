import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";
import { authService } from "@/services";

// Mock de los servicios
vi.mock("@/services", async importOriginal => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    authService: {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPassword: vi.fn(),
      getCurrentUser: vi.fn(),
    },
  };
});

describe("authStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Resetear el estado del store antes de cada prueba
    useAuthStore.setState({
      user: null,
      loading: false,
      initialized: false,
    });
  });

  it("debe inicializar con valores por defecto", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.initialized).toBe(false);
  });

  it("debe iniciar sesión exitosamente", async () => {
    const mockUser = { id: "1", email: "test@test.com", nombre: "Test User", rol: "admin" };
    vi.mocked(authService.signIn).mockResolvedValue({ data: mockUser as any, error: null });

    const result = await useAuthStore.getState().signIn("test@test.com", "password");

    expect(result.error).toBeNull();
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it("debe manejar errores de inicio de sesión", async () => {
    vi.mocked(authService.signIn).mockResolvedValue({
      data: null,
      error: "Credenciales inválidas",
    });

    const result = await useAuthStore.getState().signIn("test@test.com", "wrong");

    expect(result.error).toBe("Credenciales inválidas");
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it("debe cerrar sesión correctamente", async () => {
    useAuthStore.setState({ user: { id: "1" } as any });
    vi.mocked(authService.signOut).mockResolvedValue();

    await useAuthStore.getState().signOut();

    expect(authService.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("debe inicializar el estado del usuario al arrancar", async () => {
    const mockUser = { id: "1", email: "test@test.com" };
    vi.mocked(authService.getCurrentUser).mockResolvedValue({ data: mockUser as any, error: null });

    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().initialized).toBe(true);
  });
});
