
import { BookingService } from './booking-service';
import { ProductService } from './product-service';
import { PRODUCTS } from '@/data/products';

// Типы данных для аналитики
export interface BookingAnalytics {
  totalBookings: number;
  revenueByMonth: MonthData[];
  bookingsByStatus: PieChartData[];
  bookingTrend: TimeSeriesData[];
  topProducts: TopProductData[];
}

export interface MonthData {
  month: string;
  revenue: number;
  bookings: number;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface TopProductData {
  id: number;
  name: string;
  bookings: number;
  revenue: number;
  availability: number; // процент доступности
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  dateRange: {
    from: Date;
    to: Date;
  };
  data: 'bookings' | 'revenue' | 'products' | 'all';
}

class AnalyticsServiceClass {
  async getBookingAnalytics(): Promise<BookingAnalytics> {
    try {
      // В реальном приложении здесь был бы запрос к серверу
      // const response = await axios.get('/api/analytics/bookings');
      // return response.data;
      
      // Генерируем демо-данные
      return this.generateDemoData();
    } catch (error) {
      console.error('Error fetching booking analytics:', error);
      throw error;
    }
  }
  
  async getRevenueByPeriod(period: 'day' | 'week' | 'month' | 'year'): Promise<TimeSeriesData[]> {
    try {
      // В реальном приложении здесь был бы запрос к серверу
      // const response = await axios.get(`/api/analytics/revenue?period=${period}`);
      // return response.data;
      
      // Генерируем демо-данные в зависимости от периода
      return this.generateRevenueData(period);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }
  
  async getTopProducts(limit: number = 10): Promise<TopProductData[]> {
    try {
      // В реальном приложении здесь был бы запрос к серверу
      // const response = await axios.get(`/api/analytics/products/top?limit=${limit}`);
      // return response.data;
      
      // Возвращаем демо-данные
      const demoData = this.generateDemoData();
      return demoData.topProducts.slice(0, limit);
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  }
  
  async exportData(options: ExportOptions): Promise<string> {
    try {
      // В реальном приложении здесь был бы запрос к серверу для генерации файла
      // const response = await axios.post('/api/export', options, {
      //   responseType: 'blob'
      // });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // return url;
      
      // Симулируем успешный экспорт
      alert(`Данные успешно экспортированы в формате ${options.format}. В реальном приложении здесь был бы скачиваемый файл.`);
      return 'export-success';
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
  
  private generateDemoData(): BookingAnalytics {
    // Генерируем данные о доходах по месяцам
    const revenueByMonth: MonthData[] = [
      { month: 'Янв', revenue: 125000, bookings: 42 },
      { month: 'Фев', revenue: 148000, bookings: 51 },
      { month: 'Мар', revenue: 172000, bookings: 58 },
      { month: 'Апр', revenue: 190000, bookings: 64 },
      { month: 'Май', revenue: 215000, bookings: 72 },
      { month: 'Июн', revenue: 252000, bookings: 84 },
      { month: 'Июл', revenue: 265000, bookings: 89 },
      { month: 'Авг', revenue: 278000, bookings: 93 },
      { month: 'Сен', revenue: 254000, bookings: 85 },
      { month: 'Окт', revenue: 228000, bookings: 76 },
      { month: 'Ноя', revenue: 243000, bookings: 81 },
      { month: 'Дек', revenue: 275000, bookings: 92 }
    ];
    
    // Данные о бронированиях по статусам
    const bookingsByStatus: PieChartData[] = [
      { name: 'Активно', value: 42, color: '#10b981' },
      { name: 'Ожидает', value: 18, color: '#f59e0b' },
      { name: 'Завершено', value: 192, color: '#3b82f6' },
      { name: 'Отменено', value: 4, color: '#ef4444' }
    ];
    
    // Данные о тренде бронирований
    const bookingTrend: TimeSeriesData[] = [];
    const today = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      bookingTrend.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 10) + 5 // От 5 до 15 бронирований в день
      });
    }
    
    // Популярные товары
    const topProducts: TopProductData[] = [];
    const shuffledProducts = [...PRODUCTS].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < 10; i++) {
      const product = shuffledProducts[i];
      topProducts.push({
        id: product.id,
        name: product.name,
        bookings: Math.floor(Math.random() * 20) + 10, // От 10 до 30 бронирований
        revenue: (Math.floor(Math.random() * 20) + 10) * product.price, // Доход
        availability: product.isAvailable ? Math.floor(Math.random() * 40) + 60 : 0 // 60-100% доступности
      });
    }
    
    return {
      totalBookings: 256,
      revenueByMonth,
      bookingsByStatus,
      bookingTrend,
      topProducts
    };
  }
  
  private generateRevenueData(period: 'day' | 'week' | 'month' | 'year'): TimeSeriesData[] {
    const result: TimeSeriesData[] = [];
    const today = new Date();
    
    let days = 0;
    switch (period) {
      case 'day':
        days = 24; // По часам за последние 24 часа
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setHours(today.getHours() - i);
          result.push({
            date: `${date.getHours()}:00`,
            value: Math.floor(Math.random() * 5000) + 1000
          });
        }
        break;
      case 'week':
        days = 7; // За неделю
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          result.push({
            date: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
            value: Math.floor(Math.random() * 20000) + 15000
          });
        }
        break;
      case 'month':
        days = 30; // За 30 дней
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          result.push({
            date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
            value: Math.floor(Math.random() * 15000) + 10000
          });
        }
        break;
      case 'year':
        // За год по месяцам
        for (let i = 0; i < 12; i++) {
          const date = new Date();
          date.setMonth(today.getMonth() - i);
          result.push({
            date: date.toLocaleDateString('ru-RU', { month: 'short' }),
            value: Math.floor(Math.random() * 100000) + 150000
          });
        }
        break;
    }
    
    // Сортируем по возрастанию даты
    return result.reverse();
  }
}

export const AnalyticsService = new AnalyticsServiceClass();
