// Servicio de WiFi (SRP) que encapsula la comunicación con la API de configuración WiFi
// Depende de ApiService (DIP)
import { ApiService } from './apiService';
import type {
  WifiNetwork,
  WifiListQuery,
  CreateWifiNetworkRequest,
  UpdateWifiNetworkRequest,
  WifiResponse,
  WifiListResponse,
} from '../types/wifi';

export class WifiService {
  private readonly api: ApiService;

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  async listWifiNetworks(
    query: WifiListQuery = {},
    token?: string
  ): Promise<WifiListResponse> {
    const params = new URLSearchParams();
    if (query.isActive && query.isActive !== 'all') {
      params.set('isActive', query.isActive);
    }
    if (query.networkName) {
      params.set('networkName', query.networkName);
    }

    const endpoint = `/config/wifi/${params.toString() ? `?${params.toString()}` : ''}`;
    return this.api.get<WifiListResponse>(endpoint, token);
  }

  async createWifiNetwork(
    data: CreateWifiNetworkRequest,
    token?: string
  ): Promise<WifiResponse> {
    return this.api.post<WifiResponse>('/config/wifi/', data, token);
  }

  async updateWifiNetwork(
    id: string,
    data: UpdateWifiNetworkRequest,
    token?: string
  ): Promise<WifiResponse> {
    return this.api.patch<WifiResponse>(`/config/wifi/${id}`, data, token);
  }

  async getWifiNetworkById(
    id: string,
    token?: string
  ): Promise<WifiResponse> {
    // Nota: Este endpoint no está en la especificación OpenAPI, 
    // pero sigue el patrón típico REST. Puede necesitar ajustarse según la API real.
    return this.api.get<WifiResponse>(`/config/wifi/${id}`, token);
  }

  async deleteWifiNetwork(
    id: string,
    token?: string
  ): Promise<WifiResponse> {
    // Nota: Este endpoint no está en la especificación OpenAPI,
    // pero sigue el patrón típico REST. Puede necesitar ajustarse según la API real.
    return this.api.delete<WifiResponse>(`/config/wifi/${id}`, token);
  }

  async toggleWifiNetworkStatus(
    id: string,
    isActive: boolean,
    token?: string
  ): Promise<WifiResponse> {
    return this.updateWifiNetwork(id, { isActive }, token);
  }
}
