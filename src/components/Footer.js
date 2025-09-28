import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo">C</div>
                <span>CursuriPlus</span>
              </div>
              <p className="footer-description">
                Platforma ta de învățare pentru tehnologia modernă. 
                Construiește cariera ta în tech cu cursuri create de profesioniști.
              </p>
              <div className="footer-social">
                <a href="https://facebook.com" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  📘
                </a>
                <a href="https://twitter.com" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                  🐦
                </a>
                <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  💼
                </a>
                <a href="https://youtube.com" className="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                  📺
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">Link-uri Rapide</h3>
              <ul className="footer-links">
                <li><Link to="/">Acasă</Link></li>
                <li><Link to="/courses">Toate Cursurile</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/register">Înregistrare</Link></li>
                <li><Link to="/login">Conectare</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="footer-section">
              <h3 className="footer-title">Categorii</h3>
              <ul className="footer-links">
                <li><Link to="/courses?category=react">React & Frontend</Link></li>
                <li><Link to="/courses?category=python">Python & Data</Link></li>
                <li><Link to="/courses?category=mobile">Mobile Development</Link></li>
                <li><Link to="/courses?category=design">UI/UX Design</Link></li>
                <li><Link to="/courses?category=devops">DevOps & Cloud</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
              <h3 className="footer-title">Suport</h3>
              <ul className="footer-links">
                <li><a href="/help">Centrul de Ajutor</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/privacy">Politica de Confidențialitate</a></li>
                <li><a href="/terms">Termeni și Condiții</a></li>
                <li><a href="/guarantee">Garanția de Satisfacție</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-section">
              <h3 className="footer-title">Newsletter</h3>
              <p className="newsletter-text">
                Abonează-te pentru a primi cele mai noi cursuri și oferte speciale!
              </p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Adresa ta de email" 
                  className="newsletter-input"
                />
                <button className="newsletter-btn">
                  📧 Abonează-te
                </button>
              </div>
            </div>
          </div>
          
          {/* Copyright in main footer */}
          <div className="footer-copyright-inline">
            <p className="copyright">
              © {currentYear} CursuriPlus. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}



