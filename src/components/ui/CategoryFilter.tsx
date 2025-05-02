
import { Button } from "./button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ categories, activeCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button 
        variant={activeCategory === null ? "default" : "outline"}
        className={activeCategory === null ? "bg-orange-600 hover:bg-orange-700" : ""}
        onClick={() => onSelectCategory(null)}
      >
        Все категории
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          className={activeCategory === category ? "bg-orange-600 hover:bg-orange-700" : ""}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

export default CategoryFilter;
