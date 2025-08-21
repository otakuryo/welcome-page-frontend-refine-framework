// Tipos para la gestión de tarjetas (Cards)
import type { ApiResponse } from './auth';
import type { ApiPaginatedResponse } from './users';
export type { ApiPaginatedResponse};

export type CardType = 
  | 'ERP'
  | 'CONTROL_TIEMPOS'
  | 'PROGRAMAS'
  | 'GESTOR_PASSWORDS'
  | 'INFORMACION_PERSONAL'
  | 'CALENDARIOS'
  | 'MAQUINA_ACTUAL'
  | 'WIFI'
  | 'ENLACES';

export interface CardCreatedBy {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CardListItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  type: CardType;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO string
  createdBy: CardCreatedBy;
  assignedUsersCount: number;
}

export interface FullCard {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  type: CardType;
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  createdBy: CardCreatedBy;
}

export interface MyCardItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  type: CardType;
  isFeatured: boolean;
  sortOrder: number;
  assignedAt: string; // ISO string
  originalTitle: string;
  originalDescription: string | null;
}

export interface UserCardAssignment {
  id: string;
  userId: string;
  cardId: string;
  isFeatured: boolean;
  customTitle: string | null;
  customDescription: string | null;
  assignedAt: string; // ISO string
}

export interface CardsListQuery {
  type?: CardType;
  isActive?: 'true' | 'false' | 'all';
  page?: number;
  limit?: number;
  sortBy?: 'sortOrder' | 'title' | 'createdAt' | 'type';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  type: CardType;
  sortOrder?: number;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  type?: CardType;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AssignCardRequest {
  isFeatured?: boolean;
  customTitle?: string;
  customDescription?: string;
}

export interface UpdateFeaturedRequest {
  isFeatured: boolean;
}

export interface DeleteCardResponse {
  cardId: string;
  cardTitle: string;
  cardType: CardType;
  removedAssignments: number;
  originalAssignments: number;
}

export interface SoftDeleteCardResponse {
  cardId: string;
  cardTitle: string;
  removedAssignments: number;
  originalAssignments: number;
}
