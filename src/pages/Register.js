import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect dacă utilizatorul e deja conectat
  useEffect(() => {
    if (user && !authLoading) {
      // Verifică dacă există un coș salvat pentru utilizatorul nelogat
      const savedGuestCart = localStorage.getItem('guest_cart_items_v1');
      if (savedGuestCart) {
        try {
          const guestCartItems = JSON.parse(savedGuestCart);
          if (guestCartItems.length > 0) {
            console.log('🛒 Coș salvat detectat după înregistrare - redirecționez la checkout');
            navigate('/checkout');
            return;
          }
        } catch (error) {
          console.error('Eroare la verificarea coșului salvat:', error);
        }
      }
      
      // Dacă nu există coș salvat, merge la dashboard
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validări client-side
    if (!name.trim()) {
      setError('Te rog introdu numele complet');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Te rog introdu adresa de email');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Te rog introdu parola');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc');
      setLoading(false);
      return;
    }
    
    try {
      await register(name.trim(), email.trim(), password);
      
      // Verifică dacă există un coș salvat pentru utilizatorul nelogat
      const savedGuestCart = localStorage.getItem('guest_cart_items_v1');
      if (savedGuestCart) {
        try {
          const guestCartItems = JSON.parse(savedGuestCart);
          if (guestCartItems.length > 0) {
            console.log('🛒 Coș salvat detectat după înregistrare - redirecționez la checkout');
            navigate('/checkout');
            return;
          }
        } catch (error) {
          console.error('Eroare la verificarea coșului salvat:', error);
        }
      }
      
      // Dacă nu există coș salvat, merge la dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'A apărut o eroare la înregistrare');
    } finally {
      setLoading(false);
    }
  };

  // Afișează loading în timpul verificării autentificării
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-form-container">
            <div className="loading-auth">
              <div className="loading-spinner">🔄</div>
              <p>Se verifică autentificarea...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-header">
          <h1>🚀 Creează <span className="highlight">cont</span></h1>
          <p>Începe călătoria ta în lumea tehnologiei! Creează un cont gratuit și accesează cursurile noastre.</p>
        </div>
        
        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="alert">
                <span>⚠️</span>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="name">👤 Nume complet</label>
              <input 
                type="text" 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Introdu numele tău complet"
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">📧 Email</label>
              <input 
                type="email" 
                id="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="exemplu@email.com"
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">🔒 Parolă</label>
              <input 
                type="password" 
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Minim 6 caractere"
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">🔒 Confirmă parola</label>
              <input 
                type="password" 
                id="confirmPassword"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Repetă parola"
                required 
                disabled={loading}
              />
            </div>
            
            <button 
              className="btn primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? '🔄 Se creează contul...' : '🚀 Creează cont gratuit'}
            </button>
            
            <div className="auth-footer">
              <p>Ai deja cont? <Link to="/login">Conectează-te</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



