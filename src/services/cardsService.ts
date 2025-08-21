// Servicio de Tarjetas (SRP) que encapsula la comunicación con la API de Cards
// Depende de ApiService (DIP)
import { ApiService } from './apiService';
import type {
  ApiPaginatedResponse,
  CardListItem,
  CardsListQuery,
  FullCard,
  MyCardItem,
  CreateCardRequest,
  UpdateCardRequest,
  AssignCardRequest,
  UpdateFeaturedRequest,
  UserCardAssignment,
  DeleteCardResponse,
  SoftDeleteCardResponse,
} from '../types/cards';
import type { ApiResponse } from '../types/auth';

export class CardsService {
  private readonly api: ApiService;

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  /**
   * Obtiene una lista paginada de tarjetas con filtros opcionales
   */
  async listCards(
    query: CardsListQuery = {},
    token?: string
  ): Promise<ApiPaginatedResponse<CardListItem[]>> {
    const params = new URLSearchParams();
    if (query.type) params.set('type', query.type);
    if (query.isActive) params.set('isActive', query.isActive);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.sortBy) params.set('sortBy', query.sortBy);
    if (query.sortOrder) params.set('sortOrder', query.sortOrder);

    const endpoint = `/cards/${params.toString() ? `?${params.toString()}` : ''}`;
    return this.api.get<ApiPaginatedResponse<CardListItem[]>>(endpoint, token);
  }

  /**
   * Obtiene las tarjetas asignadas al usuario actual
   */
  async getMyCards(token?: string): Promise<ApiResponse<MyCardItem[]>> {
    return this.api.get<ApiResponse<MyCardItem[]>>('/cards/my-cards', token);
  }

  /**
   * Crea una nueva tarjeta
   */
  async createCard(
    data: CreateCardRequest,
    token?: string
  ): Promise<ApiResponse<FullCard>> {
    return this.api.post<ApiResponse<FullCard>>('/cards/', data, token);
  }

  /**
   * Actualiza una tarjeta existente
   */
  async updateCard(
    id: string,
    data: UpdateCardRequest,
    token?: string
  ): Promise<ApiResponse<FullCard>> {
    return this.api.patch<ApiResponse<FullCard>>(`/cards/${id}`, data, token);
  }

  /**
   * Asigna una tarjeta a un usuario específico
   */
  async assignCardToUser(
    cardId: string,
    userId: string,
    data: AssignCardRequest = {},
    token?: string
  ): Promise<ApiResponse<UserCardAssignment>> {
    return this.api.post<ApiResponse<UserCardAssignment>>(
      `/cards/${cardId}/assign/${userId}`,
      data,
      token
    );
  }

  /**
   * Desasigna una tarjeta de un usuario
   */
  async unassignCardFromUser(
    cardId: string,
    userId: string,
    token?: string
  ): Promise<ApiResponse<null>> {
    return this.api.delete<ApiResponse<null>>(
      `/cards/${cardId}/assign/${userId}`,
      token
    );
  }

  /**
   * Marca o desmarca una tarjeta como destacada para el usuario actual
   */
  async updateCardFeatured(
    cardId: string,
    data: UpdateFeaturedRequest,
    token?: string
  ): Promise<ApiResponse<UserCardAssignment>> {
    return this.api.patch<ApiResponse<UserCardAssignment>>(
      `/cards/${cardId}/featured`,
      data,
      token
    );
  }

  /**
   * Eliminación suave de tarjeta (elimina asignaciones pero mantiene la tarjeta)
   */
  async softDeleteCard(
    id: string,
    token?: string
  ): Promise<ApiResponse<SoftDeleteCardResponse>> {
    return this.api.delete<ApiResponse<SoftDeleteCardResponse>>(
      `/cards/${id}`,
      token
    );
  }

  /**
   * Eliminación completa de tarjeta (elimina asignaciones y la tarjeta)
   */
  async deleteCard(
    id: string,
    token?: string
  ): Promise<ApiResponse<DeleteCardResponse>> {
    return this.api.delete<ApiResponse<DeleteCardResponse>>(
      `/cards/${id}`,
      token
    );
  }
}
