import type { HttpError } from "@refinedev/core";

// Clase para manejar errores del Data Provider
export class DataProviderErrorHandler {
  /**
   * Convierte cualquier error en un HttpError estándar de Refine
   */
  static handleError(error: unknown): HttpError {
    if (error instanceof Error) {
      return {
        message: error.message,
        statusCode: 500,
      };
    }
    
    return {
      message: "Error desconocido",
      statusCode: 500,
    };
  }

  /**
   * Maneja errores específicos de recursos no soportados
   */
  static handleUnsupportedResource(resource: string): HttpError {
    return {
      message: `Recurso no soportado: ${resource}`,
      statusCode: 400,
    };
  }

  /**
   * Maneja errores de autenticación
   */
  static handleAuthenticationError(): HttpError {
    return {
      message: "Error de autenticación: Token no válido",
      statusCode: 401,
    };
  }

  /**
   * Maneja errores de validación
   */
  static handleValidationError(message: string): HttpError {
    return {
      message: `Error de validación: ${message}`,
      statusCode: 400,
    };
  }
}
