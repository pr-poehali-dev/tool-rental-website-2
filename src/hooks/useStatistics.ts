
import { useState, useEffect } from 'react';
import { BookingService } from '@/services/booking-service';
import { ProductService } from '@/services/product-service';

export interface AdminStatistics {
  products: {
    total: number;
    available: number;
    unavailable: number;
    growth: string;
  };
  bookings: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    cancelled: number;
    growth: string;
  };
  users: {
    total: number;
    new: number;
    growth: string;
  };
  revenue: {
    total: number;
    thisMonth: number;
    growth: string;
  };
}

export const useStatistics = () => {
  const [statistics, setStatistics] = useState<AdminStatistics>({
    products: { total: 0, available: 0, unavailable: 0, growth: '0%' },
    bookings: { total: 0, active: 0, pending: 0, completed: 0, cancelled: 0, growth: '0%' },
    users: { total: 0, new: 0, growth: '0%' },
    revenue: { total: 0, thisMonth: 0, growth: '0%' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Получаем статистику бронирований
        const bookingStats = await BookingService.getBookingStats();
        
        // Получаем список продуктов для определения их доступности
        const products = await ProductService.getProducts();
        const availableProducts = products.filter(p => p.isAvailable);
        const unavailableProducts = products.filter(p => !p.isAvailable);
        
        // Формируем общую статистику
        setStatistics({
          products: {
            total: products.length,
            available: availableProducts.length,
            unavailable: unavailableProducts.length,
            growth: '+12%' // В реальном приложении это значение будет рассчитываться
          },
          bookings: {
            total: bookingStats.totalBookings,
            active: bookingStats.activeBookings,
            pending: bookingStats.pendingBookings,
            completed: bookingStats.completedBookings,
            cancelled: bookingStats.cancelledBookings,
            growth: `+${bookingStats.growthPercentage}%`
          },
          users: {
            total: 364, // В демо-режиме используем фиксированные значения
            new: 42,
            growth: '+24%'
          },
          revenue: {
            total: bookingStats.totalRevenue,
            thisMonth: bookingStats.revenueThisMonth,
            growth: `+${bookingStats.growthPercentage}%`
          }
        });
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Не удалось загрузить статистику');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { statistics, loading, error };
};
