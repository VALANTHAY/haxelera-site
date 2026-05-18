import React from 'react';
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
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <div className="relative min-h-screen custom-cursor-container" style={{ position: 'relative' }}>
      {/* Absolute Tech Grid Backdrop */}
      <div className="grid-overlay"></div>

      {/* Global Elements */}
      <CustomCursor />
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
  );
}
