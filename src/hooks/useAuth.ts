// Hook de compatibilidad para mantener el uso existente de useAuth
// Internamente usa el store de Zustand
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, loading, signIn, signUp, signOut, resetPassword } = useAuthStore();

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
