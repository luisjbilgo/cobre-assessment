import React, { useState, useEffect } from 'react';
import { Menu, ChevronDown, User, Globe } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#111]/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
          <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
            <div className="bg-white rounded-full"></div>
            <div className="bg-white rounded-full"></div>
            <div className="bg-white rounded-full"></div>
            <div className="bg-white/50 rounded-full"></div>
          </div>
          Cobre
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <button className="flex items-center gap-1 hover:text-white transition-colors">Productos <ChevronDown size={14} /></button>
          <button className="flex items-center gap-1 hover:text-white transition-colors">Recursos <ChevronDown size={14} /></button>
          <a href="#" className="hover:text-white transition-colors">Atención al cliente</a>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="flex items-center gap-2 text-white text-sm border border-gray-700 rounded-full px-3 py-1.5 hover:bg-gray-800 transition-colors">
             <span className="text-yellow-500">🇨🇴</span> Col <ChevronDown size={14} />
          </button>
          <button className="text-white text-sm font-medium hover:text-gray-300 transition-colors">
            Iniciar sesión
          </button>
          <button className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
            Comienza hoy
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-white">
          <Menu />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
