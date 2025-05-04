
// Типы данных для аналитики

// Прогноз доходов
export interface RevenueForecast {
  period: string;
  predictedRevenue: number;
  upperBound: number;
  lowerBound: number;
  confidence: number;
}

// Прогноз сезонного спроса
export interface DemandForecast {
  productName: string;
  productId: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  seasonalDemand: {
    period: string;
    demand: number;
  }[];
}

// Рекомендации по оптимизации ассортимента
export interface ProductOptimizationRecommendation {
  productId: string;
  productName: string;
  recommendationType: 'increase' | 'decrease' | 'maintain' | 'remove' | 'add';
  reason: string;
  confidence: number;
  potentialRevenue: number;
}

// Данные финансового отчета
export interface FinancialReportData {
  title: string;
  description: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalBookings: number;
  revenueByDay: {
    date: string;
    revenue: number;
  }[];
  revenueByCategory: {
    category: string;
    revenue: number;
  }[];
  topClients: {
    name: string;
    revenue: number;
    bookings: number;
  }[];
}

// Данные отчета о загруженности оборудования
export interface EquipmentUsageReportData {
  title: string;
  description: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalEquipment: number;
  totalUsageHours: number;
  avgUsagePerItem: number;
  equipmentByUsage: {
    id: string;
    name: string;
    hours: number;
    utilization: number;
  }[];
  maintenanceAlerts: {
    id: string;
    name: string;
    lastMaintenance: string;
    usageHours: number;
  }[];
}

// Данные отчета об эффективности товаров
export interface ProductEfficiencyReportData {
  title: string;
  description: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  totalProducts: number;
  averageEfficiency: number;
  productEfficiency: {
    id: string;
    name: string;
    efficiency: number;
    revenue: number;
    usage: number;
  }[];
  efficiencyByCategory: {
    category: string;
    efficiency: number;
  }[];
  recommendations: {
    id: string;
    name: string;
    currentPrice: number;
    recommendedPrice: number;
    reason: string;
  }[];
}

// Пример сервиса для аналитики
class AnalyticsServiceClass {
  // Получение прогноза доходов
  async getRevenueForecast(months: number): Promise<RevenueForecast[]> {
    // В реальном приложении здесь будет запрос к API
    // Для примера генерируем тестовые данные
    return Array.from({ length: months }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i + 1);
      const monthName = date.toLocaleString('ru-RU', { month: 'long' });
      const year = date.getFullYear();
      const period = `${monthName} ${year}`;
      
      const baseRevenue = 500000 + Math.random() * 200000;
      const predictedRevenue = baseRevenue * (1 + i * 0.05);
      const confidence = 95 - i * 5;
      const range = predictedRevenue * (1 - confidence / 100);
      
      return {
        period,
        predictedRevenue: Math.round(predictedRevenue),
        upperBound: Math.round(predictedRevenue + range),
        lowerBound: Math.round(predictedRevenue - range),
        confidence
      };
    });
  }

  // Получение прогноза сезонного спроса
  async getSeasonalDemandForecast(): Promise<DemandForecast[]> {
    // В реальном приложении здесь будет запрос к API
    return [
      {
        productName: 'Перфораторы',
        productId: 'cat-1',
        trend: 'increasing',
        confidence: 87,
        seasonalDemand: this.generateSeasonalData('summer')
      },
      {
        productName: 'Шлифовальные машины',
        productId: 'cat-2',
        trend: 'stable',
        confidence: 92,
        seasonalDemand: this.generateSeasonalData('distributed')
      },
      {
        productName: 'Сварочное оборудование',
        productId: 'cat-3',
        trend: 'decreasing',
        confidence: 78,
        seasonalDemand: this.generateSeasonalData('winter')
      }
    ];
  }

  // Получение рекомендаций по оптимизации ассортимента
  async getOptimizationRecommendations(): Promise<ProductOptimizationRecommendation[]> {
    // В реальном приложении здесь будет запрос к API
    return [
      {
        productId: 'prod-1',
        productName: 'Перфоратор Bosch GBH 240',
        recommendationType: 'increase',
        reason: 'Высокий спрос, хорошие показатели окупаемости',
        confidence: 89,
        potentialRevenue: 185000
      },
      {
        productId: 'prod-2',
        productName: 'Шлифовальная машина Makita 9558HN',
        recommendationType: 'maintain',
        reason: 'Стабильный спрос, хорошая рентабельность',
        confidence: 92,
        potentialRevenue: 120000
      },
      {
        productId: 'prod-3',
        productName: 'Дрель-шуруповерт DeWalt DCD996P2',
        recommendationType: 'add',
        reason: 'Высокий спрос на рынке, перспективная ниша',
        confidence: 85,
        potentialRevenue: 230000
      },
      {
        productId: 'prod-4',
        productName: 'Сварочный аппарат Ресанта САИ 190',
        recommendationType: 'decrease',
        reason: 'Снижение спроса, высокие затраты на обслуживание',
        confidence: 81,
        potentialRevenue: 75000
      },
      {
        productId: 'prod-5',
        productName: 'Бетономешалка Энтузиаст Б-180',
        recommendationType: 'remove',
        reason: 'Низкий спрос, высокие затраты на хранение',
        confidence: 93,
        potentialRevenue: 0
      },
      {
        productId: 'prod-6',
        productName: 'Набор ручных инструментов Kraftool 27970-H65',
        recommendationType: 'add',
        reason: 'Растущий спрос, низкие затраты на обслуживание',
        confidence: 87,
        potentialRevenue: 120000
      }
    ];
  }

  // Получение финансового отчета
  async getFinancialReport(period: 'month' | 'quarter' | 'year'): Promise<FinancialReportData> {
    // В реальном приложении здесь будет запрос к API
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    const days = Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const revenueByDay = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.round(10000 + Math.random() * 50000)
      };
    });
    
    const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.revenue, 0);
    
    return {
      title: `Финансовый отчет за ${
        period === 'month' ? 'месяц' :
        period === 'quarter' ? 'квартал' : 'год'
      }`,
      description: `Финансовые показатели за период с ${startDate.toLocaleDateString('ru-RU')} по ${now.toLocaleDateString('ru-RU')}`,
      generatedAt: new Date().toISOString(),
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString(),
      totalRevenue,
      totalBookings: Math.round(days * 5.5),
      revenueByDay,
      revenueByCategory: [
        { category: 'Перфораторы', revenue: Math.round(totalRevenue * 0.25) },
        { category: 'Дрели', revenue: Math.round(totalRevenue * 0.20) },
        { category: 'Шлифовальные машины', revenue: Math.round(totalRevenue * 0.15) },
        { category: 'Сварочное оборудование', revenue: Math.round(totalRevenue * 0.10) },
        { category: 'Бетономешалки', revenue: Math.round(totalRevenue * 0.10) },
        { category: 'Прочее', revenue: Math.round(totalRevenue * 0.20) }
      ],
      topClients: [
        { name: 'ООО "Стройкомплект"', revenue: Math.round(totalRevenue * 0.15), bookings: Math.round(days * 0.8) },
        { name: 'ИП Иванов А.П.', revenue: Math.round(totalRevenue * 0.12), bookings: Math.round(days * 0.6) },
        { name: 'ООО "ТехноСтрой"', revenue: Math.round(totalRevenue * 0.10), bookings: Math.round(days * 0.5) },
        { name: 'Петров Иван Сергеевич', revenue: Math.round(totalRevenue * 0.08), bookings: Math.round(days * 0.4) },
        { name: 'ООО "МастерДом"', revenue: Math.round(totalRevenue * 0.07), bookings: Math.round(days * 0.35) }
      ]
    };
  }

  // Получение отчета о загруженности оборудования
  async getEquipmentUsageReport(period: 'month' | 'quarter' | 'year'): Promise<EquipmentUsageReportData> {
    // В реальном приложении здесь будет запрос к API
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    const totalEquipment = 50;
    const equipmentByUsage = Array.from({ length: totalEquipment }, (_, i) => {
      const usage = Math.round(20 + Math.random() * 180);
      return {
        id: `equip-${i + 1}`,
        name: `Оборудование ${i + 1}`,
        hours: usage,
        utilization: Math.round(usage / 2) // Предполагаем, что максимальная загрузка - 200 часов
      };
    }).sort((a, b) => b.hours - a.hours);
    
    const totalUsageHours = equipmentByUsage.reduce((sum, equipment) => sum + equipment.hours, 0);
    
    // Создаем уведомления о необходимости обслуживания для оборудования с большим количеством часов использования
    const maintenanceThreshold = 150;
    const maintenanceAlerts = equipmentByUsage
      .filter(e => e.hours > maintenanceThreshold)
      .map(e => {
        const lastMaintenanceDate = new Date();
        lastMaintenanceDate.setMonth(lastMaintenanceDate.getMonth() - 3);
        return {
          id: e.id,
          name: e.name,
          lastMaintenance: lastMaintenanceDate.toISOString(),
          usageHours: e.hours
        };
      });
    
    return {
      title: `Отчет о загруженности оборудования за ${
        period === 'month' ? 'месяц' :
        period === 'quarter' ? 'квартал' : 'год'
      }`,
      description: `Анализ использования оборудования за период с ${startDate.toLocaleDateString('ru-RU')} по ${now.toLocaleDateString('ru-RU')}`,
      generatedAt: new Date().toISOString(),
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString(),
      totalEquipment,
      totalUsageHours,
      avgUsagePerItem: Math.round(totalUsageHours / totalEquipment),
      equipmentByUsage,
      maintenanceAlerts
    };
  }

  // Получение отчета об эффективности товаров
  async getProductEfficiencyReport(period: 'month' | 'quarter' | 'year'): Promise<ProductEfficiencyReportData> {
    // В реальном приложении здесь будет запрос к API
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    const totalProducts = 30;
    const productEfficiency = Array.from({ length: totalProducts }, (_, i) => {
      const efficiency = Math.round(30 + Math.random() * 70);
      const usage = Math.round(10 + Math.random() * 90);
      const revenue = usage * 1000 * (efficiency / 50);
      
      return {
        id: `prod-${i + 1}`,
        name: `Товар ${i + 1}`,
        efficiency,
        revenue: Math.round(revenue),
        usage
      };
    }).sort((a, b) => b.efficiency - a.efficiency);
    
    const categories = ['Перфораторы', 'Дрели', 'Шлифовальные машины', 'Сварочное оборудование', 'Бетономешалки'];
    const efficiencyByCategory = categories.map(category => ({
      category,
      efficiency: Math.round(30 + Math.random() * 70)
    })).sort((a, b) => b.efficiency - a.efficiency);
    
    const recommendations = productEfficiency
      .filter((p, i) => i < 10 && p.efficiency < 50)
      .map(p => {
        const currentPrice = 1000 + Math.round(Math.random() * 4000);
        const recommendedPrice = p.efficiency < 30
          ? Math.round(currentPrice * 0.8)
          : Math.round(currentPrice * 1.2);
        
        return {
          id: p.id,
          name: p.name,
          currentPrice,
          recommendedPrice,
          reason: p.efficiency < 30
            ? 'Низкий спрос по текущей цене, рекомендуется снижение цены'
            : 'Высокий спрос, возможность увеличения ценовой политики'
        };
      });
    
    const totalEfficiency = productEfficiency.reduce((sum, product) => sum + product.efficiency, 0);
    
    return {
      title: `Отчет об эффективности товаров за ${
        period === 'month' ? 'месяц' :
        period === 'quarter' ? 'квартал' : 'год'
      }`,
      description: `Анализ эффективности использования товаров за период с ${startDate.toLocaleDateString('ru-RU')} по ${now.toLocaleDateString('ru-RU')}`,
      generatedAt: new Date().toISOString(),
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString(),
      totalProducts,
      averageEfficiency: Math.round(totalEfficiency / totalProducts),
      productEfficiency,
      efficiencyByCategory,
      recommendations
    };
  }

  // Вспомогательная функция для генерации сезонных данных
  private generateSeasonalData(type: 'summer' | 'winter' | 'distributed'): { period: string; demand: number }[] {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    
    return months.map((month, index) => {
      let demand: number;
      
      if (type === 'summer') {
        // Летний пик (май-август)
        demand = index >= 4 && index <= 7
          ? 70 + Math.random() * 30
          : 20 + Math.random() * 30;
      } else if (type === 'winter') {
        // Зимний пик (ноябрь-февраль)
        demand = (index >= 10 || index <= 1)
          ? 70 + Math.random() * 30
          : 20 + Math.random() * 30;
      } else {
        // Равномерное распределение с небольшими колебаниями
        demand = 40 + Math.random() * 40;
      }
      
      return {
        period: month,
        demand: Math.round(demand)
      };
    });
  }
}

export const AnalyticsService = new AnalyticsServiceClass();
