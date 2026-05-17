import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Products from './components/Products';
import DNA from './components/DNA';
import Metrics from './components/Metrics';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen" style={{ position: 'relative' }}>
      {/* Absolute Tech Grid Backdrop */}
      <div className="grid-overlay"></div>

      {/* Navigation Header */}
      <Navbar />

      {/* Main Corporate Sections */}
      <main>
        <Hero />
        <Services />
        <Products />
        <DNA />
        <Metrics />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
