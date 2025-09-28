import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { demoBankCards } from '../data/demoBankCards';

export default function DemoCards() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [copiedCard, setCopiedCard] = useState(null);

  const copyToClipboard = (text, cardId) => {
    navigator.clipboard.writeText(text);
    setCopiedCard(cardId);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  const getCardIcon = (type) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'visa': return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
      case 'mastercard': return 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)';
      case 'amex': return 'linear-gradient(135deg, #006fcf 0%, #00a8ff 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <div className="demo-cards-page">
      <div className="container">
        <div className="demo-cards-header">
          <h1>🏦 Carduri <span className="highlight">Demo</span></h1>
          <p>Folosește aceste carduri pentru a testa modalitatea de plată. Toate au fonduri nelimitate!</p>
          
          <div className="demo-cards-info">
            <div className="info-card">
              <div className="info-icon">💡</div>
              <div className="info-content">
                <h3>Cum să folosești cardurile demo:</h3>
                <ol>
                  <li>Copiază datele cardului dorit</li>
                  <li>Mergi la checkout</li>
                  <li>Introdu datele copiate</li>
                  <li>Plata va fi procesată automat!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-cards-grid">
          {demoBankCards.map((card) => (
            <div key={card.id} className="demo-card">
              <div 
                className="card-header"
                style={{ background: getCardColor(card.type) }}
              >
                <div className="card-type">
                  <span className="card-icon">{getCardIcon(card.type)}</span>
                  <span className="card-name">{card.name}</span>
                </div>
                <div className="card-balance">
                  <span className="balance-label">Sold:</span>
                  <span className="balance-amount">{card.balance}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="card-details">
                  <div className="detail-row">
                    <span className="detail-label">Număr Card:</span>
                    <div className="detail-value">
                      <code>{card.number}</code>
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard(card.number, `${card.id}-number`)}
                        title="Copiază numărul cardului"
                      >
                        {copiedCard === `${card.id}-number` ? '✅' : '📋'}
                      </button>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Data Expirării:</span>
                    <div className="detail-value">
                      <code>{card.expiry}</code>
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard(card.expiry, `${card.id}-expiry`)}
                        title="Copiază data expirării"
                      >
                        {copiedCard === `${card.id}-expiry` ? '✅' : '📋'}
                      </button>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">CVV:</span>
                    <div className="detail-value">
                      <code>{card.cvv}</code>
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard(card.cvv, `${card.id}-cvv`)}
                        title="Copiază CVV-ul"
                      >
                        {copiedCard === `${card.id}-cvv` ? '✅' : '📋'}
                      </button>
                    </div>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Nume pe Card:</span>
                    <div className="detail-value">
                      <code>Demo User</code>
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard('Demo User', `${card.id}-name`)}
                        title="Copiază numele"
                      >
                        {copiedCard === `${card.id}-name` ? '✅' : '📋'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-description">
                  <p>{card.description}</p>
                </div>

                <div className="card-actions">
                  <button 
                    className="btn primary"
                    onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                  >
                    {selectedCard === card.id ? '🔼 Ascunde Detalii' : '🔽 Vezi Detalii'}
                  </button>
                  
                  <Link to="/checkout" className="btn secondary">
                    🛒 Mergi la Checkout
                  </Link>
                </div>

                {selectedCard === card.id && (
                  <div className="card-extra-info">
                    <div className="extra-info-item">
                      <span className="extra-label">💳 Tip Card:</span>
                      <span className="extra-value">{card.type.toUpperCase()}</span>
                    </div>
                    <div className="extra-info-item">
                      <span className="extra-label">🆔 ID Card:</span>
                      <span className="extra-value">{card.id}</span>
                    </div>
                    <div className="extra-info-item">
                      <span className="extra-label">💰 Fonduri:</span>
                      <span className="extra-value">Nelimitate</span>
                    </div>
                    <div className="extra-info-item">
                      <span className="extra-label">🔒 Securitate:</span>
                      <span className="extra-value">Demo Mode</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="demo-cards-footer">
          <div className="footer-info">
            <h3>📋 Instrucțiuni de Utilizare:</h3>
            <div className="instructions">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Selectează un card</h4>
                  <p>Alege oricare dintre cardurile demo de mai sus</p>
                </div>
              </div>
              
              <div className="instruction-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Copiază datele</h4>
                  <p>Folosește butoanele de copiere pentru a copia datele cardului</p>
                </div>
              </div>
              
              <div className="instruction-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Mergi la checkout</h4>
                  <p>Adaugă cursuri în coș și mergi la pagina de plată</p>
                </div>
              </div>
              
              <div className="instruction-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Introdu datele</h4>
                  <p>Lipește datele copiate în formularul de plată</p>
                </div>
              </div>
              
              <div className="instruction-step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Finalizează plata</h4>
                  <p>Plata va fi procesată automat și vei fi redirectat la Dashboard</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-actions">
            <Link to="/courses" className="btn primary">
              🚀 Explorează Cursurile
            </Link>
            <Link to="/cart" className="btn secondary">
              🛒 Vezi Coșul
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
