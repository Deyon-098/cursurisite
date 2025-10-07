import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse } from '../firebase/firestore';
import '../styles/CourseEditor.css';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [instructorImagePreview, setInstructorImagePreview] = useState(null);

  // Încărcare date curs
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await getCourseById(id);
        if (courseData) {
          setCourse(courseData);
          
          // Set preview images if they exist
          if (courseData.image) {
            setImagePreview(courseData.image);
          }
          if (courseData.video) {
            setVideoPreview(courseData.video);
          }
          if (courseData.instructor?.image) {
            setInstructorImagePreview(courseData.instructor.image);
          }
        } else {
          console.error('Cursul nu a fost găsit');
          navigate('/admindanu');
        }
      } catch (error) {
        console.error('Eroare la încărcarea cursului:', error);
        navigate('/admindanu');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, navigate]);

  // Actualizare câmp curs
  const updateCourseField = (field, value) => {
    setCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Actualizare câmp instructor
  const updateInstructorField = (field, value) => {
    setCourse(prev => ({
      ...prev,
      instructor: {
        ...prev.instructor,
        [field]: value
      }
    }));
  };

  // Actualizare lecție
  const updateLesson = (lessonIndex, field, value) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.map((lesson, index) => 
        index === lessonIndex ? { ...lesson, [field]: value } : lesson
      )
    }));
  };

  // Adăugare lecție nouă
  const addLesson = () => {
    const newLesson = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: '',
      video: '',
      isPreview: false
    };
    
    setCourse(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson]
    }));
  };

  // Ștergere lecție
  const removeLesson = (lessonIndex) => {
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, index) => index !== lessonIndex)
    }));
  };

  // Gestionare upload imagine
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        updateCourseField('image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestionare upload video
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target.result);
        updateCourseField('video', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestionare upload imagine instructor
  const handleInstructorImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInstructorImagePreview(e.target.result);
        updateInstructorField('image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvare modificări
  const handleSave = async () => {
    if (!course) return;

    setSaving(true);
    setSaveStatus('Se salvează...');

    try {
      await updateCourse(id, course);
      setSaveStatus('Salvat cu succes!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Eroare la salvarea cursului:', error);
      setSaveStatus('Eroare la salvare!');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="course-editor">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Se încarcă cursul...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-editor">
        <div className="error-container">
          <h2>Cursul nu a fost găsit</h2>
          <button onClick={() => navigate('/admindanu')} className="back-btn">
            Înapoi la Super Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-editor">
      {/* Header */}
      <div className="course-editor-header">
        <div className="course-editor-nav">
          <button 
            className="back-btn"
            onClick={() => navigate('/admindanu')}
          >
            ← Înapoi la Super Admin
          </button>
          <h1>Editare Curs</h1>
          <div className="course-editor-actions">
            <span className="save-status">{saveStatus}</span>
            <button 
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Se salvează...' : '💾 Salvează modificările'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="course-editor-nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Prezentare Generală
        </button>
        <button 
          className={`nav-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📚 Conținut Curs
        </button>
        <button 
          className={`nav-tab ${activeTab === 'instructor' ? 'active' : ''}`}
          onClick={() => setActiveTab('instructor')}
        >
          👨‍🏫 Instructor
        </button>
        <button 
          className={`nav-tab ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          💰 Prețuri
        </button>
        <button 
          className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Setări
        </button>
      </div>

      {/* Main Content */}
      <div className="course-editor-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="course-editor-section">
            {/* Hero Section - ca un curs real */}
            <div className="course-hero">
              <div className="course-hero-content">
                <div className="course-hero-left">
                  <div className="course-category">
                    <select
                      className="category-select"
                      value={course.category || ''}
                      onChange={(e) => updateCourseField('category', e.target.value)}
                    >
                      <option value="">Selectează categoria</option>
                      <option value="programming">Programare</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="languages">Limbi străine</option>
                    </select>
                  </div>
                  
                  <div className="course-title">
                    <input
                      type="text"
                      className="title-input"
                      value={course.title || ''}
                      onChange={(e) => updateCourseField('title', e.target.value)}
                      placeholder="Titlul cursului"
                    />
                  </div>
                  
                  <div className="course-short-description">
                    <textarea
                      className="short-description-input"
                      value={course.shortDescription || ''}
                      onChange={(e) => updateCourseField('shortDescription', e.target.value)}
                      placeholder="Descrierea scurtă a cursului"
                      rows="3"
                    />
                  </div>
                  
                  <div className="course-meta">
                    <div className="meta-item">
                      <label>Instructor</label>
                      <input
                        type="text"
                        className="instructor-input"
                        value={course.instructor?.name || ''}
                        onChange={(e) => updateInstructorField('name', e.target.value)}
                        placeholder="Numele instructorului"
                      />
                    </div>
                    <div className="meta-item">
                      <label>Nivel</label>
                      <select
                        className="level-select"
                        value={course.level || ''}
                        onChange={(e) => updateCourseField('level', e.target.value)}
                      >
                        <option value="">Selectează nivelul</option>
                        <option value="beginner">Începător</option>
                        <option value="intermediate">Intermediar</option>
                        <option value="advanced">Avansat</option>
                      </select>
                    </div>
                    <div className="meta-item">
                      <label>Durată</label>
                      <input
                        type="text"
                        className="duration-input"
                        value={course.duration || ''}
                        onChange={(e) => updateCourseField('duration', e.target.value)}
                        placeholder="ex: 10 ore"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="course-hero-right">
                  <div className="course-image-container">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Course" className="course-image" />
                    ) : (
                      <div className="image-upload-placeholder">
                        <span>📷</span>
                        <p>Încarcă imaginea cursului</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="image-upload-input"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="course-description-section">
              <h2>Descrierea cursului</h2>
              <textarea
                className="description-textarea"
                value={course.description || ''}
                onChange={(e) => updateCourseField('description', e.target.value)}
                placeholder="Descrierea detaliată a cursului..."
                rows="8"
              />
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="course-editor-section">
            <div className="video-upload-section">
              <h2>Videoclipul principal</h2>
              <div className="video-upload-area">
                {videoPreview ? (
                  <video controls className="video-preview">
                    <source src={videoPreview} type="video/mp4" />
                    Browser-ul tău nu suportă videoclipul.
                  </video>
                ) : (
                  <div className="video-upload-placeholder">
                    <span>🎥</span>
                    <p>Încarcă videoclipul cursului</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="video-upload-input"
                />
              </div>
            </div>

            {/* Lessons Section */}
            <div className="lessons-section">
              <div className="lessons-header">
                <h2>Lecțiile cursului</h2>
                <button className="add-lesson-btn" onClick={addLesson}>
                  + Adaugă Lecție
                </button>
              </div>
              
              <div className="lessons-list">
                {course.lessons?.map((lesson, index) => (
                  <div key={lesson.id || index} className="lesson-item">
                    <div className="lesson-header">
                      <h3>Lecția {index + 1}</h3>
                      <button 
                        className="remove-lesson-btn"
                        onClick={() => removeLesson(index)}
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="lesson-content">
                      <input
                        type="text"
                        className="lesson-title-input"
                        value={lesson.title || ''}
                        onChange={(e) => updateLesson(index, 'title', e.target.value)}
                        placeholder="Titlul lecției"
                      />
                      
                      <textarea
                        className="lesson-description-textarea"
                        value={lesson.description || ''}
                        onChange={(e) => updateLesson(index, 'description', e.target.value)}
                        placeholder="Descrierea lecției"
                        rows="4"
                      />
                      
                      <div className="lesson-meta">
                        <div className="lesson-duration">
                          <label>Durată (minute)</label>
                          <input
                            type="number"
                            className="lesson-duration-input"
                            value={lesson.duration || ''}
                            onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                            placeholder="30"
                          />
                        </div>
                        
                        <div className="lesson-video">
                          <label>Videoclip lecție</label>
                          <input
                            type="file"
                            accept="video/*"
                            className="lesson-video-input"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                  updateLesson(index, 'video', e.target.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        
                        <div className="lesson-preview">
                          <input
                            type="checkbox"
                            id={`preview-${index}`}
                            checked={lesson.isPreview || false}
                            onChange={(e) => updateLesson(index, 'isPreview', e.target.checked)}
                          />
                          <label htmlFor={`preview-${index}`}>
                            Lecție de preview (gratuită)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructor Tab */}
        {activeTab === 'instructor' && (
          <div className="course-editor-section">
            <div className="instructor-section">
              <h2>Informații despre instructor</h2>
              
              <div className="instructor-details">
                <div className="instructor-avatar">
                  {instructorImagePreview ? (
                    <img src={instructorImagePreview} alt="Instructor" className="instructor-avatar-img" />
                  ) : (
                    <div className="instructor-avatar-upload">
                      <span>👤</span>
                      <p>Încarcă fotografia</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInstructorImageUpload}
                    className="instructor-avatar-input"
                  />
                </div>
                
                <div className="instructor-info">
                  <div className="instructor-field">
                    <label>Numele complet</label>
                    <input
                      type="text"
                      className="instructor-name-input"
                      value={course.instructor?.name || ''}
                      onChange={(e) => updateInstructorField('name', e.target.value)}
                      placeholder="Numele instructorului"
                    />
                  </div>
                  
                  <div className="instructor-field">
                    <label>Specializare</label>
                    <input
                      type="text"
                      className="instructor-specialization-input"
                      value={course.instructor?.specialization || ''}
                      onChange={(e) => updateInstructorField('specialization', e.target.value)}
                      placeholder="ex: Dezvoltator Full-Stack"
                    />
                  </div>
                  
                  <div className="instructor-field">
                    <label>Experiență</label>
                    <input
                      type="text"
                      className="instructor-experience-input"
                      value={course.instructor?.experience || ''}
                      onChange={(e) => updateInstructorField('experience', e.target.value)}
                      placeholder="ex: 5+ ani experiență"
                    />
                  </div>
                  
                  <div className="instructor-field">
                    <label>Biografie</label>
                    <textarea
                      className="instructor-bio-textarea"
                      value={course.instructor?.bio || ''}
                      onChange={(e) => updateInstructorField('bio', e.target.value)}
                      placeholder="Biografia instructorului..."
                      rows="6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="course-editor-section">
            <div className="pricing-section">
              <h2>Prețuri și oferte</h2>
              
              <div className="price-inputs">
                <div className="price-field">
                  <label>Preț actual (RON)</label>
                  <input
                    type="number"
                    className="price-input"
                    value={course.price || ''}
                    onChange={(e) => updateCourseField('price', parseFloat(e.target.value))}
                    placeholder="299"
                  />
                </div>
                
                <div className="original-price-field">
                  <label>Preț original (RON)</label>
                  <input
                    type="number"
                    className="original-price-input"
                    value={course.originalPrice || ''}
                    onChange={(e) => updateCourseField('originalPrice', parseFloat(e.target.value))}
                    placeholder="399"
                  />
                </div>
              </div>
              
              <div className="free-course">
                <input
                  type="checkbox"
                  id="free-course"
                  checked={course.isFree || false}
                  onChange={(e) => updateCourseField('isFree', e.target.checked)}
                />
                <label htmlFor="free-course">
                  Curs gratuit
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="course-editor-section">
            <div className="course-settings">
              <h3>Setări curs</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <input
                    type="checkbox"
                    id="published"
                    checked={course.published || false}
                    onChange={(e) => updateCourseField('published', e.target.checked)}
                  />
                  <label htmlFor="published">Curs publicat</label>
                </div>
                
                <div className="setting-item">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={course.featured || false}
                    onChange={(e) => updateCourseField('featured', e.target.checked)}
                  />
                  <label htmlFor="featured">Curs recomandat</label>
                </div>
                
                <div className="setting-item">
                  <input
                    type="checkbox"
                    id="certificate"
                    checked={course.certificate || false}
                    onChange={(e) => updateCourseField('certificate', e.target.checked)}
                  />
                  <label htmlFor="certificate">Oferă certificat</label>
                </div>
              </div>
            </div>
            
            <div className="course-tags">
              <h3>Tag-uri</h3>
              <input
                type="text"
                className="tags-input"
                value={course.tags?.join(', ') || ''}
                onChange={(e) => updateCourseField('tags', e.target.value.split(',').map(tag => tag.trim()))}
                placeholder="programming, javascript, react"
              />
            </div>
            
            <div className="course-requirements">
              <h3>Cerințe</h3>
              <textarea
                className="requirements-textarea"
                value={course.requirements || ''}
                onChange={(e) => updateCourseField('requirements', e.target.value)}
                placeholder="Cerințele pentru acest curs..."
                rows="4"
              />
            </div>
            
            <div className="course-objectives">
              <h3>Obiective</h3>
              <textarea
                className="objectives-textarea"
                value={course.objectives || ''}
                onChange={(e) => updateCourseField('objectives', e.target.value)}
                placeholder="Ce vei învăța din acest curs..."
                rows="4"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="course-editor-footer">
        <div className="footer-actions">
          <button 
            className="cancel-btn"
            onClick={() => navigate('/admindanu')}
          >
            Anulează
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Se salvează...' : '💾 Salvează modificările'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
