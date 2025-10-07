import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databaseManager } from '../scripts/databaseManager';
import '../styles/CourseBuilder.css';

export default function CourseBuilder() {
  const navigate = useNavigate();
  
  // State pentru cursul în construcție
  const [course, setCourse] = useState({
    title: '',
    shortDescription: '',
    description: '',
    image: '',
    video: '',
    instructor: '',
    instructorBio: '',
    instructorImage: '',
    price: 0,
    originalPrice: 0,
    currency: 'EUR',
    isFree: false,
    category: 'web-development',
    subcategory: 'react',
    level: 'Începător',
    language: 'Română',
    duration: 0,
    lessonsCount: 0,
    rating: 0,
    studentsCount: 0,
    tags: [],
    requirements: [],
    objectives: [],
    curriculum: [],
    whatYouGet: [],
    isPublished: false,
    isFeatured: false
  });

  // State pentru secțiunile de lecții
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: '',
      description: '',
      duration: 0,
      videoUrl: '',
      isPreview: false
    }
  ]);

  // State pentru UI
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeSection, setActiveSection] = useState('basic');

  // Funcții pentru gestionarea cursului
  const handleCourseChange = (field, value) => {
    setCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setCourse(prev => ({
      ...prev,
      [field]: array
    }));
  };

  // Funcții pentru gestionarea lecțiilor
  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: '',
      description: '',
      duration: 0,
      videoUrl: '',
      isPreview: false
    };
    setLessons(prev => [...prev, newLesson]);
  };

  const removeLesson = (lessonId) => {
    if (lessons.length > 1) {
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    }
  };

  const updateLesson = (lessonId, field, value) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
    ));
  };

  // Funcția de salvare
  const handleSaveCourse = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Pregătește datele cursului
      const courseData = {
        ...course,
        curriculum: lessons.map(lesson => ({
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          isPreview: lesson.isPreview
        })),
        lessonsCount: lessons.length,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      // Salvează în baza de date
      await databaseManager.initialize();
      await databaseManager.createCourse(courseData);

      setSaveMessage('✅ Cursul a fost salvat cu succes!');
      
      // Redirecționează către Super Admin după 2 secunde
      setTimeout(() => {
        navigate('/super-admin');
      }, 2000);

    } catch (error) {
      console.error('Eroare la salvarea cursului:', error);
      setSaveMessage('❌ Eroare la salvarea cursului: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Funcția pentru încărcarea imaginii
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourse(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Funcția pentru încărcarea videoclipului
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCourse(prev => ({
          ...prev,
          video: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="course-builder">
      {/* Header */}
      <div className="course-builder-header">
        <div className="course-builder-nav">
          <button 
            className="back-btn"
            onClick={() => navigate('/super-admin')}
          >
            ← Înapoi la Super Admin
          </button>
          <h1>Constructor Cursuri</h1>
          <div className="course-builder-actions">
            <button 
              className="save-btn"
              onClick={handleSaveCourse}
              disabled={isSaving}
            >
              {isSaving ? 'Se salvează...' : '💾 Salvează Cursul'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation pentru secțiuni */}
      <div className="course-builder-nav-tabs">
        <button 
          className={`nav-tab ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          📝 Informații de Bază
        </button>
        <button 
          className={`nav-tab ${activeSection === 'content' ? 'active' : ''}`}
          onClick={() => setActiveSection('content')}
        >
          🎥 Conținut Video
        </button>
        <button 
          className={`nav-tab ${activeSection === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveSection('lessons')}
        >
          📚 Lecții
        </button>
        <button 
          className={`nav-tab ${activeSection === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveSection('pricing')}
        >
          💰 Preț și Setări
        </button>
      </div>

      {/* Conținut principal */}
      <div className="course-builder-content">
        {activeSection === 'basic' && (
          <div className="course-builder-section">
            {/* Hero Section - ca un curs real */}
            <div className="course-hero">
              <div className="course-hero-content">
                <div className="course-hero-left">
                  <div className="course-category">
                    <select 
                      value={course.category}
                      onChange={(e) => handleCourseChange('category', e.target.value)}
                      className="category-select"
                    >
                      <option value="web-development">Web Development</option>
                      <option value="mobile-development">Mobile Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="blockchain">Blockchain</option>
                    </select>
                  </div>
                  
                  <h1 className="course-title">
                    <input 
                      type="text"
                      value={course.title}
                      onChange={(e) => handleCourseChange('title', e.target.value)}
                      placeholder="Introdu titlul cursului..."
                      className="title-input"
                    />
                  </h1>
                  
                  <p className="course-short-description">
                    <textarea 
                      value={course.shortDescription}
                      onChange={(e) => handleCourseChange('shortDescription', e.target.value)}
                      placeholder="Descriere scurtă a cursului..."
                      className="short-description-input"
                      rows="3"
                    />
                  </p>
                  
                  <div className="course-meta">
                    <div className="course-instructor">
                      <label>Instructor:</label>
                      <input 
                        type="text"
                        value={course.instructor}
                        onChange={(e) => handleCourseChange('instructor', e.target.value)}
                        placeholder="Numele instructorului"
                        className="instructor-input"
                      />
                    </div>
                    
                    <div className="course-level">
                      <label>Nivel:</label>
                      <select 
                        value={course.level}
                        onChange={(e) => handleCourseChange('level', e.target.value)}
                        className="level-select"
                      >
                        <option value="Începător">Începător</option>
                        <option value="Intermediar">Intermediar</option>
                        <option value="Avansat">Avansat</option>
                      </select>
                    </div>
                    
                    <div className="course-duration">
                      <label>Durată (ore):</label>
                      <input 
                        type="number"
                        value={course.duration}
                        onChange={(e) => handleCourseChange('duration', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="duration-input"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="course-hero-right">
                  <div className="course-image-upload">
                    <label className="image-upload-label">
                      {course.image ? (
                        <img src={course.image} alt="Preview" className="course-image-preview" />
                      ) : (
                        <div className="image-upload-placeholder">
                          <span>📷</span>
                          <p>Încarcă imaginea cursului</p>
                        </div>
                      )}
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="image-upload-input"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Descriere detaliată */}
            <div className="course-description-section">
              <h2>Despre acest curs</h2>
              <textarea 
                value={course.description}
                onChange={(e) => handleCourseChange('description', e.target.value)}
                placeholder="Descriere detaliată a cursului - ce va învăța utilizatorul..."
                className="description-textarea"
                rows="8"
              />
            </div>

            {/* Instructor Details */}
            <div className="instructor-section">
              <h2>Despre instructor</h2>
              <div className="instructor-details">
                <div className="instructor-image-upload">
                  <label className="instructor-image-label">
                    {course.instructorImage ? (
                      <img src={course.instructorImage} alt="Instructor" className="instructor-image-preview" />
                    ) : (
                      <div className="instructor-image-placeholder">
                        <span>👨‍🏫</span>
                        <p>Imagine instructor</p>
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handleCourseChange('instructorImage', event.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="instructor-image-input"
                    />
                  </label>
                </div>
                
                <div className="instructor-info">
                  <textarea 
                    value={course.instructorBio}
                    onChange={(e) => handleCourseChange('instructorBio', e.target.value)}
                    placeholder="Biografia instructorului..."
                    className="instructor-bio-textarea"
                    rows="4"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'content' && (
          <div className="course-builder-section">
            <h2>Conținut Video</h2>
            
            <div className="video-upload-section">
              <label className="video-upload-label">
                <div className="video-upload-area">
                  {course.video ? (
                    <video 
                      src={course.video} 
                      controls 
                      className="video-preview"
                    />
                  ) : (
                    <div className="video-upload-placeholder">
                      <span>🎥</span>
                      <p>Încarcă videoclipul de prezentare</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="video-upload-input"
                />
              </label>
            </div>
          </div>
        )}

        {activeSection === 'lessons' && (
          <div className="course-builder-section">
            <div className="lessons-header">
              <h2>Lecții și Capitole</h2>
              <button 
                className="add-lesson-btn"
                onClick={addLesson}
              >
                ➕ Adaugă Lecție
              </button>
            </div>
            
            <div className="lessons-list">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="lesson-item">
                  <div className="lesson-header">
                    <h3>Lecția {index + 1}</h3>
                    {lessons.length > 1 && (
                      <button 
                        className="remove-lesson-btn"
                        onClick={() => removeLesson(lesson.id)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  
                  <div className="lesson-content">
                    <div className="lesson-title">
                      <input 
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                        placeholder="Titlul lecției..."
                        className="lesson-title-input"
                      />
                    </div>
                    
                    <div className="lesson-description">
                      <textarea 
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
                        placeholder="Descrierea lecției..."
                        className="lesson-description-textarea"
                        rows="3"
                      />
                    </div>
                    
                    <div className="lesson-meta">
                      <div className="lesson-duration">
                        <label>Durată (minute):</label>
                        <input 
                          type="number"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(lesson.id, 'duration', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="lesson-duration-input"
                        />
                      </div>
                      
                      <div className="lesson-video">
                        <label>URL Video:</label>
                        <input 
                          type="url"
                          value={lesson.videoUrl}
                          onChange={(e) => updateLesson(lesson.id, 'videoUrl', e.target.value)}
                          placeholder="https://..."
                          className="lesson-video-input"
                        />
                      </div>
                      
                      <div className="lesson-preview">
                        <label>
                          <input 
                            type="checkbox"
                            checked={lesson.isPreview}
                            onChange={(e) => updateLesson(lesson.id, 'isPreview', e.target.checked)}
                          />
                          Lecție de preview (gratuită)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'pricing' && (
          <div className="course-builder-section">
            <h2>Preț și Setări</h2>
            
            <div className="pricing-section">
              <div className="price-inputs">
                <div className="price-field">
                  <label>Preț (EUR):</label>
                  <input 
                    type="number"
                    value={course.price}
                    onChange={(e) => handleCourseChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="price-input"
                    step="0.01"
                  />
                </div>
                
                <div className="original-price-field">
                  <label>Preț original (EUR):</label>
                  <input 
                    type="number"
                    value={course.originalPrice}
                    onChange={(e) => handleCourseChange('originalPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="original-price-input"
                    step="0.01"
                  />
                </div>
                
                <div className="free-course">
                  <label>
                    <input 
                      type="checkbox"
                      checked={course.isFree}
                      onChange={(e) => handleCourseChange('isFree', e.target.checked)}
                    />
                    Curs gratuit
                  </label>
                </div>
              </div>
              
              <div className="course-settings">
                <h3>Setări Curs</h3>
                
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>
                      <input 
                        type="checkbox"
                        checked={course.isPublished}
                        onChange={(e) => handleCourseChange('isPublished', e.target.checked)}
                      />
                      Publicat (vizibil pe site)
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <label>
                      <input 
                        type="checkbox"
                        checked={course.isFeatured}
                        onChange={(e) => handleCourseChange('isFeatured', e.target.checked)}
                      />
                      Featured (curs recomandat)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="course-tags">
                <h3>Tag-uri (separate prin virgulă)</h3>
                <input 
                  type="text"
                  value={course.tags.join(', ')}
                  onChange={(e) => handleArrayChange('tags', e.target.value)}
                  placeholder="react, javascript, frontend"
                  className="tags-input"
                />
              </div>
              
              <div className="course-requirements">
                <h3>Cerințe (separate prin virgulă)</h3>
                <textarea 
                  value={course.requirements.join(', ')}
                  onChange={(e) => handleArrayChange('requirements', e.target.value)}
                  placeholder="Cunoștințe de bază JavaScript, HTML, CSS"
                  className="requirements-textarea"
                  rows="3"
                />
              </div>
              
              <div className="course-objectives">
                <h3>Obiective (separate prin virgulă)</h3>
                <textarea 
                  value={course.objectives.join(', ')}
                  onChange={(e) => handleArrayChange('objectives', e.target.value)}
                  placeholder="Înveți React de la zero, Creezi aplicații web moderne"
                  className="objectives-textarea"
                  rows="3"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer cu butoane de acțiune */}
      <div className="course-builder-footer">
        <div className="footer-actions">
          <button 
            className="cancel-btn"
            onClick={() => navigate('/super-admin')}
          >
            Anulează
          </button>
          <button 
            className="save-btn"
            onClick={handleSaveCourse}
            disabled={isSaving}
          >
            {isSaving ? 'Se salvează...' : '💾 Salvează Cursul'}
          </button>
        </div>
        
        {saveMessage && (
          <div className="save-message">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}
