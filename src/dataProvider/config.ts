// Configuración del Data Provider
export const DATA_PROVIDER_CONFIG = {
  // Recursos soportados
  SUPPORTED_RESOURCES: {
    USERS: "users",
  },
  
  // Configuración de paginación por defecto
  DEFAULT_PAGINATION: {
    PAGE: 1,
    PAGE_SIZE: 10,
  },
  
  // Operadores de filtro soportados
  SUPPORTED_FILTER_OPERATORS: {
    EQUALS: "eq",
    CONTAINS: "contains",
  },
  
  // Campos de filtro soportados para usuarios
  USER_FILTER_FIELDS: {
    ROLE: "role",
    DEPARTMENT: "department",
    IS_ACTIVE: "isActive",
    SEARCH: "search",
  },
} as const;

// Tipos de configuración
export type SupportedResource = typeof DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES[keyof typeof DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES];
export type FilterOperator = typeof DATA_PROVIDER_CONFIG.SUPPORTED_FILTER_OPERATORS[keyof typeof DATA_PROVIDER_CONFIG.SUPPORTED_FILTER_OPERATORS];
export type UserFilterField = typeof DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS];
