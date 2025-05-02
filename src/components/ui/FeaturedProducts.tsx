
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { CategoryFilter } from "./CategoryFilter";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { Button } from "./button";
import { Link } from "react-router-dom";

export function FeaturedProducts() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const filteredProducts = activeCategory 
    ? PRODUCTS.filter(product => product.category === activeCategory).slice(0, 6)
    : PRODUCTS.slice(0, 6);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Популярные инструменты</h2>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link to="/catalog">Смотреть все инструменты</Link>
          </Button>
        </div>
        
        <CategoryFilter 
          categories={CATEGORIES}
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
