import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="CarShare" className="logo-img" />
        </Link>
        <div className="nav-links">
          <Link to="/">{t('home')}</Link>
          <Link to="/cars">{t('cars')}</Link>
          {user?.role === 'fournisseur' && (
            <Link to="/dashboard" className="dashboard-link">{t('dashboard')}</Link>
          )}
        </div>
        <div className="nav-right">
          {!user ? (
            <Link to="/login" className="btn-login">{t('login')}</Link>
          ) : (
            <div className="user-info">
              <span>{t('welcome')} {user.name}</span>
              <button onClick={logout} className="btn-logout">{t('logout')}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
