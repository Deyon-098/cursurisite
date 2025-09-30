// Manager pentru structura bazei de date CursuriPlus
import { waitForFirebase } from '../firebase/config';
import { getAllCourses } from '../firebase/firestore';

/**
 * Clasa pentru gestionarea structurii bazei de date
 */
export class DatabaseManager {
  constructor() {
    this.isInitialized = false;
    this.courses = [];
    this.users = [];
    this.payments = [];
    this.reports = [];
  }

  /**
   * Inițializează baza de date cu structura completă
   */
  async initialize() {
    try {
      console.log('🚀 Inițializez DatabaseManager...');
      
      if (this.isInitialized) {
        console.log('⚠️ DatabaseManager deja inițializat');
        return;
      }

      await waitForFirebase();
      
      // Încarcă cursurile din Firebase
      this.courses = await getAllCourses();
      console.log(`📚 Am încărcat ${this.courses.length} cursuri`);
      
      // Pentru demo, adaugă câteva cursuri dacă nu există
      if (this.courses.length === 0) {
        console.log('📝 Adaug cursuri demo...');
        await this.addDemoCourses();
        this.courses = await getAllCourses();
      }
      
      this.isInitialized = true;
      console.log('✅ DatabaseManager inițializat cu succes');
    } catch (error) {
      console.error('❌ Eroare la inițializarea DatabaseManager:', error);
      throw error;
    }
  }

  /**
   * Adaugă cursuri demo pentru testare
   */
  async addDemoCourses() {
    try {
      const { doc, collection, setDoc, serverTimestamp } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const demoCourses = [
        {
          title: "React pentru Începători",
          shortDescription: "Învață React de la zero cu exemple practice",
          description: "Un curs complet de React pentru începători, cu exemple practice și proiecte reale.",
          category: "web-development",
          subcategory: "react",
          price: 299,
          originalPrice: 399,
          currency: "RON",
          isFree: false,
          tags: ["react", "javascript", "frontend"],
          settings: {
            level: "beginner",
            language: "română",
            duration: 45,
            lessons: 12,
            isPublished: true,
            isFeatured: true
          },
          stats: {
            students: 1250,
            rating: 4.8,
            reviews: 156,
            views: 5000,
            completions: 800
          }
        },
        {
          title: "JavaScript Avansat",
          shortDescription: "Tehnici avansate de JavaScript pentru dezvoltatori",
          description: "Explorează funcțiile avansate ale JavaScript-ului și cum să le folosești în proiecte reale.",
          category: "web-development",
          subcategory: "javascript",
          price: 399,
          originalPrice: 499,
          currency: "RON",
          isFree: false,
          tags: ["javascript", "advanced", "programming"],
          settings: {
            level: "advanced",
            language: "română",
            duration: 60,
            lessons: 15,
            isPublished: true,
            isFeatured: false
          },
          stats: {
            students: 890,
            rating: 4.9,
            reviews: 98,
            views: 3200,
            completions: 650
          }
        },
        {
          title: "CSS Modern și Responsive",
          shortDescription: "Design modern cu CSS Grid și Flexbox",
          description: "Învață să creezi design-uri moderne și responsive folosind tehnici CSS avansate.",
          category: "web-development",
          subcategory: "css",
          price: 199,
          originalPrice: 299,
          currency: "RON",
          isFree: false,
          tags: ["css", "design", "responsive"],
          settings: {
            level: "intermediate",
            language: "română",
            duration: 30,
            lessons: 10,
            isPublished: true,
            isFeatured: false
          },
          stats: {
            students: 2100,
            rating: 4.7,
            reviews: 203,
            views: 6800,
            completions: 1200
          }
        }
      ];

      for (const courseData of demoCourses) {
        const courseRef = doc(collection(db, 'courses'));
        const courseId = courseRef.id;
        
        const courseStructure = {
          id: courseId,
          ...courseData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          publishedAt: serverTimestamp()
        };
        
        await setDoc(courseRef, courseStructure);
        console.log(`✅ Curs demo adăugat: ${courseData.title}`);
      }
    } catch (error) {
      console.error('❌ Eroare la adăugarea cursurilor demo:', error);
    }
  }

  /**
   * Obține statistici despre baza de date
   */
  getStats() {
    return {
      courses: this.courses.length,
      users: this.users.length,
      payments: this.payments.length,
      reports: this.reports.length
    };
  }

  /**
   * Obține statistici avansate
   */
  getAdvancedStats() {
    const totalRevenue = this.payments.reduce((sum, payment) => {
      return sum + (payment.payment?.amount || 0);
    }, 0);

    return {
      courses: {
        total: this.courses.length,
        published: this.courses.filter(course => course.settings?.isPublished).length,
        featured: this.courses.filter(course => course.settings?.isFeatured).length
      },
      users: {
        total: this.users.length,
        active: this.users.filter(user => user.roles?.isActive).length,
        premium: this.users.filter(user => user.roles?.isPremium).length
      },
      payments: {
        total: this.payments.length,
        totalRevenue: totalRevenue,
        completed: this.payments.filter(payment => payment.payment?.status === 'completed').length
      },
      reports: {
        total: this.reports.length,
        generated: this.reports.filter(report => report.status === 'generated').length
      }
    };
  }

  /**
   * Obține cursurile populare
   */
  getPopularCourses(limit = 5) {
    return this.courses
      .sort((a, b) => (b.stats?.rating || 0) - (a.stats?.rating || 0))
      .slice(0, limit);
  }

  /**
   * Obține toate cursurile
   */
  getCourses() {
    return this.courses;
  }

  /**
   * Obține toți utilizatorii
   */
  getUsers() {
    return this.users;
  }

  /**
   * Obține toate plățile
   */
  getPayments() {
    return this.payments;
  }

  /**
   * Obține toate rapoartele
   */
  getReports() {
    return this.reports;
  }

  /**
   * Creează un curs nou
   */
  async createCourse(courseData) {
    try {
      const { doc, collection, setDoc, serverTimestamp } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const courseRef = doc(collection(db, 'courses'));
      const courseId = courseRef.id;
      
      const courseStructure = {
        id: courseId,
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: courseData.settings?.isPublished ? serverTimestamp() : null
      };
      
      await setDoc(courseRef, courseStructure);
      
      // Reîncarcă cursurile
      this.courses = await getAllCourses();
      
      console.log('✅ Curs creat cu succes:', courseId);
      return courseStructure;
    } catch (error) {
      console.error('❌ Eroare la crearea cursului:', error);
      throw error;
    }
  }

  /**
   * Actualizează un curs existent
   */
  async updateCourse(courseId, courseData) {
    try {
      const { doc, setDoc, serverTimestamp } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const courseRef = doc(db, 'courses', courseId);
      
      const updatedCourse = {
        ...courseData,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(courseRef, updatedCourse, { merge: true });
      
      // Reîncarcă cursurile
      this.courses = await getAllCourses();
      
      console.log('✅ Curs actualizat cu succes:', courseId);
      return updatedCourse;
    } catch (error) {
      console.error('❌ Eroare la actualizarea cursului:', error);
      throw error;
    }
  }

  /**
   * Șterge un curs
   */
  async deleteCourse(courseId) {
    try {
      const { doc, deleteDoc } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const courseRef = doc(db, 'courses', courseId);
      await deleteDoc(courseRef);
      
      // Reîncarcă cursurile
      this.courses = await getAllCourses();
      
      console.log('✅ Curs șters cu succes:', courseId);
      return true;
    } catch (error) {
      console.error('❌ Eroare la ștergerea cursului:', error);
      throw error;
    }
  }
}

// Export instanță singleton
export const databaseManager = new DatabaseManager();