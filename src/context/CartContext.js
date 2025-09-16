import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = 'cart_items_v1';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (course, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === course.id);
      if (existing) {
        return prev.map((p) => (p.id === course.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { id: course.id, title: course.title, price: course.price, image: course.image, qty }];
    });
  };

  const removeItem = (courseId) => setItems((prev) => prev.filter((p) => p.id !== courseId));
  const updateQty = (courseId, qty) => setItems((prev) => prev.map((p) => (p.id === courseId ? { ...p, qty } : p)));
  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const count = items.reduce((acc, it) => acc + it.qty, 0);
    const subtotal = items.reduce((acc, it) => acc + it.qty * it.price, 0);
    const vat = subtotal * 0.19; // 19% TVA
    const total = subtotal + vat;
    return { count, subtotal, vat, total };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, totals }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};


