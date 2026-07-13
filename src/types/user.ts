export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: string;
  role: "USER" | "ADMIN";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
