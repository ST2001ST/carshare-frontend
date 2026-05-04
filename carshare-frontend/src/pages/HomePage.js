import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';

function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

export default HomePage;
