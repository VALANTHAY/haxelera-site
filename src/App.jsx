import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import Preloader from './components/Preloader';

// Pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Software = React.lazy(() => import('./pages/Software'));
const Cloud = React.lazy(() => import('./pages/Cloud'));
const DataAI = React.lazy(() => import('./pages/DataAI'));
const Courses = React.lazy(() => import('./pages/Courses'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

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
        <div className="grid-overlay"></div>
        <WhatsAppWidget />
        <Navbar />

        <React.Suspense fallback={<div className="min-h-screen bg-black" style={{ backgroundColor: 'var(--bg-color)' }} />}>
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
        </React.Suspense>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

function MainShell() {
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
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <div
        className="relative min-h-screen"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          position: 'relative',
        }}
      >
        <div className="grid-overlay"></div>
        <WhatsAppWidget />
        <Navbar />

        <React.Suspense fallback={<div className="min-h-screen bg-black" style={{ backgroundColor: 'var(--bg-color)' }} />}>
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
        </React.Suspense>

        <Footer />
      </div>
    </>
  );
}
