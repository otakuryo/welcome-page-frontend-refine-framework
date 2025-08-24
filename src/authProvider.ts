import type { AuthProvider } from "@refinedev/core";
import { ApiService } from "./services/apiService";
import { AuthService } from "./services/authService";
import type { LoginRequest } from "./types/auth";

// Dependency Injection: Creamos las instancias de los servicios
const apiService = new ApiService();
const authService = new AuthService(apiService);

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    // Validación de entrada
    if (!email || !password) {
      return {
        success: false,
        error: {
          name: "ValidationError",
          message: "Email y contraseña son requeridos",
        },
      };
    }

    const credentials: LoginRequest = { email, password };
    
    // Validación local antes de enviar
    const validation = authService.validateCredentials(credentials);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          name: "ValidationError",
          message: validation.errors.join(", "),
        },
      };
    }

    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
        error: result.error || {
          name: "LoginError",
          message: "Error desconocido durante el login",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "NetworkError",
          message: "Error de conexión. Intenta nuevamente.",
        },
      };
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      console.error("Error durante logout:", error);
      // Incluso si hay error, limpiar el token local
      authService.removeToken();
      return {
        success: true,
        redirectTo: "/login",
      };
    }
  },

  check: async () => {
    try {
      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        redirectTo: "/login",
      };
    } catch (error) {
      console.error("Error verificando autenticación:", error);
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    try {
      const user = await authService.getCurrentUser();
      return user?.data?.role || null;
    } catch (error) {
      console.error("Error obteniendo permisos:", error);
      return null;
    }
  },

  getIdentity: async () => {
    try {
      const user = await authService.getCurrentUser();
      return user?.data || null;
    } catch (error) {
      console.error("Error obteniendo identidad:", error);
      return null;
    }
  },

  onError: async (error) => {
    console.error("Auth Provider Error:", error);
    
    // Si es un error 401 (No autorizado), cerrar sesión
    if (error?.status === 401) {
      authService.removeToken();
      return {
        redirectTo: "/login",
        logout: true,
        error: {
          name: "UnauthorizedError",
          message: "Sesión expirada. Por favor, inicia sesión nuevamente.",
        },
      };
    }
    
    return { error };
  },
};
