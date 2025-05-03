
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/components/ui/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserRole } from "@/lib/api/types";

import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Защищенные маршруты для авторизованных пользователей */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  {/* Здесь будет компонент Cart, который нужно реализовать */}
                  <div>Корзина (требуется реализация)</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  {/* Здесь будет компонент Profile, который нужно реализовать */}
                  <div>Профиль пользователя (требуется реализация)</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  {/* Здесь будет компонент BookingList, который нужно реализовать */}
                  <div>Мои бронирования (требуется реализация)</div>
                </ProtectedRoute>
              } 
            />
            
            {/* Защищенные маршруты для администраторов */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                  {/* Здесь будет компонент AdminPanel, который нужно реализовать */}
                  <div>Административная панель (требуется реализация)</div>
                </ProtectedRoute>
              } 
            />
            
            {/* Страница 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
