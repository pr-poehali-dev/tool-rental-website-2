
import { Navigation } from "@/components/ui/Navigation";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6">О компании ПрокатПро</h1>
          <Separator className="mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Наша миссия</h2>
              <p className="text-gray-700 mb-4">
                Наша миссия — сделать профессиональный инструмент доступным для всех. Мы помогаем людям и компаниям решать свои задачи, 
                предоставляя качественный инструмент без необходимости его покупки.
              </p>
              <p className="text-gray-700 mb-4">
                Мы стремимся к тому, чтобы каждый клиент получил именно то, что ему нужно, и остался доволен нашим сервисом.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 mt-8">Наши ценности</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Качество и надежность</li>
                <li>Честность и прозрачность</li>
                <li>Доступность и клиентоориентированность</li>
                <li>Профессионализм и экспертиза</li>
                <li>Бережное отношение к ресурсам</li>
              </ul>
            </div>
            
            <div className="hidden md:block rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1550305080-4e029753abcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Команда ПрокатПро" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Проверенное качество</h3>
                <p className="text-gray-600">Весь наш инструмент проходит тщательную проверку перед каждой сдачей в аренду</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Оперативность</h3>
                <p className="text-gray-600">Быстрое оформление и выдача инструмента, минимум бюрократии</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Доступные цены</h3>
                <p className="text-gray-600">Выгодные тарифы и система скидок при длительной аренде</p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">История компании</h2>
            <p className="text-gray-700 mb-4">
              Компания ПрокатПро была основана в 2018 году группой энтузиастов, увлеченных инструментом и строительством. 
              Начав с небольшого гаража и нескольких единиц техники, мы постепенно расширяли ассортимент и улучшали сервис.
            </p>
            <p className="text-gray-700 mb-4">
              Сегодня мы располагаем более чем 500 единицами техники различных категорий, от небольших электроинструментов до 
              серьезного строительного оборудования. Наши клиенты — как частные лица, так и строительные компании, мастерские и коммунальные службы.
            </p>
            <p className="text-gray-700">
              Мы постоянно обновляем парк техники, следим за новинками рынка и стремимся предлагать только лучшее. 
              Благодаря профессиональному подходу и вниманию к деталям, ПрокатПро стал надежным партнером для многих компаний и частных лиц.
            </p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Наша команда</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="aspect-square overflow-hidden rounded-full mb-4 mx-auto w-40">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Директор" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">Алексей Иванов</h3>
                <p className="text-gray-600">Директор</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square overflow-hidden rounded-full mb-4 mx-auto w-40">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Менеджер" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">Елена Смирнова</h3>
                <p className="text-gray-600">Менеджер по работе с клиентами</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square overflow-hidden rounded-full mb-4 mx-auto w-40">
                  <img 
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Технический специалист" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">Дмитрий Петров</h3>
                <p className="text-gray-600">Технический специалист</p>
              </div>
              
              <div className="text-center">
                <div className="aspect-square overflow-hidden rounded-full mb-4 mx-auto w-40">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Логист" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">Сергей Козлов</h3>
                <p className="text-gray-600">Логист</p>
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

export default About;
