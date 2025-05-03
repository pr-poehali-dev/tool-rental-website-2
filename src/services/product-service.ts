
import { api } from '@/lib/api/axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  Product,
  ProductFilter
} from '@/lib/api/types';

/**
 * Сервис для работы с продуктами
 */
export const ProductService = {
  /**
   * Получение списка всех продуктов с пагинацией и фильтрацией
   */
  getProducts: async (filters?: ProductFilter): Promise<PaginatedResponse<Product>> => {
    // Формируем параметры запроса из фильтров
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.availability && filters.availability !== 'all') {
        params.append('available', (filters.availability === 'available').toString());
      }
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      // Добавляем категории и бренды как множественные параметры
      filters.categories?.forEach(category => {
        params.append('categories[]', category);
      });
      
      filters.brands?.forEach(brand => {
        params.append('brands[]', brand);
      });
    }
    
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
    return response.data;
  },
  
  /**
   * Получение детальной информации о продукте по ID
   */
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
  
  /**
   * Получение списка популярных продуктов
   */
  getFeaturedProducts: async (limit: number = 6): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/featured', { params: { limit } });
    return response.data;
  },
  
  /**
   * Получение списка категорий
   */
  getCategories: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/products/categories');
    return response.data;
  },
  
  /**
   * Получение списка брендов
   */
  getBrands: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/products/brands');
    return response.data;
  },
  
  /**
   * Создание нового продукта (только для администраторов)
   */
  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', productData);
    return response.data;
  },
  
  /**
   * Обновление существующего продукта (только для администраторов)
   */
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, productData);
    return response.data;
  },
  
  /**
   * Удаление продукта (только для администраторов)
   */
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete<ApiResponse<null>>(`/products/${id}`);
  },
  
  /**
   * Проверка доступности продукта в определенные даты
   */
  checkAvailability: async (productId: number, startDate: string, endDate: string): Promise<boolean> => {
    const response = await api.get<ApiResponse<{ available: boolean }>>(`/products/${productId}/availability`, {
      params: { startDate, endDate }
    });
    return response.data.available;
  }
};

export default ProductService;
