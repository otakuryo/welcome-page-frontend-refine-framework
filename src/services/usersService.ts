// Servicio de Usuarios (SRP) que encapsula la comunicación con la API de Users
// Depende de ApiService (DIP)
import { ApiService } from './apiService';
import type {
  ApiPaginatedResponse,
  UsersListItem,
  UsersListQuery,
  UserDetailed,
  UpdatePersonalInfoRequest,
  UpdateRoleRequest,
  UpdateStatusRequest,
  UpdateBasicInfoRequest,
  AdminBulkUpdateRequest,
  UserPersonalInfo,
  CreateUserRequest,
} from '../types/users';
import type { ApiResponse } from '../types/auth';

export class UsersService {
  private readonly api: ApiService;

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  async listUsers(
    query: UsersListQuery = {},
    token?: string
  ): Promise<ApiPaginatedResponse<UsersListItem[]>> {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.role) params.set('role', String(query.role));
    if (query.department) params.set('department', query.department);
    if (query.search) params.set('search', query.search);
    if (query.isActive) params.set('isActive', query.isActive);

    const endpoint = `/users/${params.toString() ? `?${params.toString()}` : ''}`;
    return this.api.get<ApiPaginatedResponse<UsersListItem[]>>(endpoint, token);
  }

  async getMe(
    token?: string
  ): Promise<ApiResponse<UserDetailed>> {
    return this.api.get<ApiResponse<UserDetailed>>(`/auth/me`, token);
  }

  async getUserById(
    id: string,
    token?: string
  ): Promise<ApiResponse<UserDetailed>> {
    return this.api.get<ApiResponse<UserDetailed>>(`/users/${id}`, token);
  }

  async createUser(
    data: CreateUserRequest,
    token?: string
  ): Promise<ApiResponse<UserDetailed>> {
    return this.api.post<ApiResponse<UserDetailed>>(`/users/create`, data, token);
  }

  async updateBasicInfo(
    id: string,
    data: UpdateBasicInfoRequest,
    token?: string
  ): Promise<ApiResponse<UserDetailed>> {
    return this.api.patch<ApiResponse<UserDetailed>>(
      `/users/${id}/update`,
      data,
      token
    );
  }

  async updatePersonalInfo(
    id: string,
    data: UpdatePersonalInfoRequest,
    token?: string
  ): Promise<ApiResponse<UserPersonalInfo>> {
    return this.api.patch<ApiResponse<UserPersonalInfo>>(
      `/users/${id}/personal-info`,
      data,
      token
    );
  }

  async updateRole(
    id: string,
    data: UpdateRoleRequest,
    token?: string
  ): Promise<ApiResponse<{ id: string; email: string; firstName: string; lastName: string; role: string }>> {
    return this.api.patch<ApiResponse<{ id: string; email: string; firstName: string; lastName: string; role: string }>>(
      `/users/${id}/role`,
      data,
      token
    );
  }

  async updateStatus(
    id: string,
    data: UpdateStatusRequest,
    token?: string
  ): Promise<ApiResponse<{ id: string; email: string; firstName: string; lastName: string; isActive: boolean }>> {
    return this.api.patch<ApiResponse<{ id: string; email: string; firstName: string; lastName: string; isActive: boolean }>>(
      `/users/${id}/status`,
      data,
      token
    );
  }

  async adminBulkUpdate(
    data: AdminBulkUpdateRequest,
    token?: string
  ): Promise<ApiResponse<unknown>> {
    return this.api.patch<ApiResponse<unknown>>(
      `/admin/users/bulk-update`,
      data,
      token
    );
  }

  async resetPassword(
    id: string,
    newPassword: string,
    token?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.api.patch<ApiResponse<{ message: string }>>(
      `/users/${id}/reset-password`,
      { newPassword },
      token
    );
  }
}


