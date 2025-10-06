import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
            console.log('🛒 Coș salvat detectat după login - redirecționez la checkout');
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
    setIsLoading(true);
    setError('');
    
    // Validări client-side
    if (!email.trim()) {
      setError('Te rog introdu adresa de email');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Te rog introdu parola');
      setIsLoading(false);
      return;
    }
    
    try {
      await login(email.trim(), password);
      
      // Verifică dacă există un coș salvat pentru utilizatorul nelogat
      const savedGuestCart = localStorage.getItem('guest_cart_items_v1');
      if (savedGuestCart) {
        try {
          const guestCartItems = JSON.parse(savedGuestCart);
          if (guestCartItems.length > 0) {
            console.log('🛒 Coș salvat detectat după login - redirecționez la checkout');
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
      setError(err.message || 'A apărut o eroare la conectare');
    } finally {
      setIsLoading(false);
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
          <h1>🔐 Conectare</h1>
          <p>Conectează-te pentru a accesa cursurile tale și să continui învățarea</p>
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
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Introdu adresa ta de email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Parola</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introdu parola ta"
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              className="btn primary large" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Se conectează...' : 'Conecteaza-te'}
            </button>
            
            <div className="auth-footer">
              <p>Nu ai cont? <Link to="/register">Creeaza unul</Link></p>
              <p style={{ marginTop: '1rem' }}>
                <Link to="/admindanu" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
                  🔐 Acces Super Admin
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



