// Tipos para la gestión de redes WiFi
import type { ApiResponse } from './auth';

export interface WifiNetwork {
  id: string;
  networkName: string;
  password: string | null;
  qrCode: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string; // ISO date-time
  updatedAt: string; // ISO date-time
}

export interface WifiListQuery {
  isActive?: 'true' | 'false' | 'all';
  networkName?: string; // filtro por nombre de red
}

export interface CreateWifiNetworkRequest {
  networkName: string; // mínimo 1 carácter (requerido)
  password?: string;
  qrCode?: string; // código QR en base64 o URL
  description?: string;
}

export interface UpdateWifiNetworkRequest {
  networkName?: string; // mínimo 1 carácter
  password?: string;
  qrCode?: string; // código QR en base64 o URL
  description?: string;
  isActive?: boolean;
}

export type WifiResponse = ApiResponse<WifiNetwork>;
export type WifiListResponse = ApiResponse<WifiNetwork[]>;
