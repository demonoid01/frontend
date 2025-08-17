export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface TokenUser {
  userId: number;
  role: UserRole;
  email: string;
  name: string;
  exp?: number;
}

export interface DecodedToken extends TokenUser {
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  name: string;
} 
