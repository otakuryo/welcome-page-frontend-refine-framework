// Tipos para la gestión de enlaces rápidos
import type { ApiResponse } from './auth';

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string | null;
  iconUrl: string | null;
  isActive: boolean;
  sortOrder: number | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface QuickLinksListQuery {
  category?: string;
  isActive?: 'true' | 'false' | 'all';
}

export interface CreateQuickLinkRequest {
  title: string;
  url: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  sortOrder?: number;
}

export interface UpdateQuickLinkRequest {
  title?: string;
  url?: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface DeleteQuickLinkResponse {
  success: true;
  message: string;
  data: null;
  timestamp: string;
}

export type QuickLinksListResponse = ApiResponse<QuickLink[]>;
export type QuickLinkResponse = ApiResponse<QuickLink>;
