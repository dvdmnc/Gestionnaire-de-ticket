import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import MovieCarousel from './MovieCarousel';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MovieCarousel />
      <Footer />
    </>
  );
};

export default LandingPage;
