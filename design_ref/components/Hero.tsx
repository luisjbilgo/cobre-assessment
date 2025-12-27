import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { FadeIn, AnimatedSection } from './AnimatedSection';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-[#111111] text-white pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Background Abstract Lines - CSS approximation of the design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full border border-white/5 opacity-20"></div>
        <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full border border-white/5 opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full border border-white/5 opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent via-[#111]/50 to-[#111]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-gray-300 mb-8">
                <span>Pagos empresariales Bre-B | Únete a las más de 50 empresas que ya están usándolo</span>
                <span className="bg-[#2D2D2D] px-2 py-0.5 rounded text-white">Agenda una Demo</span>
            </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            Pagos empresariales inmediatos <br /> en Latinoamérica
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Centraliza tu operación local e internacional en una sola plataforma.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition-all">
              Comienza hoy <ArrowRight size={16} />
            </button>
            <button className="text-white border border-gray-600 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white/5 transition-all">
              Agenda una Demo <ArrowRight size={16} />
            </button>
          </div>
        </AnimatedSection>

        <FadeIn delay={0.4} className="border-t border-white/10 pt-10">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Using text for logos to avoid broken images, styled to look like logos */}
             <span className="font-bold text-xl tracking-tighter">Thunes.</span>
             <span className="font-bold text-xl tracking-widest italic font-serif">CEMEX</span>
             <span className="font-bold text-xl">skandia</span>
             <span className="font-bold text-xl tracking-tight text-purple-400">cabify</span>
             <span className="font-bold text-xl flex items-center gap-1"><div className="w-2 h-2 bg-white rounded-full"></div>Telefonica</span>
             <span className="font-bold text-2xl tracking-tighter text-red-500">BDO</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;
