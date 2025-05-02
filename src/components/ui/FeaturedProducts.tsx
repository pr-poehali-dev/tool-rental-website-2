
import { useState } from "react";
import { ProductCard, ProductProps } from "./ProductCard";
import { CategoryFilter } from "./CategoryFilter";

const MOCK_PRODUCTS: ProductProps[] = [
  {
    id: 1,
    name: "Бензопила STIHL MS 180",
    price: 1200,
    image: "https://images.unsplash.com/photo-1566331126804-c94bf890bc74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Пилы",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Триммер бензиновый HUSQVARNA 128R",
    price: 900,
    image: "https://images.unsplash.com/photo-1621958548490-eae921b80adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Триммеры",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Генератор бензиновый CHAMPION GG3300",
    price: 1500,
    image: "https://images.unsplash.com/photo-1636197176911-7aa47728cfab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Генераторы",
    isAvailable: false,
  },
  {
    id: 4,
    name: "Мотобур ECHO EA-410",
    price: 1800,
    image: "https://images.unsplash.com/photo-1620293023555-272e1a661b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Буры",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Виброплита WACKER NEUSON WP1540A",
    price: 1700,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Виброплиты",
    isAvailable: true,
  },
  {
    id: 6,
    name: "Бензоножницы STIHL HS 45",
    price: 950,
    image: "https://images.unsplash.com/photo-1578776349090-5bb7a4b9f1c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Ножницы",
    isAvailable: false,
  }
];

export function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = [...new Set(MOCK_PRODUCTS.map(product => product.category))];
  
  const filteredProducts = activeCategory 
    ? MOCK_PRODUCTS.filter(product => product.category === activeCategory)
    : MOCK_PRODUCTS;

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Популярные инструменты</h2>
        
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;
