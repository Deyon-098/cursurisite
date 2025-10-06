import React, { useState, useEffect } from 'react';
import { checkAndPopulateCourses, clearAllCourses } from '../scripts/checkAndPopulateCourses';
import { getCourses } from '../data/coursesFirebase';
import { debugFirebaseCourses, debugGetCourses, compareCourses } from '../scripts/debugFirebaseCourses';

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    try {
      const firebaseCourses = await getCourses();
      setCourses(firebaseCourses);
      setMessage(`✅ Încărcate ${firebaseCourses.length} cursuri din Firebase`);
    } catch (error) {
      console.error('Eroare la încărcarea cursurilor:', error);
      setMessage(`❌ Eroare: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateCourses = async () => {
    setLoading(true);
    setMessage('🔄 Populez cursurile demo...');
    
    try {
      await checkAndPopulateCourses();
      await loadCourses();
      setMessage('🎉 Cursurile demo au fost adăugate cu succes!');
    } catch (error) {
      console.error('Eroare la popularea cursurilor:', error);
      setMessage(`❌ Eroare: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCourses = async () => {
    if (!window.confirm('Ești sigur că vrei să ștergi toate cursurile? Această acțiune nu poate fi anulată!')) {
      return;
    }

    setLoading(true);
    setMessage('🗑️ Șterg toate cursurile...');
    
    try {
      await clearAllCourses();
      setCourses([]);
      setMessage('🎉 Toate cursurile au fost șterse!');
    } catch (error) {
      console.error('Eroare la ștergerea cursurilor:', error);
      setMessage(`❌ Eroare: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="manage-courses-page">
      <div className="container">
        <div className="manage-courses-header">
          <h1>📚 Gestionare <span className="highlight">Cursuri</span></h1>
          <p>Verifică și gestionează cursurile din baza de date Firebase</p>
        </div>

        <div className="manage-courses-actions">
          <button 
            className="btn primary"
            onClick={loadCourses}
            disabled={loading}
          >
            {loading ? '🔄 Se încarcă...' : '🔄 Reîncarcă Cursurile'}
          </button>

          <button 
            className="btn secondary"
            onClick={handlePopulateCourses}
            disabled={loading}
          >
            {loading ? '🔄 Se populează...' : '📚 Adaugă Cursuri Demo'}
          </button>

          <button 
            className="btn danger"
            onClick={handleClearCourses}
            disabled={loading}
          >
            {loading ? '🔄 Se șterg...' : '🗑️ Șterge Toate Cursurile'}
          </button>
        </div>

        <div className="debug-actions">
          <h3>🔍 Debugging</h3>
          <button 
            className="btn debug"
            onClick={async () => {
              setMessage('🔍 Debugging Firebase...');
              try {
                await debugFirebaseCourses();
                setMessage('✅ Debugging completat - verifică consola');
              } catch (error) {
                setMessage(`❌ Eroare debugging: ${error.message}`);
              }
            }}
            disabled={loading}
          >
            🔍 Debug Firebase
          </button>

          <button 
            className="btn debug"
            onClick={async () => {
              setMessage('🔍 Debugging getCourses...');
              try {
                await debugGetCourses();
                setMessage('✅ Debugging getCourses completat - verifică consola');
              } catch (error) {
                setMessage(`❌ Eroare debugging: ${error.message}`);
              }
            }}
            disabled={loading}
          >
            🔍 Debug getCourses
          </button>

          <button 
            className="btn debug"
            onClick={async () => {
              setMessage('🔍 Comparând cursurile...');
              try {
                await compareCourses();
                setMessage('✅ Comparație completată - verifică consola');
              } catch (error) {
                setMessage(`❌ Eroare comparație: ${error.message}`);
              }
            }}
            disabled={loading}
          >
            🔍 Compară Cursuri
          </button>
        </div>

        {message && (
          <div className="message">
            <p>{message}</p>
          </div>
        )}

        <div className="courses-list">
          <h2>Cursuri în Baza de Date ({courses.length})</h2>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="no-courses">
              <div className="no-courses-icon">📚</div>
              <h3>Nu există cursuri în baza de date</h3>
              <p>Apasă pe "Adaugă Cursuri Demo" pentru a popula baza de date cu cursuri de testare.</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course.id} className="course-item">
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.shortDescription}</p>
                    <div className="course-meta">
                      <span className="course-instructor">👨‍🏫 {course.instructor}</span>
                      <span className="course-price">💰 €{course.price}</span>
                      <span className="course-duration">⏱️ {course.duration}h</span>
                      <span className="course-level">🎯 {course.level}</span>
                      <span className="course-category">📂 {course.category}</span>
                    </div>
                    <div className="course-stats">
                      <span className="course-rating">⭐ {course.rating}</span>
                      <span className="course-students">👥 {course.students}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="instructions">
          <h3>📋 Instrucțiuni:</h3>
          <ul>
            <li><strong>Reîncarcă Cursurile:</strong> Verifică cursurile curente din Firebase</li>
            <li><strong>Adaugă Cursuri Demo:</strong> Populează baza de date cu 6 cursuri demo pentru testare</li>
            <li><strong>Șterge Toate Cursurile:</strong> Șterge toate cursurile din baza de date (atenție!)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
