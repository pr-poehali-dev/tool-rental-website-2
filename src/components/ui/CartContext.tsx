
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  product: Product;
  quantity: number;
  days: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, days: number) => void;
  removeItem: (productId: number) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  updateItemDays: (productId: number, days: number) => void;
  clearCart: () => void;
  itemsCount: number;
  totalPrice: number;
  totalDeposit: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Ошибка при загрузке корзины:", error);
      }
    }
  }, []);
  
  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  
  const addItem = (product: Product, quantity: number, days: number) => {
    if (!product.isAvailable) {
      toast({
        title: "Товар недоступен",
        description: "К сожалению, данный товар сейчас недоступен для аренды",
        variant: "destructive"
      });
      return;
    }
    
    setItems(prevItems => {
      // Проверяем, есть ли уже такой товар в корзине
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Если товар уже в корзине, обновляем количество
        const updatedItems = prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity, days: days } 
            : item
        );
        
        toast({
          title: "Товар обновлен",
          description: `${product.name} (${quantity} шт, ${days} дн.) обновлен в корзине`
        });
        
        return updatedItems;
      } else {
        // Если товара нет в корзине, добавляем новый
        toast({
          title: "Товар добавлен",
          description: `${product.name} (${quantity} шт, ${days} дн.) добавлен в корзину`
        });
        
        return [...prevItems, { product, quantity, days }];
      }
    });
  };
  
  const removeItem = (productId: number) => {
    setItems(prevItems => {
      const item = prevItems.find(item => item.product.id === productId);
      
      if (item) {
        toast({
          title: "Товар удален",
          description: `${item.product.name} удален из корзины`
        });
      }
      
      return prevItems.filter(item => item.product.id !== productId);
    });
  };
  
  const updateItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const updateItemDays = (productId: number, days: number) => {
    if (days <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, days } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Корзина очищена",
      description: "Все товары удалены из корзины"
    });
  };
  
  // Подсчет общего количества товаров
  const itemsCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Подсчет общей стоимости аренды
  const totalPrice = items.reduce((total, item) => {
    const itemPrice = item.product.price * item.quantity * item.days;
    // Учитываем скидку, если она есть
    if (item.product.discount) {
      return total + (itemPrice * (1 - item.product.discount / 100));
    }
    return total + itemPrice;
  }, 0);
  
  // Подсчет общей суммы залога
  const totalDeposit = items.reduce((total, item) => {
    return total + (item.product.deposit * item.quantity);
  }, 0);
  
  const value = {
    items,
    addItem,
    removeItem,
    updateItemQuantity,
    updateItemDays,
    clearCart,
    itemsCount,
    totalPrice,
    totalDeposit
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }
  return context;
};
