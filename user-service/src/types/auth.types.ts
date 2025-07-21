export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  sessionId: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export interface UserValidationResult {
  isValid: boolean;
  error?: string;
}

export interface SessionValidationResult {
  isValid: boolean;
  user?: any;
}
