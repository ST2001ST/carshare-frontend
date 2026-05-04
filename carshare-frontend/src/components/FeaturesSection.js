import React from 'react';
import { useLanguage } from '../context/LanguageContext';

function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">{t('featuresTitle')}</h2>
        <p className="features-subtitle">{t('featuresSubtitle')}</p>

        <div className="features-grid">
          <div className="feature-card">
            <h3>{t('feature1Title')}</h3>
            <p>{t('feature1Desc')}</p>
          </div>
          <div className="feature-card">
            <h3>{t('feature2Title')}</h3>
            <p>{t('feature2Desc')}</p>
          </div>
          <div className="feature-card">
            <h3>{t('feature3Title')}</h3>
            <p>{t('feature3Desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
