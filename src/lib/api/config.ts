
/**
 * Базовые конфигурации для работы с API
 */

// Базовый URL API
export const API_BASE_URL = 'https://api.prokatpro.ru/v1';

// Тайм-аут запросов (в мс)
export const API_TIMEOUT = 10000;

// Заголовки по умолчанию
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Ключи для локального хранилища
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data'
};

// Коды ошибок API
export enum ApiErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_REQUEST = 400
}

// Конфигурация для повторных попыток
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 секунда
  backoffFactor: 2 // Экспоненциальное увеличение задержки
};
