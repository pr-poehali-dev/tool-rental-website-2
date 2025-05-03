
import { useState } from "react";
import { Navigation } from "@/components/ui/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contacts = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки формы
    setTimeout(() => {
      toast({
        title: "Сообщение отправлено",
        description: "Мы свяжемся с вами в ближайшее время",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-12">Контакты</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Наши контакты</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-orange-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Адрес</h3>
                    <p className="text-gray-600">г. Москва, ул. Инструментальная, 42</p>
                    <p className="text-gray-600 mt-1">Метро: Инструментальная (5 минут пешком)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-orange-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Телефоны</h3>
                    <p className="text-gray-600">Отдел аренды: +7 (999) 123-45-67</p>
                    <p className="text-gray-600">Техническая поддержка: +7 (999) 765-43-21</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-orange-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">Общие вопросы: info@prokatpro.ru</p>
                    <p className="text-gray-600">Аренда: rent@prokatpro.ru</p>
                    <p className="text-gray-600">Сотрудничество: partners@prokatpro.ru</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-orange-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Режим работы</h3>
                    <p className="text-gray-600">Понедельник - Пятница: 9:00 - 20:00</p>
                    <p className="text-gray-600">Суббота: 10:00 - 18:00</p>
                    <p className="text-gray-600">Воскресенье: выходной</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Реквизиты компании</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">ООО "ПрокатПро"</p>
                  <p className="text-sm text-gray-600">ИНН: 7712345678</p>
                  <p className="text-sm text-gray-600">ОГРН: 1234567890123</p>
                  <p className="text-sm text-gray-600">Юридический адрес: 125009, г. Москва, ул. Инструментальная, д. 42</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Напишите нам</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Ваше имя *</label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Введите ваше имя"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Введите ваш email"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Телефон</label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Сообщение *</label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Введите ваше сообщение"
                    rows={5}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Как нас найти</h2>
            <div className="rounded-lg overflow-hidden h-[400px]">
              {/* Здесь можно подключить карту Google Maps или Яндекс.Карты */}
              <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                <p className="text-gray-600">Карта с расположением компании</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Какие документы нужны для аренды инструмента?</h3>
                <p className="text-gray-600">Для аренды инструмента вам понадобится паспорт гражданина РФ и денежные средства для внесения залога.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Как осуществляется доставка?</h3>
                <p className="text-gray-600">Мы осуществляем доставку по Москве и Московской области. Стоимость и сроки доставки зависят от удаленности и габаритов инструмента.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Что делать, если инструмент сломался во время аренды?</h3>
                <p className="text-gray-600">В случае поломки инструмента необходимо незамедлительно связаться с нами. Если поломка произошла не по вашей вине, мы заменим инструмент на аналогичный.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
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

export default Contacts;
