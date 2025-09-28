import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    alert('✅ Mesajul a fost trimis cu succes! Vom reveni în cel mai scurt timp.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <div className="contact-header">
        <div className="container">
          <h1>Contactează-<span className="highlight">ne</span></h1>
          <p>Ai întrebări? Vrei să afli mai multe despre cursurile noastre? Suntem aici să te ajutăm să îți construiești cariera în tehnologie!</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Informații de contact</h2>
            <div className="contact-details">
              <div className="contact-item">
                <h3>📧 Email</h3>
                <p>contact@cursuriplus.ro</p>
                <p className="contact-subtitle">Răspundem în maxim 24 de ore</p>
              </div>
              <div className="contact-item">
                <h3>📞 Telefon</h3>
                <p>+40 123 456 789</p>
                <p className="contact-subtitle">Luni - Vineri, 9:00 - 18:00</p>
              </div>
              <div className="contact-item">
                <h3>📍 Adresă</h3>
                <p>București, România</p>
                <p className="contact-subtitle">Centrul de dezvoltare profesională</p>
              </div>
              <div className="contact-item">
                <h3>💬 Chat Live</h3>
                <p>Disponibil pe site</p>
                <p className="contact-subtitle">Asistență instantanee</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Trimite-ne un mesaj</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">👤 Nume complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Introdu numele tău complet"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">📧 Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplu@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">📝 Subiect</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Despre ce vrei să vorbești?"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">💬 Mesaj</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Descrie întrebarea sau solicitarea ta în detaliu..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn primary">
                🚀 Trimite mesajul
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
