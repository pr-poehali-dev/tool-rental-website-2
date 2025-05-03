
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS, STORAGE_KEYS } from './config';
import { toast } from '@/components/ui/use-toast';

// Создаем экземпляр axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS
});

// Перехватчик запросов - добавляет токен аутентификации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов - обрабатывает общие ошибки
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { response } = error;

    // Обработка сетевых ошибок
    if (!response) {
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте ваше подключение к интернету',
        variant: 'destructive'
      });
      return Promise.reject(error);
    }

    // Обработка 401 (Unauthorized) - токен истек или недействителен
    if (response.status === 401) {
      // Попытка обновить токен
      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          // Если нет refresh токена - выход из системы
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Запрос на обновление токена
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: DEFAULT_HEADERS }
        );

        const { token, refreshToken: newRefreshToken } = refreshResponse.data;
        
        // Сохранение новых токенов
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        
        // Повторяем исходный запрос с новым токеном
        const originalRequest = error.config;
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Если обновление токена не удалось - выход из системы
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }
    }

    // Обработка серверных ошибок
    if (response.status >= 500) {
      toast({
        title: 'Ошибка сервера',
        description: 'Попробуйте повторить запрос позже',
        variant: 'destructive'
      });
    }

    return Promise.reject(error);
  }
);

// Типизированные функции для API-запросов
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(response => response.data),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(response => response.data),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(response => response.data),
  
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config).then(response => response.data),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(response => response.data)
};

export default apiClient;
