import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import Preloader from './components/Preloader';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Software from './pages/Software';
import Cloud from './pages/Cloud';
import DataAI from './pages/DataAI';
import Courses from './pages/Courses';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLoading]);

  return (
    <BrowserRouter>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <div
        className="relative min-h-screen"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          position: 'relative',
        }}
      >
        {/* Background grid overlay */}
        <div className="grid-overlay"></div>

        {/* Global Persistent Elements */}
        <WhatsAppWidget />
        <Navbar />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/nosotros/*" element={<About />} />
          <Route path="/software" element={<Software />} />
          <Route path="/software/*" element={<Software />} />
          <Route path="/nube" element={<Cloud />} />
          <Route path="/nube/*" element={<Cloud />} />
          <Route path="/data-ai" element={<DataAI />} />
          <Route path="/data-ai/*" element={<DataAI />} />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/cursos/*" element={<Courses />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
