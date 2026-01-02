import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services";
import type { Usuario } from "@/services";

interface AuthState {
  user: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, nombre: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Inicializar autenticación
  const initialize = async () => {
    try {
      set({ loading: true });
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        set({ loading: false });
        return;
      }

      if (session?.user) {
        const usuario: Usuario = {
          id: session.user.id,
          email: session.user.email || "",
          nombre:
            session.user.user_metadata?.nombre || session.user.email?.split("@")[0] || "Usuario",
          telefono: session.user.user_metadata?.telefono,
          avatar_url: session.user.user_metadata?.avatar_url,
          role: "vendedor",
        };
        set({ user: usuario, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("Error during auth initialization:", error);
      set({ loading: false });
    }
  };

  // Configurar listener de cambios de autenticación
  supabase.auth.onAuthStateChange(async (event, _session) => {
    if (event === "SIGNED_OUT") {
      set({ user: null });
    } else if (event === "SIGNED_IN" && _session?.user) {
      const usuario: Usuario = {
        id: _session.user.id,
        email: _session.user.email || "",
        nombre:
          _session.user.user_metadata?.nombre || _session.user.email?.split("@")[0] || "Usuario",
        telefono: _session.user.user_metadata?.telefono,
        avatar_url: _session.user.user_metadata?.avatar_url,
        role: "vendedor",
      };
      set({ user: usuario });
    }
  });

  return {
    user: null,
    loading: true,
    signIn: async (email: string, password: string) => {
      try {
        const result = await authService.signIn(email, password);

        if (result.error) {
          return { error: result.error };
        }

        if (result.data) {
          set({ user: result.data, loading: false });
        }

        return { error: null };
      } catch (error) {
        console.error("Sign in error:", error);
        return { error: "Error inesperado al iniciar sesión" };
      }
    },
    signUp: async (email: string, password: string, nombre: string) => {
      try {
        const result = await authService.signUp(email, password, nombre);

        if (result.error) {
          return { error: result.error };
        }

        return { error: null };
      } catch (error) {
        console.error("Sign up error:", error);
        return { error: "Error inesperado al registrarse" };
      }
    },
    signOut: async () => {
      try {
        await authService.signOut();
        set({ user: null });
      } catch (error) {
        console.error("Sign out error:", error);
      }
    },
    resetPassword: async (email: string) => {
      try {
        const result = await authService.resetPassword(email);
        return { error: result.error };
      } catch (error) {
        console.error("Reset password error:", error);
        return { error: "Error al enviar email de recuperación" };
      }
    },
    initialize,
  };
});

// Inicializar al cargar el store
if (typeof window !== "undefined") {
  useAuthStore.getState().initialize();
}
