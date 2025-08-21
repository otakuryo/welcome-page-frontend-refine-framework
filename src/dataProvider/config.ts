// Configuración del Data Provider
export const DATA_PROVIDER_CONFIG = {
  // Recursos soportados
  SUPPORTED_RESOURCES: {
    USERS: "users",
    DEPARTMENTS: "departments",
    CARDS: "cards",
    WIFI: "wifi",
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
  
  // Campos de filtro soportados para departamentos
  DEPARTMENT_FILTER_FIELDS: {
    IS_ACTIVE: "isActive",
    SEARCH: "search",
    SORT_BY: "sortBy",
    SORT_ORDER: "sortOrder",
  },
  
  // Campos de filtro soportados para tarjetas
  CARD_FILTER_FIELDS: {
    TYPE: "type",
    IS_ACTIVE: "isActive",
    SORT_BY: "sortBy",
    SORT_ORDER: "sortOrder",
  },
  
  // Campos de filtro soportados para redes WiFi
  WIFI_FILTER_FIELDS: {
    IS_ACTIVE: "isActive",
    NETWORK_NAME: "networkName",
  },
} as const;

// Tipos de configuración
export type SupportedResource = typeof DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES[keyof typeof DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES];
export type FilterOperator = typeof DATA_PROVIDER_CONFIG.SUPPORTED_FILTER_OPERATORS[keyof typeof DATA_PROVIDER_CONFIG.SUPPORTED_FILTER_OPERATORS];
export type UserFilterField = typeof DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CONFIG.USER_FILTER_FIELDS];
export type DepartmentFilterField = typeof DATA_PROVIDER_CONFIG.DEPARTMENT_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CONFIG.DEPARTMENT_FILTER_FIELDS];
export type CardFilterField = typeof DATA_PROVIDER_CONFIG.CARD_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CONFIG.CARD_FILTER_FIELDS];
export type WifiFilterField = typeof DATA_PROVIDER_CONFIG.WIFI_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CONFIG.WIFI_FILTER_FIELDS];
