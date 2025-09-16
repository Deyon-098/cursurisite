import React from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data/courses';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { addItem } = useCart();

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-content">
          <h1>Invata modern, construieste un viitor mai bun</h1>
          <p>Acceseaza cursuri create de profesionisti si treci de la teorie la practica prin proiecte reale.</p>
          <div className="hero-actions">
            <a className="btn" href="#cursuri">Vezi cursurile</a>
            <a className="btn ghost" href="/register">Incepe gratuit</a>
          </div>
          <div className="hero-cats">
            {['React', 'JavaScript', 'Node', 'UI/UX', 'DevOps', 'TypeScript'].map((cat) => (
              <span className="chip" key={cat}>{cat}</span>
            ))}
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
      </section>

      <h2 id="cursuri" className="section-title">Cursuri Populare</h2>
      <div className="grid">
        {courses.map((c) => (
          <article key={c.id} className="card">
            <Link to={`/course/${c.id}`} className="card-media">
              <img src={c.image} alt={c.title} />
            </Link>
            <div className="card-body">
              <h3>{c.title}</h3>
              <p className="muted">{c.shortDescription}</p>
              <div className="card-footer">
                <strong>{c.price.toFixed(2)} €</strong>
                <div className="actions">
                  <Link to={`/course/${c.id}`} className="btn ghost">Detalii</Link>
                  <button className="btn" onClick={() => addItem(c)}>Adauga in cos</button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


