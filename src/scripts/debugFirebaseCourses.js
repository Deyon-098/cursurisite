// Script pentru debugging cursurilor din Firebase
import { waitForFirebase } from '../firebase/config';
import { getAllCourses } from '../firebase/firestore';

// Funcție pentru debugging cursurilor
export const debugFirebaseCourses = async () => {
  try {
    console.log('🔍 DEBUG: Încep verificarea cursurilor din Firebase...');
    
    await waitForFirebase();
    console.log('✅ DEBUG: Firebase este gata');
    
    const courses = await getAllCourses();
    console.log('📚 DEBUG: Cursuri primite din getAllCourses():', courses);
    console.log('📚 DEBUG: Numărul de cursuri:', courses.length);
    
    if (courses.length > 0) {
      console.log('📚 DEBUG: Detalii cursuri:');
      courses.forEach((course, index) => {
        console.log(`  ${index + 1}. ${course.title}`);
        console.log(`     - ID: ${course.id || 'N/A'}`);
        console.log(`     - Instructor: ${course.instructor || 'N/A'}`);
        console.log(`     - Preț: €${course.price || 'N/A'}`);
        console.log(`     - Categorie: ${course.category || 'N/A'}`);
        console.log(`     - Durată: ${course.duration || 'N/A'}h`);
        console.log('     ---');
      });
    } else {
      console.log('❌ DEBUG: Nu există cursuri în baza de date!');
    }
    
    return courses;
  } catch (error) {
    console.error('❌ DEBUG: Eroare la verificarea cursurilor:', error);
    throw error;
  }
};

// Funcție pentru a testa getCourses din coursesFirebase
export const debugGetCourses = async () => {
  try {
    console.log('🔍 DEBUG: Testez getCourses() din coursesFirebase...');
    
    const { getCourses } = await import('../data/coursesFirebase');
    const courses = await getCourses();
    
    console.log('📚 DEBUG: Cursuri primite din getCourses():', courses);
    console.log('📚 DEBUG: Numărul de cursuri:', courses.length);
    
    return courses;
  } catch (error) {
    console.error('❌ DEBUG: Eroare la testarea getCourses():', error);
    throw error;
  }
};

// Funcție pentru a compara cursurile
export const compareCourses = async () => {
  try {
    console.log('🔍 DEBUG: Compar cursurile din diferite surse...');
    
    const firebaseCourses = await debugFirebaseCourses();
    const getCoursesResult = await debugGetCourses();
    
    console.log('📊 DEBUG: Comparație:');
    console.log(`  - getAllCourses(): ${firebaseCourses.length} cursuri`);
    console.log(`  - getCourses(): ${getCoursesResult.length} cursuri`);
    
    if (firebaseCourses.length !== getCoursesResult.length) {
      console.log('⚠️ DEBUG: Numărul de cursuri nu coincide!');
    } else {
      console.log('✅ DEBUG: Numărul de cursuri coincide');
    }
    
    return {
      firebase: firebaseCourses,
      getCourses: getCoursesResult
    };
  } catch (error) {
    console.error('❌ DEBUG: Eroare la compararea cursurilor:', error);
    throw error;
  }
};
