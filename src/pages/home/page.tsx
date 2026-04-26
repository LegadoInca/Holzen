import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import CartPanel from './components/CartPanel';
import AndeanBasketToast from './components/AndeanBasketToast';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Products from './components/Products';
import ImpactSlider from './components/ImpactSlider';
import Reviews from './components/Reviews';
import Farmers from './components/Farmers';
import ProcessSection from './components/ProcessSection';
import ContactSection from './components/ContactSection';
import SiteFooter from './components/SiteFooter';
import CookieBar from './components/CookieBar';
import { CartItem } from './types';
import { products } from '@/mocks/holzen';

const HomePage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastItem, setToastItem] = useState<Omit<CartItem, 'qty'> | null>(null);
  const [toastProducer, setToastProducer] = useState('');
  const [toastKey, setToastKey] = useState(0);

  const handleAddToCart = useCallback((item: Omit<CartItem, 'qty'>) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    // Find producer name for this product
    const product = products.find((p) => p.id === item.id);
    setToastProducer(product?.producer.name ?? 'el productor');
    setToastItem(item);
    setToastKey((k) => k + 1);
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
  const totalAmount = cartItems.reduce((a, i) => a + i.priceNum * i.qty, 0);

  return (
    <div className="min-h-screen bg-coffee-900">
      <Navbar cartCount={totalCount} onCartOpen={() => setCartOpen(true)} />
      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onRemove={handleRemove} onQtyChange={handleQtyChange} />
      <AndeanBasketToast
        key={toastKey}
        item={toastItem}
        cartCount={totalCount}
        cartTotal={totalAmount}
        producerName={toastProducer}
        onClose={() => setToastItem(null)}
        onOpenCart={() => { setCartOpen(true); setToastItem(null); }}
      />
      <Hero />
      <Farmers />
      <Manifesto />
      <ImpactSlider />
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
