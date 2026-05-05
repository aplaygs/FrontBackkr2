export enum Role {
  USER = 'user',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
