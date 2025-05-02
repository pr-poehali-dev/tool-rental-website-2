
import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/Navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { FilterSidebar, FilterState } from "@/components/ui/FilterSidebar";
import { Button } from "@/components/ui/button";
import { PRODUCTS, CATEGORIES, BRANDS, Product } from "@/data/products";
import { Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ITEMS_PER_PAGE = 6;

const Catalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 3000],
    availability: "all",
    sortBy: "relevance"
  });

  // Apply filters and sorting
  useEffect(() => {
    let result = [...PRODUCTS];
    
    // Filter by categories
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.category));
    }
    
    // Filter by brands
    if (filters.brands.length > 0) {
      result = result.filter(product => filters.brands.includes(product.brand));
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // Filter by availability
    if (filters.availability === "available") {
      result = result.filter(product => product.isAvailable);
    } else if (filters.availability === "unavailable") {
      result = result.filter(product => !product.isAvailable);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // relevance - keep original order
        break;
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.availability !== "all" ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 3000 ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Каталог инструментов</h1>
        
        <div className="block md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[350px] p-0">
              <FilterSidebar 
                categories={CATEGORIES} 
                brands={BRANDS} 
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                isMobile={true}
                onCloseMobile={() => document.body.click()} // Close sheet
              />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="hidden md:block">
            <FilterSidebar 
              categories={CATEGORIES} 
              brands={BRANDS} 
              initialFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="md:col-span-3">
            {currentProducts.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
                <p className="text-gray-600 mb-4">Попробуйте изменить параметры фильтрации</p>
                <Button 
                  onClick={() => setFilters({
                    categories: [],
                    brands: [],
                    priceRange: [0, 3000],
                    availability: "all",
                    sortBy: "relevance"
                  })}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Сбросить все фильтры
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map(product => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <footer className="mt-auto bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-3">ПрокатПро</h4>
              <p className="text-gray-300">Профессиональный инструмент в аренду для любых задач</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Контакты</h4>
              <p className="text-gray-300">Телефон: +7 (999) 123-45-67</p>
              <p className="text-gray-300">Email: info@prokatpro.ru</p>
              <p className="text-gray-300">Адрес: г. Москва, ул. Инструментальная, 42</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Режим работы</h4>
              <p className="text-gray-300">Пн-Пт: 9:00 - 20:00</p>
              <p className="text-gray-300">Сб: 10:00 - 18:00</p>
              <p className="text-gray-300">Вс: выходной</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            © 2025 ПрокатПро. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Catalog;
