import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, totals, removeItem, updateQty, clear, saveCartBeforeLogin } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (isAuthenticated) {
      // Utilizator logat - merge direct la checkout
      navigate('/checkout');
    } else {
      // Utilizator nelogat - salvează coșul și merge la login
      const cartSaved = saveCartBeforeLogin();
      if (cartSaved) {
        console.log('🛒 Coșul salvat înainte de redirect la login');
      }
      navigate('/login');
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Coșul de <span className="highlight">cumpărături</span></h1>
            <p>Coșul tău este gol. Explorează cursurile noastre și începe să înveți!</p>
          </div>
          
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Coșul este gol</h3>
            <p>Nu ai adăugat încă cursuri în coș. Descoperă cursurile noastre și începe călătoria ta în lumea tehnologiei!</p>
            <Link to="/courses" className="btn primary">
              🚀 Explorează cursurile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Coșul de <span className="highlight">cumpărături</span></h1>
          <p>Revizuiește cursurile selectate și continuă către checkout.</p>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <div className="cart-item-price">
                    <span className="price-currency">€</span>
                    <span className="price-amount">{(item.price * item.qty).toFixed(0)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-control">
                      <label>Cantitate:</label>
                      <div className="quantity-input">
                        <button 
                          onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                          className="qty-btn"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => updateQty(item.id, Math.max(1, Number(e.target.value)))}
                          className="qty-input"
                        />
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      className="btn ghost small" 
                      onClick={() => removeItem(item.id)}
                    >
                      🗑️ Elimină
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>📋 Rezumat comandă</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>€{totals.subtotal.toFixed(0)}</span>
              </div>
              <div className="summary-row">
                <span>TVA (19%)</span>
                <span>€{totals.vat.toFixed(0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>€{totals.total.toFixed(0)}</span>
              </div>
            </div>
            
            <div className="cart-actions">
              <button 
                className="btn primary" 
                onClick={handleCheckout}
              >
                {isAuthenticated ? '🚀 Continuă la plată' : '🔐 Login pentru a continua'}
              </button>
              <button 
                className="btn ghost" 
                onClick={clear}
              >
                🗑️ Golește coșul
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



