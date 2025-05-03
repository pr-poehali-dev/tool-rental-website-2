
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/ui/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/components/ui/CartContext";
import { ChevronLeft, Check, Star, ShieldCheck, Truck, Calendar, Percent, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    // Имитация загрузки данных с сервера
    setLoading(true);
    setTimeout(() => {
      if (id) {
        const foundProduct = PRODUCTS.find(p => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.image);
        }
        setLoading(false);
      }
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-6"></div>
                <div className="h-32 bg-gray-200 rounded w-full mt-6"></div>
                <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
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
    addItem(product, quantity, days);
    toast({
      title: "Товар добавлен в корзину",
      description: `${product.name} (${quantity} шт.) на ${days} дней`,
    });
  };
  
  const handleImageChange = (image: string, index: number) => {
    setMainImage(image);
    setCurrentImageIndex(index);
  };
  
  const galleryImages = [product.image, ...(product.gallery || [])];
  
  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % galleryImages.length;
    setMainImage(galleryImages[newIndex]);
    setCurrentImageIndex(newIndex);
  };
  
  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setMainImage(galleryImages[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  // Расчет итоговой цены с учетом количества дней и скидки
  const calculatePrice = () => {
    let price = product.price * days * quantity;
    if (product.discount) {
      price = price * (1 - product.discount / 100);
    }
    return Math.round(price);
  };

  // Расчет сэкономленной суммы при наличии скидки
  const calculateSaving = () => {
    if (!product.discount) return 0;
    const fullPrice = product.price * days * quantity;
    const discountedPrice = calculatePrice();
    return Math.round(fullPrice - discountedPrice);
  };

  // Форматирование цены для улучшения читаемости
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="flex items-center group transition-all">
            <Link to="/catalog">
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Назад в каталог
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Изображения продукта */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden aspect-square mb-4 relative group shadow-sm">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-contain transition-all duration-300"
              />
              
              {galleryImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Предыдущее изображение"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Следующее изображение"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
              
              {product.discount && (
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-sm font-bold py-1 px-3 rounded-full flex items-center">
                  <Percent className="h-3 w-3 mr-1" /> -{product.discount}%
                </div>
              )}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg overflow-hidden border cursor-pointer aspect-square hover:opacity-90 transition-opacity ${mainImage === image ? 'ring-2 ring-orange-500' : ''}`}
                    onClick={() => handleImageChange(image, index)}
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
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge 
                className={`${product.isAvailable 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-red-100 text-red-800 border-red-200'} 
                  transition-all duration-200 hover:scale-105`}
                variant="outline"
              >
                {product.isAvailable ? 'В наличии' : 'Занят'}
              </Badge>
              
              <Badge variant="secondary" className="gap-1 flex items-center">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                4.8
              </Badge>
              
              <span className="text-gray-600 text-sm">Бренд: <span className="font-medium">{product.brand}</span></span>
              <span className="text-gray-600 text-sm">Категория: <span className="font-medium">{product.category}</span></span>
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPrice(product.price)} ₽/день
                  </div>
                  
                  {product.discount && (
                    <div className="flex items-center mt-1">
                      <span className="line-through text-gray-400 mr-2">
                        {formatPrice(Math.round(product.price / (1 - product.discount / 100)))} ₽
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        Экономия {product.discount}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-gray-700 font-medium">
                    Залог: {formatPrice(product.deposit)} ₽
                  </div>
                  <div className="text-sm text-gray-500">
                    (возвращается)
                  </div>
                </div>
              </div>
            </div>
            
            {product.isAvailable && (
              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Количество</label>
                    <div className="flex border rounded-md w-32 overflow-hidden">
                      <button
                        className="px-3 py-2 border-r bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 flex-1 text-center font-medium">{quantity}</span>
                      <button
                        className="px-3 py-2 border-l bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      Срок аренды (дней)
                    </label>
                    <div className="flex border rounded-md w-32 overflow-hidden">
                      <button
                        className="px-3 py-2 border-r bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => setDays(Math.max(1, days - 1))}
                        disabled={days <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 flex-1 text-center font-medium">{days}</span>
                      <button
                        className="px-3 py-2 border-l bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => setDays(days + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-md border border-orange-100">
                  <div className="flex justify-between items-center font-medium">
                    <span>Итого за аренду:</span>
                    <span className="text-lg font-bold text-orange-600">{formatPrice(calculatePrice())} ₽</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                    <span>Залог (возвращается):</span>
                    <span>{formatPrice(product.deposit * quantity)} ₽</span>
                  </div>
                  
                  {product.discount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600 mt-1">
                      <span>Ваша экономия:</span>
                      <span>{formatPrice(calculateSaving())} ₽</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-orange-600 hover:bg-orange-700 transition-all hover:shadow-lg py-6 text-base font-medium"
                  disabled={!product.isAvailable}
                >
                  Арендовать сейчас
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 mr-3 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Доставка</h4>
                    <p className="text-gray-600 text-sm">Доставка по городу от 300 ₽. Самовывоз бесплатно.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 mr-3 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Гарантия</h4>
                    <p className="text-gray-600 text-sm">Вся техника проходит диагностику перед сдачей в аренду.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {product.rentalConditions && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-semibold mb-3">Условия аренды:</h3>
                <ul className="space-y-2">
                  {product.rentalConditions.map((condition, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Дополнительная информация */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="mb-6 border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="description" 
              className="rounded-t-lg py-3 px-6 data-[state=active]:bg-white data-[state=active]:border-gray-200 data-[state=active]:border-b-white data-[state=active]:border data-[state=active]:text-orange-600 focus:ring-0 focus:ring-offset-0"
            >
              Описание
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="rounded-t-lg py-3 px-6 data-[state=active]:bg-white data-[state=active]:border-gray-200 data-[state=active]:border-b-white data-[state=active]:border data-[state=active]:text-orange-600 focus:ring-0 focus:ring-offset-0"
            >
              Характеристики
            </TabsTrigger>
            {product.benefits && (
              <TabsTrigger 
                value="benefits" 
                className="rounded-t-lg py-3 px-6 data-[state=active]:bg-white data-[state=active]:border-gray-200 data-[state=active]:border-b-white data-[state=active]:border data-[state=active]:text-orange-600 focus:ring-0 focus:ring-offset-0"
              >
                Преимущества
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="description" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.fullDescription}</p>
          </TabsContent>
          
          <TabsContent value="specifications" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
              {product.weight && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Вес</span>
                  <span className="font-medium text-gray-800">{product.weight} кг</span>
                </div>
              )}
              {product.power && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Мощность</span>
                  <span className="font-medium text-gray-800">{product.power} кВт</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          {product.benefits && (
            <TabsContent value="benefits" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          )}
        </Tabs>
        
        {/* Рекомендуемые товары */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Рекомендуемые товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PRODUCTS.filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="group">
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all hover:shadow-md">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{relatedProduct.name}</h3>
                      <div className="mt-2 font-bold text-orange-600">{formatPrice(relatedProduct.price)} ₽/день</div>
                    </div>
                  </div>
                </Link>
              ))}
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

export default ProductDetails;
