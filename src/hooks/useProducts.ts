
import { useState, useCallback } from 'react';
import { ProductService } from '@/services/product-service';
import { PaginatedResponse, Product, ProductFilter } from '@/lib/api/types';
import { useToast } from '@/components/ui/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Получение списка продуктов
  const fetchProducts = useCallback(async (filters?: ProductFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PaginatedResponse<Product> = await ProductService.getProducts(filters);
      
      setProducts(response.items);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
      
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке продуктов';
      setError(errorMessage);
      
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Получение детальной информации о продукте
  const fetchProductById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const product = await ProductService.getProductById(id);
      setCurrentProduct(product);
      return product;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке продукта';
      setError(errorMessage);
      
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Получение популярных продуктов
  const fetchFeaturedProducts = useCallback(async (limit: number = 6) => {
    setLoading(true);
    setError(null);
    
    try {
      const products = await ProductService.getFeaturedProducts(limit);
      setFeaturedProducts(products);
      return products;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке популярных продуктов';
      setError(errorMessage);
      
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Получение категорий
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const categoryList = await ProductService.getCategories();
      setCategories(categoryList);
      return categoryList;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке категорий';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение брендов
  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const brandList = await ProductService.getBrands();
      setBrands(brandList);
      return brandList;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке брендов';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    featuredProducts,
    currentProduct,
    categories,
    brands,
    pagination,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    fetchFeaturedProducts,
    fetchCategories,
    fetchBrands
  };
};

export default useProducts;
