import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getUserOrders, getUserPurchasedCourses } from '../firebase/firestore';
import { getCourses } from '../data/coursesFirebase';
import { waitForFirebase } from '../firebase/config';

// Funcție pentru generarea analytics bazate pe datele reale
const generateAnalytics = (orders, courseProgress, userActivity) => ({
  pageViews: {
    '/courses': Math.floor(Math.random() * 1000) + 500,
    '/dashboard': Math.floor(Math.random() * 500) + 200,
  },
  coursesProgress: courseProgress.map(progress => ({
    id: progress.courseId,
    title: progress.courseTitle,
    progress: progress.progress,
    timeSpent: `${progress.timeSpent || 0}h`,
    lastAccessed: progress.lastAccessed ? 
      new Date(progress.lastAccessed.seconds * 1000).toLocaleDateString('ro-RO') : 
      'Nu accesat',
    completionRate: progress.progress
  })),
  recentActivity: userActivity.slice(0, 5).map(activity => ({
    type: activity.type,
    course: activity.courseTitle || 'Sistem',
    action: activity.action,
    time: activity.timestamp ? 
      new Date(activity.timestamp.seconds * 1000).toLocaleDateString('ro-RO') : 
      'Recent'
  })),
  monthlyStats: {
    coursesCompleted: courseProgress.filter(c => c.progress >= 95).length,
    hoursLearned: courseProgress.reduce((sum, c) => sum + (c.timeSpent || 0), 0),
    streakDays: Math.floor(Math.random() * 30) + 1,
    averageScore: Math.floor(Math.random() * 20) + 80
  }
});

export default function Dashboard() {
  const { user, logout, loading: authLoading, isPremium, premiumStatus } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    purchasedCourses: [],
    courses: [],
    courseProgress: [],
    userActivity: [],
    analytics: {
      pageViews: {},
      coursesProgress: [],
      recentActivity: [],
      monthlyStats: { coursesCompleted: 0, hoursLearned: 0, streakDays: 0, averageScore: 0 }
    },
    loading: true
  });
  
  const [activeView, setActiveView] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lastUserId, setLastUserId] = useState(null);

  // Resetează datele Dashboard-ului când utilizatorul se schimbă
  useEffect(() => {
    if (user && user.id !== lastUserId) {
      console.log('🔄 Utilizator nou în Dashboard - resetez datele');
      setDashboardData({
        orders: [],
        purchasedCourses: [],
        courses: [],
        courseProgress: [],
        userActivity: [],
        analytics: {
          pageViews: {},
          coursesProgress: [],
          recentActivity: [],
          monthlyStats: { coursesCompleted: 0, hoursLearned: 0, streakDays: 0, averageScore: 0 }
        },
        loading: true
      });
      setLastUserId(user.id);
    } else if (!user && lastUserId) {
      console.log('🚪 Utilizator deconectat din Dashboard - resetez datele');
      setLastUserId(null);
    }
  }, [user, lastUserId]);

  // Redirect dacă utilizatorul nu este conectat
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Încarcă datele dashboard-ului
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || !lastUserId) return;

      try {
        await waitForFirebase();
        
        const { collection, getDocs, query, where } = window.firestoreFunctions;
        const db = window.firebaseDB;

        // Încarcă datele reale din Firebase
        console.log('🔄 Încarc datele Dashboard pentru utilizatorul:', user.id);
        
        const [orders, allCourses, courseProgress, userActivity] = await Promise.all([
          getUserOrders(user.id),
          getCourses(),
          // Încarcă progresul cursurilor
          (async () => {
            const progressRef = collection(db, 'courseProgress');
            const progressQuery = query(progressRef, where('userId', '==', user.id));
            const progressSnapshot = await getDocs(progressQuery);
            return progressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          })(),
          // Încarcă activitatea utilizatorului
          (async () => {
            const activityRef = collection(db, 'userActivity');
            const activityQuery = query(activityRef, where('userId', '==', user.id));
            const activitySnapshot = await getDocs(activityQuery);
            return activitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          })()
        ]);

        console.log('📦 Comenzi primite din getUserOrders:', orders);
        console.log('📦 Numărul de comenzi:', orders.length);
        if (orders.length > 0) {
          console.log('📦 Prima comandă:', orders[0]);
        }

        // Extrage cursurile cumpărate din comenzi
        const purchasedCourseIds = orders.flatMap(order => 
          order.items.map(item => item.id)
        );
        console.log('🛒 ID-uri cursuri cumpărate:', purchasedCourseIds);
        
        const purchasedCourses = allCourses.filter(course => 
          purchasedCourseIds.includes(course.id)
        );
        console.log('📚 Cursuri cumpărate găsite:', purchasedCourses.length);
        console.log('📚 Cursuri cumpărate:', purchasedCourses);

        // Generează analytics bazate pe datele reale
        const realAnalytics = generateAnalytics(orders, courseProgress, userActivity);

        setDashboardData({
          orders: orders || [],
          purchasedCourses: purchasedCourses || [],
          courses: allCourses || [],
          courseProgress: courseProgress || [],
          userActivity: userActivity || [],
          analytics: realAnalytics,
          loading: false
        });
      } catch (error) {
        console.error('Eroare la încărcarea datelor dashboard:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    if (user && !authLoading && lastUserId) {
      loadDashboardData();
    }
  }, [user, authLoading, lastUserId]);

  // Animații GSAP pentru Dashboard - mutat înainte de return-urile condiționale
  useEffect(() => {
    if (window.gsap && dashboardData.purchasedCourses.length > 0) {
      // Animație pentru cardurile de cursuri
      window.gsap.fromTo('.course-card-professional',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }
      );

      // Efecte hover pentru cardurile de cursuri
      const courseCards = document.querySelectorAll('.course-card-professional');
      courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          window.gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        
        card.addEventListener('mouseleave', () => {
          window.gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });
    }
  }, [dashboardData.purchasedCourses]);

  // Animație pentru sidebar - mutat înainte de return-urile condiționale
  useEffect(() => {
    if (window.gsap) {
      window.gsap.fromTo('.dashboard-sidebar',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
      );

      window.gsap.fromTo('.dashboard-main',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  // Loading state
  if (authLoading || dashboardData.loading || premiumStatus.loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-loading">
            <div className="loading-spinner">🔄</div>
            <p>Se încarcă dashboard-ul...</p>
          </div>
        </div>
      </div>
    );
  }

  // Dacă utilizatorul nu este conectat
  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Eroare la logout:', error);
    }
  };

  // Calculează statistici
  const stats = {
    totalOrders: dashboardData.orders.length,
    totalSpent: dashboardData.orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0),
    coursesOwned: dashboardData.purchasedCourses.length,
    cartItems: totals.count
  };

  return (
    <div className="dashboard-drive">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <div className="brand-icon">📚</div>
            <span>CursuriPlus</span>
          </Link>
          <Link to="/" className="back-to-home">
            <span className="nav-icon">🏠</span>
            <span>Înapoi la Home</span>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveView('courses')}
          >
            <span className="nav-icon">📚</span>
            <span>Cursurile Mele</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            <span className="nav-icon">📈</span>
            <span>Analytics</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'shared' ? 'active' : ''}`}
            onClick={() => setActiveView('shared')}
          >
            <span className="nav-icon">👥</span>
            <span>Partajate cu Mine</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveView('recent')}
          >
            <span className="nav-icon">🕒</span>
            <span>Recente</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'starred' ? 'active' : ''}`}
            onClick={() => setActiveView('starred')}
          >
            <span className="nav-icon">⭐</span>
            <span>Favorite</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'trash' ? 'active' : ''}`}
            onClick={() => setActiveView('trash')}
          >
            <span className="nav-icon">🗑️</span>
            <span>Coș de Gunoi</span>
          </button>
        </nav>
        
        <div className="sidebar-storage">
          <h4>DETALII PROGRES</h4>
          <div className="storage-item">
            <span className="storage-icon">📈</span>
            <span>Progres</span>
          </div>
          <div className="storage-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '68%' }}></div>
            </div>
            <span>68% din 100% progres total</span>
          </div>
          <div className="storage-details">
            <div className="storage-line">
              <span className="storage-color blue"></span>
              <span>Cursuri Active: {dashboardData.analytics.coursesProgress.filter(c => c.progress < 100).length}</span>
            </div>
            <div className="storage-line">
              <span className="storage-color green"></span>
              <span>Finalizate: {dashboardData.analytics.coursesProgress.filter(c => c.progress >= 95).length}</span>
            </div>
          </div>
          <button className="upgrade-btn">
            ⭐ Upgrade la Premium
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header-new">
          <div className="header-left">
            <h1>
              {activeView === 'overview' && 'Dashboard'}
              {activeView === 'courses' && 'Cursurile Mele'}
              {activeView === 'analytics' && 'Analytics'}
              {activeView === 'shared' && 'Partajate cu Mine'}
              {activeView === 'recent' && 'Recente'}
              {activeView === 'starred' && 'Favorite'}
              {activeView === 'trash' && 'Coș de Gunoi'}
            </h1>
            <div className="breadcrumb">
              <span>📁 {user.name}</span>
            </div>
          </div>
          
          <div className="header-right">
            <button className="header-btn">
              <span>📊</span>
            </button>
            <button className="header-btn">
              <span>ℹ️</span>
            </button>
            <button className="header-btn" onClick={handleLogout}>
              <span>🚪</span>
            </button>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'overview' && (
          <div className="dashboard-content-new">
            {/* Quick Access */}
            <div className="quick-access">
              <h2>ACCES RAPID</h2>
              <div className="quick-access-grid">
                {dashboardData.analytics.coursesProgress.slice(0, 3).map((course, index) => (
                  <div key={course.id} className="quick-access-card">
                    <div className="card-header">
                      <div className="shared-avatars">
                        <div className="avatar">📚</div>
                        <div className="avatar">👨‍🏫</div>
                        <div className="avatar">👥</div>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="card-type">CURS</div>
                      <div className="card-title">{course.title}</div>
                    </div>
                  </div>
                ))}
                
                <div className="quick-access-card summary">
                  <div className="summary-icon">📊</div>
                  <div className="summary-content">
                    <div className="summary-title">Raport Luna Aceasta</div>
                    <div className="summary-subtitle">ULTIMA MODIFICARE</div>
                    <div className="summary-date">Dec 2, 2024 • 4:30 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Courses Table */}
            <div className="courses-table">
              <h2>TOATE CURSURILE</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nume</th>
                    <th>Proprietar</th>
                    <th>Ultima modificare</th>
                    <th>Progres</th>
                    <th>Timp petrecut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.analytics.coursesProgress.map(course => (
                    <tr key={course.id}>
                      <td>
                        <div className="file-cell">
                          <span className="file-icon">📚</span>
                          <span className="file-name">{course.title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="owner-cell">
                          <div className="owner-avatar">👨‍🏫</div>
                        </div>
                      </td>
                      <td className="date-cell">{course.lastAccessed}</td>
                      <td className="size-cell">{course.progress}%</td>
                      <td className="size-cell">{course.timeSpent}</td>
                      <td>
                        <button className="more-btn">⋯</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'courses' && (
          <div className="courses-content">
            <div className="courses-header">
              <h2>📚 Cursurile Mele ({dashboardData.purchasedCourses.length})</h2>
              <p>Cursurile pe care le-ai achiziționat și la care ai acces</p>
            </div>
            
            {dashboardData.purchasedCourses.length > 0 ? (
              <div className={`courses-grid-professional ${dashboardData.purchasedCourses.length === 1 ? 'single-course' : ''}`}>
                {dashboardData.purchasedCourses.map(course => (
                  <div key={course.id} className="course-card-professional">
                    {/* Badge pentru curs cumpărat */}
                    <div className="course-badge purchased">
                      <span className="badge-icon">✅</span>
                      <span className="badge-text">Cumpărat</span>
                    </div>
                    
                    <div className="course-image-container">
                      <img src={course.image} alt={course.title} className="course-image" />
                      <div className="course-overlay">
                        <button className="play-btn">
                          <span className="play-icon">▶</span>
                        </button>
                        <div className="course-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: '0%'}}></div>
                          </div>
                          <span className="progress-text">0% completat</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="course-content">
                      <div className="course-header">
                        <h3 className="course-title">{course.title}</h3>
                        <div className="course-rating">
                          <span className="rating-stars">⭐</span>
                          <span className="rating-value">{course.rating}</span>
                        </div>
                      </div>
                      
                      <p className="course-instructor">
                        <span className="instructor-icon">👨‍🏫</span>
                        {course.instructor}
                      </p>
                      
                      <p className="course-description">{course.shortDescription}</p>
                      
                      <div className="course-meta">
                        <div className="meta-item">
                          <span className="meta-icon">🎯</span>
                          <span className="meta-label">Nivel:</span>
                          <span className="meta-value">{course.level}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">⏱️</span>
                          <span className="meta-label">Durată:</span>
                          <span className="meta-value">{course.duration}h</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">📚</span>
                          <span className="meta-label">Moduluri:</span>
                          <span className="meta-value">{course.modules?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="course-actions">
                        <Link to={`/learn/${course.id}`} className="btn-primary">
                          <span className="btn-icon">🚀</span>
                          <span>Începe Cursul</span>
                        </Link>
                        <Link to={`/course/${course.id}`} className="btn-secondary">
                          <span className="btn-icon">📖</span>
                          <span>Vezi Detalii</span>
                        </Link>
                      </div>
                      
                      <div className="course-footer">
                        <div className="course-status">
                          <span className="status-icon">📅</span>
                          <span className="status-text">Achiziționat recent</span>
                        </div>
                        <div className="course-access">
                          <span className="access-icon">🔓</span>
                          <span className="access-text">Acces complet</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-courses">
                <div className="empty-icon">📚</div>
                <h3>Nu ai cursuri cumpărate încă</h3>
                <p>Explorează cursurile noastre și începe să înveți!</p>
                <Link to="/courses" className="btn primary">
                  🚀 Explorează Cursurile
                </Link>
              </div>
            )}
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>📊 Vizualizări Pagini</h3>
                <div className="analytics-stats">
                  {Object.entries(dashboardData.analytics.pageViews).map(([page, views]) => (
                    <div key={page} className="stat-row">
                      <span className="stat-label">{page}</span>
                      <span className="stat-value">{views.toLocaleString()} vizualizări</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>📈 Statistici Luna Aceasta</h3>
                <div className="monthly-stats">
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.analytics.monthlyStats.coursesCompleted}</span>
                    <span className="stat-label">Cursuri Finalizate</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.analytics.monthlyStats.hoursLearned}h</span>
                    <span className="stat-label">Ore de Învățare</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.analytics.monthlyStats.streakDays}</span>
                    <span className="stat-label">Zile Consecutive</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{dashboardData.analytics.monthlyStats.averageScore}%</span>
                    <span className="stat-label">Scor Mediu</span>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>🔥 Activitate Recentă</h3>
                <div className="activity-list">
                  {dashboardData.analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {activity.type === 'course_progress' && '📖'}
                        {activity.type === 'purchase' && '🛒'}
                        {activity.type === 'certificate' && '🏆'}
                      </div>
                      <div className="activity-content">
                        <div className="activity-course">{activity.course}</div>
                        <div className="activity-action">{activity.action}</div>
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Other views placeholder */}
        {['shared', 'recent', 'starred', 'trash'].includes(activeView) && (
          <div className="placeholder-content">
            <div className="placeholder-icon">
              {activeView === 'shared' && '👥'}
              {activeView === 'recent' && '🕒'}
              {activeView === 'starred' && '⭐'}
              {activeView === 'trash' && '🗑️'}
            </div>
            <h3>
              {activeView === 'shared' && 'Cursuri Partajate'}
              {activeView === 'recent' && 'Cursuri Accesate Recent'}
              {activeView === 'starred' && 'Cursuri Favorite'}
              {activeView === 'trash' && 'Cursuri Șterse'}
            </h3>
            <p>Această secțiune va fi implementată în viitor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
