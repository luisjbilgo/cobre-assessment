import React from 'react';
import { Linkedin, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D2425] text-white pt-24 pb-12 px-6 -mt-12">
      <div className="container mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between mb-20 gap-10">
          <div className="md:w-1/3">
             <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-6">
                <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                    <div className="bg-white rounded-full"></div>
                    <div className="bg-white rounded-full"></div>
                    <div className="bg-white rounded-full"></div>
                    <div className="bg-white/50 rounded-full"></div>
                </div>
                Cobre
            </div>
            <p className="text-sm font-bold mb-2">Suscríbete a nuestro newsletter</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Recibe novedades de productos y consejos de expertos directamente en tu bandeja de entrada.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 text-[11px] text-gray-300">
            <div className="flex flex-col gap-3">
              <span className="text-teal-500 font-bold mb-2">Home</span>
              <a href="#" className="hover:text-white">Blog</a>
              <a href="#" className="hover:text-white">Atención al cliente</a>
              <a href="#" className="hover:text-white">Portal Empresarial</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-gray-500 font-bold mb-2">Productos</span>
              <a href="#" className="hover:text-white">Local Payments</a>
              <a href="#" className="hover:text-white">Cross Border Payments</a>
              <a href="#" className="hover:text-white">Connect</a>
              <a href="#" className="hover:text-white">Bre-B para empresas</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-gray-500 font-bold mb-2">Sobre Nosotros</span>
              <a href="#" className="hover:text-white">Nosotros</a>
              <a href="#" className="hover:text-white">Cobre jobs</a>
              <a href="#" className="hover:text-white">Ética Cobre</a>
              <a href="#" className="hover:text-white">Noticias</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500">
          <div className="flex items-center gap-2">
            <span>🇨🇴 Col</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#">Políticas de privacidad</a>
            <span>© 2025 Cobre / All rights reserved.</span>
            <a href="#">Términos y condiciones</a>
          </div>

          <div className="flex gap-4 text-white">
            <Linkedin size={16} />
            <Youtube size={16} />
            <Twitter size={16} />
            <Instagram size={16} />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
