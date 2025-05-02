
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Link } from "react-router-dom";

export interface ProductProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export function ProductCard({ id, name, price, image, category, isAvailable }: ProductProps) {
  return (
    <Card className="overflow-hidden transition-transform hover:scale-105">
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          <img 
            src={image} 
            alt={name} 
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isAvailable ? 'В наличии' : 'Занят'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-sm text-gray-500 mb-1">{category}</div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="mt-2 font-bold text-orange-600">{price} ₽/день</div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="default" className="w-full bg-orange-600 hover:bg-orange-700">
          <Link to={`/product/${id}`}>Подробнее</Link>
        </Button>
        {isAvailable && (
          <Button variant="outline" className="w-full">
            В корзину
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
