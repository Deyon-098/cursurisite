import { getAllCourses, getCourseById as getFirebaseCourseById } from '../firebase/firestore';

// Cache pentru cursuri pentru a reduce apelurile Firebase
let coursesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minute

// Funcție pentru a obține toate cursurile (cu cache)
export const getCourses = async () => {
  const now = Date.now();
  
  console.log('🔄 getCourses() apelat');
  console.log('🔄 Cache disponibil:', !!coursesCache);
  console.log('🔄 Cache timestamp:', cacheTimestamp);
  console.log('🔄 Timp curent:', now);
  
  // Verifică dacă cache-ul este valid
  if (coursesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📚 Folosesc cache-ul pentru cursuri:', coursesCache.length);
    return coursesCache;
  }
  
  try {
    console.log('🔄 Încarc cursurile din Firebase...');
    const courses = await getAllCourses();
    console.log('📚 Cursuri primite din getAllCourses():', courses);
    
    coursesCache = courses;
    cacheTimestamp = now;
    console.log('📚 Cursuri încărcate din Firebase:', courses.length);
    return courses;
  } catch (error) {
    console.error('❌ Eroare la obținerea cursurilor din Firebase:', error);
    
    // Dacă avem cache, returnează-l în caz de eroare
    if (coursesCache) {
      console.log('📚 Folosesc cache-ul pentru cursuri:', coursesCache.length);
      return coursesCache;
    }
    
    // Returnează array gol dacă nu există cursuri în Firebase
    console.log('📚 Nu există cursuri în Firebase, returnez array gol');
    return [];
  }
};

// Funcție pentru a obține un curs după ID
export const getCourseById = async (id) => {
  try {
    // Încearcă să obții din Firebase
    const course = await getFirebaseCourseById(id);
    if (course) {
      return course;
    }
  } catch (error) {
    console.error('Eroare la obținerea cursului din Firebase:', error);
  }
  
  // Caută în cache-ul de cursuri
  try {
    const courses = await getCourses();
    return courses.find(course => course.id === id) || null;
  } catch (error) {
    console.error('Eroare la căutarea cursului în cache:', error);
    return null;
  }
};

// Funcție pentru a invalida cache-ul
export const invalidateCoursesCache = () => {
  coursesCache = null;
  cacheTimestamp = null;
};

// Export pentru compatibilitate cu codul existent
export const courses = getCourses;
