// Utilidad para probar la implementación de autenticación
// Este archivo puede ser removido en producción
import { ApiService, AuthService } from '../services';
import type { LoginRequest } from '../types';

// Función para probar la integración del login
export async function testAuthIntegration() {
  const apiService = new ApiService();
  const authService = new AuthService(apiService);

  // Test con credenciales de ejemplo
  const testCredentials: LoginRequest = {
    email: 'test@example.com',
    password: 'password123'
  };

  console.log('🧪 Probando validación de credenciales...');
  const validation = authService.validateCredentials(testCredentials);
  console.log('Validación:', validation);

  console.log('🧪 Probando validación con credenciales inválidas...');
  const invalidValidation = authService.validateCredentials({
    email: 'invalid-email',
    password: ''
  });
  console.log('Validación inválida:', invalidValidation);

  console.log('🧪 Verificando estado de autenticación...');
  const isAuth = authService.isAuthenticated();
  console.log('¿Está autenticado?:', isAuth);

  console.log('🧪 Obteniendo usuario actual...');
  const currentUser = await authService.getCurrentUser();
  console.log('Usuario actual:', currentUser);

  return {
    validation,
    invalidValidation,
    isAuthenticated: isAuth,
    currentUser
  };
}

// Función para limpiar datos de prueba
export function cleanTestData() {
  const authService = new AuthService(new ApiService());
  authService.removeToken();
  console.log('🧹 Datos de prueba limpiados');
}
