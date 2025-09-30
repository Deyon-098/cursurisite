// Script pentru testarea structurii bazei de date
import { databaseManager } from './databaseManager';

/**
 * Testează structura completă a bazei de date
 */
export const testDatabaseStructure = async () => {
  try {
    console.log('🧪 Încep testarea structurii bazei de date...');
    
    // Inițializează managerul
    await databaseManager.initialize();
    
    // Testează statisticile
    console.log('📊 Testez statisticile...');
    const stats = databaseManager.getAdvancedStats();
    console.log('Statistici avansate:', stats);
    
    // Testează cursurile
    console.log('📚 Testez cursurile...');
    const courses = databaseManager.getCourses();
    console.log(`Total cursuri: ${courses.length}`);
    
    const popularCourses = databaseManager.getPopularCourses(3);
    console.log('Top 3 cursuri populare:', popularCourses.map(c => c.title));
    
    // Testează utilizatorii
    console.log('👥 Testez utilizatorii...');
    const users = databaseManager.getUsers();
    console.log(`Total utilizatori: ${users.length}`);
    
    const activeUsers = databaseManager.getActiveUsers();
    console.log(`Utilizatori activi: ${activeUsers.length}`);
    
    // Testează plățile
    console.log('💳 Testez plățile...');
    const payments = databaseManager.getPayments();
    console.log(`Total plăți: ${payments.length}`);
    
    const recentPayments = databaseManager.getRecentPayments(3);
    console.log('Ultimele 3 plăți:', recentPayments.map(p => ({
      amount: p.payment?.amount,
      status: p.payment?.status
    })));
    
    // Testează venitul
    console.log('💰 Testez venitul...');
    const totalRevenue = databaseManager.getTotalRevenue();
    console.log(`Venit total: ${totalRevenue} RON`);
    
    console.log('✅ Testarea structurii bazei de date completată cu succes!');
    
    return {
      success: true,
      stats,
      courses: courses.length,
      users: users.length,
      payments: payments.length,
      revenue: totalRevenue
    };
    
  } catch (error) {
    console.error('❌ Eroare la testarea structurii:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Testează crearea de date noi
 */
export const testCreateData = async () => {
  try {
    console.log('🧪 Testez crearea de date noi...');
    
    // Testează crearea unui curs nou
    console.log('📚 Creez curs nou...');
    const newCourse = await databaseManager.createCourse({
      title: "Test Curs - JavaScript Avansat",
      shortDescription: "Curs de test pentru JavaScript avansat",
      description: "Un curs de test pentru a verifica funcționalitatea sistemului.",
      category: "web-development",
      price: 199,
      instructorName: "Test Instructor",
      level: "advanced",
      duration: 30,
      isPublished: true
    });
    console.log('✅ Curs creat:', newCourse);
    
    // Testează crearea unui utilizator nou
    console.log('👤 Creez utilizator nou...');
    const newUser = await databaseManager.createUser({
      firebaseUid: "test-user-" + Date.now(),
      firstName: "Test",
      lastName: "User",
      fullName: "Test User",
      email: "test@example.com",
      role: "student",
      isActive: true
    });
    console.log('✅ Utilizator creat:', newUser);
    
    // Testează crearea unei plăți noi
    console.log('💳 Creez plată nouă...');
    const newPayment = await databaseManager.createPayment({
      userId: newUser,
      courseId: newCourse,
      amount: 199,
      method: "card",
      status: "completed",
      customerEmail: "test@example.com",
      customerName: "Test User"
    });
    console.log('✅ Plată creată:', newPayment);
    
    console.log('✅ Testarea creării de date completată cu succes!');
    
    return {
      success: true,
      courseId: newCourse,
      userId: newUser,
      paymentId: newPayment
    };
    
  } catch (error) {
    console.error('❌ Eroare la testarea creării de date:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Rulează toate testele
 */
export const runAllTests = async () => {
  console.log('🚀 Încep toate testele pentru baza de date...');
  
  try {
    // Testează structura
    const structureTest = await testDatabaseStructure();
    console.log('📊 Rezultat test structură:', structureTest);
    
    // Testează crearea de date
    const createTest = await testCreateData();
    console.log('📝 Rezultat test creare:', createTest);
    
    console.log('✅ Toate testele completate cu succes!');
    
    return {
      structureTest,
      createTest,
      overallSuccess: structureTest.success && createTest.success
    };
    
  } catch (error) {
    console.error('❌ Eroare la rularea testelor:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Export pentru utilizare directă
export default {
  testDatabaseStructure,
  testCreateData,
  runAllTests
};


