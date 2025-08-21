// Tipos para la gestión de usuarios
import type { ApiResponse } from './auth';

export type UserRole = 'ADMIN' | 'CEO' | 'RRHH' | 'JEFE_DEPARTAMENTO' | 'USUARIO';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationInfo;
}

export interface UserPersonalInfoLite {
  department: string | null;
  position: string | null;
  startDate: string | null; // ISO string
  currentMachine: string | null;
}

export interface UsersListItem {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  isActive: boolean;
  lastLogin: string | null; // ISO string o null
  createdAt: string; // ISO string
  personalInfo: UserPersonalInfoLite | null;
  cardCount: number;
}

export interface UserCard {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  type: string;
  isFeatured: boolean;
  assignedAt: string; // ISO
}

export interface UserDetailed {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole | string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string; // ISO
  personalInfo: UserPersonalInfoLite | null;
  cards: UserCard[];
}

export interface UserPersonalInfo {
  id: string;
  userId: string;
  phone: string | null;
  department: string | null;
  position: string | null;
  startDate: string | null;
  birthDate: string | null;
  emergencyContact: string | null;
  avatar: string | null;
  currentMachine: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface UsersListQuery {
  page?: number; // mínimo 1
  limit?: number; // 1-100
  role?: UserRole;
  department?: string;
  search?: string; // nombre, email o username
  isActive?: 'true' | 'false' | 'all';
}

export interface UpdatePersonalInfoRequest {
  phone?: string;
  department?: string;
  position?: string;
  startDate?: string; // ISO
  birthDate?: string; // ISO
  emergencyContact?: string;
  currentMachine?: string;
}

export interface UpdateRoleRequest {
  role: UserRole;
}

export interface UpdateStatusRequest {
  isActive: boolean;
}

export type BulkAction = 'activate' | 'deactivate' | 'updateRole';

export interface AdminBulkUpdateRequest {
  userIds: string[];
  action: BulkAction;
  data?: { role?: UserRole };
}

export interface UpdateBasicInfoRequest {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password: string;
}


