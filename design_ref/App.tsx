import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureCards from './components/FeatureCards';
import HighVolumeSection from './components/HighVolumeSection';
import SecuritySection from './components/SecuritySection';
import WhyChooseSection from './components/WhyChooseSection';
import FAQSection from './components/FaqSection';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans antialiased selection:bg-teal-900 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <FeatureCards />
        <HighVolumeSection />
        <SecuritySection />
        <WhyChooseSection />
        <FAQSection />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
