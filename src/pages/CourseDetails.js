import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../data/coursesFirebase';
import { useCart } from '../context/CartContext';
import { useGSAP, useScrollTrigger, gsapUtils } from '../hooks/useGSAP';
import 'castable-video';

export default function CourseDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const videoRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Încarcă cursul din Firebase
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        console.log('🔄 Încarc cursul cu ID:', id);
        const courseData = await getCourseById(id);
        console.log('📚 Curs încărcat:', courseData);
        
        if (courseData) {
          setCourse(courseData);
        } else {
          setError('Cursul nu a fost găsit');
        }
      } catch (err) {
        console.error('❌ Eroare la încărcarea cursului:', err);
        setError('Eroare la încărcarea cursului');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id]);

  // Animații GSAP pentru CourseDetails
  const courseDetailsRef = useGSAP((element) => {
    if (window.gsap && course) {
      // Animație pentru header
      window.gsap.fromTo('.course-details-header',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      // Animație pentru video
      window.gsap.fromTo('.course-video-modern',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: "power2.out" }
      );

      // Animație pentru info
      window.gsap.fromTo('.course-info-modern',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, delay: 0.4, ease: "power2.out" }
      );

      // Animație pentru sidebar
      window.gsap.fromTo('.course-sidebar',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, delay: 0.6, ease: "power2.out" }
      );

      // Animație pentru reviews
      window.gsap.fromTo('.reviews-section-modern',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power2.out" }
      );
    }
  }, [course]);

  // Efecte hover pentru butoane
  useEffect(() => {
    if (window.gsap && course) {
      const buttons = document.querySelectorAll('.purchase-button, .back-button');
      buttons.forEach(button => {
        gsapUtils.hoverEffect(button, 1.05, 0.3);
      });
    }
  }, [course]);

  // Loading state
  if (loading) {
    return (
      <div className="course-details-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner">🔄</div>
            <h2>Se încarcă cursul...</h2>
            <p>Te rugăm să aștepți</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="course-details-page">
        <div className="container">
          <div className="not-found">
            <h1>🔍 Cursul nu a fost găsit</h1>
            <p>Ne pare rău, dar cursul pe care îl cauți nu există sau a fost mutat.</p>
            <Link to="/courses" className="btn primary">
              🚀 Vezi toate cursurile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Funcții pentru controlul video-ului
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleCast = () => {
    if (videoRef.current) {
      videoRef.current.requestCast();
    }
  };

  const handleExitCast = () => {
    if (window.CastableVideo) {
      window.CastableVideo.exitCast();
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('✨');
    }
    return stars.join('');
  };

  return (
    <div className="course-details-modern">
      {/* Header cu navigare */}
      <div className="course-details-header">
        <div className="container">
          <Link to="/courses" className="back-button">
            <span className="back-icon">←</span>
            <span>Înapoi la cursuri</span>
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="course-details-layout">
          {/* Secțiunea principală cu video și informații */}
          <div className="course-main-section">
            {/* Video Section */}
            <div className="course-video-modern">
              <div className="video-wrapper">
                <video
                  ref={videoRef}
                  is="castable-video"
                  src="/curs2.mp4"
                  controls
                  poster={course.image}
                  className="course-video"
                >
                  Browserul tău nu suportă redarea video-ului.
                </video>
                <div className="video-overlay">
                  <div className="course-badge">
                    <span className="badge-text">{course.level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="course-info-modern">
              <div className="course-header">
                <h1 className="course-title-modern">{course.title}</h1>
                <div className="course-rating-modern">
                  <div className="rating-display">
                    <span className="rating-stars">{renderStars(course.rating)}</span>
                    <span className="rating-value">{course.rating}</span>
                    <span className="rating-count">({course.students} studenți)</span>
                  </div>
                </div>
              </div>

              <div className="course-description-modern">
                <h3>Despre acest curs</h3>
                <p>{course.description}</p>
              </div>

              {/* Course Features */}
              {course.features && (
                <div className="course-features">
                  <h3>Ce vei învăța</h3>
                  <ul className="features-list">
                    {course.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Curriculum */}
              {course.curriculum && (
                <div className="course-curriculum">
                  <h3>Programa cursului</h3>
                  <div className="curriculum-list">
                    {course.curriculum.map((lesson, index) => (
                      <div key={index} className="curriculum-item">
                        <span className="lesson-number">{index + 1}</span>
                        <span className="lesson-title">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar cu informații și achiziție */}
          <div className="course-sidebar">
            <div className="purchase-card">
              <div className="price-section">
                <div className="price-display">
                  <span className="currency">€</span>
                  <span className="amount">{course.price}</span>
                </div>
                <div className="price-note">Acces pe viață</div>
              </div>

              <button 
                className="purchase-button"
                onClick={() => addItem(course)}
              >
                <span className="button-icon">🛒</span>
                <span>Adaugă în coș</span>
              </button>

              <div className="purchase-guarantee">
                <span className="guarantee-icon">🛡️</span>
                <span>Garanție 30 zile</span>
              </div>
            </div>

            {/* Course Meta Info */}
            <div className="course-meta-card">
              <h4>Detalii curs</h4>
              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-icon">👨‍🏫</span>
                  <div className="meta-content">
                    <span className="meta-label">Instructor</span>
                    <span className="meta-value">{course.instructor}</span>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <div className="meta-content">
                    <span className="meta-label">Durată</span>
                    <span className="meta-value">{course.duration} ore</span>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🎯</span>
                  <div className="meta-content">
                    <span className="meta-label">Nivel</span>
                    <span className="meta-value">{course.level}</span>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🌍</span>
                  <div className="meta-content">
                    <span className="meta-label">Limbă</span>
                    <span className="meta-value">{course.language}</span>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📂</span>
                  <div className="meta-content">
                    <span className="meta-label">Categorie</span>
                    <span className="meta-value">{course.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section-modern">
          <div className="reviews-header">
            <h2>Recenzii studenți</h2>
            <div className="rating-summary">
              <div className="overall-rating">
                <span className="rating-number">{course.rating}</span>
                <div className="rating-stars">{renderStars(course.rating)}</div>
                <span className="rating-text">Bazat pe {course.students} recenzii</span>
              </div>
            </div>
          </div>

          <div className="reviews-grid-modern">
            {[
              {
                name: "Maria P.",
                date: "Acum 2 săptămâni",
                rating: 5,
                text: "Curs excelent! Instructorul explică foarte clar și proiectele practice sunt foarte utile. Recomand cu încredere!"
              },
              {
                name: "Alexandru M.",
                date: "Acum 1 lună",
                rating: 5,
                text: "Materialul este foarte bine structurat și actualizat. Am învățat mult și acum pot aplica cunoștințele în proiectele mele."
              },
              {
                name: "Elena R.",
                date: "Acum 3 săptămâni",
                rating: 5,
                text: "Unul dintre cele mai bune cursuri pe care le-am urmat! Explicațiile sunt clare și exemplele practice foarte utile."
              }
            ].map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.name.charAt(0)}
                    </div>
                    <div className="reviewer-details">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



