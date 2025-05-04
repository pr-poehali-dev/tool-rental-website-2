
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

// Новые интерфейсы для отчетов
export interface ReportData {
  title: string;
  description: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  data: any;
}

export interface FinancialReportData extends ReportData {
  totalRevenue: number;
  totalBookings: number;
  revenueByDay: { date: string; revenue: number }[];
  revenueByCategory: { category: string; revenue: number }[];
  topClients: { name: string; revenue: number; bookings: number }[];
}

export interface EquipmentUsageReportData extends ReportData {
  totalEquipment: number;
  totalUsageHours: number;
  avgUsagePerItem: number;
  equipmentByUsage: { name: string; hours: number; utilization: number }[];
  maintenanceAlerts: { name: string; lastMaintenance: string; usageHours: number }[];
}

export interface ProductEfficiencyReportData extends ReportData {
  mostEfficientProducts: { name: string; roi: number; utilization: number }[];
  leastEfficientProducts: { name: string; roi: number; utilization: number }[];
  recommendedActions: { product: string; action: string; potentialGain: number }[];
}

// Типы для прогнозирования
export interface RevenueForecast {
  period: string;
  predictedRevenue: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface DemandForecast {
  productId: number;
  productName: string;
  seasonalDemand: { period: string; demand: number }[];
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

export interface ProductOptimizationRecommendation {
  productId: number;
  productName: string;
  recommendationType: 'increase' | 'decrease' | 'maintain' | 'remove' | 'add';
  reason: string;
  potentialRevenue: number;
  confidence: number;
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

  // Новые методы для отчетов

  async getFinancialReport(period: 'month' | 'quarter' | 'year'): Promise<FinancialReportData> {
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await axios.get(`/api/reports/financial?period=${period}`);
      // return response.data;
      
      // Генерируем моковые данные для отчета
      return this.generateFinancialReportData(period);
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error;
    }
  }

  async getEquipmentUsageReport(period: 'month' | 'quarter' | 'year'): Promise<EquipmentUsageReportData> {
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await axios.get(`/api/reports/equipment-usage?period=${period}`);
      // return response.data;
      
      // Генерируем моковые данные для отчета
      return this.generateEquipmentUsageReportData(period);
    } catch (error) {
      console.error('Error fetching equipment usage report:', error);
      throw error;
    }
  }

  async getProductEfficiencyReport(period: 'month' | 'quarter' | 'year'): Promise<ProductEfficiencyReportData> {
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await axios.get(`/api/reports/product-efficiency?period=${period}`);
      // return response.data;
      
      // Генерируем моковые данные для отчета
      return this.generateProductEfficiencyReportData(period);
    } catch (error) {
      console.error('Error fetching product efficiency report:', error);
      throw error;
    }
  }

  async getRevenueForecast(months: number): Promise<RevenueForecast[]> {
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await axios.get(`/api/forecast/revenue?months=${months}`);
      // return response.data;
      
      // Генерируем моковые данные прогноза
      return this.generateRevenueForecastData(months);
    } catch (error) {
      console.error('Error fetching revenue forecast:', error);
      throw error;
    }
  }

  async getSeasonalDemandForecast(): Promise<DemandForecast[]> {
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await axios.get('/api/forecast/seasonal-demand');
      // return response.data;
      
      // Генерируем моковые данные прогноза сезонного спроса
      return this.generateSeasonalDemandForecastData();
    } catch (error) {
      console.error('Error fetching seasonal demand forecast:', error);
      throw error;
    }
  }

  async getOptimizationRecommendations(): Promise<ProductOptimizationRecommendation[]> {
    try {
      // В реальном приложении здесь был бы запрос к API
      // const response = await axios.get('/api/recommendations/optimization');
      // return response.data;
      
      // Генерируем моковые рекомендации по оптимизации
      return this.generateOptimizationRecommendationsData();
    } catch (error) {
      console.error('Error fetching optimization recommendations:', error);
      throw error;
    }
  }

  // Генерация моковых данных для отчетов
  private generateFinancialReportData(period: 'month' | 'quarter' | 'year'): FinancialReportData {
    const now = new Date();
    let startDate = new Date();
    let title = "";
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      title = `Финансовый отчет за ${this.getMonthName(now.getMonth())} ${now.getFullYear()}`;
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
      title = `Финансовый отчет за ${this.getQuarterName(now.getMonth())} квартал ${now.getFullYear()}`;
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
      title = `Годовой финансовый отчет за ${now.getFullYear()} год`;
    }

    // Генерируем данные о доходах по дням
    const revenueByDay = [];
    const daysInPeriod = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    for (let i = 0; i < daysInPeriod; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      revenueByDay.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 15000) + 5000
      });
    }

    // Генерируем данные о доходах по категориям
    const revenueByCategory = [
      { category: 'Электроинструмент', revenue: 450000 },
      { category: 'Строительное оборудование', revenue: 680000 },
      { category: 'Садовая техника', revenue: 320000 },
      { category: 'Генераторы и компрессоры', revenue: 280000 },
      { category: 'Измерительные приборы', revenue: 150000 },
      { category: 'Сварочное оборудование', revenue: 240000 }
    ];

    // Генерируем данные о топ-клиентах
    const topClients = [
      { name: 'ООО "СтройМастер"', revenue: 175000, bookings: 42 },
      { name: 'ИП Петров А.С.', revenue: 120000, bookings: 28 },
      { name: 'Иванов Сергей', revenue: 95000, bookings: 23 },
      { name: 'ООО "ТехноСтрой"', revenue: 85000, bookings: 19 },
      { name: 'Сидорова Анна', revenue: 65000, bookings: 15 }
    ];

    return {
      title,
      description: `Детальный отчет о финансовых показателях за период с ${startDate.toLocaleDateString('ru-RU')} по ${now.toLocaleDateString('ru-RU')}`,
      generatedAt: now.toISOString(),
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString(),
      totalRevenue: revenueByDay.reduce((sum, item) => sum + item.revenue, 0),
      totalBookings: Math.floor(Math.random() * 200) + 100,
      revenueByDay,
      revenueByCategory,
      topClients,
      data: {} // Дополнительные данные для отчета
    };
  }

  private generateEquipmentUsageReportData(period: 'month' | 'quarter' | 'year'): EquipmentUsageReportData {
    const now = new Date();
    let startDate = new Date();
    let title = "";
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      title = `Отчет о загруженности оборудования за ${this.getMonthName(now.getMonth())} ${now.getFullYear()}`;
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
      title = `Отчет о загруженности оборудования за ${this.getQuarterName(now.getMonth())} квартал ${now.getFullYear()}`;
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
      title = `Годовой отчет о загруженности оборудования за ${now.getFullYear()} год`;
    }

    // Генерируем данные о загруженности оборудования
    const equipmentByUsage = [];
    for (let i = 0; i < 20; i++) {
      const hours = Math.floor(Math.random() * 1200) + 300;
      const totalPossibleHours = 1920; // 8 часов * 20 рабочих дней * 12 месяцев
      const utilization = Math.min(100, Math.round((hours / totalPossibleHours) * 100));
      
      equipmentByUsage.push({
        name: `Оборудование ${i + 1}`,
        hours,
        utilization
      });
    }
    
    // Сортируем по загруженности (от большего к меньшему)
    equipmentByUsage.sort((a, b) => b.hours - a.hours);

    // Генерируем данные о предстоящем обслуживании
    const maintenanceAlerts = [];
    for (let i = 0; i < 5; i++) {
      const lastMaintenanceDate = new Date();
      lastMaintenanceDate.setDate(now.getDate() - Math.floor(Math.random() * 90));
      
      maintenanceAlerts.push({
        name: equipmentByUsage[i].name,
        lastMaintenance: lastMaintenanceDate.toISOString().split('T')[0],
        usageHours: Math.floor(Math.random() * 300) + 200
      });
    }

    return {
      title,
      description: `Анализ использования оборудования за период с ${startDate.toLocaleDateString('ru-RU')} по ${now.toLocaleDateString('ru-RU')}`,
      generatedAt: now.toISOString(),
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString(),
      totalEquipment: equipmentByUsage.length,
      totalUsageHours: equipmentByUsage.reduce((sum, item) => sum + item.hours, 0),
      avgUsagePerItem: Math.round(equipmentByUsage.reduce((sum, item) => sum + item.hours, 0) / equipmentByUsage.length),
      equipmentByUsage,
      maintenanceAlerts,
      data: {} // Дополнительные данные для отчета
    };
  }

  private generateProductEfficiencyReportData(period: 'month' | 'quarter' | 'year'): ProductEfficiencyReportData {
    const now = new Date();
    let startDate = new Date();
    let title = "";
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      title = `Отчет об эффективности товаров за ${this.getMonthName(now.getMonth())} ${now.getFullYear()}`;
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
      title = `Отчет об эффективности товаров за ${this.getQuarterName(now.getMonth())} квартал ${now.getFullYear()}`;
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
      title = `Годовой отчет об эффективности товаров за ${now.getFullYear()} год`;
    }

    // Генерируем данные о наиболее эффективных товарах
    const mostEfficientProducts = [];
    for (let i = 0; i < 10; i++) {
      mostEfficientProducts.push({
        name: `Эффективный товар ${i + 1}`,
        roi: Math.floor(Math.random() * 300) + 200, // ROI в процентах
        utilization: Math.floor(Math.random() * 40) + 60 // 60-100%
      });
    }
    
    // Сортируем по ROI (от большего к меньшему)
    mostEfficientProducts.sort((a, b) => b.roi - a.roi);

    // Генерируем данные о наименее эффективных товарах
    const leastEfficientProducts = [];
    for (let i = 0; i < 10; i++) {
      leastEfficientProducts.push({
        name: `Неэффективный товар ${i + 1}`,
        roi: Math.floor(Math.random() * 50) + 10, // ROI в процентах
        utilization: Math.floor(Math.random() * 40) + 10 // 10-50%
      });
    }
    
    // Сортируем по ROI (от меньшего к большему)
    leastEfficientProducts.sort((a, b) => a.roi - b.roi);

    // Генерируем рекомендуемые действия
    const actionTypes = [
      'Увеличить закупку',
      'Снизить закупку',
      'Увеличить стоимость аренды',
      'Снизить стоимость аренды',
      'Заменить новой моделью',
      'Рассмотреть продажу',
      'Провести рекламную акцию'
    ];

    const recommendedActions = [];
    for (let i = 0; i < 5; i++) {
      // Для эффективных товаров
      recommendedActions.push({
        product: mostEfficientProducts[i].name,
        action: actionTypes[Math.floor(Math.random() * 2)], // Первые две рекомендации для эффективных
        potentialGain: Math.floor(Math.random() * 50000) + 30000
      });
      
      // Для неэффективных товаров
      recommendedActions.push({
        product: leastEfficientProducts[i].name,
        action: actionTypes[Math.floor(Math.random() * 5) + 2], // Остальные рекомендации для неэффективных
        potentialGain: Math.floor(Math.random() * 20000) + 5000
      });
    }

    return {
      title,
      description: `Анализ эффективности использования товаров за период с ${startDate.toLocaleDateString('ru-RU')} по ${now.toLocaleDateString('ru-RU')}`,
      generatedAt: now.toISOString(),
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString(),
      mostEfficientProducts,
      leastEfficientProducts,
      recommendedActions,
      data: {} // Дополнительные данные для отчета
    };
  }

  // Генерация прогнозов (для второй части задания)
  private generateRevenueForecastData(months: number): RevenueForecast[] {
    const forecasts: RevenueForecast[] = [];
    const now = new Date();
    
    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date(now);
      forecastDate.setMonth(now.getMonth() + i);
      
      // Базовый прогнозируемый доход
      const baseRevenue = 200000 + (i * 15000);
      
      // Случайное отклонение ±10%
      const variation = baseRevenue * 0.1;
      const predictedRevenue = baseRevenue + (Math.random() * variation * 2 - variation);
      
      // Нижняя и верхняя границы прогноза (±20% от прогнозируемого значения)
      const bound = predictedRevenue * 0.2;
      
      forecasts.push({
        period: `${this.getMonthName(forecastDate.getMonth())} ${forecastDate.getFullYear()}`,
        predictedRevenue: Math.round(predictedRevenue),
        lowerBound: Math.round(predictedRevenue - bound),
        upperBound: Math.round(predictedRevenue + bound),
        confidence: Math.round(80 - i * 5) // Уменьшение уверенности с увеличением горизонта прогноза
      });
    }
    
    return forecasts;
  }

  private generateSeasonalDemandForecastData(): DemandForecast[] {
    const productNames = [
      'Перфоратор Bosch GBH 2-26',
      'Бетономешалка ЗУБР БС-120-600',
      'Генератор Honda EU22i',
      'Болгарка Makita GA5030',
      'Шуруповерт DeWALT DCD791D2'
    ];
    
    const forecasts: DemandForecast[] = [];
    const seasons = ['Зима', 'Весна', 'Лето', 'Осень'];
    
    for (let i = 0; i < 5; i++) {
      const seasonalDemand: { period: string; demand: number }[] = [];
      
      // Генерируем разные паттерны спроса для разных инструментов
      let pattern: number[] = [];
      if (i === 0) pattern = [30, 80, 100, 50]; // Строительные инструменты: пик весной и летом
      else if (i === 1) pattern = [20, 90, 120, 40]; // Бетономешалки: сильный пик в летнее время
      else if (i === 2) pattern = [40, 50, 120, 70]; // Генераторы: пик летом (дачный сезон)
      else if (i === 3) pattern = [60, 90, 90, 70]; // Болгарки: стабильный спрос с увеличением в сезон
      else pattern = [70, 80, 70, 60]; // Шуруповерты: относительно стабильный спрос
      
      // Создаем сезонный прогноз
      for (let j = 0; j < 4; j++) {
        seasonalDemand.push({
          period: seasons[j],
          demand: pattern[j]
        });
      }
      
      // Определяем тренд на основе паттерна
      let trend: 'increasing' | 'decreasing' | 'stable';
      const avgFirstHalf = (pattern[0] + pattern[1]) / 2;
      const avgSecondHalf = (pattern[2] + pattern[3]) / 2;
      
      if (avgSecondHalf > avgFirstHalf * 1.2) trend = 'increasing';
      else if (avgFirstHalf > avgSecondHalf * 1.2) trend = 'decreasing';
      else trend = 'stable';
      
      forecasts.push({
        productId: i + 1,
        productName: productNames[i],
        seasonalDemand,
        trend,
        confidence: Math.floor(Math.random() * 20) + 75 // 75-95%
      });
    }
    
    return forecasts;
  }

  private generateOptimizationRecommendationsData(): ProductOptimizationRecommendation[] {
    const recommendations: ProductOptimizationRecommendation[] = [];
    const products = [
      'Перфоратор Bosch GBH 2-26',
      'Бетономешалка ЗУБР БС-120-600',
      'Генератор Honda EU22i',
      'Болгарка Makita GA5030',
      'Шуруповерт DeWALT DCD791D2',
      'Лестница-стремянка Alumet 8 ступеней',
      'Сварочный аппарат Ресанта САИ 250',
      'Тепловая пушка Master BLP 53M',
      'Компрессор Metabo PowerAir V 400',
      'Штроборез Makita SG1251J'
    ];
    
    const recommendationTypes: Array<'increase' | 'decrease' | 'maintain' | 'remove' | 'add'> = 
      ['increase', 'decrease', 'maintain', 'remove', 'add'];
    
    const reasonsForIncrease = [
      'Высокий стабильный спрос',
      'Растущая популярность',
      'Высокая рентабельность',
      'Сезонный рост спроса',
      'Конкурентное преимущество'
    ];
    
    const reasonsForDecrease = [
      'Сезонное падение спроса',
      'Недостаточный спрос',
      'Высокие затраты на обслуживание',
      'Появление более современных аналогов',
      'Низкая рентабельность'
    ];
    
    const reasonsForRemove = [
      'Устаревание модели',
      'Прекращение поддержки производителем',
      'Постоянная поломка и высокие затраты',
      'Отсутствие спроса',
      'Появление значительно лучших аналогов'
    ];
    
    const reasonsForAdd = [
      'Растущий спрос на рынке',
      'Запросы от клиентов',
      'Новинка рынка с хорошим потенциалом',
      'Конкурентное предложение',
      'Высокая рентабельность в категории'
    ];
    
    // Создаем рекомендации
    for (let i = 0; i < 7; i++) {
      const type = recommendationTypes[Math.floor(Math.random() * recommendationTypes.length)];
      let reason = '';
      
      switch (type) {
        case 'increase':
          reason = reasonsForIncrease[Math.floor(Math.random() * reasonsForIncrease.length)];
          break;
        case 'decrease':
          reason = reasonsForDecrease[Math.floor(Math.random() * reasonsForDecrease.length)];
          break;
        case 'maintain':
          reason = 'Оптимальный баланс спроса и предложения';
          break;
        case 'remove':
          reason = reasonsForRemove[Math.floor(Math.random() * reasonsForRemove.length)];
          break;
        case 'add':
          reason = reasonsForAdd[Math.floor(Math.random() * reasonsForAdd.length)];
          break;
      }
      
      recommendations.push({
        productId: i + 1,
        productName: type === 'add' ? `Новый продукт #${i+1}` : products[i],
        recommendationType: type,
        reason,
        potentialRevenue: type === 'remove' ? 0 : Math.floor(Math.random() * 200000) + 50000,
        confidence: Math.floor(Math.random() * 25) + 70 // 70-95%
      });
    }
    
    return recommendations;
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

  // Вспомогательные методы
  private getMonthName(month: number): string {
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return monthNames[month];
  }

  private getQuarterName(month: number): string {
    if (month < 3) return 'I';
    if (month < 6) return 'II';
    if (month < 9) return 'III';
    return 'IV';
  }
}

export const AnalyticsService = new AnalyticsServiceClass();
