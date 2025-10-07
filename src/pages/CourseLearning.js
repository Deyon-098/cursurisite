import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseById } from '../data/coursesFirebase';
import { useAuth } from '../context/AuthContext';
import { markLessonComplete, getCourseProgress, updateTimeSpent } from '../firebase/firestore';
import { debugCourseProgress } from '../scripts/debugProgress';
import { fixCourseProgress } from '../scripts/fixProgress';
import { useTimeTracking } from '../hooks/useTimeTracking';

export default function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);

  // Hook pentru tracking-ul timpului
  const { timeSpent, isTracking, stopTracking } = useTimeTracking(
    user?.id, 
    id, 
    !loading && course && !showMap // Activează tracking-ul când cursul este încărcat și nu este în mapă
  );

  // Lecții demo pentru cursuri - folosind useCallback pentru a evita re-render-urile
  const generateLessons = React.useCallback((courseTitle) => {
    const lessons = [];
    // Folosim un număr variabil de lecții bazat pe titlul cursului pentru consistență
    let lessonCount;
    
    // Determină numărul de lecții bazat pe tipul cursului
    if (courseTitle.toLowerCase().includes('react')) {
      lessonCount = 10;
    } else if (courseTitle.toLowerCase().includes('javascript')) {
      lessonCount = 12;
    } else if (courseTitle.toLowerCase().includes('python')) {
      lessonCount = 8;
    } else if (courseTitle.toLowerCase().includes('css')) {
      lessonCount = 6;
    } else if (courseTitle.toLowerCase().includes('html')) {
      lessonCount = 7;
    } else {
      // Pentru alte cursuri, folosim un număr bazat pe hash-ul titlului pentru consistență
      let hash = 0;
      for (let i = 0; i < courseTitle.length; i++) {
        hash = ((hash << 5) - hash + courseTitle.charCodeAt(i)) & 0xffffffff;
      }
      lessonCount = Math.abs(hash) % 5 + 6; // 6-10 lecții
    }
    
    for (let i = 0; i < lessonCount; i++) {
      lessons.push({
        id: i + 1,
        title: `Lecția ${i + 1}: ${getLessonTitle(courseTitle, i)}`,
        description: `În această lecție vei învăța conceptele fundamentale și vei aplica cunoștințele în practică.`,
        duration: 15 + (i * 3) + (Math.abs(courseTitle.charCodeAt(i % courseTitle.length)) % 10), // Durată consistentă bazată pe curs
        type: i % 3 === 0 ? 'video' : i % 3 === 1 ? 'theory' : 'practice',
        difficulty: i < 3 ? 'beginner' : i < 6 ? 'intermediate' : 'advanced',
        unlocked: i === 0, // Doar prima lecție este deblocată inițial
        completed: false, // Inițial nici o lecție nu este completată
        resources: [
          { type: 'video', title: 'Video Lecție', url: '#' },
          { type: 'pdf', title: 'Materiale PDF', url: '#' },
          { type: 'quiz', title: 'Test de Verificare', url: '#' }
        ]
      });
    }
    return lessons;
  }, []);

  const getLessonTitle = (courseTitle, index) => {
    const titles = {
      'React': [
        'Introducere în React',
        'Componente și Props',
        'State și Lifecycle',
        'Event Handling',
        'Hooks - useState și useEffect',
        'Hooks - useContext și useReducer',
        'Routing cu React Router',
        'State Management cu Redux',
        'Testing cu Jest',
        'Deployment și Optimizare'
      ],
      'JavaScript': [
        'Fundamentele JavaScript',
        'Variabile și Tipuri de Date',
        'Funcții și Scope',
        'Obiecte și Arrays',
        'DOM Manipulation',
        'Async Programming',
        'ES6+ Features',
        'Modules și Imports',
        'Error Handling',
        'Performance Optimization'
      ],
      'Python': [
        'Sintaxa Python',
        'Variabile și Tipuri',
        'Control Flow',
        'Funcții și Modules',
        'OOP în Python',
        'File Handling',
        'Exception Handling',
        'Libraries și Packages',
        'Data Structures',
        'Algorithms și Problem Solving'
      ]
    };
    
    const courseKey = Object.keys(titles).find(key => 
      courseTitle.toLowerCase().includes(key.toLowerCase())
    );
    
    return titles[courseKey]?.[index] || `Concept ${index + 1}`;
  };

  // Încarcă cursul
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        // Scroll la începutul paginii când se încarcă cursul
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        
        const courseData = await getCourseById(id);
        
        if (courseData) {
          const lessons = generateLessons(courseData.title);
          
          // Încarcă progresul existent din Firebase ÎNAINTE de a seta cursul
          if (user) {
            console.log('🔄 Încarc progresul pentru utilizatorul:', user.id, 'cursul:', courseData.id);
            
            // Debug progresul
            await debugCourseProgress(user.id, courseData.id);
            
            const progressData = await getCourseProgress(user.id, courseData.id);
            console.log('📊 Progres primit din Firebase:', progressData);
            
            if (progressData && progressData.completedLessons) {
              // Filtrează lecțiile completate pentru a elimina indexurile invalide
              const validCompletedLessons = progressData.completedLessons.filter(index => 
                index >= 0 && index < lessons.length
              );
              
              const completedLessons = new Set(validCompletedLessons);
              setCompletedLessons(completedLessons);
              
              console.log('✅ Lecții completate găsite:', Array.from(completedLessons));
              console.log('📊 Total lecții în curs:', lessons.length);
              
              // Actualizează lecțiile cu progresul din Firebase
              lessons.forEach((lesson, index) => {
                if (completedLessons.has(index)) {
                  lesson.completed = true;
                  lesson.unlocked = true;
                  console.log(`✅ Lecția ${index} marcată ca completată`);
                } else if (index > 0 && completedLessons.has(index - 1)) {
                  lesson.unlocked = true;
                  console.log(`🔓 Lecția ${index} deblocată (lecția anterioară completată)`);
                } else if (index === 0) {
                  lesson.unlocked = true; // Prima lecție este întotdeauna deblocată
                }
              });
              
              console.log('📈 Progres încărcat cu succes din Firebase:', progressData);
              
              // Dacă există lecții invalide în progres, curăță-le
              if (validCompletedLessons.length !== progressData.completedLessons.length) {
                console.log('🧹 Curăț lecțiile invalide din progres');
                await fixCourseProgress(user.id, courseData.id, courseData.title, lessons.length);
              }
            } else {
              console.log('📊 Nu există progres pentru acest curs, toate lecțiile sunt blocate except prima');
              // Prima lecție este întotdeauna deblocată
              if (lessons.length > 0) {
                lessons[0].unlocked = true;
              }
            }
          }
          
          // Setează cursul cu lecțiile actualizate
          setCourse({
            ...courseData,
            lessons
          });
        } else {
          navigate('/courses');
        }
      } catch (error) {
        console.error('Eroare la încărcarea cursului:', error);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, navigate, user, generateLessons]);

  const handleLessonClick = (lessonIndex) => {
    const lesson = course.lessons[lessonIndex];
    if (lesson.unlocked) {
      setCurrentLesson(lessonIndex);
      setShowMap(false);
      
      // Scroll la începutul paginii cu delay pentru a permite render-ul
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  // Salvează timpul petrecut în Firebase când componenta se deconectează
  useEffect(() => {
    return () => {
      if (user && course && timeSpent > 0) {
        console.log('💾 Salvând timpul petrecut la deconectare:', timeSpent, 'minute');
        updateTimeSpent(user.id, course.id, course.title, timeSpent);
      }
    };
  }, [user, course, timeSpent]);

  // Salvează timpul la fiecare 5 minute
  useEffect(() => {
    if (timeSpent > 0 && timeSpent % 5 === 0 && user && course) {
      console.log('💾 Salvând timpul petrecut (5 min):', timeSpent, 'minute');
      updateTimeSpent(user.id, course.id, course.title, 5);
    }
  }, [timeSpent, user, course]);

  const handleMarkLessonComplete = async (lessonIndex) => {
    if (!user) {
      console.error('Utilizatorul nu este conectat');
      return;
    }

    try {
      console.log('🔄 Marchez lecția ca completată:', lessonIndex);
      
      // Salvează progresul în Firebase
      const success = await markLessonComplete(
        user.id, 
        course.id, 
        course.title, 
        lessonIndex, 
        course.lessons.length
      );

      if (success) {
        // Actualizează starea locală
        const newCompleted = new Set(completedLessons);
        newCompleted.add(lessonIndex);
        setCompletedLessons(newCompleted);
        
        // Actualizează lecția în array-ul de lecții
        const updatedLessons = [...course.lessons];
        updatedLessons[lessonIndex].completed = true;
        updatedLessons[lessonIndex].unlocked = true;
        
        // Deblochează următoarea lecție
        if (lessonIndex < course.lessons.length - 1) {
          updatedLessons[lessonIndex + 1].unlocked = true;
        }
        
        setCourse({ ...course, lessons: updatedLessons });
        
        console.log('✅ Lecția a fost marcată ca completată în Firebase');
        console.log('📈 Progres actualizat:', Math.round(((lessonIndex + 1) / course.lessons.length) * 100) + '%');
        
        // Debug progresul după marcare
        await debugCourseProgress(user.id, course.id);
        
        // Notifică dashboard-ul despre schimbarea progresului
        window.dispatchEvent(new CustomEvent('courseProgressUpdated', {
          detail: {
            userId: user.id,
            courseId: course.id,
            lessonIndex,
            totalLessons: course.lessons.length
          }
        }));
      }
    } catch (error) {
      console.error('❌ Eroare la marcarea lecției ca completată:', error);
    }
  };

  const getLessonIcon = (type, completed) => {
    if (completed) return '✅';
    switch (type) {
      case 'video': return '🎥';
      case 'theory': return '📚';
      case 'practice': return '💻';
      default: return '📖';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#00ff88';
      case 'intermediate': return '#ffa500';
      case 'advanced': return '#ff4757';
      default: return '#00d4ff';
    }
  };

  if (loading) {
    return (
      <div className="course-learning-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-learning-page">
        <div className="error-container">
          <h2>❌ Cursul nu a fost găsit</h2>
          <Link to="/courses" className="btn primary">Înapoi la Cursuri</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-learning-page">
      {/* Header */}
      <div className="learning-header">
        <div className="header-content">
          <div className="course-info">
            <Link to="/dashboard" className="back-btn">
              <span>←</span> Înapoi la Dashboard
            </Link>
            <h1>{course.title}</h1>
            <p className="course-description">{course.shortDescription}</p>
            <div className="course-meta">
              <span className="meta-item">
                <span className="icon">👨‍🏫</span>
                {course.instructor}
              </span>
              <span className="meta-item">
                <span className="icon">⏱️</span>
                {course.duration || 'N/A'} ore
              </span>
              <span className="meta-item">
                <span className="icon">📚</span>
                {course.lessons.length} lecții
              </span>
            </div>
          </div>
          
          <div className="progress-overview">
            <div className="progress-circle">
              <div className="progress-text">
                {Math.round((completedLessons.size / course.lessons.length) * 100)}%
              </div>
            </div>
            <div className="progress-info">
              <div className="progress-label">Progres Curs</div>
              <div className="progress-details">
                {completedLessons.size} din {course.lessons.length} lecții
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="learning-content">
        {showMap ? (
          /* Learning Map */
          <div className="learning-map-container">
            <div className="map-header">
              <h2>🗺️ Harta de Învățare</h2>
              <p>Parcurge lecțiile în ordine pentru a debloca următoarele nivele</p>
            </div>
            
            <div className="lessons-map">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`lesson-node ${lesson.unlocked ? 'unlocked' : 'locked'} ${lesson.completed ? 'completed' : ''}`}
                  onClick={() => handleLessonClick(index)}
                >
                  <div className="node-content">
                    <div className="node-icon">
                      {getLessonIcon(lesson.type, lesson.completed)}
                    </div>
                    <div className="node-info">
                      <div className="node-title">{lesson.title}</div>
                      <div className="node-meta">
                        <span className="duration">{lesson.duration} min</span>
                        <span 
                          className="difficulty"
                          style={{ color: getDifficultyColor(lesson.difficulty) }}
                        >
                          {lesson.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="node-status">
                      {lesson.completed ? (
                        <span className="status-icon">✅</span>
                      ) : lesson.unlocked ? (
                        <span className="status-icon">▶️</span>
                      ) : (
                        <span className="status-icon">🔒</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Connection line to next lesson */}
                  {index < course.lessons.length - 1 && (
                    <div className={`connection-line ${lesson.completed ? 'active' : ''}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Lesson Content */
          <div className="lesson-content">
            <div className="lesson-header">
              <button 
                className="back-to-map-btn"
                onClick={() => {
                  setShowMap(true);
                  // Scroll la începutul paginii cu delay
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
              >
                ← Înapoi la Hartă
              </button>
              <h2>{course.lessons[currentLesson].title}</h2>
              <div className="lesson-meta">
                <span className="lesson-type">
                  {course.lessons[currentLesson].type === 'video' ? '🎥 Video' : 
                   course.lessons[currentLesson].type === 'theory' ? '📚 Teorie' : '💻 Practică'}
                </span>
                <span className="lesson-duration">
                  ⏱️ {course.lessons[currentLesson].duration} minute
                </span>
              </div>
            </div>
            
            <div className="lesson-body">
              <div className="lesson-description">
                <p>{course.lessons[currentLesson].description}</p>
              </div>
              
              <div className="lesson-media">
                {course.lessons[currentLesson].type === 'video' ? (
                  <div className="video-placeholder">
                    <div className="video-thumbnail">
                      <div className="play-button">▶️</div>
                      <div className="video-title">Video Lecție</div>
                    </div>
                  </div>
                ) : (
                  <div className="content-placeholder">
                    <div className="content-icon">
                      {course.lessons[currentLesson].type === 'theory' ? '📚' : '💻'}
                    </div>
                    <div className="content-title">
                      {course.lessons[currentLesson].type === 'theory' ? 'Material Teoretic' : 'Exercițiu Practic'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lesson-resources">
                <h3>📁 Resurse</h3>
                <div className="resources-list">
                  {course.lessons[currentLesson].resources.map((resource, index) => (
                    <div key={index} className="resource-item">
                      <span className="resource-icon">
                        {resource.type === 'video' ? '🎥' : 
                         resource.type === 'pdf' ? '📄' : '📝'}
                      </span>
                      <span className="resource-title">{resource.title}</span>
                      <button className="resource-btn">Deschide</button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lesson-actions">
                <button 
                  className="complete-btn"
                  onClick={() => handleMarkLessonComplete(currentLesson)}
                  disabled={course.lessons[currentLesson].completed}
                >
                  {course.lessons[currentLesson].completed ? '✅ Completat' : '✓ Marchează ca Completat'}
                </button>
                
                {currentLesson < course.lessons.length - 1 && (
                  <button 
                    className="next-btn"
                    onClick={() => {
                      setCurrentLesson(currentLesson + 1);
                      // Scroll la începutul paginii cu delay
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    Următoarea Lecție →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

