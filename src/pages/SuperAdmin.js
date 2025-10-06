import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { databaseManager } from '../scripts/databaseManager';
import { waitForFirebase } from '../firebase/config';

export default function SuperAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    popularCourses: [],
    loading: true
  });
  
  // State pentru gestionarea cursurilor
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // State pentru datele de plăți
  const [paymentsData, setPaymentsData] = useState({
    payments: [],
    totalRevenue: 0,
    courseStats: [],
    loading: true
  });
  
  // State pentru filtrarea cursurilor
  const [courseFilter, setCourseFilter] = useState('all');
  
  // State pentru utilizatori
  const [usersData, setUsersData] = useState({
    users: [],
    loading: true
  });
  const [usersSearchTerm, setUsersSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // State pentru graficul de înregistrări
  const [registrationChartData, setRegistrationChartData] = useState({
    data: [],
    loading: true,
    totalUsers: 0
  });
  const [newCourse, setNewCourse] = useState({
    title: '',
    shortDescription: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    category: 'web-development',
    subcategory: 'react',
    price: 0,
    originalPrice: 0,
    currency: 'EUR',
    isFree: false,
    tags: [],
    level: 'Începător',
    language: 'Română',
    duration: 0,
    lessonsCount: 0,
    instructor: 'Expert',
    instructorBio: '',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 0,
    studentsCount: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    requirements: [],
    objectives: [],
    curriculum: [],
    whatYouGet: [],
    isPublished: false,
    isFeatured: false
  });

  const navigate = useNavigate();

  // Funcție pentru filtrarea cursurilor
  const getFilteredCourseStats = () => {
    if (!paymentsData.courseStats) return [];
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    switch (courseFilter) {
      case 'week':
        // Pentru demo, returnează toate cursurile (în realitate ar filtra după dată)
        return paymentsData.courseStats;
      case 'month':
        // Pentru demo, returnează toate cursurile (în realitate ar filtra după dată)
        return paymentsData.courseStats;
      default:
        return paymentsData.courseStats;
    }
  };

  // Funcție pentru filtrarea utilizatorilor
  const getFilteredUsers = () => {
    if (!usersData.users) return [];
    
    if (!usersSearchTerm.trim()) {
      return usersData.users;
    }
    
    const searchTerm = usersSearchTerm.toLowerCase();
    return usersData.users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  };

  // Funcție pentru afișarea detaliilor utilizatorului
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Funcție helper pentru validarea datelor
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return dateObj.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getYearFromDate = (date) => {
    if (!date) return 'N/A';
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return dateObj.getFullYear().toString();
    } catch (error) {
      return 'N/A';
    }
  };

  // Funcție pentru calcularea orelor reale de conținut
  const getRealContentHours = () => {
    if (!databaseManager.courses || databaseManager.courses.length === 0) {
      return 0;
    }
    
    let totalHours = 0;
    databaseManager.courses.forEach(course => {
      // Calculează orele din durata cursului sau din lecții
      if (course.duration) {
        // Dacă cursul are durata specificată
        const duration = course.duration;
        if (typeof duration === 'number') {
          totalHours += duration;
        } else if (typeof duration === 'string') {
          // Parsează durata din string (ex: "2h 30m" sau "2.5h")
          const hoursMatch = duration.match(/(\d+(?:\.\d+)?)\s*h/i);
          const minutesMatch = duration.match(/(\d+)\s*m/i);
          
          if (hoursMatch) {
            totalHours += parseFloat(hoursMatch[1]);
          }
          if (minutesMatch) {
            totalHours += parseFloat(minutesMatch[1]) / 60;
          }
        }
      } else if (course.lessons && course.lessons.length > 0) {
        // Dacă nu are durată, calculează din lecții (presupunând 30 min per lecție)
        totalHours += course.lessons.length * 0.5;
      } else {
        // Fallback: presupune 1 oră per curs
        totalHours += 1;
      }
    });
    
    return Math.round(totalHours * 10) / 10; // Rotunjește la o zecimală
  };

  // Funcție pentru a obține datele de înregistrare din baza de date (ultimele 12 luni)
  const getRegistrationChartData = async () => {
    try {
      await waitForFirebase();
      const { collection, getDocs } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      // Creează un array cu ultimele 12 luni
      const last12Months = [];
      const today = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        last12Months.push({
          year: date.getFullYear(),
          month: date.getMonth(),
          count: 0,
          displayMonth: date.toLocaleDateString('ro-RO', { month: 'short' }),
          displayYear: date.getFullYear().toString()
        });
      }
      
      // Procesează utilizatorii și grupează după luna de înregistrare
      let totalUsers = 0;
      snapshot.docs.forEach(doc => {
        const userData = doc.data();
        totalUsers++;
        
        let createdAt = new Date();
        if (userData.createdAt) {
          try {
            createdAt = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
            if (isNaN(createdAt.getTime())) { createdAt = new Date(); }
          } catch (error) { createdAt = new Date(); }
        } else if (userData.dateCreated) {
          try {
            createdAt = userData.dateCreated.toDate ? userData.dateCreated.toDate() : new Date(userData.dateCreated);
            if (isNaN(createdAt.getTime())) { createdAt = new Date(); }
          } catch (error) { createdAt = new Date(); }
        } else if (userData.metadata?.creationTime) {
          try {
            createdAt = new Date(userData.metadata.creationTime);
            if (isNaN(createdAt.getTime())) { createdAt = new Date(); }
          } catch (error) { createdAt = new Date(); }
        }
        
        const userYear = createdAt.getFullYear();
        const userMonth = createdAt.getMonth();
        const monthData = last12Months.find(month => 
          month.year === userYear && month.month === userMonth
        );
        if (monthData) {
          monthData.count++;
        }
      });
      
      return {
        data: last12Months,
        totalUsers: totalUsers
      };
    } catch (error) {
      console.error('Eroare la obținerea datelor pentru grafic:', error);
      return {
        data: [],
        totalUsers: 0
      };
    }
  };

  // Funcții pentru obținerea datelor reale din Firebase
  const getRealUsersCount = async () => {
    try {
      await waitForFirebase();
      const { collection, getDocs } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return snapshot.size;
    } catch (error) {
      console.error('Eroare la obținerea utilizatorilor:', error);
      return 0;
    }
  };

  const getRealOrdersCount = async () => {
    try {
      await waitForFirebase();
      const { collection, getDocs } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      
      return snapshot.size;
    } catch (error) {
      console.error('Eroare la obținerea comenzilor:', error);
      return 0;
    }
  };

  const getRealRevenue = async () => {
    try {
      await waitForFirebase();
      const { collection, getDocs } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      
      let totalRevenue = 0;
      snapshot.docs.forEach(doc => {
        const orderData = doc.data();
        if (orderData.totals && orderData.totals.total) {
          totalRevenue += orderData.totals.total;
        }
      });
      
      return totalRevenue;
    } catch (error) {
      console.error('Eroare la obținerea veniturilor:', error);
      return 0;
    }
  };

  const getRealUsersData = async () => {
    try {
      await waitForFirebase();
      const { collection, getDocs, query, where } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      // Obține toți utilizatorii
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      // Obține toate comenzile pentru a calcula statisticile reale
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      
      // Creează un map cu comenzile pentru fiecare utilizator
      const userOrdersMap = {};
      let totalRevenue = 0;
      
      ordersSnapshot.docs.forEach(doc => {
        const orderData = doc.data();
        const userId = orderData.userId || orderData.user?.id;
        const orderTotal = orderData.totals?.total || 0;
        
        if (userId) {
          if (!userOrdersMap[userId]) {
            userOrdersMap[userId] = {
              ordersCount: 0,
              totalSpent: 0,
              orders: []
            };
          }
          userOrdersMap[userId].ordersCount++;
          userOrdersMap[userId].totalSpent += orderTotal;
          userOrdersMap[userId].orders.push({
            id: doc.id,
            total: orderTotal,
            date: orderData.createdAt || orderData.dateCreated || new Date(),
            status: orderData.status || 'completed'
          });
        }
        totalRevenue += orderTotal;
      });
      
      const users = [];
      usersSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        const userId = doc.id;
        const userOrders = userOrdersMap[userId] || { ordersCount: 0, totalSpent: 0, orders: [] };
        
        // Procesează data de creare
        let createdAt = new Date();
        if (userData.createdAt) {
          try {
            createdAt = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
            if (isNaN(createdAt.getTime())) {
              createdAt = new Date(); // Fallback la data curentă
            }
          } catch (error) {
            createdAt = new Date(); // Fallback la data curentă
          }
        } else if (userData.dateCreated) {
          try {
            createdAt = userData.dateCreated.toDate ? userData.dateCreated.toDate() : new Date(userData.dateCreated);
            if (isNaN(createdAt.getTime())) {
              createdAt = new Date(); // Fallback la data curentă
            }
          } catch (error) {
            createdAt = new Date(); // Fallback la data curentă
          }
        } else if (userData.metadata?.creationTime) {
          try {
            createdAt = new Date(userData.metadata.creationTime);
            if (isNaN(createdAt.getTime())) {
              createdAt = new Date(); // Fallback la data curentă
            }
          } catch (error) {
            createdAt = new Date(); // Fallback la data curentă
          }
        }

        // Procesează ultima conectare
        let lastLogin = null;
        if (userData.lastLogin) {
          lastLogin = userData.lastLogin.toDate ? userData.lastLogin.toDate() : new Date(userData.lastLogin);
        } else if (userData.lastSignInTime) {
          lastLogin = new Date(userData.lastSignInTime);
        }

        users.push({
          id: userId,
          name: userData.name || userData.displayName || 'Utilizator necunoscut',
          email: userData.email || 'Email necunoscut',
          createdAt: createdAt,
          isPremium: userData.isPremium || userData.premium || false,
          lastLogin: lastLogin,
          ordersCount: userOrders.ordersCount,
          totalSpent: userOrders.totalSpent,
          orders: userOrders.orders,
          // Date suplimentare din profilul utilizatorului
          phone: userData.phone || null,
          address: userData.address || null,
          profileImage: userData.photoURL || userData.profileImage || null
        });
      });
      
      // Sortează după data de creare (cele mai recente primul)
      users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return users;
    } catch (error) {
      console.error('Eroare la obținerea utilizatorilor:', error);
      return [];
    }
  };

  const getRealPaymentsData = async () => {
    try {
      await waitForFirebase();
      const { collection, getDocs } = window.firestoreFunctions;
      const db = window.firebaseDB;
      
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      
      const payments = [];
      let totalRevenue = 0;
      const courseStats = {};
      
      snapshot.docs.forEach(doc => {
        const orderData = doc.data();
        const orderId = doc.id;
        
        if (orderData.totals && orderData.totals.total) {
          totalRevenue += orderData.totals.total;
          
          // Procesează itemurile din comandă
          if (orderData.items && Array.isArray(orderData.items)) {
            orderData.items.forEach(item => {
              const courseId = item.courseId || item.id;
              const courseTitle = item.title || 'Curs necunoscut';
              const price = item.price || 0;
              const quantity = item.quantity || 1;
              
              if (!courseStats[courseId]) {
                courseStats[courseId] = {
                  id: courseId,
                  title: courseTitle,
                  totalSold: 0,
                  totalRevenue: 0,
                  orders: 0
                };
              }
              
              courseStats[courseId].totalSold += quantity;
              courseStats[courseId].totalRevenue += price * quantity;
              courseStats[courseId].orders += 1;
            });
          }
          
          payments.push({
            id: orderId,
            date: orderData.createdAt || orderData.date || new Date(),
            total: orderData.totals.total,
            status: orderData.status || 'completed',
            items: orderData.items || [],
            userEmail: orderData.userEmail || 'Utilizator necunoscut'
          });
        }
      });
      
      return {
        payments: payments.sort((a, b) => new Date(b.date) - new Date(a.date)),
        totalRevenue,
        courseStats: Object.values(courseStats).sort((a, b) => b.totalRevenue - a.totalRevenue)
      };
    } catch (error) {
      console.error('Eroare la obținerea datelor de plăți:', error);
      return { payments: [], totalRevenue: 0, courseStats: [] };
    }
  };

  // Baza de date cu utilizatori admin
  const adminUsers = {
    'danu': { name: 'Danu', role: 'Super Admin', password: '1234' },
    'admin': { name: 'Admin', role: 'Administrator', password: 'admin123' },
    'manager': { name: 'Manager', role: 'Manager', password: 'manager123' }
  };

  // Funcție pentru autentificare
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    const user = adminUsers[loginData.username];
    if (user && user.password === loginData.password) {
      setIsAuthenticated(true);
      setLoggedUser({
        name: user.name,
        role: user.role
      });
    } else {
      setLoginError('Acces interzis');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funcții pentru gestionarea cursurilor
  const loadCourses = async () => {
    try {
      setCoursesLoading(true);
      await databaseManager.initialize();
      const allCourses = databaseManager.courses || [];
      setCourses(allCourses);
    } catch (error) {
      console.error('Eroare la încărcarea cursurilor:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await databaseManager.initialize();
      
      if (editingCourse) {
        // Actualizează cursul existent
        await databaseManager.updateCourse(editingCourse.id, newCourse);
        console.log('✅ Curs actualizat cu succes');
      } else {
        // Adaugă curs nou
        await databaseManager.createCourse(newCourse);
        console.log('✅ Curs nou adăugat cu succes');
      }
      
      setShowAddCourseModal(false);
      setEditingCourse(null);
      setNewCourse({
        title: '',
        shortDescription: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
        category: 'web-development',
        subcategory: 'react',
        price: 0,
        originalPrice: 0,
        currency: 'EUR',
        isFree: false,
        tags: [],
        level: 'Începător',
        language: 'Română',
        duration: 0,
        lessonsCount: 0,
        instructor: 'Expert',
        instructorBio: '',
        instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
        rating: 0,
        studentsCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        requirements: [],
        objectives: [],
        curriculum: [],
        whatYouGet: [],
        isPublished: false,
        isFeatured: false
      });
      await loadCourses(); // Reîncarcă lista de cursuri
    } catch (error) {
      console.error('Eroare la adăugarea cursului:', error);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setNewCourse({
      title: course.title || '',
      shortDescription: course.shortDescription || '',
      description: course.description || '',
      image: course.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
      category: course.category || 'web-development',
      subcategory: course.subcategory || 'react',
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      currency: course.currency || 'EUR',
      isFree: course.isFree || false,
      tags: course.tags || [],
      level: course.level || 'Începător',
      language: course.language || 'Română',
      duration: course.duration || 0,
      lessonsCount: course.lessonsCount || 0,
      instructor: course.instructor || 'Expert',
      instructorBio: course.instructorBio || '',
      instructorImage: course.instructorImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      rating: course.rating || 0,
      studentsCount: course.studentsCount || 0,
      lastUpdated: course.lastUpdated || new Date().toISOString().split('T')[0],
      requirements: course.requirements || [],
      objectives: course.objectives || [],
      curriculum: course.curriculum || [],
      whatYouGet: course.whatYouGet || [],
      isPublished: course.isPublished || false,
      isFeatured: course.isFeatured || false
    });
    setShowAddCourseModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Ești sigur că vrei să ștergi acest curs?')) {
      try {
        await databaseManager.initialize();
        await databaseManager.deleteCourse(courseId);
        console.log('✅ Curs șters cu succes');
        await loadCourses(); // Reîncarcă lista de cursuri
      } catch (error) {
        console.error('Eroare la ștergerea cursului:', error);
      }
    }
  };

  const handleNewCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Încarcă statisticile pentru dashboard
  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        setDashboardStats(prev => ({ ...prev, loading: true }));
        
        // Inițializează managerul bazei de date
        await databaseManager.initialize();
        
        // Obține datele reale din Firebase
        const [realUsers, realOrders, realRevenue] = await Promise.all([
          getRealUsersCount(),
          getRealOrdersCount(),
          getRealRevenue()
        ]);
        
        // Obține datele cursurilor din databaseManager
        const totalCourses = databaseManager.courses?.length || 0;
        const publishedCourses = databaseManager.courses?.filter(c => 
          c.settings?.isPublished || c.isPublished
        )?.length || 0;
        const featuredCourses = databaseManager.courses?.filter(c => 
          c.settings?.isFeatured || c.isFeatured
        )?.length || 0;
        
        // Obține cursurile populare
        const popularCourses = databaseManager.getPopularCourses(5);
        
        console.log('📊 Statistici reale:', {
          totalCourses,
          realUsers,
          realOrders,
          realRevenue,
          publishedCourses,
          featuredCourses
        });
        
        setDashboardStats({
          totalCourses: totalCourses,
          totalUsers: realUsers,
          totalPayments: realOrders,
          totalRevenue: realRevenue,
          publishedCourses: publishedCourses,
          featuredCourses: featuredCourses,
          popularCourses: popularCourses.map(course => ({
            id: course.id,
            title: course.title,
            rating: course.stats?.rating || course.rating || 0,
            students: course.stats?.students || course.studentsCount || 0,
            price: course.price || 0
          })),
          loading: false
        });
      } catch (error) {
        console.error('Eroare la încărcarea statisticilor:', error);
        setDashboardStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadDashboardStats();
  }, [isAuthenticated]);

  // Încarcă cursurile când se accesează secțiunea
  useEffect(() => {
    if (isAuthenticated && activeSection === 'courses') {
      loadCourses();
    }
  }, [isAuthenticated, activeSection]);

  // Încarcă datele de plăți când se accesează secțiunea
  useEffect(() => {
    const loadPaymentsData = async () => {
      if (isAuthenticated && activeSection === 'payments') {
        try {
          setPaymentsData(prev => ({ ...prev, loading: true }));
          const data = await getRealPaymentsData();
          setPaymentsData({
            ...data,
            loading: false
          });
        } catch (error) {
          console.error('Eroare la încărcarea datelor de plăți:', error);
          setPaymentsData(prev => ({ ...prev, loading: false }));
        }
      }
    };

    loadPaymentsData();
  }, [isAuthenticated, activeSection]);

  // Încarcă datele utilizatorilor când se accesează secțiunea
  useEffect(() => {
    const loadUsersData = async () => {
      if (isAuthenticated && activeSection === 'users') {
        try {
          setUsersData(prev => ({ ...prev, loading: true }));
          const users = await getRealUsersData();
          setUsersData({
            users: users,
            loading: false
          });
        } catch (error) {
          console.error('Eroare la încărcarea utilizatorilor:', error);
          setUsersData(prev => ({ ...prev, loading: false }));
        }
      }
    };
    loadUsersData();
  }, [isAuthenticated, activeSection]);

  // Încarcă și actualizează datele graficului de înregistrări
  useEffect(() => {
    const loadChartData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setRegistrationChartData(prev => ({ ...prev, loading: true }));
        const chartData = await getRegistrationChartData();
        setRegistrationChartData({
          data: chartData.data,
          totalUsers: chartData.totalUsers,
          loading: false
        });
      } catch (error) {
        console.error('Eroare la încărcarea datelor graficului:', error);
        setRegistrationChartData(prev => ({ ...prev, loading: false }));
      }
    };
    
    loadChartData();
    
    // Actualizează datele la fiecare 30 de secunde pentru timp real
    const interval = setInterval(loadChartData, 30000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Închide modal-ul cu Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showUserModal) {
        setShowUserModal(false);
        setSelectedUser(null);
      }
    };

    if (showUserModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showUserModal]);

  // Actualizează statisticile când se modifică cursurile
  useEffect(() => {
    const updateStatsFromCourses = async () => {
      if (isAuthenticated && courses.length > 0) {
        try {
          // Obține datele reale din Firebase
          const [realUsers, realOrders, realRevenue] = await Promise.all([
            getRealUsersCount(),
            getRealOrdersCount(),
            getRealRevenue()
          ]);
          
          const totalCourses = courses.length;
          const publishedCourses = courses.filter(c => 
            c.settings?.isPublished || c.isPublished
          ).length;
          const featuredCourses = courses.filter(c => 
            c.settings?.isFeatured || c.isFeatured
          ).length;
          
          setDashboardStats(prev => ({
            ...prev,
            totalCourses: totalCourses,
            totalUsers: realUsers,
            totalPayments: realOrders,
            totalRevenue: realRevenue,
            publishedCourses: publishedCourses,
            featuredCourses: featuredCourses
          }));
        } catch (error) {
          console.error('Eroare la actualizarea statisticilor:', error);
        }
      }
    };

    updateStatsFromCourses();
  }, [courses, isAuthenticated]);

  // Dacă nu este autentificat, afișează ecranul de login
  if (!isAuthenticated) {
    return (
      <div className="sa-login-page">
        <div className="sa-login-container">
          <div className="sa-login-card">
            <div className="sa-login-header">
              <div className="sa-logo">
                <div className="sa-logo-icon">CP</div>
                <div className="sa-logo-text">CursuriPlus</div>
              </div>
              <div className="sa-login-title">
                <h1>Super Admin</h1>
                <p>Panoul de Control CursuriPlus</p>
              </div>
            </div>
            
            <form className="sa-login-form" onSubmit={handleLogin}>
              <div className="sa-form-group">
                <label htmlFor="username">Utilizator</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  placeholder="Introdu utilizatorul"
                  required
                />
              </div>
              
              <div className="sa-form-group">
                <label htmlFor="password">Parolă</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="Introdu parola"
                  required
                />
              </div>
              
              {loginError && (
                <div className="sa-login-error">
                  <span className="sa-error-icon">⚠️</span>
                  {loginError}
                </div>
              )}
              
              <button type="submit" className="sa-login-btn">
                Accesează Panoul
              </button>
            </form>
            
            <div className="sa-login-footer">
              <Link to="/" className="sa-back-link">
                ← Înapoi la Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      description: 'Prezentare generală'
    },
    {
      id: 'courses',
      title: 'Cursuri',
      icon: '📚',
      description: 'Gestionare cursuri'
    },
    {
      id: 'users',
      title: 'Utilizatori',
      icon: '👥',
      description: 'Gestionare utilizatori'
    },
    {
      id: 'payments',
      title: 'Plăți',
      icon: '💳',
      description: 'Tranzacții și plăți'
    },
    {
      id: 'reports',
      title: 'Rapoarte',
      icon: '📈',
      description: 'Analiză și rapoarte'
    },
    {
      id: 'settings',
      title: 'Setări',
      icon: '⚙️',
      description: 'Configurare sistem'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="sa-dashboard-content">
            <div className="sa-dashboard-header">
              <h1>Dashboard</h1>
              <p>Prezentare generală a platformei</p>
              </div>
              
              {dashboardStats.loading ? (
              <div className="sa-loading">
                <div className="sa-loading-spinner"></div>
                  <p>Se încarcă statisticile...</p>
                </div>
              ) : (
                <>
                  {/* Statistici principale */}
                <div className="sa-stats-grid">
                  <div className="sa-stat-card">
                    <div className="sa-stat-header">
                      <h3>Venit Total</h3>
                      <div className="sa-stat-icon">💰</div>
                    </div>
                    <div className="sa-stat-value">€{dashboardStats.totalRevenue?.toLocaleString() || '0'}</div>
                    <div className="sa-stat-trend positive">
                      <span>+15%</span>
                      <span>față de luna trecută</span>
                    </div>
                    <button 
                      className="sa-stat-action"
                      onClick={() => setActiveSection('payments')}
                    >
                      Vezi Detalii →
                    </button>
                    </div>
                    
                  <div className="sa-stat-card">
                    <div className="sa-stat-header">
                      <h3>Cursuri Vândute</h3>
                      <div className="sa-stat-icon">📚</div>
                      </div>
                    <div className="sa-stat-value">{dashboardStats.totalPayments || '0'}</div>
                    <div className="sa-stat-trend positive">
                      <span>+8%</span>
                      <span>față de luna trecută</span>
                    </div>
                    <button 
                      className="sa-stat-action"
                      onClick={() => setActiveSection('payments')}
                    >
                      Vezi Cursuri →
                    </button>
                    </div>
                    
                  <div className="sa-stat-card">
                    <div className="sa-stat-header">
                      <h3>Studenți Activi</h3>
                      <div className="sa-stat-icon">👥</div>
                    </div>
                    <div className="sa-countries-list">
                      <div className="sa-country-item">
                        <span className="sa-flag">📖</span>
                        <span>Studenți înregistrați: {dashboardStats.totalUsers || '0'}</span>
                      </div>
                      <div className="sa-country-item">
                        <span className="sa-flag">🎓</span>
                        <span>Cursuri finalizate: {Math.floor((dashboardStats.totalUsers || 0) * 0.3)}</span>
                      </div>
                      <div className="sa-country-item">
                        <span className="sa-flag">⭐</span>
                        <span>Rating mediu: 4.8/5</span>
                      </div>
                    </div>
                      </div>
                    </div>
                    
                {/* Grafic și statistici secundare */}
                <div className="sa-secondary-grid">
                  <div className="sa-chart-card">
                    <div className="sa-chart-header">
                      <h3>Evoluția Înregistrărilor</h3>
                      <span>Ultimele 12 luni</span>
                      </div>
                    <div className="sa-chart-simple">
                      {registrationChartData.loading ? (
                        <div className="sa-chart-loading">
                          <div className="sa-loading-spinner"></div>
                        </div>
                      ) : (
                        <div className="sa-chart-simple-content">
                          {/* Linia simplă */}
                          <div className="sa-chart-line-simple">
                            <div className="sa-chart-line-fill"></div>
                          </div>
                          
                          {/* Numărul de studenți */}
                          <div className="sa-chart-number">
                            {registrationChartData.totalUsers} studenți
                          </div>
                          
                          {/* Text explicativ */}
                          <div className="sa-chart-description">
                            Total înregistrări în ultimele 12 luni
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="sa-billing-card">
                    <div className="sa-billing-header">
                      <h3>Finanțe</h3>
                            </div>
                    <div className="sa-billing-details">
                      <div className="sa-billing-item">
                        <span>Venit lunar:</span>
                        <span>€{Math.floor((dashboardStats.totalRevenue || 0) / 12).toLocaleString()}</span>
                          </div>
                      <div className="sa-billing-item">
                        <span>Cursuri vândute:</span>
                        <span>{dashboardStats.totalPayments || '0'}</span>
                            </div>
                      <div className="sa-billing-item">
                        <span>Rambursări:</span>
                        <span>€0</span>
                          </div>
                      <div className="sa-billing-item">
                        <span>Comisioane:</span>
                        <span>€{Math.floor((dashboardStats.totalRevenue || 0) * 0.05).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="sa-billing-total">
                      <div className="sa-total-circle">
                        <span>€{dashboardStats.totalRevenue?.toLocaleString() || '0'}</span>
                        <span>Total</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Audience și Account Overview */}
                <div className="sa-tertiary-grid">
                  <div className="sa-audience-card">
                    <div className="sa-audience-header">
                      <h3>Distribuția Studenților</h3>
                    </div>
                    <div className="sa-audience-chart">
                      <div className="sa-audience-bars">
                        <div className="sa-audience-bar">
                          <span>Începători</span>
                          <div className="sa-bar-container">
                            <div className="sa-bar-fill" style={{width: '65%'}}></div>
                          </div>
                        </div>
                        <div className="sa-audience-bar">
                          <span>Avansați</span>
                          <div className="sa-bar-container">
                            <div className="sa-bar-fill" style={{width: '35%'}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="sa-audience-percentage">
                        <div className="sa-percentage-circle">
                          <span>85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sa-account-card">
                    <div className="sa-account-header">
                      <h3>Acest An</h3>
                    </div>
                    <div className="sa-account-details">
                      <div className="sa-account-item">
                        <span>Înregistrări:</span>
                        <span>{dashboardStats.totalUsers || '0'}</span>
                      </div>
                      <div className="sa-account-item">
                        <span>Cursuri create:</span>
                        <span>{dashboardStats.totalCourses || '0'}</span>
                      </div>
                      <div className="sa-account-item">
                        <span>Venit total:</span>
                        <span>€{dashboardStats.totalRevenue?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    </div>
                  </div>
                </>
              )}
          </div>
        );
      case 'courses':
        return (
          <div className="sa-courses-content">
            <div className="sa-courses-header">
              <div className="sa-header-left">
                    <h1>Gestionare Cursuri</h1>
                    <button 
                  className="sa-add-course-btn"
                      onClick={() => setShowAddCourseModal(true)}
                    >
                      ➕ Adaugă Curs Nou
                    </button>
                  </div>
                  
              <div className="sa-courses-stats">
                <div className="sa-stat-item">
                  <span className="sa-stat-number">{courses.length}</span>
                  <span className="sa-stat-label">Total Cursuri</span>
                      </div>
                <div className="sa-stat-item">
                  <span className="sa-stat-number">{dashboardStats.publishedCourses || 0}</span>
                  <span className="sa-stat-label">Publicate</span>
                      </div>
                <div className="sa-stat-item">
                  <span className="sa-stat-number">{(dashboardStats.totalCourses || 0) - (dashboardStats.publishedCourses || 0)}</span>
                  <span className="sa-stat-label">Draft</span>
                      </div>
                <div className="sa-stat-item">
                  <span className="sa-stat-number">{dashboardStats.featuredCourses || 0}</span>
                  <span className="sa-stat-label">Featured</span>
                  </div>
                </div>
              </div>
              
              {coursesLoading ? (
              <div className="sa-loading">
                <div className="sa-loading-spinner"></div>
                  <p>Se încarcă cursurile...</p>
                </div>
              ) : (
              <div className="sa-courses-container">
                  {courses.length === 0 ? (
                  <div className="sa-empty-state">
                    <div className="sa-empty-icon">📚</div>
                      <h3>Nu există cursuri</h3>
                      <p>Adaugă primul curs pentru a începe</p>
                      <button 
                      className="sa-primary-btn"
                        onClick={() => setShowAddCourseModal(true)}
                      >
                        Adaugă Primul Curs
                      </button>
                    </div>
                  ) : (
                  <div className="sa-courses-grid">
                      {courses.map((course) => (
                      <div key={course.id} className="sa-course-card">
                        <div className="sa-course-image">
                            <img src={course.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop'} alt={course.title} />
                          <div className="sa-course-status">
                              {course.isPublished ? (
                              <span className="sa-status-published">✅ Publicat</span>
                              ) : (
                              <span className="sa-status-draft">📝 Draft</span>
                              )}
                              {course.isFeatured && (
                              <span className="sa-status-featured">⭐ Featured</span>
                              )}
                            </div>
                          </div>
                          
                        <div className="sa-course-content">
                          <h3 className="sa-course-title">{course.title}</h3>
                          <p className="sa-course-instructor">👨‍🏫 {course.instructor || 'Expert'}</p>
                          <p className="sa-course-description">{course.shortDescription}</p>
                          
                          <div className="sa-course-footer">
                            <div className="sa-course-price">
                              <span className="sa-price-currency">€</span>
                              <span className="sa-price-amount">{course.isFree ? '0' : (course.price || 0).toFixed(0)}</span>
                              </div>
                            <div className="sa-course-actions">
                                <button 
                                className="sa-edit-btn"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                className="sa-delete-btn"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                      </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        );
      case 'users':
        return (
          <div className="sa-users-content">
            <div className="sa-users-header">
              <h1>Gestionare Utilizatori</h1>
              <p>Administrează utilizatorii platformei</p>
            </div>
            
            {usersData.loading ? (
              <div className="sa-loading">
                <div className="sa-loading-spinner"></div>
                <p>Se încarcă utilizatorii...</p>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="sa-users-search">
                  <div className="sa-search-container">
                    <div className="sa-search-icon">🔍</div>
                    <input
                      type="text"
                      placeholder="Caută după nume sau email..."
                      value={usersSearchTerm}
                      onChange={(e) => setUsersSearchTerm(e.target.value)}
                      className="sa-search-input"
                    />
                    {usersSearchTerm && (
                      <button
                        onClick={() => setUsersSearchTerm('')}
                        className="sa-search-clear"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="sa-search-results">
                    {getFilteredUsers().length} utilizatori găsiți
                  </div>
                </div>

                {/* Users List */}
                <div className="sa-users-list">
                  {getFilteredUsers().length > 0 ? (
                    <div className="sa-users-grid">
                      {getFilteredUsers().map((user, index) => (
                        <div key={user.id} className="sa-user-card">
                          <div className="sa-user-header">
                            <div className="sa-user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="sa-user-info">
                              <h3 className="sa-user-name">{user.name}</h3>
                              <p className="sa-user-email">{user.email}</p>
                            </div>
                            {user.isPremium && (
                              <div className="sa-user-premium-badge">
                                ⭐ Premium
                              </div>
                            )}
                          </div>
                          
                          <div className="sa-user-stats">
                            <div className="sa-user-stat">
                              <span className="sa-stat-label">Comenzi</span>
                              <span className="sa-stat-value">{user.ordersCount || 0}</span>
                            </div>
                            <div className="sa-user-stat">
                              <span className="sa-stat-label">Cheltuit</span>
                              <span className="sa-stat-value">€{(user.totalSpent || 0).toLocaleString()}</span>
                            </div>
                            <div className="sa-user-stat">
                              <span className="sa-stat-label">Înregistrat</span>
                              <span className="sa-stat-value">
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="sa-user-actions">
                            <button 
                              className="sa-user-action-btn sa-view-btn"
                              onClick={() => handleViewUser(user)}
                            >
                              Vezi Profil
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="sa-no-users">
                      <div className="sa-no-users-icon">👥</div>
                      <h3>Nu s-au găsit utilizatori</h3>
                      <p>
                        {usersSearchTerm 
                          ? `Nu s-au găsit utilizatori care să conțină "${usersSearchTerm}"`
                          : 'Nu există utilizatori în baza de date'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case 'payments':
        return (
          <div className="sa-payments-content">
            <div className="sa-payments-header">
              <h1>Gestionare Plăți</h1>
              <p>Statistici și detalii despre plăți și cursuri vândute</p>
            </div>
            
            {paymentsData.loading ? (
              <div className="sa-loading">
                <div className="sa-loading-spinner"></div>
                <p>Se încarcă datele de plăți...</p>
              </div>
            ) : (
              <>
                {/* Statistici generale */}
                <div className="sa-payments-stats">
                  <div className="sa-payment-stat-card">
                    <div className="sa-payment-stat-icon">💰</div>
                    <div className="sa-payment-stat-info">
                      <h3>Venit Total</h3>
                      <div className="sa-payment-stat-value">€{paymentsData.totalRevenue?.toLocaleString() || '0'}</div>
                    </div>
                  </div>
                  
                  <div className="sa-payment-stat-card">
                    <div className="sa-payment-stat-icon">📦</div>
                    <div className="sa-payment-stat-info">
                      <h3>Total Plăți</h3>
                      <div className="sa-payment-stat-value">{paymentsData.payments?.length || '0'}</div>
                    </div>
                  </div>
                  
                  <div className="sa-payment-stat-card">
                    <div className="sa-payment-stat-icon">📚</div>
                    <div className="sa-payment-stat-info">
                      <h3>Cursuri Vândute</h3>
                      <div className="sa-payment-stat-value">{paymentsData.courseStats?.length || '0'}</div>
                    </div>
                  </div>
                </div>

                {/* Top cursuri vândute */}
                <div className="sa-top-courses">
                  <div className="sa-top-courses-header">
                    <h2>Top Cursuri Vândute</h2>
                    <div className="sa-top-courses-filters">
                      <button 
                        className={`sa-filter-btn ${courseFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setCourseFilter('all')}
                      >
                        Toate
                      </button>
                      <button 
                        className={`sa-filter-btn ${courseFilter === 'month' ? 'active' : ''}`}
                        onClick={() => setCourseFilter('month')}
                      >
                        Luna aceasta
                      </button>
                      <button 
                        className={`sa-filter-btn ${courseFilter === 'week' ? 'active' : ''}`}
                        onClick={() => setCourseFilter('week')}
                      >
                        Ultimele 7 zile
                      </button>
                    </div>
                  </div>
                  
                  <div className="sa-courses-sales-grid">
                    {getFilteredCourseStats()?.slice(0, 12).map((course, index) => (
                      <div key={course.id} className="sa-course-sale-card">
                        <div className="sa-course-sale-header">
                          <div className="sa-course-sale-rank">
                            <span className="sa-rank-number">#{index + 1}</span>
                            <div className="sa-rank-badge">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                            </div>
                          </div>
                          <div className="sa-course-sale-revenue">
                            €{course.totalRevenue?.toLocaleString() || '0'}
                          </div>
                        </div>
                        
                        <div className="sa-course-sale-content">
                          <h4 className="sa-course-sale-title">{course.title}</h4>
                          
                          <div className="sa-course-sale-metrics">
                            <div className="sa-metric-item">
                              <div className="sa-metric-icon">👥</div>
                              <div className="sa-metric-info">
                                <span className="sa-metric-value">{course.totalSold}</span>
                                <span className="sa-metric-label">Studenți</span>
                              </div>
                            </div>
                            
                            <div className="sa-metric-item">
                              <div className="sa-metric-icon">📦</div>
                              <div className="sa-metric-info">
                                <span className="sa-metric-value">{course.orders}</span>
                                <span className="sa-metric-label">Comenzi</span>
                              </div>
                            </div>
                            
                            <div className="sa-metric-item">
                              <div className="sa-metric-icon">💰</div>
                              <div className="sa-metric-info">
                                <span className="sa-metric-value">€{Math.round(course.totalRevenue / course.totalSold) || 0}</span>
                                <span className="sa-metric-label">Preț mediu</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {paymentsData.courseStats?.length === 0 && (
                    <div className="sa-no-courses">
                      <div className="sa-no-courses-icon">📚</div>
                      <h3>Nu există cursuri vândute</h3>
                      <p>Încă nu s-au vândut cursuri. Când utilizatorii vor cumpăra cursuri, acestea vor apărea aici.</p>
                    </div>
                  )}
                </div>

                {/* Istoric plăți */}
                <div className="sa-payments-history">
                  <h2>Istoric Plăți</h2>
                  <div className="sa-payments-table">
                    <div className="sa-payments-table-header">
                      <div>Data</div>
                      <div>Utilizator</div>
                      <div>Cursuri</div>
                      <div>Total</div>
                      <div>Status</div>
                    </div>
                    <div className="sa-payments-table-body">
                      {paymentsData.payments?.slice(0, 20).map((payment) => (
                        <div key={payment.id} className="sa-payment-row">
                          <div className="sa-payment-date">
                            {new Date(payment.date).toLocaleDateString('ro-RO')}
                          </div>
                          <div className="sa-payment-user">
                            {payment.userEmail}
                          </div>
                          <div className="sa-payment-courses">
                            {payment.items?.length || 0} cursuri
                          </div>
                          <div className="sa-payment-total">
                            €{payment.total?.toLocaleString() || '0'}
                          </div>
                          <div className={`sa-payment-status ${payment.status}`}>
                            {payment.status === 'completed' ? '✅ Finalizată' : 
                             payment.status === 'pending' ? '⏳ În așteptare' : 
                             payment.status === 'cancelled' ? '❌ Anulată' : payment.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'reports':
        return (
          <div className="sa-content">
            <h2>Rapoarte și Analiză</h2>
            <p>Secțiunea pentru rapoarte și analiză va fi implementată aici.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="sa-content">
            <h2>Setări Sistem</h2>
            <p>Secțiunea pentru configurarea sistemului va fi implementată aici.</p>
          </div>
        );
      default:
        return (
          <div className="sa-content">
            <h2>Secțiune necunoscută</h2>
            <p>Te rugăm să selectezi o secțiune validă din meniul lateral.</p>
          </div>
        );
    }
  };

  return (
    <div className="sa-page">
      {/* Header */}
      <div className="sa-header">
        <div className="sa-header-content">
          <div className="sa-header-left">
            <div className="sa-logo">
              <div className="sa-logo-icon">CP</div>
              <div className="sa-logo-text">CursuriPlus</div>
            </div>
          </div>
          
          <div className="sa-header-right">
            <div className="sa-user-profile">
              <div className="sa-profile-avatar">
                {loggedUser?.name ? loggedUser.name.charAt(0).toUpperCase() : 'SA'}
              </div>
              <div className="sa-profile-info">
                <span className="sa-profile-name">{loggedUser?.name || 'Super Admin'}</span>
                <span className="sa-profile-role">{loggedUser?.role || 'Administrator'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="sa-layout">
        {/* Sidebar */}
        <div className="sa-sidebar">
          <nav className="sa-nav">
            <ul className="sa-nav-list">
              {menuItems.map((item) => (
                <li key={item.id} className="sa-nav-item">
                  <button
                    className={`sa-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="sa-nav-icon">{item.icon}</span>
                    <div className="sa-nav-content">
                      <span className="sa-nav-title">{item.title}</span>
                      <span className="sa-nav-desc">{item.description}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="sa-sidebar-footer">
          </div>
        </div>

        {/* Main Content */}
        <div className="sa-main">
          <div className="sa-main-content">
            {renderContent()}
          </div>
        </div>
      </div>

              {/* Modal pentru detaliile utilizatorului */}
              {showUserModal && selectedUser && (
                <div className="sa-modal-overlay" onClick={() => setShowUserModal(false)}>
                  <div className="sa-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="sa-modal-header">
                      <h2>Detalii Utilizator</h2>
                      <button 
                        className="sa-modal-close"
                        onClick={() => setShowUserModal(false)}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="sa-user-details">
                      <div className="sa-user-detail-header">
                        <div className="sa-user-detail-avatar">
                          {selectedUser.profileImage ? (
                            <img src={selectedUser.profileImage} alt={selectedUser.name} />
                          ) : (
                            selectedUser.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="sa-user-detail-info">
                          <h3>{selectedUser.name}</h3>
                          <p>{selectedUser.email}</p>
                          {selectedUser.isPremium && (
                            <span className="sa-user-premium-badge">⭐ Premium</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="sa-user-detail-stats">
                        <div className="sa-user-detail-stat">
                          <span className="sa-detail-label">Comenzi Totale</span>
                          <span className="sa-detail-value">{selectedUser.ordersCount || 0}</span>
                        </div>
                        <div className="sa-user-detail-stat">
                          <span className="sa-detail-label">Suma Cheltuită</span>
                          <span className="sa-detail-value">€{(selectedUser.totalSpent || 0).toLocaleString()}</span>
                        </div>
                        <div className="sa-user-detail-stat">
                          <span className="sa-detail-label">Data Înregistrării</span>
                          <span className="sa-detail-value">
                            {formatDate(selectedUser.createdAt)}
                          </span>
                        </div>
                        <div className="sa-user-detail-stat">
                          <span className="sa-detail-label">Ultima Conectare</span>
                          <span className="sa-detail-value">
                            {formatDate(selectedUser.lastLogin)}
                          </span>
                        </div>
                        <div className="sa-user-detail-stat">
                          <span className="sa-detail-label">Telefon</span>
                          <span className="sa-detail-value">
                            {selectedUser.phone || 'N/A'}
                          </span>
                        </div>
                        <div className="sa-user-detail-stat">
                          <span className="sa-detail-label">Adresă</span>
                          <span className="sa-detail-value">
                            {selectedUser.address || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Statistici generale */}
                      <div className="sa-user-summary">
                        <h4>Rezumat Activitate</h4>
                        <div className="sa-user-summary-stats">
                          <div className="sa-summary-stat">
                            <span className="sa-summary-icon">📊</span>
                            <div className="sa-summary-info">
                              <span className="sa-summary-label">Cursuri Cumpărate</span>
                              <span className="sa-summary-value">{selectedUser.ordersCount || 0}</span>
                            </div>
                          </div>
                          <div className="sa-summary-stat">
                            <span className="sa-summary-icon">💰</span>
                            <div className="sa-summary-info">
                              <span className="sa-summary-label">Investiție Totală</span>
                              <span className="sa-summary-value">€{(selectedUser.totalSpent || 0).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="sa-summary-stat">
                            <span className="sa-summary-icon">📅</span>
                            <div className="sa-summary-info">
                              <span className="sa-summary-label">Membru din</span>
                              <span className="sa-summary-value">
                                {getYearFromDate(selectedUser.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="sa-summary-stat">
                            <span className="sa-summary-icon">⭐</span>
                            <div className="sa-summary-info">
                              <span className="sa-summary-label">Status</span>
                              <span className="sa-summary-value">
                                {selectedUser.isPremium ? 'Premium' : 'Standard'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedUser.orders && selectedUser.orders.length > 0 && (
                        <div className="sa-user-orders">
                          <h4>Istoric Comenzi</h4>
                          <div className="sa-user-orders-list">
                            {selectedUser.orders.map((order, index) => (
                              <div key={order.id || index} className="sa-user-order-item">
                                <div className="sa-order-info">
                                  <span className="sa-order-id">#{order.id}</span>
                                  <span className="sa-order-date">
                                    {new Date(order.date).toLocaleDateString('ro-RO')}
                                  </span>
                                </div>
                                <div className="sa-order-amount">€{order.total.toLocaleString()}</div>
                                <div className={`sa-order-status ${order.status}`}>
                                  {order.status === 'completed' ? '✅ Finalizată' : 
                                   order.status === 'pending' ? '⏳ În așteptare' : 
                                   '❌ Anulată'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

      {/* Modal pentru adăugarea/editarea cursurilor */}
      {showAddCourseModal && (
        <div className="sa-modal-overlay">
          <div className="sa-modal">
            <div className="sa-modal-header">
              <h2>{editingCourse ? 'Editează Curs' : 'Adaugă Curs Nou'}</h2>
              <button 
                className="sa-modal-close"
                onClick={() => {
                  setShowAddCourseModal(false);
                  setEditingCourse(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="sa-modal-form">
              <div className="sa-form-group">
                <label htmlFor="title">Titlul cursului *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCourse.title}
                  onChange={handleNewCourseChange}
                  required
                  placeholder="Introdu titlul cursului"
                />
              </div>
              
              <div className="sa-form-group">
                <label htmlFor="shortDescription">Descriere scurtă *</label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={newCourse.shortDescription}
                  onChange={handleNewCourseChange}
                  required
                  placeholder="Descriere scurtă pentru curs"
                  rows="3"
                />
              </div>
              
              <div className="sa-form-group">
                <label htmlFor="description">Despre acest curs *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleNewCourseChange}
                  placeholder="Descriere detaliată a cursului - ce va învăța utilizatorul"
                  rows="5"
                  required
                />
              </div>
              
              <div className="sa-form-row">
                <div className="sa-form-group">
                  <label htmlFor="image">URL Imagine *</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={newCourse.image}
                    onChange={handleNewCourseChange}
                    required
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                
                <div className="sa-form-group">
                  <label htmlFor="instructor">Instructor *</label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    value={newCourse.instructor}
                    onChange={handleNewCourseChange}
                    required
                    placeholder="Numele instructorului"
                  />
                </div>
              </div>
              
              <div className="sa-form-row">
                <div className="sa-form-group">
                  <label htmlFor="category">Categorie *</label>
                  <select
                    id="category"
                    name="category"
                    value={newCourse.category}
                    onChange={handleNewCourseChange}
                    required
                  >
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="data-science">Data Science</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="blockchain">Blockchain</option>
                    <option value="game-development">Game Development</option>
                  </select>
                </div>
                
                <div className="sa-form-group">
                  <label htmlFor="level">Nivel *</label>
                  <select
                    id="level"
                    name="level"
                    value={newCourse.level}
                    onChange={handleNewCourseChange}
                    required
                  >
                    <option value="Începător">Începător</option>
                    <option value="Intermediar">Intermediar</option>
                    <option value="Avansat">Avansat</option>
                  </select>
                </div>
              </div>
              
              <div className="sa-form-row">
                <div className="sa-form-group">
                  <label htmlFor="price">Preț (EUR) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newCourse.price}
                    onChange={handleNewCourseChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="sa-form-group">
                  <label htmlFor="duration">Durată (ore)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={newCourse.duration}
                    onChange={handleNewCourseChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="sa-form-checkboxes">
                <div className="sa-form-checkbox">
                  <input
                    type="checkbox"
                    id="isFree"
                    name="isFree"
                    checked={newCourse.isFree}
                    onChange={handleNewCourseChange}
                  />
                  <label htmlFor="isFree">Curs gratuit</label>
                </div>
                
                <div className="sa-form-checkbox">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={newCourse.isPublished}
                    onChange={handleNewCourseChange}
                  />
                  <label htmlFor="isPublished">Publicat</label>
                </div>
                
                <div className="sa-form-checkbox">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={newCourse.isFeatured}
                    onChange={handleNewCourseChange}
                  />
                  <label htmlFor="isFeatured">Featured</label>
                </div>
              </div>
              
              <div className="sa-modal-actions">
                <button 
                  type="button" 
                  className="sa-cancel-btn"
                  onClick={() => {
                    setShowAddCourseModal(false);
                    setEditingCourse(null);
                  }}
                >
                  Anulează
                </button>
                <button type="submit" className="sa-save-btn">
                  {editingCourse ? 'Actualizează Curs' : 'Adaugă Curs'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}