import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechMarquee from './components/TechMarquee';
import TerminalSimulator from './components/TerminalSimulator';
import Services from './components/Services';
import Products from './components/Products';
import DNA from './components/DNA';
import Metrics from './components/Metrics';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import Preloader from './components/Preloader';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Prevent scrolling while preloader is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      <div className="relative min-h-screen custom-cursor-container" style={{ position: 'relative', opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
        {/* Absolute Tech Grid Backdrop */}
        <div className="grid-overlay"></div>

        {/* Global Elements */}
        <WhatsAppWidget />
        <Navbar />

        {/* Main Corporate Sections */}
        <main>
          <Hero />
          <TechMarquee />
          <TerminalSimulator />
          <Services />
          <Products />
          <Testimonials />
          <DNA />
          <Metrics />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
