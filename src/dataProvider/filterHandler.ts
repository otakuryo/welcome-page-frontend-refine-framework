import type { CrudFilter, LogicalFilter } from "@refinedev/core";
import type { UsersListQuery } from "../types/users";
import type { DepartmentsListQuery } from "../types/departments";
import type { CardsListQuery } from "../types/cards";
import type { WifiListQuery } from "../types/wifi";
import type { QuickLinksListQuery } from "../types/quicklinks";
import { DATA_PROVIDER_CONFIG } from "./config";

export const CRUD_OPERATORS = {
  EQ: "eq",
  CONTAINS: "contains",
};

// Clase para manejar filtros del Data Provider
export class DataProviderFilterHandler {
  /**
   * Aplica filtros a la consulta de usuarios
   */
  static applyUserFilters(
    filters: LogicalFilter[] | undefined, 
    query: UsersListQuery
  ): UsersListQuery {
    if (!filters) return query;

    filters.forEach((filter: LogicalFilter) => {
      if (filter.operator === CRUD_OPERATORS.EQ) {
        this.applyEqualsFilter(filter, query);
      } else if (filter.operator === CRUD_OPERATORS.CONTAINS) {
        this.applyContainsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad
   */
  private static applyEqualsFilter(
    filter: LogicalFilter, 
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
    filter: LogicalFilter, 
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
    filters: LogicalFilter[] | undefined, 
    query: DepartmentsListQuery
  ): DepartmentsListQuery {
    if (!filters) return query;

    filters.forEach((filter: LogicalFilter) => {
      if (filter.operator === CRUD_OPERATORS.EQ) {
        this.applyDepartmentEqualsFilter(filter, query);
      } else if (filter.operator === CRUD_OPERATORS.CONTAINS) {
        this.applyDepartmentContainsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad para departamentos
   */
  private static applyDepartmentEqualsFilter(
    filter: LogicalFilter, 
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
    filter: LogicalFilter,
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
    filters: LogicalFilter[] | undefined, 
    query: CardsListQuery
  ): CardsListQuery {
    if (!filters) return query;

    filters.forEach((filter: LogicalFilter) => {
      if (filter.operator === CRUD_OPERATORS.EQ) {
        this.applyCardEqualsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad para tarjetas
   */
  private static applyCardEqualsFilter(
    filter: LogicalFilter, 
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

  /**
   * Aplica filtros a la consulta de redes WiFi
   */
  static applyWifiFilters(
    filters: LogicalFilter[] | undefined, 
    query: WifiListQuery
  ): WifiListQuery {
    if (!filters) return query;

    filters.forEach((filter: LogicalFilter) => {
      if (filter.operator === CRUD_OPERATORS.EQ) {
        this.applyWifiEqualsFilter(filter, query);
      } else if (filter.operator === CRUD_OPERATORS.CONTAINS) {
        this.applyWifiContainsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad para redes WiFi
   */
  private static applyWifiEqualsFilter(
    filter: LogicalFilter, 
    query: WifiListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    switch (field) {
      case DATA_PROVIDER_CONFIG.WIFI_FILTER_FIELDS.IS_ACTIVE:
        if (value !== undefined) {
          query.isActive = value ? "true" : "false";
        }
        break;
    }
  }

  /**
   * Aplica filtros de contenido para redes WiFi
   */
  private static applyWifiContainsFilter(
    filter: LogicalFilter, 
    query: WifiListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    if (field === DATA_PROVIDER_CONFIG.WIFI_FILTER_FIELDS.NETWORK_NAME && value) {
      query.networkName = value as string;
    }
  }

  /**
   * Crea una consulta base para redes WiFi
   */
  static createBaseWifiQuery(): WifiListQuery {
    return {
      isActive: "all",
    };
  }

  /**
   * Aplica filtros a la consulta de enlaces rápidos
   */
  static applyQuickLinksFilters(
    filters: LogicalFilter[] | undefined, 
    query: QuickLinksListQuery
  ): QuickLinksListQuery {
    if (!filters) return query;

    filters.forEach((filter: LogicalFilter) => {
      if (filter.operator === CRUD_OPERATORS.EQ) {
        this.applyQuickLinksEqualsFilter(filter, query);
      } else if (filter.operator === CRUD_OPERATORS.CONTAINS) {
        this.applyQuickLinksContainsFilter(filter, query);
      }
    });

    return query;
  }

  /**
   * Aplica filtros de igualdad para enlaces rápidos
   */
  private static applyQuickLinksEqualsFilter(
    filter: LogicalFilter, 
    query: QuickLinksListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    switch (field) {
      case DATA_PROVIDER_CONFIG.QUICK_LINKS_FILTER_FIELDS.IS_ACTIVE:
        if (value !== undefined) {
          query.isActive = value ? "true" : "false";
        }
        break;
      
      case DATA_PROVIDER_CONFIG.QUICK_LINKS_FILTER_FIELDS.CATEGORY:
        if (value) {
          query.category = value as string;
        }
        break;
    }
  }

  /**
   * Aplica filtros de contenido para enlaces rápidos
   */
  private static applyQuickLinksContainsFilter(
    filter: LogicalFilter, 
    query: QuickLinksListQuery
  ): void {
    const field = filter.field as string;
    const value = filter.value;

    if (field === DATA_PROVIDER_CONFIG.QUICK_LINKS_FILTER_FIELDS.CATEGORY && value) {
      query.category = value as string;
    }
  }

  /**
   * Crea una consulta base para enlaces rápidos
   */
  static createBaseQuickLinksQuery(): QuickLinksListQuery {
    return {
      isActive: "all",
    };
  }
}
