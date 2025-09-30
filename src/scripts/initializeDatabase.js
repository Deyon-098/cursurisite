// Script pentru inițializarea structurii de bază de date CursuriPlus
import { waitForFirebase } from '../firebase/config';

// =================== STRUCTURA BAZEI DE DATE ===================

/**
 * COLECȚIA CURSURI
 * Structura completă pentru cursuri cu toate câmpurile necesare
 */
export const createCourseStructure = async (courseData) => {
  try {
    await waitForFirebase();
    const db = window.firebaseDB;
    const { doc, collection, setDoc, serverTimestamp } = window.firestoreFunctions;
    
    const courseRef = doc(collection(db, 'courses'));
    const courseId = courseRef.id;
    
    const courseStructure = {
      id: courseId,
      title: courseData.title || "Titlul cursului",
      shortDescription: courseData.shortDescription || "Descriere scurtă",
      description: courseData.description || "Descriere completă",
      category: courseData.category || "web-development",
      subcategory: courseData.subcategory || "react",
      tags: courseData.tags || ["react", "javascript", "frontend"],
      price: courseData.price || 299,
      originalPrice: courseData.originalPrice || 399,
      currency: courseData.currency || "RON",
      isFree: courseData.isFree || false,
      images: {
        thumbnail: courseData.images?.thumbnail || "url-imagine",
        gallery: courseData.images?.gallery || ["url1", "url2"],
        banner: courseData.images?.banner || "url-banner"
      },
      videos: {
        preview: courseData.videos?.preview || "url-video-preview",
        lessons: courseData.videos?.lessons || ["url-lecție1", "url-lecție2"],
        totalDuration: courseData.videos?.totalDuration || 45
      },
      instructor: {
        id: courseData.instructor?.id || "instructor-id",
        name: courseData.instructor?.name || "Nume Instructor",
        bio: courseData.instructor?.bio || "Biografie instructor",
        avatar: courseData.instructor?.avatar || "url-avatar"
      },
      stats: {
        students: courseData.stats?.students || 1250,
        rating: courseData.stats?.rating || 4.8,
        reviews: courseData.stats?.reviews || 156,
        views: courseData.stats?.views || 5000,
        completions: courseData.stats?.completions || 800
      },
      settings: {
        level: courseData.settings?.level || "intermediate",
        language: courseData.settings?.language || "română",
        duration: courseData.settings?.duration || 45,
        lessons: courseData.settings?.lessons || 12,
        isPublished: courseData.settings?.isPublished || true,
        isFeatured: courseData.settings?.isFeatured || true
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp()
    };
    
    await setDoc(courseRef, courseStructure);
    console.log('✅ Curs creat cu succes:', courseId);
    return courseStructure;
  } catch (error) {
    console.error('❌ Eroare la crearea cursului:', error);
    throw error;
  }
};

/**
 * COLECȚIA UTILIZATORI
 * Structura completă pentru utilizatori cu toate câmpurile necesare
 */
export const createUserStructure = async (userData) => {
  try {
    await waitForFirebase();
    const db = window.firebaseDB;
    const { doc, collection, setDoc, serverTimestamp } = window.firestoreFunctions;
    
    const userRef = doc(collection(db, 'users'));
    const userId = userRef.id;
    
    const userStructure = {
      id: userId,
      firebaseUid: userData.firebaseUid || "firebase-user-id",
      personalInfo: {
        firstName: userData.personalInfo?.firstName || "Ion",
        lastName: userData.personalInfo?.lastName || "Popescu",
        fullName: userData.personalInfo?.fullName || "Ion Popescu",
        email: userData.personalInfo?.email || "ion@example.com",
        phone: userData.personalInfo?.phone || "+40712345678",
        avatar: userData.personalInfo?.avatar || "url-avatar",
        bio: userData.personalInfo?.bio || "Biografie utilizator",
        dateOfBirth: userData.personalInfo?.dateOfBirth || "1990-01-01",
        gender: userData.personalInfo?.gender || "male",
        location: {
          country: userData.personalInfo?.location?.country || "România",
          city: userData.personalInfo?.location?.city || "București",
          address: userData.personalInfo?.location?.address || "Strada Exemplu, Nr. 1"
        }
      },
      roles: {
        primary: userData.roles?.primary || "student",
        permissions: userData.roles?.permissions || ["view_courses", "enroll_courses"],
        isActive: userData.roles?.isActive || true,
        isVerified: userData.roles?.isVerified || true,
        isPremium: userData.roles?.isPremium || false
      },
      stats: {
        coursesEnrolled: userData.stats?.coursesEnrolled || 5,
        coursesCompleted: userData.stats?.coursesCompleted || 3,
        totalLearningTime: userData.stats?.totalLearningTime || 120,
        certificates: userData.stats?.certificates || 2,
        points: userData.stats?.points || 1500,
        level: userData.stats?.level || 3
      },
      preferences: {
        language: userData.preferences?.language || "română",
        notifications: {
          email: userData.preferences?.notifications?.email || true,
          push: userData.preferences?.notifications?.push || true,
          sms: userData.preferences?.notifications?.sms || false
        },
        privacy: {
          profilePublic: userData.preferences?.privacy?.profilePublic || false,
          showProgress: userData.preferences?.privacy?.showProgress || true,
          showCertificates: userData.preferences?.privacy?.showCertificates || true
        }
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    };
    
    await setDoc(userRef, userStructure);
    console.log('✅ Utilizator creat cu succes:', userId);
    return userStructure;
  } catch (error) {
    console.error('❌ Eroare la crearea utilizatorului:', error);
    throw error;
  }
};

/**
 * COLECȚIA PLĂȚI
 * Structura completă pentru plăți cu toate câmpurile necesare
 */
export const createPaymentStructure = async (paymentData) => {
  try {
    await waitForFirebase();
    const db = window.firebaseDB;
    const { doc, collection, setDoc, serverTimestamp } = window.firestoreFunctions;
    
    const paymentRef = doc(collection(db, 'payments'));
    const paymentId = paymentRef.id;
    
    const paymentStructure = {
      id: paymentId,
      userId: paymentData.userId || "user-id",
      courseId: paymentData.courseId || "course-id",
      orderId: paymentData.orderId || "order-123",
      payment: {
        amount: paymentData.payment?.amount || 299,
        currency: paymentData.payment?.currency || "RON",
        method: paymentData.payment?.method || "card",
        status: paymentData.payment?.status || "completed",
        transactionId: paymentData.payment?.transactionId || "txn_123456",
        gateway: paymentData.payment?.gateway || "stripe"
      },
      transaction: {
        processedAt: paymentData.transaction?.processedAt || serverTimestamp(),
        completedAt: paymentData.transaction?.completedAt || serverTimestamp(),
        refundedAt: paymentData.transaction?.refundedAt || null,
        notes: paymentData.transaction?.notes || "Plată procesată cu succes"
      },
      customer: {
        email: paymentData.customer?.email || "client@example.com",
        name: paymentData.customer?.name || "Nume Client",
        phone: paymentData.customer?.phone || "+40712345678"
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(paymentRef, paymentStructure);
    console.log('✅ Plată creată cu succes:', paymentId);
    return paymentStructure;
  } catch (error) {
    console.error('❌ Eroare la crearea plății:', error);
    throw error;
  }
};

/**
 * COLECȚIA RAPOARTE
 * Structura completă pentru rapoarte cu toate câmpurile necesare
 */
export const createReportStructure = async (reportData) => {
  try {
    await waitForFirebase();
    const db = window.firebaseDB;
    const { doc, collection, setDoc, serverTimestamp } = window.firestoreFunctions;
    
    const reportRef = doc(collection(db, 'reports'));
    const reportId = reportRef.id;
    
    const reportStructure = {
      id: reportId,
      type: reportData.type || "general",
      period: {
        start: reportData.period?.start || "2024-01-01",
        end: reportData.period?.end || "2024-01-31",
        granularity: reportData.period?.granularity || "daily"
      },
      data: {
        summary: {
          totalRevenue: reportData.data?.summary?.totalRevenue || 15000,
          totalUsers: reportData.data?.summary?.totalUsers || 500,
          totalCourses: reportData.data?.summary?.totalCourses || 25
        },
        metrics: {
          conversionRate: reportData.data?.metrics?.conversionRate || 0.15,
          averageOrderValue: reportData.data?.metrics?.averageOrderValue || 299,
          userRetention: reportData.data?.metrics?.userRetention || 0.85
        },
        charts: {
          revenueChart: reportData.data?.charts?.revenueChart || "chart-data",
          userGrowthChart: reportData.data?.charts?.userGrowthChart || "chart-data"
        },
        tables: reportData.data?.tables || [
          { name: "Top Courses", data: [] },
          { name: "User Activity", data: [] }
        ]
      },
      settings: {
        isPublic: reportData.settings?.isPublic || false,
        isScheduled: reportData.settings?.isScheduled || true,
        recipients: reportData.settings?.recipients || ["admin@example.com"],
        format: reportData.settings?.format || "json"
      },
      status: reportData.status || "generated",
      generatedBy: reportData.generatedBy || "system",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(reportRef, reportStructure);
    console.log('✅ Raport creat cu succes:', reportId);
    return reportStructure;
  } catch (error) {
    console.error('❌ Eroare la crearea raportului:', error);
    throw error;
  }
};

/**
 * Funcție pentru inițializarea completă a bazei de date
 */
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Încep inițializarea bazei de date CursuriPlus...');
    
    await waitForFirebase();
    const db = window.firebaseDB;
    const { getDocs, collection } = window.firestoreFunctions;
    
    // Verifică dacă există deja date
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const paymentsSnapshot = await getDocs(collection(db, 'payments'));
    const reportsSnapshot = await getDocs(collection(db, 'reports'));
    
    console.log(`📊 Status baza de date:
    - Cursuri: ${coursesSnapshot.size}
    - Utilizatori: ${usersSnapshot.size}
    - Plăți: ${paymentsSnapshot.size}
    - Rapoarte: ${reportsSnapshot.size}`);
    
    if (coursesSnapshot.size === 0) {
      console.log('📚 Adaug cursuri demo...');
      // Adaugă cursuri demo
      await createCourseStructure({
        title: "React pentru Începători",
        shortDescription: "Învață React de la zero",
        description: "Un curs complet de React pentru începători...",
        category: "web-development",
        subcategory: "react",
        price: 299,
        originalPrice: 399
      });
    }
    
    if (usersSnapshot.size === 0) {
      console.log('👥 Adaug utilizatori demo...');
      // Adaugă utilizatori demo
      await createUserStructure({
        personalInfo: {
          firstName: "Ion",
          lastName: "Popescu",
          email: "ion@example.com"
        },
        roles: {
          primary: "student"
        }
      });
    }
    
    if (paymentsSnapshot.size === 0) {
      console.log('💳 Adaug plăți demo...');
      // Adaugă plăți demo
      await createPaymentStructure({
        userId: "demo-user-id",
        courseId: "demo-course-id",
        payment: {
          amount: 299,
          status: "completed"
        }
      });
    }
    
    if (reportsSnapshot.size === 0) {
      console.log('📊 Adaug rapoarte demo...');
      // Adaugă rapoarte demo
      await createReportStructure({
        type: "general",
        data: {
          summary: {
            totalRevenue: 15000,
            totalUsers: 500,
            totalCourses: 25
          }
        }
      });
    }
    
    console.log('✅ Inițializarea bazei de date a fost finalizată cu succes!');
    return true;
  } catch (error) {
    console.error('❌ Eroare la inițializarea bazei de date:', error);
    throw error;
  }
};

/**
 * Funcție pentru testarea structurii bazei de date
 */
export const testDatabaseStructure = async () => {
  try {
    console.log('🧪 Încep testarea structurii bazei de date...');
    
    await waitForFirebase();
    const db = window.firebaseDB;
    const { getDocs, collection } = window.firestoreFunctions;
    
    // Testează fiecare colecție
    const collections = ['courses', 'users', 'payments', 'reports'];
    
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        console.log(`✅ Colecția ${collectionName}: ${snapshot.size} documente`);
        
        if (snapshot.size > 0) {
          const firstDoc = snapshot.docs[0];
          console.log(`📄 Primul document din ${collectionName}:`, firstDoc.data());
        }
      } catch (error) {
        console.error(`❌ Eroare la testarea colecției ${collectionName}:`, error);
      }
    }
    
    console.log('✅ Testarea structurii bazei de date a fost finalizată!');
    return true;
  } catch (error) {
    console.error('❌ Eroare la testarea structurii bazei de date:', error);
    throw error;
  }
};


