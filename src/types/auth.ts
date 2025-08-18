// Interfaces para las requests y responses de autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export interface AuthData {
  user: AuthUser;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export interface LoginResponse extends ApiResponse<AuthData> {}

export interface ApiError {
  name: string;
  status?: number;
  success: boolean;
  error: string;
  message: string;
  code: string;
  statusCode: number;
  errorId: string;
  timestamp: string;
  details?: any;
}
