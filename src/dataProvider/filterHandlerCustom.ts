// Manejador de filtros para Data Provider Custom
import type { CrudFilter, Pagination } from "@refinedev/core";
import type { 
  DepartmentsListQuery,
} from "../types/departments";
import { DATA_PROVIDER_CUSTOM_CONFIG } from "./configCustom";

export class DataProviderCustomFilterHandler {
  /**
   * Crea una query base para paginación
   */
  static createBaseQuery(pagination?: Pagination): { page: number; limit: number } {
    return {
      page: pagination?.current || DATA_PROVIDER_CUSTOM_CONFIG.DEFAULT_PAGINATION.PAGE,
      limit: pagination?.pageSize || DATA_PROVIDER_CUSTOM_CONFIG.DEFAULT_PAGINATION.PAGE_SIZE,
    };
  }

  /**
   * Crea una query base específica para departamentos disponibles
   */
  static createAvailableDepartmentsQuery(pagination?: Pagination): DepartmentsListQuery {
    return {
      page: pagination?.current || DATA_PROVIDER_CUSTOM_CONFIG.DEFAULT_PAGINATION.PAGE,
      limit: pagination?.pageSize || DATA_PROVIDER_CUSTOM_CONFIG.DEFAULT_PAGINATION.PAGE_SIZE,
      isActive: "true", // Por defecto solo departamentos activos
      sortBy: "name",
      sortOrder: "asc",
    };
  }

  /**
   * Aplica filtros específicos para departamentos disponibles
   */
  static applyAvailableDepartmentsFilters(
    filters?: CrudFilter[],
    baseQuery?: DepartmentsListQuery
  ): DepartmentsListQuery {
    const query = baseQuery || this.createAvailableDepartmentsQuery();

    if (!filters || filters.length === 0) {
      return query;
    }

    filters.forEach((filter) => {
      if (filter.operator === "eq") {
        switch (filter.field) {
          case DATA_PROVIDER_CUSTOM_CONFIG.AVAILABLE_DEPARTMENTS_FILTER_FIELDS.IS_ACTIVE:
            query.isActive = filter.value as "true" | "false" | "all";
            break;
        }
      } else if (filter.operator === "contains") {
        switch (filter.field) {
          case DATA_PROVIDER_CUSTOM_CONFIG.AVAILABLE_DEPARTMENTS_FILTER_FIELDS.SEARCH:
            query.search = filter.value as string;
            break;
        }
      }
    });

    return query;
  }

  /**
   * Crea filtros para obtener departamentos de un usuario específico
   */
  static createUserDepartmentsFilters(userId: string): { userId: string } {
    return { userId };
  }

  /**
   * Crea payload para actualización masiva de departamentos de usuario
   */
  static createBulkUpdatePayload(
    userId: string,
    departmentIds: string[]
  ): {
    userId: string;
    departmentIds: string[];
    action: "bulk-update";
  } {
    return {
      userId,
      departmentIds,
      action: "bulk-update",
    };
  }

  /**
   * Crea payload para asignación individual de departamento
   */
  static createAssignmentPayload(
    departmentId: string,
    userId: string,
    isHead: boolean = false,
    message?: string
  ): {
    departmentId: string;
    userId: string;
    isHead: boolean;
    message?: string;
  } {
    return {
      departmentId,
      userId,
      isHead,
      ...(message && { message }),
    };
  }

  /**
   * Extrae el userId de filtros o meta
   */
  static extractUserIdFromFilters(filters?: CrudFilter[], meta?: any): string | null {
    // Primero intentar desde meta
    if (meta?.userId) {
      return meta.userId as string;
    }

    // Luego desde filtros
    if (filters) {
      const userIdFilter = filters.find(
        filter => 'field' in filter && filter.field === DATA_PROVIDER_CUSTOM_CONFIG.USER_DEPARTMENTS_FILTER_FIELDS.USER_ID
      );
      if (userIdFilter && 'operator' in userIdFilter && userIdFilter.operator === "eq") {
        return userIdFilter.value as string;
      }
    }

    return null;
  }

  /**
   * Valida que los parámetros requeridos estén presentes
   */
  static validateRequiredParams(params: { userId?: string; departmentIds?: string[] }): void {
    if (!params.userId) {
      throw new Error("userId es requerido para operaciones de departamentos de usuario");
    }

    if (params.departmentIds && !Array.isArray(params.departmentIds)) {
      throw new Error("departmentIds debe ser un array");
    }
  }
}
