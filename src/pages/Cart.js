import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, totals, removeItem, updateQty, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="page-title">Cos</h1>
        <p>Cosul este gol. <Link to="/">Vezi cursurile</Link></p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Cos</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {items.map((it) => (
            <div key={it.id} className="cart-item">
              <img src={it.image} alt={it.title} />
              <div className="info">
                <h3>{it.title}</h3>
                <p className="muted">{(it.price * it.qty).toFixed(2)} €</p>
                <div className="qty">
                  <label>Cantitate</label>
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => updateQty(it.id, Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <button className="btn ghost" onClick={() => removeItem(it.id)}>Elimina</button>
              </div>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Rezumat</h3>
          <div className="summary-row"><span>Subtotal</span><strong>{totals.subtotal.toFixed(2)} €</strong></div>
          <div className="summary-row"><span>TVA (19%)</span><strong>{totals.vat.toFixed(2)} €</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{totals.total.toFixed(2)} €</strong></div>
          <button className="btn" onClick={() => navigate('/checkout')}>Continua la plata</button>
          <button className="btn ghost" onClick={clear}>Goleste cosul</button>
        </aside>
      </div>
    </div>
  );
}



