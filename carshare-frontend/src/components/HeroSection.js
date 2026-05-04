import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function HeroSection() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroSubtitle')}</p>
        <div className="hero-buttons">
          <Link to="/cars" className="btn-primary">{t('heroBtn')}</Link>
          {!user && (
            <Link to="/signup" className="btn-secondary">{t('becomeProvider')}</Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
