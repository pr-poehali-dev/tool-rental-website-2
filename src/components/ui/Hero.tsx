
import { Button } from "./button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="bg-orange-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Профессиональный инструмент в аренду</h1>
            <p className="text-lg mb-6 text-gray-700">
              Бензопилы, триммеры, генераторы и другая техника для любых задач. 
              Доступные цены и гибкие условия аренды.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link to="/catalog">Выбрать инструмент</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contacts">Связаться с нами</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1563345202-838434935deb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Бензоинструмент" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
