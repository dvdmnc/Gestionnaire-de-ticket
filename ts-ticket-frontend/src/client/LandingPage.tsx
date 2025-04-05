import React from 'react';
import HeroSection from './HeroSection';
import MovieCarousel from './MovieCarousel';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <MovieCarousel />
      <Footer />
    </>
  );
};

export default LandingPage;
