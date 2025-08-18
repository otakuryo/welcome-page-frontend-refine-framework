// Servicio de autenticación que implementa la lógica específica de auth
// Dependency Inversion Principle: depende de la abstracción (ApiService)
import type { 
  LoginRequest, 
  LoginResponse, 
  AuthUser, 
  ApiError 
} from '../types/auth';
import { ApiService } from './apiService';

export class AuthService {
  private apiService: ApiService;
  private readonly TOKEN_KEY = 'refine-auth';

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async login(credentials: LoginRequest): Promise<{
    success: boolean;
    user?: AuthUser;
    token?: string;
    error?: ApiError;
  }> {
    try {
      const response = await this.apiService.post<LoginResponse>(
        '/auth/login',
        credentials
      );

      if (response.success && response.data) {
        // Guardar token en localStorage
        this.setToken(response.data.accessToken);
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.accessToken,
        };
      }

      return {
        success: false,
        error: {
          name: 'LoginError',
          status: 401,
          success: false,
          error: response.message || 'Error en el login',
          message: response.message || 'Error en el login',
          code: 'LOGIN_ERROR',
          statusCode: 401,
          errorId: 'LOGIN_ERROR',
          timestamp: new Date().toISOString(),
          details: undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error as ApiError,
      };
    }
  }

  async logout(): Promise<void> {
    this.removeToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Verificar si el token no ha expirado (JWT básico)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch {
      // Si no se puede parsear el token, considerarlo inválido
      this.removeToken();
      return false;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token || !this.isAuthenticated()) {
      return null;
    }

    try {
      // Aquí podrías hacer una llamada a la API para obtener los datos actuales del usuario
      // Por ahora, extraeremos la info básica del token
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        id: payload.sub || payload.userId || '',
        email: payload.email || '',
        username: payload.username || '',
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        role: payload.role || '',
        isActive: payload.isActive ?? true,
      };
    } catch {
      this.removeToken();
      return null;
    }
  }

  // Método para validar credenciales localmente antes de enviar
  validateCredentials(credentials: LoginRequest): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = [];

    if (!credentials.email) {
      errors.push('El email es requerido');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.push('El formato del email es inválido');
    }

    if (!credentials.password) {
      errors.push('La contraseña es requerida');
    } else if (credentials.password.length < 1) {
      errors.push('La contraseña no puede estar vacía');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
