// Firebase CDN Configuration
// Firebase este inițializat prin CDN în index.html și funcțiile sunt disponibile global

// Funcție pentru a aștepta inițializarea Firebase CDN
const waitForFirebase = () => {
  return new Promise((resolve) => {
    const checkFirebase = () => {
      if (window.firebaseAuth && window.firebaseDB && window.firestoreFunctions && window.authFunctions) {
        resolve();
      } else {
        setTimeout(checkFirebase, 50);
      }
    };
    checkFirebase();
  });
};

// Exportă serviciile Firebase direct din window
export const auth = () => window.firebaseAuth;
export const db = () => window.firebaseDB;
export const storage = () => window.firebaseStorage;
export const analytics = () => window.firebaseAnalytics;
export const app = () => window.firebaseApp;

// Export funcția de inițializare
export { waitForFirebase };
