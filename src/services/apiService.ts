// Servicio genérico para manejar las llamadas HTTP (Single Responsibility Principle)
import type { ApiError } from '../types/auth';

export class ApiService {
  private readonly apiUrl: string;
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api/v1') {
    this.apiUrl = import.meta.env.VITE_API_URL;
    this.baseUrl = `${this.apiUrl}${baseUrl}`;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          name: errorData.error || 'ApiError',
          status: response.status,
          success: false,
          error: errorData.error || 'Error desconocido',
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || 'UNKNOWN_ERROR',
          statusCode: errorData.statusCode,
          errorId: errorData.errorId || 'unknown',
          timestamp: errorData.timestamp || new Date().toISOString(),
          details: errorData.details,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async put<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  getApiUrl(): string {
    return this.baseUrl;
  }
}
