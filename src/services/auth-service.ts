
import { api } from '@/lib/api/axios';
import { 
  ApiResponse, 
  AuthCredentials, 
  AuthResponse, 
  RegistrationData, 
  User 
} from '@/lib/api/types';
import { STORAGE_KEYS } from '@/lib/api/config';

/**
 * Сервис для работы с аутентификацией и управлением пользователями
 */
export const AuthService = {
  /**
   * Вход пользователя в систему
   */
  login: async (credentials: AuthCredentials): Promise<User> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { token, refreshToken, user } = response.data;
    
    // Сохраняем данные в локальное хранилище
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    
    return user;
  },
  
  /**
   * Регистрация нового пользователя
   */
  register: async (data: RegistrationData): Promise<User> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { token, refreshToken, user } = response.data;
    
    // Сохраняем данные в локальное хранилище
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    
    return user;
  },
  
  /**
   * Выход пользователя из системы
   */
  logout: async (): Promise<void> => {
    try {
      // Отправляем запрос на сервер для инвалидации токена
      await api.post<ApiResponse<null>>('/auth/logout');
    } catch (error) {
      // Игнорируем ошибки - в любом случае удаляем локальные данные
    }
    
    // Очищаем локальное хранилище
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
  
  /**
   * Получение данных текущего пользователя
   */
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },
  
  /**
   * Проверка авторизации пользователя
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },
  
  /**
   * Проверка, является ли пользователь администратором
   */
  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'admin';
  },
  
  /**
   * Обновление профиля пользователя
   */
  updateProfile: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${userId}`, data);
    
    // Обновляем данные пользователя в локальном хранилище
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }
    
    return response.data;
  },
  
  /**
   * Сброс пароля - запрос ссылки для восстановления
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post<ApiResponse<null>>('/auth/password-reset-request', { email });
  },
  
  /**
   * Сброс пароля - установка нового пароля
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post<ApiResponse<null>>('/auth/password-reset', { token, newPassword });
  },
  
  /**
   * Изменение пароля пользователя
   */
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post<ApiResponse<null>>('/auth/change-password', { oldPassword, newPassword });
  }
};

export default AuthService;
