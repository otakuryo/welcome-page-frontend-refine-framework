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
  GetManyParams,
  GetManyResponse,
  CreateManyParams,
  CreateManyResponse,
  UpdateManyParams,
  UpdateManyResponse,
  DeleteManyParams,
  DeleteManyResponse,
  CustomParams,
  CustomResponse
} from "@refinedev/core";
import { ApiService } from "../services/apiService";
import { UsersService } from "../services/usersService";
import { AuthService } from "../services/authService";
import type {
  UsersListQuery,
  CreateUserRequest,
  UpdatePersonalInfoRequest,
  AdminBulkUpdateRequest,
} from "../types/users";
import { DataProviderErrorHandler } from "./errorHandler";
import { DataProviderFilterHandler } from "./filterHandler";
import { DATA_PROVIDER_CONFIG } from "./config";

// Instancias de servicios
const apiService = new ApiService();
const usersService = new UsersService(apiService);
const authService = new AuthService(apiService);

export const dataProvider: DataProvider = {
  // Método para obtener lista de recursos
  getList: async <TData extends BaseRecord = BaseRecord>({ 
    resource, 
    pagination, 
    filters, 
    sorters, 
    meta 
  }: GetListParams): Promise<GetListResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        const query = DataProviderFilterHandler.createBaseQuery(pagination);
        const filteredQuery = DataProviderFilterHandler.applyUserFilters(filters, query);
        
        const response = await usersService.listUsers(filteredQuery, token || undefined);
        
        return {
          data: response.data as unknown as TData[],
          total: response.pagination.total,
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para obtener un recurso específico
  getOne: async <TData extends BaseRecord = BaseRecord>({ 
    resource, 
    id, 
    meta 
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        const response = await usersService.getUserById(String(id), token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para crear un recurso
  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    variables, 
    meta 
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        const userData = variables as CreateUserRequest;
        const response = await usersService.createUser(userData, token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para actualizar un recurso
  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    id, 
    variables, 
    meta 
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        // Determinar qué tipo de actualización realizar basado en los campos
        const updateData = variables as any;
        
        if (updateData.role !== undefined) {
          const response = await usersService.updateRole(String(id), { role: updateData.role }, token || undefined);
          return {
            data: response.data as unknown as TData,
          };
        }
        
        if (updateData.isActive !== undefined) {
          const response = await usersService.updateStatus(String(id), { isActive: updateData.isActive }, token || undefined);
          return {
            data: response.data as unknown as TData,
          };
        }
        
        // Actualización de información personal
        const personalInfo: UpdatePersonalInfoRequest = {};
        if (updateData.phone !== undefined) personalInfo.phone = updateData.phone;
        if (updateData.department !== undefined) personalInfo.department = updateData.department;
        if (updateData.position !== undefined) personalInfo.position = updateData.position;
        if (updateData.startDate !== undefined) personalInfo.startDate = updateData.startDate;
        if (updateData.birthDate !== undefined) personalInfo.birthDate = updateData.birthDate;
        if (updateData.emergencyContact !== undefined) personalInfo.emergencyContact = updateData.emergencyContact;
        if (updateData.currentMachine !== undefined) personalInfo.currentMachine = updateData.currentMachine;
        
        const response = await usersService.updatePersonalInfo(String(id), personalInfo, token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para eliminar un recurso
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    id, 
    meta 
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        // Implementar eliminación de usuario si es necesario
        // Por ahora, solo desactivamos el usuario
        const response = await usersService.updateStatus(String(id), { isActive: false }, token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para obtener múltiples recursos
  getMany: async <TData extends BaseRecord = BaseRecord>({ 
    resource, 
    ids, 
    meta 
  }: GetManyParams): Promise<GetManyResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        const promises = ids.map(id => usersService.getUserById(String(id), token || undefined));
        const responses = await Promise.all(promises);
        
        return {
          data: responses.map(response => response.data as unknown as TData),
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para crear múltiples recursos
  createMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    variables, 
    meta 
  }: CreateManyParams<TVariables>): Promise<CreateManyResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        const promises = variables.map((userData: any) => 
          usersService.createUser(userData as CreateUserRequest, token || undefined)
        );
        const responses = await Promise.all(promises);
        
        return {
          data: responses.map(response => response.data as unknown as TData),
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para actualizar múltiples recursos
  updateMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    ids, 
    variables, 
    meta 
  }: UpdateManyParams<TVariables>): Promise<UpdateManyResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        const bulkUpdateData: AdminBulkUpdateRequest = {
          userIds: ids.map(id => String(id)),
          action: "updateRole",
          data: variables as any,
        };
        
        const response = await usersService.adminBulkUpdate(bulkUpdateData, token || undefined);
        return {
          data: response.data as unknown as TData[],
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para eliminar múltiples recursos
  deleteMany: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    resource, 
    ids, 
    meta 
  }: DeleteManyParams<TVariables>): Promise<DeleteManyResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.USERS) {
        const bulkUpdateData: AdminBulkUpdateRequest = {
          userIds: ids.map(id => String(id)),
          action: "deactivate",
        };
        
        const response = await usersService.adminBulkUpdate(bulkUpdateData, token || undefined);
        return {
          data: response.data as unknown as TData[],
        };
      }

      throw DataProviderErrorHandler.handleUnsupportedResource(resource);
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },

  // Método para obtener la URL de la API
  getApiUrl: () => {
    return apiService.getApiUrl();
  },

  // Método para operaciones personalizadas
  custom: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ 
    url, 
    method, 
    filters, 
    sorters, 
    payload, 
    query, 
    headers 
  }: CustomParams): Promise<CustomResponse<TData>> => {
    try {
      const token = authService.getToken();
      
      // Aquí puedes implementar operaciones personalizadas
      // Por ejemplo, llamadas específicas que no encajan en los métodos estándar
      
      throw new Error("Operación personalizada no implementada");
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },
};
