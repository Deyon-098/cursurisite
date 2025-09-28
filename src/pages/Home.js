import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCourses, invalidateCoursesCache } from '../data/coursesFirebase';
import { waitForFirebase } from '../firebase/config';
import { useGSAP, useScrollTrigger, gsapUtils } from '../hooks/useGSAP';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Referințe GSAP pentru animații
  const heroRef = useGSAP((element) => {
    if (window.gsap) {
      // Animație pentru hero content
      window.gsap.fromTo('.hero-content h1', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
      
      window.gsap.fromTo('.hero-content p', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
      );
      
      window.gsap.fromTo('.hero-actions', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power2.out" }
      );
      
      window.gsap.fromTo('.hero-cats .chip', 
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 0.9, stagger: 0.1, ease: "back.out(1.7)" }
      );
    }
  }, [loading]);

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
    }
  }, [courses]);

  const successStoriesRef = useScrollTrigger((element) => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      // Animație pentru poveștile de succes
      window.gsap.fromTo('.success-story',
        { opacity: 0, x: -50, rotationY: -15 },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.success-stories-section',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  const careerRef = useScrollTrigger((element) => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      // Animație pentru cardurile de carieră
      window.gsap.fromTo('.career-card',
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: '.career-opportunities-section',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  const learningPathRef = useScrollTrigger((element) => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      // Animație pentru căile de învățare
      window.gsap.fromTo('.learning-path',
        { opacity: 0, x: 50, rotationY: 15 },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.learning-path-section',
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  // Încarcă cursurile din Firebase
  useEffect(() => {
    const loadCourses = async () => {
      try {
        console.log('🔄 Încep încărcarea cursurilor în Home.js...');
        
        // Invalidează cache-ul pentru a forța reîncărcarea
        invalidateCoursesCache();
        console.log('🗑️ Cache-ul cursurilor a fost invalidat');
        
        await waitForFirebase();
        console.log('✅ Firebase este gata');
        
        const firebaseCourses = await getCourses();
        console.log('📚 Cursuri primite din getCourses():', firebaseCourses);
        console.log('📚 Numărul de cursuri:', firebaseCourses.length);
        
        if (firebaseCourses.length > 0) {
          console.log('📚 Primul curs:', firebaseCourses[0]);
        }
        
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
  
  // Define categories with their associated keywords
  const categories = useMemo(() => [
    { id: 'all', name: 'Toate cursurile', icon: '📚', keywords: [] },
    { id: 'react', name: 'React & Frontend', icon: '⚛️', keywords: ['react', 'frontend', 'javascript', 'web'] },
    { id: 'python', name: 'Python & Data', icon: '🐍', keywords: ['python', 'data', 'machine learning', 'data science'] },
    { id: 'mobile', name: 'Mobile Development', icon: '📱', keywords: ['mobile', 'react native', 'ios', 'android'] },
    { id: 'design', name: 'UI/UX Design', icon: '🎨', keywords: ['ui', 'ux', 'design', 'figma'] },
    { id: 'devops', name: 'DevOps & Cloud', icon: '☁️', keywords: ['devops', 'cloud', 'aws', 'docker', 'kubernetes'] },
    { id: 'security', name: 'Cybersecurity', icon: '🔒', keywords: ['cybersecurity', 'security', 'hacking', 'pentesting'] },
    { id: 'blockchain', name: 'Blockchain & Web3', icon: '⛓️', keywords: ['blockchain', 'web3', 'solidity', 'crypto'] },
    { id: 'gaming', name: 'Game Development', icon: '🎮', keywords: ['game', 'unity', 'gaming', 'c#'] }
  ], []);

  // Filter courses based on selected category
  const filteredCourses = useMemo(() => {
    console.log('🔍 Filtrez cursurile pentru categoria:', selectedCategory);
    console.log('🔍 Cursuri disponibile pentru filtrare:', courses.length);
    
    if (selectedCategory === 'all') {
      const result = courses.slice(0, 6); // Show first 6 courses for "all"
      console.log('🔍 Cursuri filtrate (all):', result.length);
      return result;
    }
    
    const category = categories.find(cat => cat.id === selectedCategory);
    if (!category) {
      const result = courses.slice(0, 6);
      console.log('🔍 Cursuri filtrate (categoria nu găsită):', result.length);
      return result;
    }
    
    const result = courses.filter(course => {
      const searchText = `${course.title} ${course.shortDescription} ${course.description} ${course.instructor}`.toLowerCase();
      return category.keywords.some(keyword => searchText.includes(keyword));
    }).slice(0, 6); // Limit to 6 courses per category
    
    console.log('🔍 Cursuri filtrate pentru categoria', selectedCategory, ':', result.length);
    return result;
  }, [selectedCategory, categories, courses]);

  // Adaugă efecte hover pentru cardurile de cursuri
  useEffect(() => {
    if (window.gsap && courses.length > 0) {
      const courseCards = document.querySelectorAll('.course-card');
      courseCards.forEach(card => {
        gsapUtils.hoverEffect(card, 1.05, 0.3);
      });
    }
  }, [courses]);

  // Get featured courses (most popular by price/rating simulation)
  const featuredCourses = courses.slice(0, 3);
  console.log('⭐ Cursuri recomandate:', featuredCourses.length);

  // Loading state
  if (loading) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="loading-section">
            <div className="loading-spinner">🔄</div>
            <p>Se încarcă cursurile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Construiește un viitor mai bun cu{' '}
              <span className="highlight">tehnologia modernă</span>
            </h1>
            <p>
              Accesează cursuri create de profesioniști și treci de la teorie la practică prin proiecte reale. 
              Învață cele mai noi tehnologii și construiește aplicații de nivel enterprise.
            </p>
            <div className="hero-actions">
              <Link className="btn primary" to="/courses">
                Explorează cursurile
              </Link>
              <Link className="btn ghost" to="/register">
                Începe gratuit
              </Link>
            </div>
                <div className="hero-cats">
                  {['React', 'Python', 'UI/UX', 'Machine Learning', 'DevOps', 'Mobile', 'Cybersecurity', 'Data Science', 'Blockchain', 'Game Development'].map((cat) => (
                    <span className="chip" key={cat}>{cat}</span>
                  ))}
                </div>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="geometric-shape shape-1"></div>
          <div className="geometric-shape shape-2"></div>
          <div className="geometric-shape shape-3"></div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <div className="container">
        <h2 className="section-title">
          Cursuri <span className="highlight">Recomandate</span>
        </h2>
        <p className="section-subtitle">
          Cursurile noastre cele mai populare, selectate special pentru tine
        </p>
        <div className="courses-grid">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="container">
        <h2 className="section-title">
          Explorează după <span className="highlight">Categorie</span>
        </h2>
        <p className="section-subtitle">
          Găsește cursurile perfecte pentru domeniul tău de interes
        </p>
        
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="no-results">
              <h3>🔍 Nu s-au găsit cursuri</h3>
              <p>Nu există cursuri pentru categoria selectată în acest moment.</p>
            </div>
          )}
        </div>

        {filteredCourses.length > 0 && (
          <div className="view-all-section">
            <Link to="/courses" className="btn primary">
              🚀 Vezi toate cursurile ({courses.length})
            </Link>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-header">
            <h2>De ce să alegi <span className="highlight">CursuriPlus</span>?</h2>
            <p>Platforma ta de învățare online cu cele mai bune cursuri tech din România</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👨‍🏫</div>
              <div className="stat-number">{courses.length}</div>
              <div className="stat-label">Cursuri Premium</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-number">3</div>
              <div className="stat-label">Niveluri de Dificultate</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-number">{courses.reduce((total, course) => total + (course.duration || 0), 0)}+</div>
              <div className="stat-label">Ore de Conținut</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">{new Set(courses.map(course => course.instructor)).size}</div>
              <div className="stat-label">Instructori Experți</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="success-stories-section">
        <div className="container">
          <h2 className="section-title">
            Povești de <span className="highlight">Succes</span>
          </h2>
          <p className="section-subtitle">
            Descoperă cum au transformat cursurile noastre carierele studenților
          </p>
          
          <div className="success-grid">
            <div className="success-story">
              <div className="story-header">
                <div className="story-avatar">M</div>
                <div className="story-info">
                  <h4>Maria Popescu</h4>
                  <p>Frontend Developer la Google</p>
                </div>
                <div className="story-rating">⭐⭐⭐⭐⭐</div>
              </div>
              <blockquote className="story-quote">
                "Cursul de React m-a ajutat să trec de la zero la job-ul visurilor mele în doar 6 luni. 
                Proiectele practice și mentoratul personalizat au făcut diferența!"
              </blockquote>
              <div className="story-stats">
                <span className="stat">💰 +€3,500 salariu</span>
                <span className="stat">⏱️ 6 luni de studiu</span>
                <span className="stat">🎯 100% placement</span>
              </div>
            </div>

            <div className="success-story">
              <div className="story-header">
                <div className="story-avatar">A</div>
                <div className="story-info">
                  <h4>Alexandru Ionescu</h4>
                  <p>Data Scientist la Microsoft</p>
                </div>
                <div className="story-rating">⭐⭐⭐⭐⭐</div>
              </div>
              <blockquote className="story-quote">
                "Machine Learning cu Python a fost cursul care mi-a deschis ușa către AI. 
                Acum lucrez cu algoritmi avansați și salariul mi-a crescut cu 200%!"
              </blockquote>
              <div className="story-stats">
                <span className="stat">💰 +€5,000 salariu</span>
                <span className="stat">⏱️ 4 luni de studiu</span>
                <span className="stat">🎯 Promovare rapidă</span>
              </div>
            </div>

            <div className="success-story">
              <div className="story-header">
                <div className="story-avatar">E</div>
                <div className="story-info">
                  <h4>Elena Radu</h4>
                  <p>UI/UX Designer la Apple</p>
                </div>
                <div className="story-rating">⭐⭐⭐⭐⭐</div>
              </div>
              <blockquote className="story-quote">
                "De la zero la Apple în 8 luni! Cursul de UI/UX Design mi-a dat toate instrumentele 
                necesare pentru a crea interfețe care fac diferența în viața oamenilor."
              </blockquote>
              <div className="story-stats">
                <span className="stat">💰 +€4,200 salariu</span>
                <span className="stat">⏱️ 8 luni de studiu</span>
                <span className="stat">🎯 Job la FAANG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Opportunities Section */}
      <div className="career-opportunities-section">
        <div className="container">
          <h2 className="section-title">
            Oportunități de <span className="highlight">Carieră</span>
          </h2>
          <p className="section-subtitle">
            Salarii medii în România pentru profesii tech (2024)
          </p>
          
          <div className="career-grid">
            <div className="career-card">
              <div className="career-icon">⚛️</div>
              <h3>React Developer</h3>
              <div className="career-salary">€2,500 - €4,500</div>
              <div className="career-demand">🔥 Foarte cerut</div>
              <ul className="career-skills">
                <li>React, JavaScript, TypeScript</li>
                <li>Redux, Next.js, Testing</li>
                <li>Git, CI/CD, Agile</li>
              </ul>
            </div>

            <div className="career-card">
              <div className="career-icon">🐍</div>
              <h3>Python Developer</h3>
              <div className="career-salary">€2,800 - €5,000</div>
              <div className="career-demand">🔥 Foarte cerut</div>
              <ul className="career-skills">
                <li>Python, Django, Flask</li>
                <li>SQL, PostgreSQL, MongoDB</li>
                <li>Docker, AWS, Linux</li>
              </ul>
            </div>

            <div className="career-card">
              <div className="career-icon">🤖</div>
              <h3>AI/ML Engineer</h3>
              <div className="career-salary">€3,500 - €6,500</div>
              <div className="career-demand">🚀 Exploziv</div>
              <ul className="career-skills">
                <li>TensorFlow, PyTorch, Scikit-learn</li>
                <li>Python, R, SQL</li>
                <li>Docker, Kubernetes, MLOps</li>
              </ul>
            </div>

            <div className="career-card">
              <div className="career-icon">🔒</div>
              <h3>Cybersecurity Specialist</h3>
              <div className="career-salary">€3,000 - €5,500</div>
              <div className="career-demand">🛡️ Critic</div>
              <ul className="career-skills">
                <li>Penetration Testing, Ethical Hacking</li>
                <li>Network Security, SIEM</li>
                <li>Linux, Python, C++</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path Section */}
      <div className="learning-path-section">
        <div className="container">
          <h2 className="section-title">
            Căile Tale de <span className="highlight">Învățare</span>
          </h2>
          <p className="section-subtitle">
            Alege calea perfectă pentru obiectivele tale de carieră
          </p>
          
          <div className="learning-paths">
            <div className="learning-path">
              <div className="path-header">
                <div className="path-icon">🚀</div>
                <h3>Frontend Developer</h3>
                <div className="path-duration">6-8 luni</div>
              </div>
              <div className="path-steps">
                <div className="path-step">
                  <span className="step-number">1</span>
                  <span className="step-title">HTML & CSS Fundamentals</span>
                  <span className="step-duration">2 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">2</span>
                  <span className="step-title">JavaScript Modern</span>
                  <span className="step-duration">4 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">3</span>
                  <span className="step-title">React & Ecosystem</span>
                  <span className="step-duration">6 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">4</span>
                  <span className="step-title">Proiecte Practice</span>
                  <span className="step-duration">4 săptămâni</span>
                </div>
              </div>
              <div className="path-outcome">
                <strong>Rezultat:</strong> Job ca Frontend Developer (€2,500-€4,500)
              </div>
            </div>

            <div className="learning-path">
              <div className="path-header">
                <div className="path-icon">⚙️</div>
                <h3>Backend Developer</h3>
                <div className="path-duration">8-10 luni</div>
              </div>
              <div className="path-steps">
                <div className="path-step">
                  <span className="step-number">1</span>
                  <span className="step-title">Python Fundamentals</span>
                  <span className="step-duration">3 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">2</span>
                  <span className="step-title">Django & FastAPI</span>
                  <span className="step-duration">6 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">3</span>
                  <span className="step-title">Databases & SQL</span>
                  <span className="step-duration">4 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">4</span>
                  <span className="step-title">DevOps & Deployment</span>
                  <span className="step-duration">5 săptămâni</span>
                </div>
              </div>
              <div className="path-outcome">
                <strong>Rezultat:</strong> Job ca Backend Developer (€2,800-€5,000)
              </div>
            </div>

            <div className="learning-path">
              <div className="path-header">
                <div className="path-icon">🤖</div>
                <h3>AI/ML Engineer</h3>
                <div className="path-duration">10-12 luni</div>
              </div>
              <div className="path-steps">
                <div className="path-step">
                  <span className="step-number">1</span>
                  <span className="step-title">Python & Math</span>
                  <span className="step-duration">4 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">2</span>
                  <span className="step-title">Machine Learning</span>
                  <span className="step-duration">6 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">3</span>
                  <span className="step-title">Deep Learning</span>
                  <span className="step-duration">8 săptămâni</span>
                </div>
                <div className="path-step">
                  <span className="step-number">4</span>
                  <span className="step-title">MLOps & Production</span>
                  <span className="step-duration">4 săptămâni</span>
                </div>
              </div>
              <div className="path-outcome">
                <strong>Rezultat:</strong> Job ca AI/ML Engineer (€3,500-€6,500)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Gata să îți construiești <span className="highlight">viitorul în tech</span>?
            </h2>
            <p className="cta-description">
              Alătură-te miilor de studenți care au deja început călătoria lor în lumea tehnologiei. 
              Începe astăzi cu cursurile noastre premium!
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn primary large">
                🚀 Începe gratuit acum
              </Link>
              <Link to="/courses" className="btn ghost large">
                📚 Explorează cursurile
              </Link>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>Acces pe viață la cursuri</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>Suport 24/7 de la instructori</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✅</span>
                <span>Certificat de completare</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


