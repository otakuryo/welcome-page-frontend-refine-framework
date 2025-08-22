// Configuración del Data Provider Custom
export const DATA_PROVIDER_CUSTOM_CONFIG = {
  // Recursos soportados específicos para funcionalidades custom
  SUPPORTED_RESOURCES: {
    USER_DEPARTMENTS: "user-departments",
    AVAILABLE_DEPARTMENTS: "available-departments",
    DEPARTMENT_ASSIGNMENTS: "department-assignments",
  },
  
  // Configuración de paginación por defecto
  DEFAULT_PAGINATION: {
    PAGE: 1,
    PAGE_SIZE: 100, // Para departamentos usamos un límite más alto por defecto
  },
  
  // Operadores de filtro soportados
  SUPPORTED_FILTER_OPERATORS: {
    EQUALS: "eq",
    CONTAINS: "contains",
    IN: "in",
  },
  
  // Campos de filtro soportados para departamentos de usuario
  USER_DEPARTMENTS_FILTER_FIELDS: {
    USER_ID: "userId",
    IS_HEAD: "isHead",
    IS_ACTIVE: "isActive",
    DEPARTMENT_ID: "departmentId",
  },
  
  // Campos de filtro soportados para departamentos disponibles
  AVAILABLE_DEPARTMENTS_FILTER_FIELDS: {
    IS_ACTIVE: "isActive",
    SEARCH: "search",
    EXCLUDE_USER: "excludeUser", // Para excluir departamentos ya asignados a un usuario
  },
  
  // Campos de filtro para asignaciones de departamento
  DEPARTMENT_ASSIGNMENTS_FILTER_FIELDS: {
    USER_ID: "userId",
    DEPARTMENT_IDS: "departmentIds",
    BULK_UPDATE: "bulkUpdate",
  },
  
  // Endpoints específicos
  ENDPOINTS: {
    USER_DEPARTMENTS: (userId: string) => `/users/${userId}/departments`,
    AVAILABLE_DEPARTMENTS: "/departments",
    ASSIGN_USER_TO_DEPARTMENT: (departmentId: string, userId: string) => `/departments/${departmentId}/users/${userId}`,
    REMOVE_USER_FROM_DEPARTMENT: (departmentId: string, userId: string) => `/departments/${departmentId}/users/${userId}`,
    BULK_UPDATE_USER_DEPARTMENTS: (userId: string) => `/users/${userId}/departments/bulk-update`,
  },
} as const;

// Tipos de configuración
export type CustomSupportedResource = typeof DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES[keyof typeof DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES];
export type CustomFilterOperator = typeof DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_FILTER_OPERATORS[keyof typeof DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_FILTER_OPERATORS];
export type UserDepartmentsFilterField = typeof DATA_PROVIDER_CUSTOM_CONFIG.USER_DEPARTMENTS_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CUSTOM_CONFIG.USER_DEPARTMENTS_FILTER_FIELDS];
export type AvailableDepartmentsFilterField = typeof DATA_PROVIDER_CUSTOM_CONFIG.AVAILABLE_DEPARTMENTS_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CUSTOM_CONFIG.AVAILABLE_DEPARTMENTS_FILTER_FIELDS];
export type DepartmentAssignmentsFilterField = typeof DATA_PROVIDER_CUSTOM_CONFIG.DEPARTMENT_ASSIGNMENTS_FILTER_FIELDS[keyof typeof DATA_PROVIDER_CUSTOM_CONFIG.DEPARTMENT_ASSIGNMENTS_FILTER_FIELDS];
