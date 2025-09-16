import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { totals } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">CursuriPlus</Link>
        <nav className="main-nav">
          <NavLink to="/" end>Acasa</NavLink>
          <NavLink to="/cart">Cos ({totals.count})</NavLink>
          {user ? (
            <>
              <span className="welcome">Salut, {user.name}</span>
              <button className="btn ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
          <button className="btn ghost theme-toggle" onClick={toggleTheme} aria-label="Schimba tema">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </nav>
      </div>
    </header>
  );
}


