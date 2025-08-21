// Servicio de WiFi (SRP) que encapsula la comunicación con la API de configuración WiFi
// Depende de ApiService (DIP)
import QRCode from 'qrcode';
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

  /**
   * Genera un código QR para una red WiFi usando el formato estándar WiFi QR Code
   * @param ssid El nombre de la red WiFi (SSID)
   * @param password La contraseña de la red (opcional)
   * @param security El tipo de seguridad (por defecto WPA2)
   * @returns Una promesa que resuelve a una cadena base64 del código QR
   */
  private async generateWifiQRCode(
    ssid: string,
    password?: string,
    security: 'WPA' | 'WPA2' | 'WEP' | 'nopass' = 'WPA2'
  ): Promise<string> {
    // Formato estándar para códigos QR de WiFi
    // WIFI:T:<tipo>;S:<SSID>;P:<contraseña>;H:<oculto>;;
    const wifiString = `WIFI:T:${security};S:${ssid};P:${password || ''};H:false;;`;
    
    try {
      // Generar el código QR como data URL base64
      const qrDataURL = await QRCode.toDataURL(wifiString, {
        errorCorrectionLevel: 'M',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrDataURL;
    } catch (error) {
      console.error('Error generando código QR:', error);
      throw new Error('No se pudo generar el código QR para la red WiFi');
    }
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
    try {
      // Generar el código QR automáticamente si no se proporciona uno
      let qrCode = undefined;
      if (data.networkName) {
        qrCode = await this.generateWifiQRCode(data.networkName, data.password);
      }

      // Crear el objeto de datos con el código QR generado
      const dataWithQR: CreateWifiNetworkRequest = {
        ...data,
        qrCode
      };

      return this.api.post<WifiResponse>('/config/wifi/', dataWithQR, token);
    } catch (error) {
      console.error('Error creando red WiFi:', error);
      throw error;
    }
  }

  async updateWifiNetwork(
    id: string,
    data: UpdateWifiNetworkRequest,
    token?: string
  ): Promise<WifiResponse> {
    try {
      let dataWithQR = { ...data };

      // Si se está actualizando el nombre de la red o la contraseña, regenerar el QR
      if (data.networkName) {

        const ssid = data.networkName;
        const password = data.password;
        
        const qrCode = await this.generateWifiQRCode(ssid, password);

        dataWithQR = {
          ...dataWithQR,
          qrCode
        };
      }

      return this.api.patch<WifiResponse>(`/config/wifi/${id}`, dataWithQR, token);
    } catch (error) {
      console.error('Error actualizando red WiFi:', error);
      throw error;
    }
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

  /**
   * Regenera el código QR para una red WiFi existente
   * @param id El ID de la red WiFi
   * @param token Token de autenticación opcional
   * @returns Una promesa que resuelve a la respuesta de la API con el nuevo código QR
   */
  async regenerateQRCode(
    id: string,
    token?: string
  ): Promise<WifiResponse> {
    try {
      // Obtener los datos actuales de la red
      const currentNetwork = await this.getWifiNetworkById(id, token);
      
      // Generar un nuevo código QR
      const qrCode = await this.generateWifiQRCode(
        currentNetwork.data.networkName,
        currentNetwork.data.password || undefined
      );

      // Actualizar solo el código QR
      return this.api.patch<WifiResponse>(`/config/wifi/${id}`, { qrCode }, token);
    } catch (error) {
      console.error('Error regenerando código QR:', error);
      throw error;
    }
  }
}
