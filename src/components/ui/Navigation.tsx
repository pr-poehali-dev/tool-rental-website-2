
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Badge } from "./badge";

export function Navigation() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-2xl text-orange-600">
            ПрокатПро
          </Link>
          <div className="hidden md:flex gap-6">
            <Link to="/catalog" className="hover:text-orange-600 transition-colors">
              Каталог
            </Link>
            <Link to="/about" className="hover:text-orange-600 transition-colors">
              О нас
            </Link>
            <Link to="/contacts" className="hover:text-orange-600 transition-colors">
              Контакты
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                {cartCount}
              </Badge>
            )}
          </Link>
          <Link to="/login">
            <User className="h-6 w-6" />
          </Link>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 pt-10">
                <Link to="/" className="text-lg font-medium">Главная</Link>
                <Link to="/catalog" className="text-lg font-medium">Каталог</Link>
                <Link to="/about" className="text-lg font-medium">О нас</Link>
                <Link to="/contacts" className="text-lg font-medium">Контакты</Link>
                <Link to="/login" className="text-lg font-medium">Вход/Регистрация</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
