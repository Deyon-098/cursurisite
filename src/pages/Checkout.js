import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { items, totals, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="page-title">Plata</h1>
        <p>Nu aveti produse in cos.</p>
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setProcessing(true);
    // Simulam plata
    await new Promise((r) => setTimeout(r, 1200));
    clear();
    setProcessing(false);
    navigate('/');
    alert('Plata realizata cu succes! Accesul la cursuri a fost activat.');
  };

  return (
    <div className="container">
      <h1 className="page-title">Plata</h1>
      <form className="checkout" onSubmit={handlePay}>
        <div className="payment-details">
          <label>Nume pe card
            <input type="text" placeholder="Ion Popescu" required />
          </label>
          <label>Numar card
            <input type="text" placeholder="4111 1111 1111 1111" required />
          </label>
          <div className="row">
            <label>Expirare
              <input type="text" placeholder="12/28" required />
            </label>
            <label>CVV
              <input type="password" placeholder="123" required />
            </label>
          </div>
        </div>
        <aside className="cart-summary">
          <h3>Rezumat</h3>
          <div className="summary-row"><span>Subtotal</span><strong>{totals.subtotal.toFixed(2)} €</strong></div>
          <div className="summary-row"><span>TVA (19%)</span><strong>{totals.vat.toFixed(2)} €</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{totals.total.toFixed(2)} €</strong></div>
          <button className="btn" type="submit" disabled={processing}>{processing ? 'Se proceseaza...' : 'Plateste'}</button>
        </aside>
      </form>
    </div>
  );
}



