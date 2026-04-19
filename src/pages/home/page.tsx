import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import CartPanel from './components/CartPanel';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Products from './components/Products';
import Reviews from './components/Reviews';
import Farmers from './components/Farmers';
import ProcessSection from './components/ProcessSection';
import ContactSection from './components/ContactSection';
import SiteFooter from './components/SiteFooter';
import CookieBar from './components/CookieBar';
import { CartItem } from './types';

const HomePage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = useCallback((item: Omit<CartItem, 'qty'>) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleQtyChange = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  }, []);

  const totalCount = cartItems.reduce((a, i) => a + i.qty, 0);

  return (
    <div className="min-h-screen bg-coffee-900">
      <Navbar cartCount={totalCount} onCartOpen={() => setCartOpen(true)} />
      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onRemove={handleRemove} onQtyChange={handleQtyChange} />
      <Hero />
      <Farmers />
      <Manifesto />
      <Products onAddToCart={handleAddToCart} />
      <Reviews />
      <ProcessSection />
      <ContactSection />
      <SiteFooter />
      <CookieBar />
    </div>
  );
};

export default HomePage;
