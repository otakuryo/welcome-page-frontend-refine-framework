// Manejador de errores para Data Provider Custom
import type { HttpError } from "@refinedev/core";

export class DataProviderCustomErrorHandler {
  /**
   * Convierte un error genérico a HttpError de Refine
   */
  static handleError(error: any, context?: string): never {
    console.error(`DataProviderCustom Error${context ? ` in ${context}` : ''}:`, error);

    // Si es un error de respuesta HTTP
    if (error.response) {
      const status = error.response.status || 500;
      const message = error.response.data?.message || error.message || "Error desconocido";
      
      const httpError: HttpError = {
        message,
        statusCode: status,
        errors: error.response.data
      };
      throw httpError;
    }

    // Si es un error de red
    if (error.request) {
      const httpError: HttpError = {
        message: "Error de conexión. Verifica tu conexión a internet.",
        statusCode: 0,
        errors: { originalError: error }
      };
      throw httpError;
    }

    // Error genérico
    const httpError: HttpError = {
      message: error.message || "Error inesperado en el data provider custom",
      statusCode: 500,
      errors: { originalError: error }
    };
    throw httpError;
  }

  /**
   * Maneja errores específicos de operaciones de departamentos de usuario
   */
  static handleUserDepartmentError(error: any, operation: string, userId?: string): never {
    const context = `user departments operation: ${operation}${userId ? ` for user ${userId}` : ''}`;
    
    // Errores específicos de departamentos de usuario
    if (error.response?.status === 404) {
      const message = operation.includes('get')
        ? `Usuario ${userId || 'especificado'} no encontrado o no tiene departamentos asignados`
        : "Departamento o usuario no encontrado";
      
      const httpError: HttpError = {
        message,
        statusCode: 404,
        errors: error.response.data
      };
      throw httpError;
    }

    if (error.response?.status === 409) {
      const httpError: HttpError = {
        message: "El usuario ya está asignado a este departamento",
        statusCode: 409,
        errors: error.response.data
      };
      throw httpError;
    }

    if (error.response?.status === 403) {
      const httpError: HttpError = {
        message: "No tienes permisos para realizar esta operación en departamentos",
        statusCode: 403,
        errors: error.response.data
      };
      throw httpError;
    }

    // Usar el manejador genérico para otros errores
    this.handleError(error, context);
  }

  /**
   * Maneja errores específicos de operaciones masivas
   */
  static handleBulkOperationError(error: any, operation: string, itemCount?: number): never {
    const context = `bulk operation: ${operation}${itemCount ? ` (${itemCount} items)` : ''}`;
    
    if (error.response?.status === 422) {
      const httpError: HttpError = {
        message: "Algunos elementos de la operación masiva contienen datos inválidos",
        statusCode: 422,
        errors: error.response.data
      };
      throw httpError;
    }

    if (error.response?.status === 207) {
      // Multi-status: algunas operaciones fallaron
      const httpError: HttpError = {
        message: "La operación masiva se completó parcialmente. Algunos elementos fallaron.",
        statusCode: 207,
        errors: error.response.data
      };
      throw httpError;
    }

    // Usar el manejador genérico para otros errores
    this.handleError(error, context);
  }

  /**
   * Maneja errores de validación con mensajes específicos
   */
  static handleValidationError(field: string, value: any, expectedType: string): never {
    const httpError: HttpError = {
      message: `Validation Error: El campo '${field}' debe ser de tipo ${expectedType}, recibido: ${typeof value}`,
      statusCode: 400,
      errors: {
        field,
        value,
        expectedType,
        type: 'validation_error'
      }
    };
    throw httpError;
  }
}
