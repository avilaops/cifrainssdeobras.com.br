import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Benefits } from '@/components/sections/Benefits';
import { Comparison } from '@/components/sections/Comparison';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { WhatYouGet } from '@/components/sections/WhatYouGet';
import { MockupSection } from '@/components/sections/MockupSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { FAQ } from '@/components/sections/FAQ';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { BackToTop } from '@/components/common/BackToTop';
import NotFound from '@/pages/NotFound';

const HomePage: React.FC = () => (
  <>
    <Hero />
    <Benefits />
    <Comparison />
    <HowItWorks />
    <WhatYouGet />
    <MockupSection />
    <CtaSection />
    <FAQ />
  </>
);

const App: React.FC = () => (
  <BrowserRouter>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  </BrowserRouter>
);

export default App;
