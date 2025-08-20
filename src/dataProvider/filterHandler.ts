import type { CrudFilter, CrudOperators } from "@refinedev/core";
import type { UsersListQuery } from "../types/users";
import { DATA_PROVIDER_CONFIG } from "./config";

// Clase para manejar filtros del Data Provider
export class DataProviderFilterHandler {
  /**
   * Aplica filtros a la consulta de usuarios
   */
  static applyUserFilters(
    filters: CrudFilter[] | undefined, 
    query: UsersListQuery
  ): UsersListQuery {
    if (!filters) return query;

    filters.forEach((filter: CrudFilter) => {
      if (filter.operator === CrudOperators.EQ) {
        this.applyEqualsFilter(filter, query);
      } else if (filter.operator === CrudOperators.CONTAINS) {
        this.applyContainsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad
   */
  private static applyEqualsFilter(
    filter: CrudFilter, 
    query: UsersListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    switch (field) {
      case DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS.ROLE:
        if (value) {
          query.role = value as any;
        }
        break;
      
      case DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS.DEPARTMENT:
        if (value) {
          query.department = value as string;
        }
        break;
      
      case DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS.IS_ACTIVE:
        if (value !== undefined) {
          query.isActive = value ? "true" : "false";
        }
        break;
    }
  }

  /**
   * Aplica filtros de contenido
   */
  private static applyContainsFilter(
    filter: CrudFilter, 
    query: UsersListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    if (field === DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS.SEARCH && value) {
      query.search = value as string;
    }
  }

  /**
   * Crea una consulta base con paginación
   */
  static createBaseQuery(pagination?: { current?: number; pageSize?: number }): UsersListQuery {
    return {
      page: pagination?.current || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE,
      limit: pagination?.pageSize || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE_SIZE,
    };
  }
}
