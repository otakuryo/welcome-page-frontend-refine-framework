// Exportaciones del Data Provider Custom
export { dataProviderCustom as default } from './dataProviderCustom';
export { dataProviderCustom } from './dataProviderCustom';

// Exportar configuraciones
export { DATA_PROVIDER_CUSTOM_CONFIG } from './configCustom';
export type {
  CustomSupportedResource,
  CustomFilterOperator,
  UserDepartmentsFilterField,
  AvailableDepartmentsFilterField,
  DepartmentAssignmentsFilterField,
} from './configCustom';

// Exportar manejadores
export { DataProviderCustomErrorHandler } from './errorHandlerCustom';
export { DataProviderCustomFilterHandler } from './filterHandlerCustom';

// Constantes útiles para el uso del data provider
export const CUSTOM_RESOURCES = {
  USER_DEPARTMENTS: "user-departments" as const,
  AVAILABLE_DEPARTMENTS: "available-departments" as const,
  DEPARTMENT_ASSIGNMENTS: "department-assignments" as const,
  DEPARTMENT_CARDS: "department-cards" as const,
  AVAILABLE_CARDS: "available-cards" as const,
  CARD_ASSIGNMENTS: "card-assignments" as const,
};

// Tipos de utilidad para TypeScript
export interface UserDepartmentsListParams {
  userId: string;
  pagination?: {
    current?: number;
    pageSize?: number;
  };
}

export interface DepartmentAssignmentParams {
  departmentId: string;
  userId: string;
  isHead?: boolean;
  message?: string;
}

export interface BulkUpdateParams {
  userId: string;
  departmentIds: string[];
  currentDepartments?: any[];
}

// Hooks personalizados de utilidad (opcional - para usar más adelante)
export const CUSTOM_HOOKS_CONFIG = {
  // Configuración para hooks personalizados que se pueden crear más adelante
  DEFAULT_NOTIFICATIONS: {
    SUCCESS: {
      UPDATE_DEPARTMENTS: {
        message: "Departamentos actualizados correctamente",
        type: "success" as const,
      },
      ASSIGN_DEPARTMENT: {
        message: "Usuario asignado al departamento correctamente",
        type: "success" as const,
      },
      REMOVE_DEPARTMENT: {
        message: "Usuario removido del departamento correctamente",
        type: "success" as const,
      },
    },
    ERROR: {
      UPDATE_DEPARTMENTS: {
        message: "Error al actualizar departamentos",
        type: "error" as const,
      },
      ASSIGN_DEPARTMENT: {
        message: "Error al asignar usuario al departamento",
        type: "error" as const,
      },
      REMOVE_DEPARTMENT: {
        message: "Error al remover usuario del departamento",
        type: "error" as const,
      },
      LOAD_DEPARTMENTS: {
        message: "Error al cargar departamentos",
        type: "error" as const,
      },
    },
  },
};
