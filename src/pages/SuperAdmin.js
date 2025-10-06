import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { databaseManager } from '../scripts/databaseManager';

export default function SuperAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalPayments: 0,
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

  // Funcție pentru autentificare
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginData.username === 'danu' && loginData.password === '1234') {
      setIsAuthenticated(true);
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
        
        // Obține datele reale din baza de date
        const stats = databaseManager.getAdvancedStats();
        const popularCourses = databaseManager.getPopularCourses(5);
        
        setDashboardStats({
          totalCourses: stats.courses.total,
          totalUsers: stats.users.total,
          totalPayments: stats.payments.total,
          totalRevenue: stats.payments.totalRevenue,
          popularCourses: popularCourses.map(course => ({
            id: course.id,
            title: course.title,
            rating: course.stats?.rating || 0,
            students: course.stats?.students || 0,
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

  // Dacă nu este autentificat, afișează ecranul de login
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <div className="admin-login-logo">
                <span className="admin-login-icon">👑</span>
                <h1>Super Admin</h1>
              </div>
              <p>Panoul de control CursuriPlus</p>
            </div>
            
            <form className="admin-login-form" onSubmit={handleLogin}>
              <div className="admin-form-group">
                <label htmlFor="username" className="admin-form-label">
                  Utilizator
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  placeholder="Introdu utilizatorul"
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="password" className="admin-form-label">
                  Parolă
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="admin-form-input"
                  placeholder="Introdu parola"
                  required
                />
              </div>
              
              {loginError && (
                <div className="admin-login-error">
                  <span className="admin-error-icon">⚠️</span>
                  {loginError}
                </div>
              )}
              
              <button type="submit" className="admin-login-btn">
                <span className="admin-btn-icon">🔐</span>
                Accesează Panoul
              </button>
            </form>
            
            <div className="admin-login-footer">
              <Link to="/" className="admin-back-link">
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
          <div className="admin-content">
            <div className="admin-dashboard">
              <div className="admin-dashboard-header">
                <h1>Dashboard Super Admin</h1>
                <p>Prezentare generală a platformei CursuriPlus</p>
              </div>
              
              {dashboardStats.loading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner">🔄</div>
                  <p>Se încarcă statisticile...</p>
                </div>
              ) : (
                <>
                  {/* Statistici principale */}
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">📚</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-number">{dashboardStats.totalCourses}</div>
                        <div className="admin-stat-label">Total Cursuri</div>
                        <div className="admin-stat-trend">+12% față de luna trecută</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">👥</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-number">{dashboardStats.totalUsers}</div>
                        <div className="admin-stat-label">Utilizatori Înregistrați</div>
                        <div className="admin-stat-trend">+8% față de luna trecută</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">💳</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-number">{dashboardStats.totalPayments}</div>
                        <div className="admin-stat-label">Tranzacții Finalizate</div>
                        <div className="admin-stat-trend">+15% față de luna trecută</div>
                      </div>
                    </div>
                    
                    <div className="admin-stat-card">
                      <div className="admin-stat-icon">💰</div>
                      <div className="admin-stat-content">
                        <div className="admin-stat-number">{dashboardStats.totalRevenue?.toLocaleString() || '0'} RON</div>
                        <div className="admin-stat-label">Venit Total</div>
                        <div className="admin-stat-trend">+22% față de luna trecută</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cursuri populare */}
                  <div className="admin-popular-courses">
                    <h2>Cele Mai Populare Cursuri</h2>
                    <div className="admin-courses-list">
                      {dashboardStats.popularCourses.map((course, index) => (
                        <div key={course.id} className="admin-course-item">
                          <div className="admin-course-rank">#{index + 1}</div>
                          <div className="admin-course-info">
                            <div className="admin-course-title">{course.title}</div>
                            <div className="admin-course-meta">
                              <span className="admin-course-rating">⭐ {course.rating}</span>
                              <span className="admin-course-students">👥 {course.students}</span>
                              <span className="admin-course-price">{course.price} RON</span>
                            </div>
                          </div>
                          <div className="admin-course-progress">
                            <div className="admin-progress-bar">
                              <div 
                                className="admin-progress-fill" 
                                style={{ width: `${Math.min(100, (course.students / 100) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="admin-progress-text">
                              {Math.min(100, Math.round((course.students / 100) * 100))}% popularitate
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="admin-content">
            <div className="admin-courses-section">
              <div className="admin-section-header">
                <div className="admin-header-layout">
                  <div className="admin-title-section">
                    <h1>Gestionare Cursuri</h1>
                    <button 
                      className="btn primary"
                      onClick={() => setShowAddCourseModal(true)}
                    >
                      ➕ Adaugă Curs Nou
                    </button>
                  </div>
                  
                  <div className="admin-stats-section">
                    <div className="admin-stats-bar">
                      <div className="admin-stat-item">
                        <span className="stat-number">{courses.length}</span>
                        <span className="stat-label">Total Cursuri</span>
                      </div>
                      <div className="admin-stat-item">
                        <span className="stat-number">{courses.filter(c => c.isPublished).length}</span>
                        <span className="stat-label">Publicate</span>
                      </div>
                      <div className="admin-stat-item">
                        <span className="stat-number">{courses.filter(c => !c.isPublished).length}</span>
                        <span className="stat-label">Draft</span>
                      </div>
                      <div className="admin-stat-item">
                        <span className="stat-number">{courses.filter(c => c.isFeatured).length}</span>
                        <span className="stat-label">Featured</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {coursesLoading ? (
                <div className="admin-loading">
                  <div className="admin-loading-spinner">🔄</div>
                  <p>Se încarcă cursurile...</p>
                </div>
              ) : (
                <div className="admin-courses-container">
                  {courses.length === 0 ? (
                    <div className="admin-empty-state">
                      <div className="admin-empty-icon">📚</div>
                      <h3>Nu există cursuri</h3>
                      <p>Adaugă primul curs pentru a începe</p>
                      <button 
                        className="admin-primary-btn"
                        onClick={() => setShowAddCourseModal(true)}
                      >
                        Adaugă Primul Curs
                      </button>
                    </div>
                  ) : (
                    <div className="courses-grid">
                      {courses.map((course) => (
                        <article key={course.id} className="course-card">
                          <div className="course-card-media">
                            <img src={course.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop'} alt={course.title} />
                            <div className="course-level-badge">{course.level || 'Începător'}</div>
                            {/* Admin Status Overlay */}
                            <div className="admin-status-overlay">
                              {course.isPublished ? (
                                <span className="admin-status-published">✅ Publicat</span>
                              ) : (
                                <span className="admin-status-draft">📝 Draft</span>
                              )}
                              {course.isFeatured && (
                                <span className="admin-status-featured">⭐ Featured</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="course-card-body">
                            <h3 className="course-card-title">{course.title}</h3>
                            <p className="course-card-instructor">👨‍🏫 {course.instructor || 'Expert'}</p>
                            <p className="course-card-description">{course.shortDescription}</p>
                            
                            <div className="course-card-footer">
                              <div className="course-card-price">
                                <span className="price-currency">€</span>
                                <span className="price-amount">{course.isFree ? '0' : (course.price || 0).toFixed(0)}</span>
                              </div>
                              <div className="course-card-actions">
                                <button 
                                  className="btn ghost small"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                  className="btn primary small"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="admin-content">
            <h2>Gestionare Utilizatori</h2>
            <p>Secțiunea pentru gestionarea utilizatorilor va fi implementată aici.</p>
          </div>
        );
      case 'payments':
        return (
          <div className="admin-content">
            <h2>Gestionare Plăți</h2>
            <p>Secțiunea pentru gestionarea plăților va fi implementată aici.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="admin-content">
            <h2>Rapoarte și Analiză</h2>
            <p>Secțiunea pentru rapoarte și analiză va fi implementată aici.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="admin-content">
            <h2>Setări Sistem</h2>
            <p>Secțiunea pentru configurarea sistemului va fi implementată aici.</p>
          </div>
        );
      default:
        return (
          <div className="admin-content">
            <h2>Secțiune necunoscută</h2>
            <p>Te rugăm să selectezi o secțiune validă din meniul lateral.</p>
          </div>
        );
    }
  };

  return (
    <div className="super-admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <span className="admin-icon">👑</span>
            <div className="admin-title">
              <h1>Super Admin</h1>
              <p>CursuriPlus Control Panel</p>
            </div>
          </div>
          <div className="admin-actions">
            <Link to="/" className="admin-back-btn">
              <span>←</span> Înapoi la Site
            </Link>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <ul className="admin-nav-list">
              {menuItems.map((item) => (
                <li key={item.id} className="admin-nav-item">
                  <button
                    className={`admin-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    <div className="admin-nav-content">
                      <span className="admin-nav-title">{item.title}</span>
                      <span className="admin-nav-desc">{item.description}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="admin-main">
          <div className="admin-main-content">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal pentru adăugarea/editarea cursurilor */}
      {showAddCourseModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingCourse ? 'Editează Curs' : 'Adaugă Curs Nou'}</h2>
              <button 
                className="admin-modal-close"
                onClick={() => {
                  setShowAddCourseModal(false);
                  setEditingCourse(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="admin-modal-form">
              <div className="admin-form-group">
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
              
              <div className="admin-form-group">
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
              
              <div className="admin-form-group">
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
              
              <div className="admin-form-group">
                <label htmlFor="objectives">Ce vei învăța * (una per linie)</label>
                <textarea
                  id="objectives"
                  name="objectives"
                  value={newCourse.objectives ? newCourse.objectives.join('\n') : ''}
                  onChange={(e) => {
                    const objectivesArray = e.target.value.split('\n').filter(obj => obj.trim() !== '');
                    setNewCourse({...newCourse, objectives: objectivesArray});
                  }}
                  placeholder="Exemplu:&#10;Înțelegerea conceptelor fundamentale React&#10;Construirea primelor componente React&#10;Gestionarea stării cu useState și useEffect"
                  rows="5"
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="curriculum">Programa cursului * (una per linie)</label>
                <textarea
                  id="curriculum"
                  name="curriculum"
                  value={newCourse.curriculum ? newCourse.curriculum.map(item => 
                    typeof item === 'string' ? item : item.lesson || item.title || item
                  ).join('\n') : ''}
                  onChange={(e) => {
                    const curriculumArray = e.target.value.split('\n').filter(item => item.trim() !== '');
                    setNewCourse({...newCourse, curriculum: curriculumArray});
                  }}
                  placeholder="Exemplu:&#10;Introducere în React&#10;Componente și Props&#10;State și Hooks&#10;Proiect Final"
                  rows="6"
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="whatYouGet">Ce vei primi * (una per linie)</label>
                <textarea
                  id="whatYouGet"
                  name="whatYouGet"
                  value={newCourse.whatYouGet ? newCourse.whatYouGet.join('\n') : ''}
                  onChange={(e) => {
                    const whatYouGetArray = e.target.value.split('\n').filter(item => item.trim() !== '');
                    setNewCourse({...newCourse, whatYouGet: whatYouGetArray});
                  }}
                  placeholder="Exemplu:&#10;32 de lecții video HD&#10;Cod sursă pentru toate proiectele&#10;Acces la comunitatea Discord&#10;Certificat de finalizare"
                  rows="4"
                  required
                />
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
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
                
                <div className="admin-form-group">
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
              
              <div className="admin-form-group">
                <label htmlFor="instructorBio">Biografia Instructorului</label>
                <textarea
                  id="instructorBio"
                  name="instructorBio"
                  value={newCourse.instructorBio}
                  onChange={handleNewCourseChange}
                  placeholder="Descrierea instructorului"
                  rows="2"
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="requirements">Cerințe * (una per linie)</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={newCourse.requirements ? newCourse.requirements.join('\n') : ''}
                  onChange={(e) => {
                    const requirementsArray = e.target.value.split('\n').filter(req => req.trim() !== '');
                    setNewCourse({...newCourse, requirements: requirementsArray});
                  }}
                  placeholder="Exemplu:&#10;Cunoștințe de bază în JavaScript&#10;HTML și CSS de bază&#10;Node.js instalat pe computer"
                  rows="4"
                  required
                />
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
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
                
                <div className="admin-form-group">
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
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="language">Limbă *</label>
                  <select
                    id="language"
                    name="language"
                    value={newCourse.language}
                    onChange={handleNewCourseChange}
                    required
                  >
                    <option value="Română">Română</option>
                    <option value="English">English</option>
                    <option value="Français">Français</option>
                    <option value="Deutsch">Deutsch</option>
                    <option value="Español">Español</option>
                  </select>
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="subcategory">Subcategorie</label>
                  <input
                    type="text"
                    id="subcategory"
                    name="subcategory"
                    value={newCourse.subcategory}
                    onChange={handleNewCourseChange}
                    placeholder="Ex: react, python, cybersecurity"
                  />
                </div>
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
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
                
                <div className="admin-form-group">
                  <label htmlFor="originalPrice">Preț original (EUR)</label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={newCourse.originalPrice}
                    onChange={handleNewCourseChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
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
                
                <div className="admin-form-group">
                  <label htmlFor="lessonsCount">Numărul de lecții</label>
                  <input
                    type="number"
                    id="lessonsCount"
                    name="lessonsCount"
                    value={newCourse.lessonsCount}
                    onChange={handleNewCourseChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="rating">Rating inițial</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={newCourse.rating}
                    onChange={handleNewCourseChange}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="studentsCount">Numărul de studenți</label>
                  <input
                    type="number"
                    id="studentsCount"
                    name="studentsCount"
                    value={newCourse.studentsCount}
                    onChange={handleNewCourseChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="admin-form-checkboxes">
                <div className="admin-form-checkbox">
                  <input
                    type="checkbox"
                    id="isFree"
                    name="isFree"
                    checked={newCourse.isFree}
                    onChange={handleNewCourseChange}
                  />
                  <label htmlFor="isFree">Curs gratuit</label>
                </div>
                
                <div className="admin-form-checkbox">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={newCourse.isPublished}
                    onChange={handleNewCourseChange}
                  />
                  <label htmlFor="isPublished">Publicat</label>
                </div>
                
                <div className="admin-form-checkbox">
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
              
              <div className="admin-modal-actions">
                <button 
                  type="button" 
                  className="admin-cancel-btn"
                  onClick={() => {
                    setShowAddCourseModal(false);
                    setEditingCourse(null);
                  }}
                >
                  Anulează
                </button>
                <button type="submit" className="admin-save-btn">
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
