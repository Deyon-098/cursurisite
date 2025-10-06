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
                    <button className="sa-stat-action">Vezi Detalii →</button>
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
                    <button className="sa-stat-action">Vezi Cursuri →</button>
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
                      <span>Ultimele 30 zile</span>
                    </div>
                    <div className="sa-chart-placeholder">
                      <div className="sa-chart-line"></div>
                      <div className="sa-chart-point">{dashboardStats.totalUsers || '0'} studenți</div>
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
          <div className="sa-content">
            <h2>Gestionare Utilizatori</h2>
            <p>Secțiunea pentru gestionarea utilizatorilor va fi implementată aici.</p>
          </div>
        );
      case 'payments':
        return (
          <div className="sa-content">
            <h2>Gestionare Plăți</h2>
            <p>Secțiunea pentru gestionarea plăților va fi implementată aici.</p>
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
            <div className="sa-footer-graphic">
              <div className="sa-graphic-person">👤</div>
              <div className="sa-graphic-elements">
                <span>📢</span>
                <span>🛍️</span>
                <span>📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="sa-main">
          <div className="sa-main-content">
            {renderContent()}
          </div>
        </div>
      </div>

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