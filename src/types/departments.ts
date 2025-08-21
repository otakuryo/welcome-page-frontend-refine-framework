// Tipos relacionados con Departamentos basados en la API

export interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Lista de departamentos con contadores
export interface DepartmentListItem extends Department {
  _count: {
    users: number;
    cards: number;
  };
}

// Departamento detallado con relaciones
export interface DepartmentDetailed extends Department {
  users: DepartmentUser[];
  cards: DepartmentCard[];
}

// Usuario en un departamento
export interface DepartmentUser {
  id: string;
  userId: string;
  isHead: boolean;
  joinedAt: string;
  isActive: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

// Tarjeta asignada a departamento
export interface DepartmentCard {
  id: string;
  cardId: string;
  canEdit: boolean;
  canDelete: boolean;
  assignedAt: string;
  isActive: boolean;
  card: {
    id: string;
    title: string;
    description?: string;
    type: string;
    isActive: boolean;
  };
}

// Mis departamentos
export interface MyDepartment {
  assignment: {
    id: string;
    isHead: boolean;
    joinedAt: string;
  };
  department: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
  };
}

// Query parameters para listar departamentos
export interface DepartmentsListQuery {
  page?: number;
  limit?: number;
  isActive?: "true" | "false" | "all";
  search?: string;
  sortBy?: "name" | "slug" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

// Request para crear departamento
export interface CreateDepartmentRequest {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

// Request para actualizar departamento
export interface UpdateDepartmentRequest {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

// Request para asignar usuario a departamento
export interface AssignUserToDepartmentRequest {
  isHead?: boolean;
  message?: string;
}

// Request para asignar tarjeta a departamento
export interface AssignCardToDepartmentRequest {
  canEdit?: boolean;
  canDelete?: boolean;
  message?: string;
}

// Response para asignación de usuario
export interface UserDepartmentAssignment {
  id: string;
  userId: string;
  departmentId: string;
  isHead: boolean;
  joinedAt: string;
  isActive: boolean;
}

// Response para asignación de tarjeta
export interface CardDepartmentAssignment {
  id: string;
  departmentId: string;
  cardId: string;
  assignedBy: string;
  canEdit: boolean;
  canDelete: boolean;
  assignedAt: string;
  isActive: boolean;
}

// Tarjeta de departamento con información adicional
export interface DepartmentCardDetailed {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  type: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  canDelete: boolean;
  assignedAt: string;
  assignedBy: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
