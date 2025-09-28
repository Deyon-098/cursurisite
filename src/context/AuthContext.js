import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { waitForFirebase } from '../firebase/config';
import { createUserProfile, getUserProfile, getUserOrders } from '../firebase/firestore';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]);
  const [premiumStatus, setPremiumStatus] = useState({
    isPremium: false,
    hasOrders: false,
    loading: true
  });

  // Monitor auth state changes
  useEffect(() => {
    const initAuth = async () => {
      await waitForFirebase();
      
      const { onAuthStateChanged } = window.authFunctions;
      const auth = window.firebaseAuth;
      
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || userProfile?.name || firebaseUser.email.split('@')[0],
            ...userProfile
          };
          setUser(userData);
          
          // Check premium status
          await checkPremiumStatus(firebaseUser.uid);
        } catch (error) {
          console.error('Eroare la obținerea profilului utilizator:', error);
          
          // Don't create multiple profiles - just set user data from Firebase Auth
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
          };
          setUser(userData);
          
          // Check premium status even if profile fetch failed
          await checkPremiumStatus(firebaseUser.uid);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserOrders([]);
        setPremiumStatus({
          isPremium: false,
          hasOrders: false,
          loading: false
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
    };
    
    initAuth();
  }, []);

  // Function to check premium status based on orders AND user profile
  const checkPremiumStatus = async (userId) => {
    try {
      setPremiumStatus(prev => ({ ...prev, loading: true }));
      
      // Check both orders and user profile for premium status
      const [orders, userProfile] = await Promise.all([
        getUserOrders(userId),
        getUserProfile(userId)
      ]);
      
      setUserOrders(orders || []);
      
      const hasOrders = orders && orders.length > 0;
      const hasPaidOrders = orders?.some(order => 
        order.totals?.total > 0 && order.status !== 'cancelled'
      );
      
      // User is premium if they have paid orders OR isPremium flag in profile
      const isPremiumFromOrders = hasOrders && hasPaidOrders;
      const isPremiumFromProfile = userProfile?.isPremium === true;
      const isPremium = isPremiumFromOrders || isPremiumFromProfile;
      
      setPremiumStatus({
        isPremium,
        hasOrders,
        loading: false
      });
      
      console.log('Premium Status:', { 
        isPremium, 
        isPremiumFromOrders, 
        isPremiumFromProfile, 
        hasOrders, 
        ordersCount: orders?.length || 0 
      });
    } catch (error) {
      console.error('Eroare la verificarea statutului premium:', error);
      setPremiumStatus({
        isPremium: false,
        hasOrders: false,
        loading: false
      });
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email și parola sunt obligatorii');
    }
    
    try {
      setLoading(true);
      await waitForFirebase();
      
      const { signInWithEmailAndPassword } = window.authFunctions;
      const auth = window.firebaseAuth;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      console.error('Eroare la conectare:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('Nu există un cont cu acest email');
        case 'auth/wrong-password':
          throw new Error('Parolă incorectă');
        case 'auth/invalid-email':
          throw new Error('Email invalid');
        case 'auth/too-many-requests':
          throw new Error('Prea multe încercări. Încearcă din nou mai târziu');
        default:
          throw new Error('Eroare la conectare. Încearcă din nou');
      }
    }
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error('Completează toate câmpurile');
    }
    
    if (password.length < 6) {
      throw new Error('Parola trebuie să aibă cel puțin 6 caractere');
    }

    try {
      setLoading(true);
      await waitForFirebase();
      
      const { createUserWithEmailAndPassword, updateProfile } = window.authFunctions;
      const auth = window.firebaseAuth;
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Create user profile in Firestore
      await createUserProfile(firebaseUser.uid, {
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return firebaseUser;
    } catch (error) {
      setLoading(false);
      console.error('Eroare la înregistrare:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Există deja un cont cu acest email');
        case 'auth/invalid-email':
          throw new Error('Email invalid');
        case 'auth/weak-password':
          throw new Error('Parola este prea slabă');
        default:
          throw new Error('Eroare la înregistrare. Încearcă din nou');
      }
    }
  };

  const logout = async () => {
    try {
      await waitForFirebase();
      
      const { signOut } = window.authFunctions;
      const auth = window.firebaseAuth;
      
      await signOut(auth);
      
      // Resetează toate datele utilizatorului
      setUser(null);
      setUserOrders([]);
      setPremiumStatus({
        isPremium: false,
        hasOrders: false,
        loading: false
      });
      
      console.log('🚪 Utilizator deconectat - toate datele resetate');
    } catch (error) {
      console.error('Eroare la deconectare:', error);
      throw new Error('Eroare la deconectare');
    }
  };

  const value = useMemo(() => ({ 
    user, 
    login, 
    register, 
    logout, 
    loading,
    isAuthenticated: !!user,
    premiumStatus,
    userOrders,
    checkPremiumStatus: () => user?.id ? checkPremiumStatus(user.id) : null,
    isPremium: premiumStatus.isPremium,
    hasOrders: premiumStatus.hasOrders
  }), [user, loading, premiumStatus, userOrders]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};



