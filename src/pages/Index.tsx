
import { Navigation } from "@/components/ui/Navigation";
import { Hero } from "@/components/ui/Hero";
import { FeaturedProducts } from "@/components/ui/FeaturedProducts";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main>
        <Hero />
        <FeaturedProducts />
        
        <section className="py-16 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Большой выбор</h3>
              <p className="text-gray-700">Более 100 единиц техники различного назначения для любых задач</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Выгодные цены</h3>
              <p className="text-gray-700">Доступная аренда от суток. Скидки при длительной аренде</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Простые условия</h3>
              <p className="text-gray-700">Минимум документов, быстрое оформление и возврат техники</p>
            </div>
          </div>
        </section>
      </main>
      
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

export default Index;
