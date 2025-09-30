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
    category: 'web-development',
    subcategory: 'react',
    price: 0,
    originalPrice: 0,
    currency: 'RON',
    isFree: false,
    tags: [],
    level: 'beginner',
    language: 'română',
    duration: 0,
    lessons: 0,
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
        category: 'web-development',
        subcategory: 'react',
        price: 0,
        originalPrice: 0,
        currency: 'RON',
        isFree: false,
        tags: [],
        level: 'beginner',
        language: 'română',
        duration: 0,
        lessons: 0,
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
      category: course.category || 'web-development',
      subcategory: course.subcategory || 'react',
      price: course.price || 0,
      originalPrice: course.originalPrice || 0,
      currency: course.currency || 'RON',
      isFree: course.isFree || false,
      tags: course.tags || [],
      level: course.settings?.level || 'beginner',
      language: course.settings?.language || 'română',
      duration: course.settings?.duration || 0,
      lessons: course.settings?.lessons || 0,
      isPublished: course.settings?.isPublished || false,
      isFeatured: course.settings?.isFeatured || false
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
                <h1>Gestionare Cursuri</h1>
                <p>Gestionează toate cursurile din platformă</p>
                <button 
                  className="admin-add-course-btn"
                  onClick={() => setShowAddCourseModal(true)}
                >
                  <span className="admin-btn-icon">➕</span>
                  Adaugă Curs Nou
                </button>
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
                    <div className="admin-courses-grid">
                      {courses.map((course) => (
                        <div key={course.id} className="admin-course-card">
                          <div className="admin-course-header">
                            <div className="admin-course-title">{course.title}</div>
                            <div className="admin-course-status">
                              {course.settings?.isPublished ? (
                                <span className="admin-status-published">Publicat</span>
                              ) : (
                                <span className="admin-status-draft">Draft</span>
                              )}
                              {course.settings?.isFeatured && (
                                <span className="admin-status-featured">Featured</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="admin-course-info">
                            <div className="admin-course-meta">
                              <span className="admin-course-category">{course.category}</span>
                              <span className="admin-course-level">{course.settings?.level}</span>
                              <span className="admin-course-language">{course.settings?.language}</span>
                            </div>
                            
                            <div className="admin-course-description">
                              {course.shortDescription}
                            </div>
                            
                            <div className="admin-course-stats">
                              <div className="admin-course-stat">
                                <span className="admin-stat-label">Preț:</span>
                                <span className="admin-course-price">
                                  {course.isFree ? 'Gratuit' : `${course.price} ${course.currency}`}
                                </span>
                              </div>
                              <div className="admin-course-stat">
                                <span className="admin-stat-label">Studenți:</span>
                                <span className="admin-course-students">{course.stats?.students || 0}</span>
                              </div>
                              <div className="admin-course-stat">
                                <span className="admin-stat-label">Rating:</span>
                                <span className="admin-course-rating">⭐ {course.stats?.rating || 0}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="admin-course-actions">
                            <button 
                              className="admin-edit-btn"
                              onClick={() => handleEditCourse(course)}
                            >
                              <span className="admin-btn-icon">✏️</span>
                              Editează
                            </button>
                            <button 
                              className="admin-delete-btn"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <span className="admin-btn-icon">🗑️</span>
                              Șterge
                            </button>
                          </div>
                        </div>
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
                <label htmlFor="description">Descriere completă</label>
                <textarea
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleNewCourseChange}
                  placeholder="Descriere detaliată a cursului"
                  rows="5"
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
                    <option value="beginner">Începător</option>
                    <option value="intermediate">Intermediar</option>
                    <option value="advanced">Avansat</option>
                  </select>
                </div>
              </div>
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="price">Preț (RON) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newCourse.price}
                    onChange={handleNewCourseChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="originalPrice">Preț original (RON)</label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    value={newCourse.originalPrice}
                    onChange={handleNewCourseChange}
                    min="0"
                    placeholder="0"
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
                  <label htmlFor="lessons">Numărul de lecții</label>
                  <input
                    type="number"
                    id="lessons"
                    name="lessons"
                    value={newCourse.lessons}
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
