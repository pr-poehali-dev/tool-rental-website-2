
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { Slider } from "./slider";
import { Separator } from "./separator";
import { Button } from "./button";
import { X } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  initialFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  availability: "all" | "available" | "unavailable";
  sortBy: "relevance" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
}

export function FilterSidebar({ 
  categories, 
  brands, 
  initialFilters, 
  onFilterChange,
  isMobile = false,
  onCloseMobile
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAvailabilityChange = (value: "all" | "available" | "unavailable") => {
    const newFilters = { ...filters, availability: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: FilterState["sortBy"]) => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 3000],
      availability: "all",
      sortBy: "relevance"
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className={`bg-white rounded-lg border p-4 ${isMobile ? 'w-full h-full overflow-auto' : ''}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Фильтры</h3>
          <Button variant="ghost" size="icon" onClick={onCloseMobile}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Сортировка</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FilterState["sortBy"])}
          >
            <option value="relevance">По релевантности</option>
            <option value="price-asc">По цене (возрастание)</option>
            <option value="price-desc">По цене (убывание)</option>
            <option value="name-asc">По имени (А-Я)</option>
            <option value="name-desc">По имени (Я-А)</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Доступность</label>
          <div className="flex gap-4 mt-1">
            <div className="flex items-center">
              <input
                type="radio"
                id="all"
                name="availability"
                className="mr-2"
                checked={filters.availability === "all"}
                onChange={() => handleAvailabilityChange("all")}
              />
              <Label htmlFor="all">Все</Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="available"
                name="availability"
                className="mr-2"
                checked={filters.availability === "available"}
                onChange={() => handleAvailabilityChange("available")}
              />
              <Label htmlFor="available">В наличии</Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="unavailable"
                name="availability"
                className="mr-2"
                checked={filters.availability === "unavailable"}
                onChange={() => handleAvailabilityChange("unavailable")}
              />
              <Label htmlFor="unavailable">Занятые</Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <label className="text-sm font-medium">Цена аренды (₽/день)</label>
          <div className="mt-6 px-2">
            <Slider
              defaultValue={filters.priceRange}
              min={0}
              max={3000}
              step={100}
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              className="mb-6"
            />
            <div className="flex justify-between">
              <span>{filters.priceRange[0]} ₽</span>
              <span>{filters.priceRange[1]} ₽</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <Accordion type="multiple" defaultValue={["categories", "brands"]} className="w-full">
          <AccordionItem value="categories">
            <AccordionTrigger>Категории</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="brands">
            <AccordionTrigger>Бренды</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`brand-${brand}`}
                      checked={filters.brands.includes(brand)}
                      onCheckedChange={(checked) => handleBrandChange(brand, checked === true)}
                    />
                    <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button 
          onClick={handleReset} 
          variant="outline" 
          className="w-full"
        >
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
}

export default FilterSidebar;
