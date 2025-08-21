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
import { DepartmentsService } from "../services/departmentsService";
import { AuthService } from "../services/authService";
import type {
  UsersListQuery,
  CreateUserRequest,
  UpdatePersonalInfoRequest,
  UpdateBasicInfoRequest,
  AdminBulkUpdateRequest,
} from "../types/users";
import type {
  DepartmentsListQuery,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "../types/departments";
import { DataProviderErrorHandler } from "./errorHandler";
import { DataProviderFilterHandler } from "./filterHandler";
import { DATA_PROVIDER_CONFIG } from "./config";

// Instancias de servicios
const apiService = new ApiService();
const usersService = new UsersService(apiService);
const departmentsService = new DepartmentsService(apiService);
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
        filteredQuery.isActive = "all";
        
        const response = await usersService.listUsers(filteredQuery, token || undefined);
        
        return {
          data: response.data as unknown as TData[],
          total: response.pagination.total,
        };
      }

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        const query = DataProviderFilterHandler.createBaseDepartmentQuery(pagination);
        const filteredQuery = DataProviderFilterHandler.applyDepartmentFilters(filters, query);
        
        const response = await departmentsService.listDepartments(filteredQuery, token || undefined);
        
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

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        const response = await departmentsService.getDepartmentById(String(id), token || undefined);
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

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        const departmentData = variables as CreateDepartmentRequest;
        const response = await departmentsService.createDepartment(departmentData, token || undefined);
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
        const updateData = variables as any;
        
        // Separar datos básicos del usuario e información personal
        const basicInfo: UpdateBasicInfoRequest = {};
        const personalInfo: UpdatePersonalInfoRequest = {};
        
        // Datos básicos del usuario
        if (updateData.email !== undefined) basicInfo.email = updateData.email;
        if (updateData.username !== undefined) basicInfo.username = updateData.username;
        if (updateData.firstName !== undefined) basicInfo.firstName = updateData.firstName;
        if (updateData.lastName !== undefined) basicInfo.lastName = updateData.lastName;
        if (updateData.role !== undefined) basicInfo.role = updateData.role;
        if (updateData.isActive !== undefined) basicInfo.isActive = updateData.isActive;
        
        // Información personal
        if (updateData.phone !== undefined) personalInfo.phone = updateData.phone;
        if (updateData.department !== undefined) personalInfo.department = updateData.department;
        if (updateData.position !== undefined) personalInfo.position = updateData.position;
        if (updateData.startDate !== undefined) personalInfo.startDate = updateData.startDate;
        if (updateData.birthDate !== undefined) personalInfo.birthDate = updateData.birthDate;
        if (updateData.emergencyContact !== undefined) personalInfo.emergencyContact = updateData.emergencyContact;
        if (updateData.currentMachine !== undefined) personalInfo.currentMachine = updateData.currentMachine;
        
        // Crear promesas para ambas actualizaciones si hay datos para actualizar
        const promises: Promise<any>[] = [];
        
        if (Object.keys(basicInfo).length > 0) {
          promises.push(usersService.updateBasicInfo(String(id), basicInfo, token || undefined));
        }
        
        if (Object.keys(personalInfo).length > 0) {
          promises.push(usersService.updatePersonalInfo(String(id), personalInfo, token || undefined));
        }
        
        // Si no hay nada que actualizar, devolver el usuario actual
        if (promises.length === 0) {
          const response = await usersService.getUserById(String(id), token || undefined);
          return {
            data: response.data as unknown as TData,
          };
        }
        
        // Ejecutar ambas actualizaciones en paralelo
        const responses = await Promise.all(promises);
        
        // Devolver los datos del usuario actualizado (del primer response que debe ser basicInfo)
        // Si solo se actualizó personalInfo, obtener los datos completos del usuario
        if (Object.keys(basicInfo).length > 0) {
          return {
            data: responses[0].data as unknown as TData,
          };
        } else {
          // Solo se actualizó información personal, obtener datos completos
          const userResponse = await usersService.getUserById(String(id), token || undefined);
          return {
            data: userResponse.data as unknown as TData,
          };
        }
      }

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        const updateData = variables as UpdateDepartmentRequest;
        const response = await departmentsService.updateDepartment(String(id), updateData, token || undefined);
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

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        // Para departamentos, realizamos eliminación física
        const response = await departmentsService.deleteDepartment(String(id), token || undefined);
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

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        const promises = ids.map(id => departmentsService.getDepartmentById(String(id), token || undefined));
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

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        const promises = variables.map((departmentData: any) => 
          departmentsService.createDepartment(departmentData as CreateDepartmentRequest, token || undefined)
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

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        // Para departamentos, actualizamos uno por uno ya que no hay bulk update en la API
        const promises = ids.map(id => 
          departmentsService.updateDepartment(String(id), variables as UpdateDepartmentRequest, token || undefined)
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

      if (resource === DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.DEPARTMENTS) {
        // Para departamentos, eliminamos uno por uno ya que no hay bulk delete en la API
        const promises = ids.map(id => 
          departmentsService.deleteDepartment(String(id), token || undefined)
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
      
      // Manejar reset de contraseña - path específico: /users/{id}/reset-password
      if (url?.match(/^\/users\/[^\/]+\/reset-password$/) && method === 'patch') {
        const urlParts = url.split('/');
        const userId = urlParts[2]; // /users/{id}/reset-password
        const { newPassword } = payload as { newPassword: string };
        
        const response = await usersService.resetPassword(userId, newPassword, token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      // Manejar obtener departamento por slug - path específico: /departments/slug/{slug}
      if (url?.match(/^\/departments\/slug\/[^\/]+$/) && method === 'get') {
        const urlParts = url.split('/');
        const slug = urlParts[3]; // /departments/slug/{slug}
        
        const response = await departmentsService.getDepartmentBySlug(slug, token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      // Manejar obtener mis departamentos - path específico: /departments/my-departments
      if (url === '/departments/my-departments' && method === 'get') {
        const response = await departmentsService.getMyDepartments(token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      // Manejar asignación de usuario a departamento - path específico: /departments/{id}/users/{userId}
      if (url?.match(/^\/departments\/[^\/]+\/users\/[^\/]+$/) && method === 'post') {
        const urlParts = url.split('/');
        const departmentId = urlParts[2]; // /departments/{id}/users/{userId}
        const userId = urlParts[4];
        
        const response = await departmentsService.assignUserToDepartment(
          departmentId, 
          userId, 
          payload as any, 
          token || undefined
        );
        return {
          data: response.data as unknown as TData,
        };
      }

      // Manejar remoción de usuario de departamento - path específico: /departments/{id}/users/{userId}
      if (url?.match(/^\/departments\/[^\/]+\/users\/[^\/]+$/) && method === 'delete') {
        const urlParts = url.split('/');
        const departmentId = urlParts[2]; // /departments/{id}/users/{userId}
        const userId = urlParts[4];
        
        const response = await departmentsService.removeUserFromDepartment(
          departmentId, 
          userId, 
          token || undefined
        );
        return {
          data: response.data as unknown as TData,
        };
      }

      // Manejar obtener tarjetas de departamento - path específico: /departments/{id}/cards
      if (url?.match(/^\/departments\/[^\/]+\/cards$/) && method === 'get') {
        const urlParts = url.split('/');
        const departmentId = urlParts[2]; // /departments/{id}/cards
        
        const response = await departmentsService.getDepartmentCards(departmentId, token || undefined);
        return {
          data: response.data as unknown as TData,
        };
      }

      // Manejar asignación de tarjeta a departamento - path específico: /departments/{id}/cards/{cardId}
      if (url?.match(/^\/departments\/[^\/]+\/cards\/[^\/]+$/) && method === 'post') {
        const urlParts = url.split('/');
        const departmentId = urlParts[2]; // /departments/{id}/cards/{cardId}
        const cardId = urlParts[4];
        
        const response = await departmentsService.assignCardToDepartment(
          departmentId, 
          cardId, 
          payload as any, 
          token || undefined
        );
        return {
          data: response.data as unknown as TData,
        };
      }

      // Manejar remoción de tarjeta de departamento - path específico: /departments/{id}/cards/{cardId}
      if (url?.match(/^\/departments\/[^\/]+\/cards\/[^\/]+$/) && method === 'delete') {
        const urlParts = url.split('/');
        const departmentId = urlParts[2]; // /departments/{id}/cards/{cardId}
        const cardId = urlParts[4];
        
        const response = await departmentsService.removeCardFromDepartment(
          departmentId, 
          cardId, 
          token || undefined
        );
        return {
          data: response.data as unknown as TData,
        };
      }
      
      // Aquí puedes implementar otras operaciones personalizadas
      throw new Error("Operación personalizada no implementada");
    } catch (error) {
      throw DataProviderErrorHandler.handleError(error);
    }
  },
};
