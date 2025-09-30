// Script pentru debugging progresul cursurilor
import { getCourseProgress, markLessonComplete } from '../firebase/firestore';

export const debugCourseProgress = async (userId, courseId) => {
  console.log('🔍 DEBUG: Verific progresul pentru utilizatorul:', userId, 'cursul:', courseId);
  
  try {
    const progress = await getCourseProgress(userId, courseId);
    console.log('📊 Progres găsit:', progress);
    
    if (progress) {
      console.log('✅ Lecții completate:', progress.completedLessons);
      console.log('📈 Progres procentual:', progress.progress + '%');
      console.log('⏱️ Timp petrecut:', progress.timeSpent + 'h');
      console.log('📅 Ultima accesare:', progress.lastAccessed);
    } else {
      console.log('❌ Nu există progres pentru acest curs');
    }
    
    return progress;
  } catch (error) {
    console.error('❌ Eroare la debugging progres:', error);
    return null;
  }
};

export const testMarkLesson = async (userId, courseId, courseTitle, lessonIndex, totalLessons) => {
  console.log('🧪 TEST: Marchez lecția', lessonIndex, 'ca completată');
  
  try {
    const success = await markLessonComplete(userId, courseId, courseTitle, lessonIndex, totalLessons);
    console.log('✅ Rezultat marcare lecție:', success);
    
    // Verific progresul după marcare
    const progress = await getCourseProgress(userId, courseId);
    console.log('📊 Progres după marcare:', progress);
    
    return success;
  } catch (error) {
    console.error('❌ Eroare la testarea marcare lecție:', error);
    return false;
  }
};

// Funcție pentru a afișa toate progresele unui utilizator
export const debugAllProgress = async (userId) => {
  console.log('🔍 DEBUG: Verific toate progresele pentru utilizatorul:', userId);
  
  try {
    const { collection, getDocs, query, where } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const progressRef = collection(db, 'courseProgress');
    const progressQuery = query(progressRef, where('userId', '==', userId));
    const progressSnapshot = await getDocs(progressQuery);
    
    console.log('📊 Total progrese găsite:', progressSnapshot.size);
    
    progressSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log('📚 Curs:', data.courseTitle, '| Progres:', data.progress + '%', '| Lecții completate:', data.completedLessons);
    });
    
    return progressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('❌ Eroare la debugging toate progresele:', error);
    return [];
  }
};
