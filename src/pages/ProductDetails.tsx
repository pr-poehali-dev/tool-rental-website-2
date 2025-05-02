
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/ui/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, Product } from "@/data/products";
import { ChevronLeft, Check, AlertTriangle, Truck, ShieldCheck } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    if (id) {
      const foundProduct = PRODUCTS.find(p => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
        setMainImage(foundProduct.image);
      }
    }
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    console.log("Добавление в корзину:", { product, quantity });
    // Здесь будет логика добавления в корзину
  };
  
  const handleImageChange = (image: string) => {
    setMainImage(image);
  };
  
  const galleryImages = [product.image, ...(product.gallery || [])];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="flex items-center">
            <Link to="/catalog">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад в каталог
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Изображения продукта */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden aspect-square mb-4">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg overflow-hidden border cursor-pointer aspect-square ${mainImage === image ? 'ring-2 ring-orange-500' : ''}`}
                    onClick={() => handleImageChange(image)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - изображение ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Информация о продукте */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.shortDescription}</p>
            
            <div className="flex items-center mb-6">
              <Badge 
                className={product.isAvailable ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                variant="outline"
              >
                {product.isAvailable ? 'В наличии' : 'Занят'}
              </Badge>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-600">Бренд: {product.brand}</span>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-600">Категория: {product.category}</span>
            </div>
            
            <div className="mb-6">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {product.price} ₽/день
                {product.discount && (
                  <span className="ml-2 line-through text-lg text-gray-400">
                    {Math.round(product.price / (1 - product.discount / 100))} ₽
                  </span>
                )}
              </div>
              <div className="text-gray-600">Залог: {product.deposit} ₽</div>
            </div>
            
            {product.isAvailable && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex border rounded-md">
                  <button
                    className="px-3 py-2 border-r"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    className="px-3 py-2 border-l"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className="bg-orange-600 hover:bg-orange-700"
                  disabled={!product.isAvailable}
                >
                  Добавить в корзину
                </Button>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start mb-3">
                <Truck className="h-5 w-5 mr-2 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Доставка</h4>
                  <p className="text-gray-600 text-sm">Доставка по городу от 300 ₽. Самовывоз бесплатно.</p>
                </div>
              </div>
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 mr-2 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Гарантия</h4>
                  <p className="text-gray-600 text-sm">Вся техника проходит диагностику перед сдачей в аренду.</p>
                </div>
              </div>
            </div>
            
            {product.rentalConditions && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Условия аренды:</h3>
                <ul className="space-y-1">
                  {product.rentalConditions.map((condition, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Дополнительная информация */}
        <Tabs defaultValue="description">
          <TabsList className="mb-6">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specifications">Характеристики</TabsTrigger>
            {product.benefits && (
              <TabsTrigger value="benefits">Преимущества</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="description" className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 whitespace-pre-line">{product.fullDescription}</p>
          </TabsContent>
          
          <TabsContent value="specifications" className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              {product.weight && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Вес</span>
                  <span className="font-medium">{product.weight} кг</span>
                </div>
              )}
              {product.power && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Мощность</span>
                  <span className="font-medium">{product.power} кВт</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          {product.benefits && (
            <TabsContent value="benefits" className="bg-white p-6 rounded-lg shadow-sm">
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          )}
        </Tabs>
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

export default ProductDetails;
