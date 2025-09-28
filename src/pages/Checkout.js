import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { isDemoCard, processDemoPayment, getRandomSuccessMessage } from '../data/demoBankCards';

export default function Checkout() {
  const { items, totals, checkout } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-header">
            <h1>Plata <span className="highlight">comenzii</span></h1>
            <p>Nu aveți produse în coș pentru a finaliza comanda.</p>
          </div>
          
          <div className="empty-checkout">
            <div className="empty-checkout-icon">💳</div>
            <h3>Coșul este gol</h3>
            <p>Adăugați cursuri în coș pentru a putea finaliza comanda.</p>
            <button 
              className="btn primary" 
              onClick={() => navigate('/courses')}
            >
              🚀 Explorează cursurile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    
    if (authLoading) {
      alert('Se verifică autentificarea. Te rog așteaptă...');
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Validare simplă
    if (!paymentData.cardName || !paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
      alert('Te rog completează toate câmpurile de plată');
      return;
    }

    setProcessing(true);
    
    try {
      const cleanCardNumber = paymentData.cardNumber.replace(/\s/g, '');
      
      // Verifică dacă este card demo
      if (isDemoCard(cleanCardNumber)) {
        console.log('🏦 Procesez plată demo cu cardul:', cleanCardNumber);
        
        // Procesează plata demo
        const demoResult = await processDemoPayment(paymentData, totals.total);
        
        if (demoResult.success) {
          // Salvează comanda în Firebase cu flag demo
          const result = await checkout({
            ...paymentData,
            isDemoPayment: true,
            transactionId: demoResult.transactionId
          });
          
          setProcessing(false);
          
          // Mesaj de succes pentru card demo
          const successMessage = getRandomSuccessMessage();
          alert(`${successMessage}\n\n🏦 Card Demo: ${cleanCardNumber}\n💰 Suma: €${totals.total.toFixed(0)}\n🆔 Transaction ID: ${demoResult.transactionId}\n\n📊 Accesează Dashboard-ul pentru a vedea cursurile tale!`);
          navigate('/dashboard');
          return;
        }
      }
      
      // Procesare normală pentru carduri reale
      await new Promise((r) => setTimeout(r, 1200));
      
      // Salvează comanda în Firebase
      const result = await checkout(paymentData);
      
      setProcessing(false);
      
      // Redirectează la Dashboard după plată
      alert(`✅ Plata realizată cu succes! Comanda #${result.orderId} a fost înregistrată. Accesul la cursuri a fost activat.\n\n📊 Accesează Dashboard-ul pentru a vedea cursurile tale!`);
      navigate('/dashboard');
      
    } catch (error) {
      setProcessing(false);
      console.error('Eroare la checkout:', error);
      alert(`❌ Eroare la finalizarea comenzii: ${error.message}`);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Plata <span className="highlight">comenzii</span></h1>
          <p>Finalizați comanda și accesați cursurile selectate.</p>
          
          <div className="payment-header">
            <div className="demo-cards-link">
              <Link to="/demo-cards" className="btn ghost">
                🏦 Vezi Cardurile Demo pentru Testare
              </Link>
            </div>
          </div>
        </div>
        
        <div className="checkout-content">
          <div className="payment-section">
            <h2>💳 Informații de plată</h2>
            <form className="payment-form" onSubmit={handlePay}>
              <div className="form-group">
                <label htmlFor="cardName">👤 Nume pe card</label>
                <input 
                  type="text" 
                  id="cardName"
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handleInputChange}
                  placeholder="Ion Popescu" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cardNumber">💳 Număr card</label>
                <input 
                  type="text" 
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="4111 1111 1111 1111" 
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry">📅 Expirare</label>
                  <input 
                    type="text" 
                    id="expiry"
                    name="expiry"
                    value={paymentData.expiry}
                    onChange={handleInputChange}
                    placeholder="12/28" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">🔒 CVV</label>
                  <input 
                    type="password" 
                    id="cvv"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123" 
                    required 
                  />
                </div>
              </div>
              
              <button 
                className="btn primary large" 
                type="submit" 
                disabled={processing}
              >
                {processing ? '🔄 Se procesează...' : '🚀 Finalizează plata'}
              </button>
            </form>
          </div>
          
          <div className="order-summary">
            <h3>📋 Rezumat comandă</h3>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <h4>{item.title}</h4>
                    <span>Cantitate: {item.qty}</span>
                  </div>
                  <div className="order-item-price">
                    €{(item.price * item.qty).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
            
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
          </div>
        </div>
      </div>
    </div>
  );
}



