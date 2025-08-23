import type { 
  DataProvider, 
  BaseRecord,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  CreateParams,
  CreateResponse,
  UpdateParams,
  UpdateResponse,
  DeleteOneParams,
  DeleteOneResponse,
  CustomParams,
  CustomResponse
} from "@refinedev/core";
import { ApiService } from "../services/apiService";
import { DepartmentsService } from "../services/departmentsService";
import { UserDepartmentsService } from "../services/userDepartmentsService";
import { AuthService } from "../services/authService";
import type {
  DepartmentListItem,
  MyDepartment,
  UserDepartmentAssignment,
} from "../types/departments";
import { DataProviderCustomErrorHandler } from "./errorHandlerCustom";
import { DataProviderCustomFilterHandler } from "./filterHandlerCustom";
import { DATA_PROVIDER_CUSTOM_CONFIG } from "./configCustom";

// Instancias de servicios especializados
const apiService = new ApiService();
const departmentsService = new DepartmentsService(apiService);
const userDepartmentsService = new UserDepartmentsService(departmentsService);
const authService = new AuthService(apiService);

export const dataProviderCustom: DataProvider = {
  // ✅ GET LIST - Obtener listas de recursos
  getList: async <TData extends BaseRecord = BaseRecord>({ 
    resource, 
    pagination, 
    filters, 
    sorters, 
    meta 
  }: GetListParams): Promise<GetListResponse<TData>> => {
    try {
      const token = authService.getToken();

      // 🎯 Obtener departamentos disponibles
      if (resource === DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES.AVAILABLE_DEPARTMENTS) {
        const query = DataProviderCustomFilterHandler.createAvailableDepartmentsQuery(pagination);
        const filteredQuery = DataProviderCustomFilterHandler.applyAvailableDepartmentsFilters(filters, query);
        
        const response = await userDepartmentsService.getAvailableDepartments();
        
        return {
          data: response as unknown as TData[],
          total: response.length, // Para departamentos disponibles, el total es la longitud del array
        };
      }

      // 🎯 Obtener departamentos de un usuario específico
      if (resource === DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES.USER_DEPARTMENTS) {
        const userId = DataProviderCustomFilterHandler.extractUserIdFromFilters(filters, meta);
        
        if (!userId) {
          DataProviderCustomErrorHandler.handleValidationError("userId", userId, "string");
        }

        DataProviderCustomFilterHandler.validateRequiredParams({ userId });
        
        const response = await userDepartmentsService.getUserDepartments(userId);
        
        return {
          data: response as unknown as TData[],
          total: response.length,
        };
      }

      throw new Error(`Recurso no soportado: ${resource}`);
    } catch (error) {
      DataProviderCustomErrorHandler.handleError(error, `getList for resource: ${resource}`);
    }
  },

  // ✅ GET ONE - Obtener un recurso específico (no implementado para este caso de uso)
  getOne: async <TData extends BaseRecord = BaseRecord>({ 
    resource, 
    id, 
    meta 
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    throw new Error(`getOne no está implementado para el recurso: ${resource}`);
  },

  // ✅ CREATE - Crear nuevo recurso (asignación de departamento)
  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    variables, 
    meta 
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    try {
      const token = authService.getToken();

      // 🎯 Asignar usuario a departamento
      if (resource === DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES.DEPARTMENT_ASSIGNMENTS) {
        const { departmentId, userId, isHead = false, message } = variables as any;
        
        DataProviderCustomFilterHandler.validateRequiredParams({ userId });
        
        if (!departmentId) {
          DataProviderCustomErrorHandler.handleValidationError("departmentId", departmentId, "string");
        }

        const payload = DataProviderCustomFilterHandler.createAssignmentPayload(
          departmentId, 
          userId, 
          isHead, 
          message
        );
        
        const response = await userDepartmentsService.assignUserToDepartment(
          departmentId,
          userId,
          { isHead, message }
        );
        
        return {
          data: response as unknown as TData,
        };
      }

      throw new Error(`Recurso no soportado para create: ${resource}`);
    } catch (error) {
      DataProviderCustomErrorHandler.handleUserDepartmentError(error, 'create', (variables as any)?.userId);
    }
  },

  // ✅ UPDATE - Actualizar recurso (actualización masiva de departamentos)
  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    id, 
    variables, 
    meta 
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    try {
      const token = authService.getToken();

      // 🎯 Actualización masiva de departamentos de usuario
      if (resource === DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES.USER_DEPARTMENTS) {
        const userId = String(id);
        const { departmentIds, currentDepartments } = variables as any;
        
        DataProviderCustomFilterHandler.validateRequiredParams({ userId, departmentIds });
        
        const response = await userDepartmentsService.updateUserDepartments(
          userId,
          currentDepartments || [],
          departmentIds
        );
        
        return {
          data: response as unknown as TData,
        };
      }

      throw new Error(`Recurso no soportado para update: ${resource}`);
    } catch (error) {
      DataProviderCustomErrorHandler.handleUserDepartmentError(error, 'update', String(id));
    }
  },

  // ✅ DELETE ONE - Eliminar asignación de departamento
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    id, 
    variables, 
    meta 
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    try {
      const token = authService.getToken();

      // 🎯 Remover usuario de departamento
      if (resource === DATA_PROVIDER_CUSTOM_CONFIG.SUPPORTED_RESOURCES.DEPARTMENT_ASSIGNMENTS) {
        const { departmentId, userId } = variables as any;
        
        DataProviderCustomFilterHandler.validateRequiredParams({ userId });
        
        if (!departmentId) {
          DataProviderCustomErrorHandler.handleValidationError("departmentId", departmentId, "string");
        }
        
        await userDepartmentsService.removeUserFromDepartment(departmentId, userId);
        
        return {
          data: { id, departmentId, userId } as unknown as TData,
        };
      }

      throw new Error(`Recurso no soportado para deleteOne: ${resource}`);
    } catch (error) {
      DataProviderCustomErrorHandler.handleUserDepartmentError(error, 'deleteOne', (variables as any)?.userId);
    }
  },

  // ✅ GET MANY - No implementado para este caso de uso
  getMany: async ({ resource, ids, meta }) => {
    throw new Error(`getMany no está implementado para el recurso: ${resource}`);
  },

  // ✅ CREATE MANY - No implementado para este caso de uso
  createMany: async ({ resource, variables, meta }) => {
    throw new Error(`createMany no está implementado para el recurso: ${resource}`);
  },

  // ✅ UPDATE MANY - No implementado para este caso de uso
  updateMany: async ({ resource, ids, variables, meta }) => {
    throw new Error(`updateMany no está implementado para el recurso: ${resource}`);
  },

  // ✅ DELETE MANY - No implementado para este caso de uso
  deleteMany: async ({ resource, ids, variables, meta }) => {
    throw new Error(`deleteMany no está implementado para el recurso: ${resource}`);
  },

  // ✅ CUSTOM - Operaciones personalizadas
  custom: async <TData extends BaseRecord = BaseRecord>({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
    meta,
  }: CustomParams): Promise<CustomResponse<TData>> => {
    try {
      const token = authService.getToken() || '';

      // 🎯 Endpoint personalizado para obtener departamentos de usuario por ID
      if (url?.match(/^\/users\/[^\/]+\/departments$/) && method === 'get') {
        const urlParts = url.split('/');
        const userId = urlParts[2]; // /users/{userId}/departments
        
        DataProviderCustomFilterHandler.validateRequiredParams({ userId });
        
        const response = await userDepartmentsService.getUserDepartments(userId);
        return {
          data: response as unknown as TData,
        };
      }

      // 🎯 Endpoint personalizado para actualización masiva
      if (url?.match(/^\/users\/[^\/]+\/departments\/bulk-update$/) && method === 'put') {
        const urlParts = url.split('/');
        const userId = urlParts[2]; // /users/{userId}/departments/bulk-update
        const { departmentIds, currentDepartments } = payload as any;
        
        DataProviderCustomFilterHandler.validateRequiredParams({ userId, departmentIds });
        
        const response = await userDepartmentsService.updateUserDepartments(
          userId,
          currentDepartments || [],
          departmentIds
        );
        
        return {
          data: response as unknown as TData,
        };
      }

      // 🎯 Endpoint para obtener departamentos disponibles
      if (url === '/departments/available' && method === 'get') {
        const response = await userDepartmentsService.getAvailableDepartments();
        return {
          data: response as unknown as TData,
        };
      }

      // 🎯 Endpoint para obtener tarjetas disponibles de un departamento
      if (url?.match(/^\/departments\/[^\/]+\/cards$/) && method === 'get') {
        let departmentId = meta?.id;

        if(!departmentId) {
          const urlParts = url.split('/');
          departmentId = urlParts[2];
        }

        const response = await departmentsService.getDepartmentCards(departmentId, token);
        return {
          data: response.data as unknown as TData,
        };
      }

      throw new Error(`Endpoint custom no soportado: ${method?.toUpperCase()} ${url}`);
    } catch (error) {
      DataProviderCustomErrorHandler.handleError(error, `custom endpoint: ${method?.toUpperCase()} ${url}`);
    }
  },

  // ✅ GET API URL - Construir URL de la API
  getApiUrl: () => {
    return import.meta.env.REACT_APP_API_URL || "http://localhost:3001/api";
  },
};

export default dataProviderCustom;
