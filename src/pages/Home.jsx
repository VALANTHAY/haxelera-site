import React from 'react';
import Hero from '../components/Hero';
import TechMarquee from '../components/TechMarquee';
import TerminalSimulator from '../components/TerminalSimulator';
import Services from '../components/Services';
import Products from '../components/Products';
import Testimonials from '../components/Testimonials';
import DNA from '../components/DNA';
import Metrics from '../components/Metrics';
import Contact from '../components/Contact';

export default function Home() {
  return (
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
  );
}
