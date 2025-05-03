
// Базовый тип ответа API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Типы для пагинации
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Типы для аутентификации
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MANAGER = 'manager'
}

// Типы для продуктов
export interface ProductFilter {
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  availability?: 'all' | 'available' | 'unavailable';
  sortBy?: string;
  page?: number;
  limit?: number;
  search?: string;
}

// Типы для бронирования
export interface BookingItem {
  productId: number;
  quantity: number;
  days: number;
}

export interface BookingRequest {
  items: BookingItem[];
  startDate: string;
  endDate: string;
  deliveryAddress?: string;
  deliveryMethod: 'pickup' | 'delivery';
  comment?: string;
}

export interface Booking {
  id: number;
  items: BookingItemDetails[];
  user: User;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  totalPrice: number;
  totalDeposit: number;
  deliveryAddress?: string;
  deliveryMethod: 'pickup' | 'delivery';
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingItemDetails extends BookingItem {
  product: {
    id: number;
    name: string;
    price: number;
    deposit: number;
    discount?: number;
    image: string;
  };
  subtotal: number;
  depositTotal: number;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
