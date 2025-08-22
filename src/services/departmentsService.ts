// Servicio de Departamentos (SRP) que encapsula la comunicación con la API de Departments
// Depende de ApiService (DIP)
import { ApiService } from './apiService';
import type {
  DepartmentListItem,
  DepartmentsListQuery,
  DepartmentDetailed,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  AssignUserToDepartmentRequest,
  AssignCardToDepartmentRequest,
  UserDepartmentAssignment,
  CardDepartmentAssignment,
  DepartmentCardDetailed,
  MyDepartment,
} from '../types/departments';
import type { ApiResponse } from '../types/auth';
import type { ApiPaginatedResponse } from '../types/users';

export class DepartmentsService {
  private readonly api: ApiService;

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  async listDepartments(
    query: DepartmentsListQuery = {},
    token?: string
  ): Promise<ApiPaginatedResponse<DepartmentListItem[]>> {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.isActive) params.set('isActive', query.isActive);
    if (query.search) params.set('search', query.search);
    if (query.sortBy) params.set('sortBy', query.sortBy);
    if (query.sortOrder) params.set('sortOrder', query.sortOrder);

    const endpoint = `/departments/${params.toString() ? `?${params.toString()}` : ''}`;
    return this.api.get<ApiPaginatedResponse<DepartmentListItem[]>>(endpoint, token);
  }

  async getDepartmentById(
    id: string,
    token?: string
  ): Promise<ApiResponse<DepartmentDetailed>> {
    return this.api.get<ApiResponse<DepartmentDetailed>>(`/departments/${id}`, token);
  }

  async getDepartmentBySlug(
    slug: string,
    token?: string
  ): Promise<ApiResponse<DepartmentDetailed>> {
    return this.api.get<ApiResponse<DepartmentDetailed>>(`/departments/slug/${slug}`, token);
  }

  async createDepartment(
    data: CreateDepartmentRequest,
    token?: string
  ): Promise<ApiResponse<DepartmentDetailed>> {
    return this.api.post<ApiResponse<DepartmentDetailed>>('/departments/', data, token);
  }

  async updateDepartment(
    id: string,
    data: UpdateDepartmentRequest,
    token?: string
  ): Promise<ApiResponse<DepartmentDetailed>> {
    return this.api.patch<ApiResponse<DepartmentDetailed>>(`/departments/${id}`, data, token);
  }

  async deleteDepartment(
    id: string,
    token?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.api.delete<ApiResponse<{ message: string }>>(`/departments/${id}`, token);
  }

  // Gestión de usuarios en departamentos
  async assignUserToDepartment(
    departmentId: string,
    userId: string,
    data: AssignUserToDepartmentRequest = {},
    token?: string
  ): Promise<ApiResponse<UserDepartmentAssignment>> {
    return this.api.post<ApiResponse<UserDepartmentAssignment>>(
      `/departments/${departmentId}/users/${userId}`,
      data,
      token
    );
  }

  async removeUserFromDepartment(
    departmentId: string,
    userId: string,
    token?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.api.delete<ApiResponse<{ message: string }>>(
      `/departments/${departmentId}/users/${userId}`,
      token
    );
  }

  // Gestión de tarjetas en departamentos
  async getDepartmentCards(
    departmentId: string,
    token?: string
  ): Promise<ApiResponse<DepartmentCardDetailed[]>> {
    return this.api.get<ApiResponse<DepartmentCardDetailed[]>>(
      `/departments/${departmentId}/cards`,
      token
    );
  }

  async assignCardToDepartment(
    departmentId: string,
    cardId: string,
    data: AssignCardToDepartmentRequest = {},
    token?: string
  ): Promise<ApiResponse<CardDepartmentAssignment>> {
    return this.api.post<ApiResponse<CardDepartmentAssignment>>(
      `/departments/${departmentId}/cards/${cardId}`,
      data,
      token
    );
  }

  async removeCardFromDepartment(
    departmentId: string,
    cardId: string,
    token?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.api.delete<ApiResponse<{ message: string }>>(
      `/departments/${departmentId}/cards/${cardId}`,
      token
    );
  }

  // Obtener departamentos del usuario actual
  async getMyDepartments(
    token?: string
  ): Promise<ApiResponse<MyDepartment[]>> {
    return this.api.get<ApiResponse<MyDepartment[]>>('/departments/my-departments', token);
  }

  // Obtener departamentos de un usuario
  async getUserDepartments(
    userId: string,
    token?: string
  ): Promise<ApiResponse<MyDepartment[]>> {
    return this.api.get<ApiResponse<MyDepartment[]>>(`/departments/user/${userId}`, token);
  }
}
