import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../data/courses';
import { useCart } from '../context/CartContext';

export default function CourseDetails() {
  const { id } = useParams();
  const course = getCourseById(id);
  const { addItem } = useCart();

  if (!course) return <div className="container"><p>Cursul nu a fost gasit.</p></div>;

  return (
    <div className="container">
      <div className="course-hero">
        <img src={course.image} alt={course.title} />
        <div className="course-hero-body">
          <h1>{course.title}</h1>
          <p className="muted">Nivel: {course.level} · {course.lessonsCount} lectii · {course.durationHours} ore</p>
          <p>{course.description}</p>
          <div className="price-actions">
            <strong className="price">{course.price.toFixed(2)} €</strong>
            <button className="btn" onClick={() => addItem(course)}>Adauga in cos</button>
          </div>
        </div>
      </div>
    </div>
  );
}


