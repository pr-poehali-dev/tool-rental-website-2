
import axios from '@/lib/api/axios';
import { AxiosResponse } from 'axios';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  productId: number;
  productName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  depositAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCreateDto {
  customerId: string;
  productId: number;
  startDate: string;
  endDate: string;
  depositAmount: number;
}

export interface BookingUpdateDto {
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
}

export interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  revenueThisMonth: number;
  growthPercentage: number;
}

class BookingServiceClass {
  async getBookings(): Promise<Booking[]> {
    try {
      // Для демонстрации используем локальные данные, в реальности здесь был бы API-запрос
      // const response: AxiosResponse<Booking[]> = await axios.get('/api/bookings');
      // return response.data;
      
      return this.getMockBookings();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      // const response: AxiosResponse<Booking> = await axios.get(`/api/bookings/${id}`);
      // return response.data;
      
      const booking = this.getMockBookings().find(b => b.id === id);
      return booking || null;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      return null;
    }
  }

  async createBooking(booking: BookingCreateDto): Promise<Booking | null> {
    try {
      // const response: AxiosResponse<Booking> = await axios.post('/api/bookings', booking);
      // return response.data;
      
      // В реальности здесь был бы API-запрос
      alert('Создание бронирования (будет реализовано при подключении API)');
      return null;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }

  async updateBooking(id: string, booking: BookingUpdateDto): Promise<Booking | null> {
    try {
      // const response: AxiosResponse<Booking> = await axios.put(`/api/bookings/${id}`, booking);
      // return response.data;
      
      // В реальности здесь был бы API-запрос
      alert(`Обновление бронирования ${id} (будет реализовано при подключении API)`);
      return null;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      return null;
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      // await axios.delete(`/api/bookings/${id}`);
      // return true;
      
      // В реальности здесь был бы API-запрос
      alert(`Удаление бронирования ${id} (будет реализовано при подключении API)`);
      return true;
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      return false;
    }
  }

  async getBookingStats(): Promise<BookingStats> {
    try {
      // const response: AxiosResponse<BookingStats> = await axios.get('/api/bookings/stats');
      // return response.data;
      
      // Возвращаем моковые данные
      return {
        totalBookings: 256,
        activeBookings: 42,
        completedBookings: 192,
        pendingBookings: 18,
        cancelledBookings: 4,
        totalRevenue: 1250000,
        revenueThisMonth: 358420,
        growthPercentage: 18
      };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      return {
        totalBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        revenueThisMonth: 0,
        growthPercentage: 0
      };
    }
  }

  private getMockBookings(): Booking[] {
    return [
      {
        id: "B-2304",
        customerId: "C-1001",
        customerName: "Иванов Алексей",
        productId: 1,
        productName: "Перфоратор Bosch GBH 2-26",
        startDate: "2025-05-03",
        endDate: "2025-05-08",
        status: "active",
        totalAmount: 12800,
        depositAmount: 5000,
        createdAt: "2025-05-03T10:30:00Z",
        updatedAt: "2025-05-03T10:45:00Z"
      },
      {
        id: "B-2303",
        customerId: "C-1002",
        customerName: "Смирнова Ольга",
        productId: 3,
        productName: "Шлифовальная машина Makita BO5041",
        startDate: "2025-05-02",
        endDate: "2025-05-06",
        status: "pending",
        totalAmount: 8600,
        depositAmount: 3000,
        createdAt: "2025-05-02T14:15:00Z",
        updatedAt: "2025-05-02T14:20:00Z"
      },
      {
        id: "B-2302",
        customerId: "C-1003",
        customerName: "Петров Сергей",
        productId: 5,
        productName: "Электрогенератор Honda EU22i",
        startDate: "2025-05-01",
        endDate: "2025-05-10",
        status: "completed",
        totalAmount: 15200,
        depositAmount: 8000,
        createdAt: "2025-05-01T09:10:00Z",
        updatedAt: "2025-05-10T18:30:00Z"
      },
      {
        id: "B-2301",
        customerId: "C-1004",
        customerName: "Козлова Анна",
        productId: 8,
        productName: "Лестница-стремянка Alumet 8 ступеней",
        startDate: "2025-04-28",
        endDate: "2025-04-30",
        status: "cancelled",
        totalAmount: 7400,
        depositAmount: 2000,
        createdAt: "2025-04-28T16:45:00Z",
        updatedAt: "2025-04-29T10:20:00Z"
      },
      {
        id: "B-2300",
        customerId: "C-1005",
        customerName: "Соколов Дмитрий",
        productId: 12,
        productName: "Бетономешалка Энтузиаст Б-120",
        startDate: "2025-04-27",
        endDate: "2025-05-07",
        status: "active",
        totalAmount: 9200,
        depositAmount: 4000,
        createdAt: "2025-04-27T11:25:00Z",
        updatedAt: "2025-04-27T12:00:00Z"
      },
      {
        id: "B-2299",
        customerId: "C-1006",
        customerName: "Новиков Антон",
        productId: 15,
        productName: "Сварочный аппарат Ресанта САИ 250",
        startDate: "2025-04-26",
        endDate: "2025-04-29",
        status: "completed",
        totalAmount: 6800,
        depositAmount: 3500,
        createdAt: "2025-04-26T13:30:00Z",
        updatedAt: "2025-04-29T17:15:00Z"
      },
      {
        id: "B-2298",
        customerId: "C-1007",
        customerName: "Морозова Екатерина",
        productId: 19,
        productName: "Тепловая пушка Master BLP 53M",
        startDate: "2025-04-25",
        endDate: "2025-05-05",
        status: "active",
        totalAmount: 11500,
        depositAmount: 5000,
        createdAt: "2025-04-25T10:10:00Z",
        updatedAt: "2025-04-25T10:45:00Z"
      },
      {
        id: "B-2297",
        customerId: "C-1008",
        customerName: "Волков Игорь",
        productId: 22,
        productName: "Компрессор Metabo PowerAir V 400",
        startDate: "2025-04-24",
        endDate: "2025-04-27",
        status: "completed",
        totalAmount: 8900,
        depositAmount: 4500,
        createdAt: "2025-04-24T09:20:00Z",
        updatedAt: "2025-04-27T19:00:00Z"
      },
      {
        id: "B-2296",
        customerId: "C-1009",
        customerName: "Лебедева Марина",
        productId: 25,
        productName: "Шуруповерт Bosch GSR 18V-50",
        startDate: "2025-04-23",
        endDate: "2025-04-28",
        status: "completed",
        totalAmount: 7200,
        depositAmount: 3000,
        createdAt: "2025-04-23T14:40:00Z",
        updatedAt: "2025-04-28T16:10:00Z"
      },
      {
        id: "B-2295",
        customerId: "C-1010",
        customerName: "Кузнецов Андрей",
        productId: 27,
        productName: "Штроборез Makita SG1251J",
        startDate: "2025-04-22",
        endDate: "2025-04-24",
        status: "completed",
        totalAmount: 6400,
        depositAmount: 5000,
        createdAt: "2025-04-22T11:30:00Z",
        updatedAt: "2025-04-24T18:45:00Z"
      }
    ];
  }
}

export const BookingService = new BookingServiceClass();
