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
    <div className="course-edit-modern">
      {/* Header cu navigare */}
      <div className="course-edit-header">
        <div className="container">
          <button 
            className="back-button"
            onClick={() => navigate('/admindanu')}
          >
            <span className="back-icon">←</span>
            <span>Înapoi la Super Admin</span>
          </button>
          <h1>Editare Curs</h1>
        </div>
      </div>

      <div className="container">
        <div className="course-edit-layout">
          {/* Coloana stângă - Conținutul principal */}
          <div className="course-edit-main">
            
            {/* 1. Numele cursului */}
            <div className="course-title-section">
              <input
                type="text"
                className="course-title-input"
                value={course.title || ''}
                onChange={(e) => updateCourseField('title', e.target.value)}
                placeholder="Numele cursului"
              />
            </div>

            {/* 2. Imaginea pentru preview și video */}
            <div className="course-media-section">
              <div className="media-upload-area">
                <div className="image-upload-section">
                  <h3>Imaginea pentru preview</h3>
                  <div className="image-upload-container">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Course Preview" className="preview-image" />
                    ) : (
                      <div className="image-upload-placeholder">
                        <span>📷</span>
                        <p>Încarcă imaginea pentru preview</p>
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

                <div className="video-upload-section">
                  <h3>Video curs</h3>
                  <div className="video-upload-container">
                    {videoPreview ? (
                      <video controls className="preview-video">
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
              </div>
            </div>

            {/* 3. Despre acest curs */}
            <div className="course-about-section">
              <h3 className="section-title">Despre acest curs</h3>
              <textarea
                className="course-description-input"
                value={course.description || ''}
                onChange={(e) => updateCourseField('description', e.target.value)}
                placeholder="Un curs complet de cybersecurity care te va învăța cum să identifici vulnerabilități, să implementezi măsuri de securitate și să răspunzi la incidente de securitate."
                rows="4"
              />
            </div>

            {/* 4. Ce vei învăța */}
            <div className="course-learning-section">
              <h3 className="section-title">Ce vei învăța</h3>
              <div className="learning-points-list">
                {course.features?.map((feature, index) => (
                  <div key={index} className="learning-point-item">
                    <span className="check-icon">✓</span>
                    <input
                      type="text"
                      className="learning-point-input"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...course.features];
                        newFeatures[index] = e.target.value;
                        updateCourseField('features', newFeatures);
                      }}
                      placeholder="80+ ore de conținut"
                    />
                    <button 
                      className="remove-point-btn"
                      onClick={() => {
                        const newFeatures = course.features.filter((_, i) => i !== index);
                        updateCourseField('features', newFeatures);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button 
                  className="add-point-btn"
                  onClick={() => {
                    const newFeatures = [...(course.features || []), ''];
                    updateCourseField('features', newFeatures);
                  }}
                >
                  + Adaugă punct
                </button>
              </div>
            </div>

            {/* 5. Programa cursului */}
            <div className="course-curriculum-section">
              <h3 className="section-title">Programa cursului</h3>
              <div className="curriculum-list">
                {course.curriculum?.map((lesson, index) => (
                  <div key={index} className="curriculum-item">
                    <span className="lesson-number">{index + 1}</span>
                    <input
                      type="text"
                      className="curriculum-input"
                      value={lesson}
                      onChange={(e) => {
                        const newCurriculum = [...course.curriculum];
                        newCurriculum[index] = e.target.value;
                        updateCourseField('curriculum', newCurriculum);
                      }}
                      placeholder="Network security"
                    />
                    <button 
                      className="remove-curriculum-btn"
                      onClick={() => {
                        const newCurriculum = course.curriculum.filter((_, i) => i !== index);
                        updateCourseField('curriculum', newCurriculum);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button 
                  className="add-curriculum-btn"
                  onClick={() => {
                    const newCurriculum = [...(course.curriculum || []), ''];
                    updateCourseField('curriculum', newCurriculum);
                  }}
                >
                  + Adaugă modul
                </button>
              </div>
            </div>
          </div>

          {/* Coloana dreaptă - Preț și detalii */}
          <div className="course-edit-sidebar">
            
            {/* 5. Prețul în euro */}
            <div className="price-section">
              <div className="price-display">
                <span className="currency">€</span>
                <input
                  type="number"
                  className="price-input"
                  value={course.price || ''}
                  onChange={(e) => updateCourseField('price', parseFloat(e.target.value))}
                  placeholder="699"
                />
              </div>
              <div className="price-note">Acces pe viață</div>
            </div>

            {/* 6. Detalii curs */}
            <div className="course-details-section">
              <h4 className="details-title">Detalii curs</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-icon">👨‍🏫</span>
                  <div className="detail-content">
                    <span className="detail-label">INSTRUCTOR</span>
                    <input
                      type="text"
                      className="detail-input"
                      value={course.instructor || ''}
                      onChange={(e) => updateCourseField('instructor', e.target.value)}
                      placeholder="Radu Popescu"
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <div className="detail-content">
                    <span className="detail-label">DURATĂ</span>
                    <input
                      type="text"
                      className="detail-input"
                      value={course.duration || ''}
                      onChange={(e) => updateCourseField('duration', e.target.value)}
                      placeholder="80 ore"
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎯</span>
                  <div className="detail-content">
                    <span className="detail-label">NIVEL</span>
                    <select
                      className="detail-select"
                      value={course.level || ''}
                      onChange={(e) => updateCourseField('level', e.target.value)}
                    >
                      <option value="">Selectează nivelul</option>
                      <option value="beginner">Începător</option>
                      <option value="intermediate">Intermediar</option>
                      <option value="advanced">Avansat</option>
                    </select>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🌍</span>
                  <div className="detail-content">
                    <span className="detail-label">LIMBĂ</span>
                    <input
                      type="text"
                      className="detail-input"
                      value={course.language || ''}
                      onChange={(e) => updateCourseField('language', e.target.value)}
                      placeholder="română"
                    />
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📂</span>
                  <div className="detail-content">
                    <span className="detail-label">CATEGORIE</span>
                    <select
                      className="detail-select"
                      value={course.category || ''}
                      onChange={(e) => updateCourseField('category', e.target.value)}
                    >
                      <option value="">Selectează categoria</option>
                      <option value="programming">Programare</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="security">Securitate</option>
                      <option value="languages">Limbi străine</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Butonul de salvare */}
            <div className="save-section">
              <div className="save-status">{saveStatus}</div>
              <button 
                className="save-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Se salvează...' : '💾 Salvează modificările'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
