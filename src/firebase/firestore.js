// Firebase Firestore functions prin CDN
import { waitForFirebase } from './config';

// =================== COURSES ===================

// Obține toate cursurile
export const getAllCourses = async () => {
  try {
    await waitForFirebase();
    
    const { collection, getDocs } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const coursesRef = collection(db, 'courses');
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Eroare la obținerea cursurilor:', error);
    throw error;
  }
};

// Obține un curs după ID
export const getCourseById = async (courseId) => {
  try {
    await waitForFirebase();
    
    const { doc, getDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (courseSnap.exists()) {
      return {
        id: courseSnap.id,
        ...courseSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Eroare la obținerea cursului:', error);
    throw error;
  }
};

// Adaugă un curs nou
export const addCourse = async (courseData) => {
  try {
    await waitForFirebase();
    
    const { collection, addDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const coursesRef = collection(db, 'courses');
    const docRef = await addDoc(coursesRef, {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Eroare la adăugarea cursului:', error);
    throw error;
  }
};

// Actualizează un curs
export const updateCourse = async (courseId, updates) => {
  try {
    await waitForFirebase();
    
    const { doc, updateDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Eroare la actualizarea cursului:', error);
    throw error;
  }
};

// Șterge un curs
export const deleteCourse = async (courseId) => {
  try {
    await waitForFirebase();
    
    const { doc, deleteDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const courseRef = doc(db, 'courses', courseId);
    await deleteDoc(courseRef);
  } catch (error) {
    console.error('Eroare la ștergerea cursului:', error);
    throw error;
  }
};

// =================== USERS ===================

// Obține informații despre utilizator
export const getUserProfile = async (userId) => {
  try {
    await waitForFirebase();
    
    const { doc, getDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Eroare la obținerea profilului utilizator:', error);
    throw error;
  }
};

// Creează/actualizează profilul utilizatorului
export const updateUserProfile = async (userId, userData) => {
  try {
    await waitForFirebase();
    
    const { doc, updateDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Eroare la actualizarea profilului utilizator:', error);
    throw error;
  }
};

// Creează un utilizator nou în Firestore (doar dacă nu există)
export const createUserProfile = async (userId, userData) => {
  try {
    await waitForFirebase();
    
    const { doc, setDoc, getDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const userRef = doc(db, 'users', userId);
    
    // Check if profile already exists
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      console.log('Profilul utilizatorului există deja, nu se creează din nou');
      return userSnap.data();
    }
    
    // Create new profile only if it doesn't exist
    const profileData = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(userRef, profileData);
    console.log('Profil nou creat pentru utilizatorul:', userId);
    return profileData;
  } catch (error) {
    console.error('Eroare la crearea profilului utilizator:', error);
    throw error;
  }
};

// =================== ORDERS/PURCHASES ===================

// Obține comenzile unui utilizator
export const getUserOrders = async (userId) => {
  try {
    console.log('🔄 getUserOrders apelat pentru userId:', userId);
    await waitForFirebase();
    
    const { collection, query, where, getDocs } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    console.log('📦 Snapshot orders pentru userId', userId, ':', snapshot.size, 'documente');
    
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sortează comenzile după createdAt în JavaScript (nu necesită index Firebase)
    orders.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA; // Descendent (cele mai noi primul)
    });
    
    console.log('📦 Comenzi returnate:', orders.length);
    if (orders.length > 0) {
      console.log('📦 Prima comandă:', orders[0]);
    }
    
    return orders;
  } catch (error) {
    console.error('❌ Eroare la obținerea comenzilor utilizator:', error);
    throw error;
  }
};

// Obține cursurile cumpărate de un utilizator
export const getUserPurchasedCourses = async (userId) => {
  try {
    const orders = await getUserOrders(userId);
    const courseIds = [];
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!courseIds.includes(item.id)) {
            courseIds.push(item.id);
          }
        });
      }
    });
    
    return courseIds;
  } catch (error) {
    console.error('Eroare la obținerea cursurilor cumpărate:', error);
    throw error;
  }
};

// =================== REVIEWS ===================

// Adaugă o recenzie
export const addReview = async (reviewData) => {
  try {
    await waitForFirebase();
    
    const { collection, addDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...reviewData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Eroare la adăugarea recenziei:', error);
    throw error;
  }
};

// Obține recenziile unui curs
export const getCourseReviews = async (courseId) => {
  try {
    await waitForFirebase();
    
    const { collection, query, where, orderBy, getDocs } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('courseId', '==', courseId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Eroare la obținerea recenziilor:', error);
    throw error;
  }
};

// =================== ORDERS ===================

// Adaugă o comandă nouă
export const addOrder = async (orderData) => {
  try {
    console.log('🛒 addOrder apelat cu datele:', orderData);
    await waitForFirebase();
    
    const { collection, addDoc, serverTimestamp } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const ordersRef = collection(db, 'orders');
    const orderWithTimestamp = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('🛒 Salvez comanda în Firebase:', orderWithTimestamp);
    
    const docRef = await addDoc(ordersRef, orderWithTimestamp);
    
    console.log('✅ Comandă salvată cu ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Eroare la salvarea comenzii:', error);
    throw error;
  }
};

// =================== COURSE PROGRESS ===================

// Funcție pentru a actualiza progresul unui curs
export const updateCourseProgress = async (userId, courseId, courseTitle, progressData) => {
  try {
    console.log('🔄 updateCourseProgress apelat:', { userId, courseId, courseTitle, progressData });
    
    await waitForFirebase();
    
    const { doc, setDoc, serverTimestamp } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    console.log('💾 Salvez progresul în documentul:', `${userId}_${courseId}`);
    
    const progressUpdate = {
      userId,
      courseId,
      courseTitle,
      progress: progressData.progress,
      timeSpent: progressData.timeSpent || 0,
      completedLessons: progressData.completedLessons || [],
      lastAccessed: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('💾 Datele de salvat în Firebase:', progressUpdate);
    console.log('💾 Lecții completate de salvat:', progressUpdate.completedLessons);
    
    await setDoc(progressRef, progressUpdate, { merge: true });
    
    console.log('✅ Progres salvat cu succes pentru cursul:', courseId);
    console.log('✅ Lecții completate salvate:', progressUpdate.completedLessons);
    return true;
  } catch (error) {
    console.error('❌ Eroare la actualizarea progresului:', error);
    return false;
  }
};

// Funcție pentru a obține progresul unui curs
export const getCourseProgress = async (userId, courseId) => {
  try {
    console.log('🔄 getCourseProgress apelat:', { userId, courseId });
    
    await waitForFirebase();
    
    const { doc, getDoc } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    console.log('🔍 Caut progresul în documentul:', `${userId}_${courseId}`);
    
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      const data = progressDoc.data();
      console.log('📊 Progres găsit în Firebase:', data);
      console.log('📊 Lecții completate:', data.completedLessons);
      console.log('📊 Progres procentual:', data.progress + '%');
      return data;
    }
    
    console.log('📊 Nu există progres pentru acest curs în Firebase');
    return null;
  } catch (error) {
    console.error('❌ Eroare la obținerea progresului:', error);
    return null;
  }
};

// Funcție pentru a marca o lecție ca completată
export const markLessonComplete = async (userId, courseId, courseTitle, lessonIndex, totalLessons) => {
  try {
    console.log('🔄 markLessonComplete apelat:', { userId, courseId, courseTitle, lessonIndex, totalLessons });
    
    const progressData = await getCourseProgress(userId, courseId);
    console.log('📊 Progres existent:', progressData);
    
    let completedLessons = progressData?.completedLessons || [];
    
    // Verifică dacă lecția este deja completată
    if (!completedLessons.includes(lessonIndex)) {
      completedLessons.push(lessonIndex);
      console.log('✅ Lecție adăugată la lista completată:', lessonIndex);
    } else {
      console.log('⚠️ Lecția era deja marcată ca completată:', lessonIndex);
      return true; // Lecția era deja completată, nu face nimic
    }
    
    // Filtrează lecțiile completate pentru a elimina duplicatele și lecțiile invalide
    completedLessons = completedLessons.filter(index => index >= 0 && index < totalLessons);
    
    // Calculează progresul corect
    const progress = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
    console.log('📈 Progres calculat:', progress + '%', `(${completedLessons.length}/${totalLessons})`);
    
    const updateData = {
      progress,
      completedLessons,
      timeSpent: progressData?.timeSpent || 0 // Păstrează timpul real, nu adaugă artificial
    };
    
    console.log('💾 Datele de actualizat:', updateData);
    
    await updateCourseProgress(userId, courseId, courseTitle, updateData);
    
    console.log('✅ Lecție marcată ca completată cu succes:', lessonIndex, 'Progres:', progress + '%');
    return true;
  } catch (error) {
    console.error('❌ Eroare la marcarea lecției ca completată:', error);
    return false;
  }
};

// Funcție pentru a actualiza timpul petrecut în curs
export const updateTimeSpent = async (userId, courseId, courseTitle, additionalMinutes) => {
  try {
    console.log('⏱️ updateTimeSpent apelat:', { userId, courseId, courseTitle, additionalMinutes });
    
    const progressData = await getCourseProgress(userId, courseId);
    const currentTimeSpent = progressData?.timeSpent || 0;
    const newTimeSpent = currentTimeSpent + additionalMinutes;
    
    console.log('⏱️ Timp actualizat:', currentTimeSpent, '→', newTimeSpent, 'minute');
    
    const updateData = {
      progress: progressData?.progress || 0,
      completedLessons: progressData?.completedLessons || [],
      timeSpent: newTimeSpent
    };
    
    await updateCourseProgress(userId, courseId, courseTitle, updateData);
    
    console.log('✅ Timp actualizat cu succes pentru cursul:', courseId);
    return true;
  } catch (error) {
    console.error('❌ Eroare la actualizarea timpului:', error);
    return false;
  }
};