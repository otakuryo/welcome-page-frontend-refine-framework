import type { CrudFilter, CrudOperators } from "@refinedev/core";
import type { UsersListQuery } from "../types/users";
import type { DepartmentsListQuery } from "../types/departments";
import type { CardsListQuery } from "../types/cards";
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
   * Aplica filtros a la consulta de departamentos
   */
  static applyDepartmentFilters(
    filters: CrudFilter[] | undefined, 
    query: DepartmentsListQuery
  ): DepartmentsListQuery {
    if (!filters) return query;

    filters.forEach((filter: CrudFilter) => {
      if (filter.operator === CrudOperators.EQ) {
        this.applyDepartmentEqualsFilter(filter, query);
      } else if (filter.operator === CrudOperators.CONTAINS) {
        this.applyDepartmentContainsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad para departamentos
   */
  private static applyDepartmentEqualsFilter(
    filter: CrudFilter, 
    query: DepartmentsListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    switch (field) {
      case DATA_PROVIDER_CONFIG.DEPARTMENT_FILTER_FIELDS.IS_ACTIVE:
        if (value !== undefined) {
          query.isActive = value ? "true" : "false";
        }
        break;
      
      case DATA_PROVIDER_CONFIG.DEPARTMENT_FILTER_FIELDS.SORT_BY:
        if (value) {
          query.sortBy = value as "name" | "slug" | "createdAt" | "updatedAt";
        }
        break;
      
      case DATA_PROVIDER_CONFIG.DEPARTMENT_FILTER_FIELDS.SORT_ORDER:
        if (value) {
          query.sortOrder = value as "asc" | "desc";
        }
        break;
    }
  }

  /**
   * Aplica filtros de contenido para departamentos
   */
  private static applyDepartmentContainsFilter(
    filter: CrudFilter, 
    query: DepartmentsListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    if (field === DATA_PROVIDER_CONFIG.DEPARTMENT_FILTER_FIELDS.SEARCH && value) {
      query.search = value as string;
    }
  }

  /**
   * Crea una consulta base con paginación para usuarios
   */
  static createBaseQuery(pagination?: { current?: number; pageSize?: number }): UsersListQuery {
    return {
      page: pagination?.current || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE,
      limit: pagination?.pageSize || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE_SIZE,
    };
  }

  /**
   * Crea una consulta base con paginación para departamentos
   */
  static createBaseDepartmentQuery(pagination?: { current?: number; pageSize?: number }): DepartmentsListQuery {
    return {
      page: pagination?.current || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE,
      limit: pagination?.pageSize || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE_SIZE,
      isActive: "all",
    };
  }

  /**
   * Aplica filtros a la consulta de tarjetas
   */
  static applyCardFilters(
    filters: CrudFilter[] | undefined, 
    query: CardsListQuery
  ): CardsListQuery {
    if (!filters) return query;

    filters.forEach((filter: CrudFilter) => {
      if (filter.operator === CrudOperators.EQ) {
        this.applyCardEqualsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad para tarjetas
   */
  private static applyCardEqualsFilter(
    filter: CrudFilter, 
    query: CardsListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    switch (field) {
      case DATA_PROVIDER_CONFIG.CARD_FILTER_FIELDS.TYPE:
        if (value) {
          query.type = value as any;
        }
        break;
      
      case DATA_PROVIDER_CONFIG.CARD_FILTER_FIELDS.IS_ACTIVE:
        if (value !== undefined) {
          query.isActive = value ? "true" : "false";
        }
        break;
      
      case DATA_PROVIDER_CONFIG.CARD_FILTER_FIELDS.SORT_BY:
        if (value) {
          query.sortBy = value as any;
        }
        break;
      
      case DATA_PROVIDER_CONFIG.CARD_FILTER_FIELDS.SORT_ORDER:
        if (value) {
          query.sortOrder = value as any;
        }
        break;
    }
  }

  /**
   * Crea una consulta base con paginación para tarjetas
   */
  static createBaseCardQuery(pagination?: { current?: number; pageSize?: number }): CardsListQuery {
    return {
      page: pagination?.current || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE,
      limit: pagination?.pageSize || DATA_PROVIDER_CONFIG.DEFAULT_PAGINATION.PAGE_SIZE,
      isActive: "all",
    };
  }
}
