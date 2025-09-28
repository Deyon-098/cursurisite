// 🏦 Carduri Demo pentru Testare - CursuriPlus
// Aceste carduri au fonduri nelimitate pentru testare

export const demoBankCards = [
  {
    id: 'demo-1',
    name: 'Visa Demo Gold',
    number: '4111 1111 1111 1111',
    expiry: '12/25',
    cvv: '123',
    type: 'visa',
    balance: '∞',
    description: 'Card Visa cu fonduri nelimitate pentru testare'
  },
  {
    id: 'demo-2', 
    name: 'Mastercard Demo Platinum',
    number: '5555 5555 5555 4444',
    expiry: '10/26',
    cvv: '456',
    type: 'mastercard',
    balance: '∞',
    description: 'Card Mastercard cu fonduri nelimitate pentru testare'
  },
  {
    id: 'demo-3',
    name: 'American Express Demo',
    number: '3782 822463 10005',
    expiry: '08/27',
    cvv: '789',
    type: 'amex',
    balance: '∞',
    description: 'Card American Express cu fonduri nelimitate pentru testare'
  },
  {
    id: 'demo-4',
    name: 'Visa Demo Business',
    number: '4000 0000 0000 0002',
    expiry: '06/25',
    cvv: '321',
    type: 'visa',
    balance: '∞',
    description: 'Card Visa Business cu fonduri nelimitate pentru testare'
  },
  {
    id: 'demo-5',
    name: 'Mastercard Demo Corporate',
    number: '2223 0000 0000 0001',
    expiry: '04/26',
    cvv: '654',
    type: 'mastercard',
    balance: '∞',
    description: 'Card Mastercard Corporate cu fonduri nelimitate pentru testare'
  }
];

// Funcție pentru verificarea dacă un card este demo
export const isDemoCard = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return demoBankCards.some(card => 
    card.number.replace(/\s/g, '') === cleanNumber
  );
};

// Funcție pentru procesarea plății demo
export const processDemoPayment = async (cardData, amount) => {
  // Simulează procesarea plății
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Verifică dacă cardul este demo
  if (!isDemoCard(cardData.cardNumber)) {
    throw new Error('Cardul nu este un card demo valid');
  }
  
  // Returnează succes pentru toate cardurile demo
  return {
    success: true,
    transactionId: `DEMO_${Date.now()}`,
    message: 'Plata demo realizată cu succes!',
    amount: amount,
    cardType: getCardType(cardData.cardNumber)
  };
};

// Funcție pentru obținerea tipului de card
export const getCardType = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const card = demoBankCards.find(card => 
    card.number.replace(/\s/g, '') === cleanNumber
  );
  return card ? card.type : 'unknown';
};

// Funcție pentru obținerea mesajelor de succes aleatoare
export const getRandomSuccessMessage = () => {
  const messages = [
    '🎉 Plata realizată cu succes! Accesul la cursuri a fost activat!',
    '✅ Comanda finalizată! Bine ai venit în comunitatea CursuriPlus!',
    '🚀 Plată acceptată! Cursurile tale sunt gata de accesare!',
    '💎 Premium activat! Accesează Dashboard-ul pentru a vedea cursurile!',
    '⭐ Comanda procesată! Începe să înveți imediat!',
    '🎯 Plata confirmată! Cursurile tale sunt disponibile!',
    '🔥 Comanda finalizată! Să începem să învățăm!',
    '💫 Premium activat! Accesează conținutul premium!'
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

// Funcție pentru obținerea informațiilor despre card
export const getCardInfo = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return demoBankCards.find(card => 
    card.number.replace(/\s/g, '') === cleanNumber
  );
};
