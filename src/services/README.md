# Servicios de Autenticación - Implementación SOLID

Esta implementación sigue los principios SOLID para crear un sistema de autenticación modular y mantenible.

## Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
- **`ApiService`**: Se encarga únicamente de las comunicaciones HTTP
- **`AuthService`**: Maneja solo la lógica de autenticación
- **`authProvider`**: Actúa como adaptador entre Refine y nuestros servicios

### 2. Open/Closed Principle (OCP)
- Los servicios están abiertos para extensión pero cerrados para modificación
- Se pueden agregar nuevos métodos sin cambiar la funcionalidad existente

### 3. Liskov Substitution Principle (LSP)
- Las interfaces están bien definidas y pueden ser implementadas por diferentes clases
- Los tipos TypeScript garantizan el cumplimiento de contratos

### 4. Interface Segregation Principle (ISP)
- Los tipos están divididos en interfaces específicas (`LoginRequest`, `AuthUser`, etc.)
- No hay dependencias en métodos que no se usan

### 5. Dependency Inversion Principle (DIP)
- `AuthService` depende de la abstracción `ApiService`, no de implementaciones concretas
- Inyección de dependencias mediante constructor

## Estructura de Archivos

```
src/
├── types/
│   ├── auth.ts          # Interfaces y tipos para autenticación
│   └── index.ts         # Barrel exports
├── services/
│   ├── apiService.ts    # Servicio genérico para HTTP
│   ├── authService.ts   # Servicio específico de autenticación
│   ├── index.ts         # Barrel exports
│   └── README.md        # Esta documentación
├── utils/
│   └── authTest.ts      # Utilidades de prueba (remover en producción)
└── authProvider.ts      # Provider de Refine actualizado
```

## Uso

### Importaciones
```typescript
import { ApiService, AuthService } from './services';
import type { LoginRequest, AuthUser } from './types';
```

### Ejemplo de uso directo
```typescript
const apiService = new ApiService();
const authService = new AuthService(apiService);

const result = await authService.login({
  email: 'usuario@ejemplo.com',
  password: 'password123'
});
```

## Características

- ✅ Validación de credenciales
- ✅ Manejo robusto de errores
- ✅ Verificación de tokens JWT
- ✅ Limpieza automática de tokens expirados
- ✅ Tipos TypeScript completos
- ✅ Integración con Refine
- ✅ Principios SOLID

## API Endpoints

- `POST /api/v1/auth/login` - Iniciar sesión
- Espera: `{ email: string, password: string }`
- Retorna: `{ success: boolean, data: { user: AuthUser, accessToken: string } }`

## Notas de Seguridad

- Los tokens se almacenan en localStorage
- Se verifica la expiración de tokens automáticamente
- Los errores 401 limpian automáticamente la sesión
- Validación de entrada en cliente y servidor
