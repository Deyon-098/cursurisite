import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { totals } = useCart();
  const { user, logout, loading, isPremium } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Închide menu-ul mobile când se schimbă ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <div className="logo">C</div>
          <span>CursuriPlus</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="nav-container">
          <nav className="main-nav desktop-nav">
            <div className="nav-primary">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/courses">Courses</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
            
            <div className="nav-secondary">
              {loading ? (
                <span className="welcome">Se încarcă...</span>
              ) : user ? (
                <>
                  <NavLink to="/dashboard" className="btn ghost">📊 Dashboard</NavLink>
                  <span className="welcome">Salut, {user.name}</span>
                  <button className="btn ghost" onClick={logout}>Logout</button>
                </>
              ) : (
                <NavLink to="/login">Login</NavLink>
              )}
              <NavLink to="/cart" className="cart-link">
                🛒 Cart ({totals.count})
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <nav className={`main-nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            <NavLink to="/" end onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/courses" onClick={closeMobileMenu}>Courses</NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu}>Contact</NavLink>
            {loading ? (
              <div className="mobile-user-info">
                <span className="welcome">Se încarcă...</span>
              </div>
            ) : user ? (
              <>
                <NavLink to="/dashboard" onClick={closeMobileMenu}>📊 Dashboard</NavLink>
                <div className="mobile-user-info">
                  <span className="welcome">Salut, {user.name}</span>
                  <button className="btn ghost" onClick={() => { logout(); closeMobileMenu(); }}>Logout</button>
                </div>
              </>
            ) : (
              <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
            )}
            <NavLink to="/cart" className="cart-link" onClick={closeMobileMenu}>
              🛒 Cart ({totals.count})
            </NavLink>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
        )}
      </div>
    </header>
  );
}


