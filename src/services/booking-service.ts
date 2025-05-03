
import { api } from '@/lib/api/axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  Booking,
  BookingRequest
} from '@/lib/api/types';

/**
 * Сервис для работы с бронированиями
 */
export const BookingService = {
  /**
   * Создание нового бронирования
   */
  createBooking: async (bookingData: BookingRequest): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);
    return response.data;
  },
  
  /**
   * Получение списка бронирований текущего пользователя
   */
  getUserBookings: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Booking>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>('/bookings/me', {
      params: { page, limit }
    });
    return response.data;
  },
  
  /**
   * Получение детальной информации о бронировании по ID
   */
  getBookingById: async (id: number): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },
  
  /**
   * Отмена бронирования
   */
  cancelBooking: async (id: number): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
    return response.data;
  },
  
  /**
   * Получение списка всех бронирований (только для администраторов)
   */
  getAllBookings: async (
    page: number = 1,
    limit: number = 10,
    status?: string,
    startDate?: string,
    endDate?: string,
    userId?: number
  ): Promise<PaginatedResponse<Booking>> => {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (userId) params.append('userId', userId.toString());
    
    const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>('/admin/bookings', { params });
    return response.data;
  },
  
  /**
   * Обновление статуса бронирования (только для администраторов)
   */
  updateBookingStatus: async (id: number, status: string): Promise<Booking> => {
    const response = await api.put<ApiResponse<Booking>>(`/admin/bookings/${id}/status`, { status });
    return response.data;
  }
};

export default BookingService;
