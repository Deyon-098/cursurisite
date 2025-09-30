// Script pentru a repara progresul cursurilor cu erori
import { getCourseProgress, updateCourseProgress } from '../firebase/firestore';

export const fixCourseProgress = async (userId, courseId, courseTitle, totalLessons) => {
  console.log('🔧 Repar progresul pentru cursul:', courseId);
  
  try {
    const progressData = await getCourseProgress(userId, courseId);
    
    if (!progressData) {
      console.log('📊 Nu există progres pentru acest curs');
      return false;
    }
    
    console.log('📊 Progres existent:', progressData);
    
    // Filtrează lecțiile completate pentru a elimina indexurile invalide
    const validCompletedLessons = (progressData.completedLessons || []).filter(index => 
      index >= 0 && index < totalLessons
    );
    
    // Calculează progresul corect
    const correctProgress = Math.min(100, Math.round((validCompletedLessons.length / totalLessons) * 100));
    
    console.log('🔧 Lecții valide:', validCompletedLessons.length, 'din', totalLessons);
    console.log('🔧 Progres corect:', correctProgress + '%');
    
    // Dacă progresul este diferit, actualizează-l
    if (progressData.progress !== correctProgress || 
        progressData.completedLessons.length !== validCompletedLessons.length) {
      
      const updateData = {
        progress: correctProgress,
        completedLessons: validCompletedLessons,
        timeSpent: progressData.timeSpent || 0
      };
      
      console.log('🔧 Actualizez progresul cu:', updateData);
      
      await updateCourseProgress(userId, courseId, courseTitle, updateData);
      
      console.log('✅ Progres reparat cu succes!');
      return true;
    } else {
      console.log('✅ Progresul este deja corect');
      return false;
    }
  } catch (error) {
    console.error('❌ Eroare la repararea progresului:', error);
    return false;
  }
};

// Funcție pentru a repara toate progresele unui utilizator
export const fixAllUserProgress = async (userId) => {
  console.log('🔧 Repar toate progresele pentru utilizatorul:', userId);
  
  try {
    const { collection, getDocs, query, where } = window.firestoreFunctions;
    const db = window.firebaseDB;
    
    const progressRef = collection(db, 'courseProgress');
    const progressQuery = query(progressRef, where('userId', '==', userId));
    const progressSnapshot = await getDocs(progressQuery);
    
    console.log('📊 Găsite', progressSnapshot.size, 'progrese');
    
    let fixedCount = 0;
    
    for (const doc of progressSnapshot.docs) {
      const progressData = doc.data();
      console.log('🔧 Verific progresul pentru cursul:', progressData.courseTitle);
      
      // Estimează numărul total de lecții bazat pe tipul cursului
      let estimatedTotalLessons;
      if (progressData.courseTitle.toLowerCase().includes('react')) {
        estimatedTotalLessons = 10;
      } else if (progressData.courseTitle.toLowerCase().includes('javascript')) {
        estimatedTotalLessons = 12;
      } else if (progressData.courseTitle.toLowerCase().includes('python')) {
        estimatedTotalLessons = 8;
      } else if (progressData.courseTitle.toLowerCase().includes('css')) {
        estimatedTotalLessons = 6;
      } else if (progressData.courseTitle.toLowerCase().includes('html')) {
        estimatedTotalLessons = 7;
      } else {
        estimatedTotalLessons = 8; // Default
      }
      
      const wasFixed = await fixCourseProgress(
        userId, 
        progressData.courseId, 
        progressData.courseTitle, 
        estimatedTotalLessons
      );
      
      if (wasFixed) {
        fixedCount++;
      }
    }
    
    console.log('✅ Reparare completă!', fixedCount, 'progrese reparate din', progressSnapshot.size);
    return fixedCount;
  } catch (error) {
    console.error('❌ Eroare la repararea tuturor progreselor:', error);
    return 0;
  }
};
