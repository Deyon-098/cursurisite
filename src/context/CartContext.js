import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addOrder } from '../firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = 'cart_items_v1';
const GUEST_CART_KEY = 'guest_cart_items_v1';

export const CartProvider = ({ children }) => {
  const { user, checkPremiumStatus } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [lastUserId, setLastUserId] = useState(null);

  // Gestionarea coșului când utilizatorul se schimbă
  useEffect(() => {
    if (user && user.id !== lastUserId) {
      console.log('🔄 Utilizator nou detectat - verific coșul salvat');
      
      // Verifică dacă există un coș salvat pentru utilizatorul nelogat
      try {
        const savedGuestCart = localStorage.getItem(GUEST_CART_KEY);
        if (savedGuestCart) {
          const guestCartItems = JSON.parse(savedGuestCart);
          if (guestCartItems.length > 0) {
            console.log('🛒 Restaurez coșul salvat:', guestCartItems);
            setItems(guestCartItems);
            // Șterge coșul salvat după restaurare
            localStorage.removeItem(GUEST_CART_KEY);
          } else {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Eroare la restaurarea coșului:', error);
        setItems([]);
      }
      
      setLastUserId(user.id);
    } else if (!user && lastUserId) {
      console.log('🚪 Utilizator deconectat - salvez coșul curent');
      
      // Salvează coșul curent pentru utilizatorul nelogat
      if (items.length > 0) {
        try {
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
          console.log('💾 Coșul salvat pentru utilizatorul nelogat:', items);
        } catch (error) {
          console.error('Eroare la salvarea coșului:', error);
        }
      }
      
      setItems([]);
      setLastUserId(null);
    }
  }, [user, lastUserId, items]);

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
  const clear = () => {
    setItems([]);
    setLastUserId(null);
  };

  // Funcție pentru salvarea coșului înainte de redirect la login
  const saveCartBeforeLogin = () => {
    if (items.length > 0) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
        console.log('💾 Coșul salvat înainte de redirect la login:', items);
        return true;
      } catch (error) {
        console.error('Eroare la salvarea coșului:', error);
        return false;
      }
    }
    return false;
  };

  // Funcție pentru finalizarea comenzii și salvarea în Firebase
  const checkout = async (paymentData = {}) => {
    if (!user) {
      throw new Error('Trebuie să fii conectat pentru a finaliza comanda');
    }

    if (items.length === 0) {
      throw new Error('Coșul este gol');
    }

    try {
      const orderData = {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty,
          image: item.image
        })),
        totals: {
          subtotal: totals.subtotal,
          vat: totals.vat,
          total: totals.total,
          count: totals.count
        },
        paymentData,
        status: 'completed'
      };

      const orderId = await addOrder(orderData);
      
      
      // Golește coșul după salvarea comenzii
      clear();
      
      // Reîmprospătează statusul Premium după cumpărare
      if (checkPremiumStatus) {
        await checkPremiumStatus();
      }
      
      return {
        orderId,
        orderData
      };
    } catch (error) {
      console.error('Eroare la salvarea comenzii:', error);
      throw new Error('Eroare la finalizarea comenzii. Încearcă din nou.');
    }
  };

  const totals = useMemo(() => {
    const count = items.reduce((acc, it) => acc + it.qty, 0);
    const subtotal = items.reduce((acc, it) => acc + it.qty * it.price, 0);
    const vat = subtotal * 0.19; // 19% TVA
    const total = subtotal + vat;
    return { count, subtotal, vat, total };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, checkout, totals, saveCartBeforeLogin }),
    [items, totals, user]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};



