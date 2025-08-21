// Servicio de Enlaces Rápidos (SRP) que encapsula la comunicación con la API de Quick Links
// Depende de ApiService (DIP)
import { ApiService } from './apiService';
import type {
  QuickLink,
  QuickLinksListQuery,
  CreateQuickLinkRequest,
  UpdateQuickLinkRequest,
  QuickLinksListResponse,
  QuickLinkResponse,
  DeleteQuickLinkResponse,
} from '../types/quicklinks';

export class QuickLinksService {
  private readonly api: ApiService;

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  async listQuickLinks(
    query: QuickLinksListQuery = {},
    token?: string
  ): Promise<QuickLinksListResponse> {
    const params = new URLSearchParams();
    if (query.category) params.set('category', query.category);
    if (query.isActive) params.set('isActive', query.isActive);

    const endpoint = `/config/quick-links/${params.toString() ? `?${params.toString()}` : ''}`;
    return this.api.get<QuickLinksListResponse>(endpoint, token);
  }

  async getQuickLinkById(
    id: string,
    token?: string
  ): Promise<QuickLinkResponse> {
    return this.api.get<QuickLinkResponse>(`/config/quick-links/${id}`, token);
  }

  async createQuickLink(
    data: CreateQuickLinkRequest,
    token?: string
  ): Promise<QuickLinkResponse> {
    return this.api.post<QuickLinkResponse>(`/config/quick-links/`, data, token);
  }

  async updateQuickLink(
    id: string,
    data: UpdateQuickLinkRequest,
    token?: string
  ): Promise<QuickLinkResponse> {
    return this.api.patch<QuickLinkResponse>(
      `/config/quick-links/${id}`,
      data,
      token
    );
  }

  async deleteQuickLink(
    id: string,
    token?: string
  ): Promise<DeleteQuickLinkResponse> {
    return this.api.delete<DeleteQuickLinkResponse>(
      `/config/quick-links/${id}`,
      token
    );
  }
}
