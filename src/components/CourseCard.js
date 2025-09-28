import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CourseCard({ course }) {
  const { addItem } = useCart();

  return (
    <article className="course-card">
      <Link to={`/course/${course.id}`} className="course-card-media">
        <img src={course.image} alt={course.title} />
        <div className="course-level-badge">{course.level}</div>
      </Link>
      <div className="course-card-body">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-instructor">👨‍🏫 {course.instructor || 'Expert'}</p>
        <p className="course-card-description">{course.shortDescription}</p>
        <div className="course-card-footer">
          <div className="course-card-price">
            <span className="price-currency">€</span>
            <span className="price-amount">{course.price.toFixed(0)}</span>
          </div>
          <div className="course-card-actions">
            <Link to={`/course/${course.id}`} className="btn ghost small">
              Detalii
            </Link>
            <button 
              className="btn primary small" 
              onClick={() => addItem(course)}
            >
              Adaugă în coș
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
