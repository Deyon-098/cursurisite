import React, { useState, useRef, useEffect, useMemo } from 'react';
import CourseCard from '../components/CourseCard';
import { getCourses, invalidateCoursesCache } from '../data/coursesFirebase';
import { waitForFirebase } from '../firebase/config';
import { useScrollTrigger, gsapUtils } from '../hooks/useGSAP';

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // State pentru acordioane
  const [accordionStates, setAccordionStates] = useState({
    search: true,      // Căutarea să fie deschisă implicit
    level: true,       // Nivelul să fie deschis implicit
    category: false,   // Categoria să fie închisă implicit
    price: false,      // Prețul să fie închis implicit
    sort: false        // Sortarea să fie închisă implicit
  });

  
  const COURSES_PER_PAGE = 6;

  // Încarcă cursurile din Firebase
  useEffect(() => {
    const loadCourses = async () => {
      try {
        console.log('🔄 Încep încărcarea cursurilor în Courses.js...');
        
        // Invalidează cache-ul pentru a forța reîncărcarea
        invalidateCoursesCache();
        console.log('🗑️ Cache-ul cursurilor a fost invalidat');
        
        await waitForFirebase();
        console.log('✅ Firebase este gata');
        
        const firebaseCourses = await getCourses();
        console.log('📚 Cursuri primite din getCourses():', firebaseCourses);
        console.log('📚 Numărul de cursuri:', firebaseCourses.length);
        
        setCourses(firebaseCourses);
        console.log('✅ Cursurile au fost setate în state');
      } catch (error) {
        console.error('❌ Eroare la încărcarea cursurilor:', error);
        setCourses([]);
      } finally {
        setLoading(false);
        console.log('🏁 Loading finalizat');
      }
    };

    loadCourses();
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    console.log('🔍 Filtrez și sortez cursurile în Courses.js...');
    console.log('🔍 Cursuri disponibile:', courses.length);
    console.log('🔍 Search term:', searchTerm);
    console.log('🔍 Selected level:', selectedLevel);
    console.log('🔍 Selected category:', selectedCategory);
    console.log('🔍 Price range:', priceRange);
    console.log('🔍 Sort by:', sortBy);
    
    let result = courses.filter(course => {
      // Verifică dacă cursul are proprietățile necesare
      if (!course || typeof course !== 'object') {
        return false;
      }
      
      // Filtrare după căutare
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = !searchTerm.trim() || 
        (course.title && course.title.toLowerCase().includes(searchLower)) ||
        (course.shortDescription && course.shortDescription.toLowerCase().includes(searchLower)) ||
        (course.description && course.description.toLowerCase().includes(searchLower)) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchLower)) ||
        (course.level && course.level.toLowerCase().includes(searchLower)) ||
        (course.category && course.category.toLowerCase().includes(searchLower));
      
      // Filtrare după nivel
      const matchesLevel = selectedLevel === 'all' || (course.level && course.level === selectedLevel);
      
      // Filtrare după categorie
      const matchesCategory = selectedCategory === 'all' || (course.category && course.category === selectedCategory);
      
      // Filtrare după preț
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const price = course.price || 0;
        switch (priceRange) {
          case '0-100':
            matchesPrice = price <= 100;
            break;
          case '100-300':
            matchesPrice = price > 100 && price <= 300;
            break;
          case '300-500':
            matchesPrice = price > 300 && price <= 500;
            break;
          case '500+':
            matchesPrice = price > 500;
            break;
        }
      }
      
      return matchesSearch && matchesLevel && matchesCategory && matchesPrice;
    });
    
    // Sortare
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.lastUpdated || b.createdAt || 0) - new Date(a.lastUpdated || a.createdAt || 0);
        case 'oldest':
          return new Date(a.lastUpdated || a.createdAt || 0) - new Date(b.lastUpdated || b.createdAt || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
    
    console.log('🔍 Cursuri filtrate și sortate:', result.length);
    return result;
  }, [searchTerm, selectedLevel, selectedCategory, priceRange, sortBy, courses]);

  // Obține opțiunile pentru filtre
  const levels = ['all', ...new Set(courses.map(course => course.level).filter(level => level))];
  const categories = ['all', ...new Set(courses.map(course => course.category).filter(category => category))];
  
  // Paginare
  const totalPages = Math.ceil(filteredAndSortedCourses.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const currentCourses = filteredAndSortedCourses.slice(startIndex, endIndex);
  
  console.log('🎯 Niveluri disponibile:', levels);
  console.log('📂 Categorii disponibile:', categories);
  console.log('📄 Pagina curentă:', currentPage, 'din', totalPages);
  console.log('📚 Cursuri pe pagina curentă:', currentCourses.length);

  const getLevelDisplay = (level) => {
    if (level === 'all') return '📚 Toate nivelurile';
    if (level === 'Începător' || level === 'beginner') return '🎯 Începător';
    if (level === 'Intermediar' || level === 'intermediate') return '⚡ Intermediar';
    if (level === 'Avansat' || level === 'advanced') return '🚀 Avansat';
    return `🎯 ${level}`;
  };

  const getCategoryDisplay = (category) => {
    if (category === 'all') return '📂 Toate categoriile';
    const categoryMap = {
      'react': '⚛️ React',
      'python': '🐍 Python',
      'javascript': '🟨 JavaScript',
      'ai': '🤖 AI & Machine Learning',
      'web': '🌐 Web Development',
      'mobile': '📱 Mobile Development',
      'design': '🎨 UI/UX Design',
      'devops': '⚙️ DevOps',
      'security': '🔒 Cybersecurity',
      'marketing': '📈 Digital Marketing',
      'blockchain': '⛓️ Blockchain'
    };
    return categoryMap[category] || `📂 ${category}`;
  };

  const getPriceRangeDisplay = (range) => {
    const rangeMap = {
      'all': '💰 Toate prețurile',
      '0-100': '💰 €0 - €100',
      '100-300': '💰 €100 - €300',
      '300-500': '💰 €300 - €500',
      '500+': '💰 €500+'
    };
    return rangeMap[range] || range;
  };

  const getSortDisplay = (sort) => {
    const sortMap = {
      'newest': '🕒 Cele mai noi',
      'oldest': '🕰️ Cele mai vechi',
      'price-low': '💰 Preț crescător',
      'price-high': '💰 Preț descrescător',
      'rating': '⭐ Cel mai bine cotat',
      'title': '🔤 Alfabetic'
    };
    return sortMap[sort] || sort;
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setIsDropdownOpen(false);
    setCurrentPage(1); // Reset la prima pagină
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeSelect = (range) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleSortSelect = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedLevel('all');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const toggleAccordion = (section) => {
    setAccordionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleAllAccordions = () => {
    const allOpen = Object.values(accordionStates).every(state => state);
    const newState = !allOpen;
    setAccordionStates({
      search: newState,
      level: newState,
      category: newState,
      price: newState,
      sort: newState
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animații GSAP pentru cursuri - adăugate după definirea variabilelor
  const coursesRef = useScrollTrigger((element) => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      // Animație pentru cardurile de cursuri
      window.gsap.fromTo('.course-card',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.courses-grid',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animație pentru sidebar
      window.gsap.fromTo('.courses-sidebar',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.courses-layout',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [currentCourses]);

  // Efecte hover pentru cardurile de cursuri
  useEffect(() => {
    if (window.gsap && currentCourses.length > 0) {
      const courseCards = document.querySelectorAll('.course-card');
      courseCards.forEach(card => {
        gsapUtils.hoverEffect(card, 1.05, 0.3);
      });
    }
  }, [currentCourses]);

  // Loading state
  if (loading) {
    return (
      <div className="courses-page">
        <div className="container">
          <div className="loading-section">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-header">
        <div className="container">
          <h1>Toate <span className="highlight">Cursurile</span></h1>
          <p>Descoperă cursurile noastre și începe să înveți astăzi. Fiecare curs este creat de profesioniști cu experiență în industrie.</p>
        </div>
      </div>

      <div className="container">
        <div className="courses-layout">
          {/* Sidebar cu filtre */}
          <div className="courses-sidebar">
            <div className="filters-header">
              <h3>🔍 Filtre</h3>
              <div className="filters-actions">
                <button 
                  className="toggle-accordions-btn"
                  onClick={toggleAllAccordions}
                  title="Deschide/închide toate secțiunile"
                >
                  {Object.values(accordionStates).every(state => state) ? '📁' : '📂'}
                </button>
                <button 
                  className="clear-filters-btn"
                  onClick={clearAllFilters}
                  title="Șterge toate filtrele"
                >
                  🗑️ Șterge toate
                </button>
              </div>
            </div>

            {/* Căutare */}
            <div className="filter-section accordion">
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion('search')}
              >
                <h4>🔍 Căutare</h4>
                <span className={`accordion-icon ${accordionStates.search ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              {accordionStates.search && (
                <div className="accordion-content">
          <div className="search-box">
            <input
              type="text"
                      placeholder="Caută cursuri, instructori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
                title="Șterge căutarea"
              >
                ✕
              </button>
            )}
          </div>
                </div>
              )}
            </div>

            {/* Filtru Nivel */}
            <div className="filter-section accordion">
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion('level')}
              >
                <h4>🎯 Nivel</h4>
                <span className={`accordion-icon ${accordionStates.level ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              {accordionStates.level && (
                <div className="accordion-content">
                  <div className="filter-options">
                {levels.map(level => (
                      <button
                    key={level}
                        className={`filter-option ${selectedLevel === level ? 'active' : ''}`}
                    onClick={() => handleLevelSelect(level)}
                  >
                    {getLevelDisplay(level)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filtru Categorie */}
            <div className="filter-section accordion">
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion('category')}
              >
                <h4>📂 Categorie</h4>
                <span className={`accordion-icon ${accordionStates.category ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              {accordionStates.category && (
                <div className="accordion-content">
                  <div className="filter-options">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {getCategoryDisplay(category)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filtru Preț */}
            <div className="filter-section accordion">
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion('price')}
              >
                <h4>💰 Preț</h4>
                <span className={`accordion-icon ${accordionStates.price ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              {accordionStates.price && (
                <div className="accordion-content">
                  <div className="filter-options">
                    {['all', '0-100', '100-300', '300-500', '500+'].map(range => (
                      <button
                        key={range}
                        className={`filter-option ${priceRange === range ? 'active' : ''}`}
                        onClick={() => handlePriceRangeSelect(range)}
                      >
                        {getPriceRangeDisplay(range)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sortare */}
            <div className="filter-section accordion">
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion('sort')}
              >
                <h4>🔄 Sortare</h4>
                <span className={`accordion-icon ${accordionStates.sort ? 'open' : ''}`}>
                  ▼
                </span>
              </div>
              {accordionStates.sort && (
                <div className="accordion-content">
                  <div className="filter-options">
                    {['newest', 'oldest', 'price-low', 'price-high', 'rating', 'title'].map(sort => (
                      <button
                        key={sort}
                        className={`filter-option ${sortBy === sort ? 'active' : ''}`}
                        onClick={() => handleSortSelect(sort)}
                      >
                        {getSortDisplay(sort)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rezumat filtre */}
            <div className="filter-summary">
              <h4>📊 Rezumat</h4>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Total cursuri:</span>
                  <span className="stat-value">{filteredAndSortedCourses.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Pagina curentă:</span>
                  <span className="stat-value">{currentPage} din {totalPages}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conținut principal */}
          <div className="courses-main">
            {/* Header cu rezultate */}
            <div className="results-header">
              <div className="results-info">
                <h2>
                  {filteredAndSortedCourses.length > 0 ? (
                    <>
                      {filteredAndSortedCourses.length} cursuri găsite
                      {searchTerm && <span> pentru "{searchTerm}"</span>}
                    </>
                  ) : (
                    'Nu s-au găsit cursuri'
                  )}
                </h2>
                <p>
                  Afișez {currentCourses.length} cursuri din {filteredAndSortedCourses.length} total
                </p>
          </div>
        </div>

            {/* Grila de cursuri */}
            <div className={`courses-grid ${
              currentCourses.length === 1 ? 'single-course' : 
              currentCourses.length === 2 ? 'two-courses' : ''
            }`}>
              {currentCourses.length > 0 ? (
                currentCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <div className="no-results">
                  <h3>🔍 Nu s-au găsit rezultate</h3>
                  <p>
                    Nu s-au găsit cursuri care să corespundă filtrelor selectate. 
                    Încearcă să modifici filtrele sau să ștergi toate filtrele.
                  </p>
                  <button 
                    className="btn primary"
                    onClick={clearAllFilters}
                  >
                    🗑️ Șterge toate filtrele
                  </button>
                </div>
              )}
            </div>

            {/* Paginare */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Următor →
                </button>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
