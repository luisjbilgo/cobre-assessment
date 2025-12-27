import React from 'react';
import { Counter } from './Counter';
import { AnimatedSection } from './AnimatedSection';

const ContactSection: React.FC = () => {
  return (
    <section className="bg-[#F8F8F6] pb-24 px-6 relative z-10">
      <div className="container mx-auto">
        <AnimatedSection className="bg-[#222222] rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row gap-16 text-white shadow-2xl">
          
          {/* Left: Text and Counting Stats */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                Hablemos sobre <br/> cómo optimizar <br/> tus pagos
              </h2>
              <p className="text-gray-400 text-sm mb-12">
                Completa el formulario y te contactaremos en menos de 24 horas hábiles.
              </p>
            </div>

            <div className="space-y-8 mt-auto">
              <div className="flex items-center gap-6">
                <div className="text-4xl font-bold text-teal-400 w-24">
                  <Counter end={3} prefix="+" suffix="x" />
                </div>
                <div className="text-xs text-gray-400 max-w-[200px]">
                  más rápido el procesamiento de pagos.
                </div>
              </div>
              <div className="w-full h-px bg-gray-800"></div>
              <div className="flex items-center gap-6">
                <div className="text-4xl font-bold text-teal-400 w-24">
                  <Counter end={56} prefix="-" suffix="%" />
                </div>
                <div className="text-xs text-gray-400 max-w-[200px]">
                  de errores transaccionales con las APIs de Cobre.
                </div>
              </div>
              <div className="w-full h-px bg-gray-800"></div>
              <div className="flex items-center gap-6">
                <div className="text-4xl font-bold text-teal-400 w-24">
                   <Counter end={50} prefix="-" suffix="h" />
                </div>
                <div className="text-xs text-gray-400 max-w-[200px]">
                  mensuales dedicadas a conciliación, ahora automatizadas.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:w-1/2 bg-[#F8F8F6] rounded-xl p-8 md:p-10 text-gray-800">
             <form className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <input type="text" placeholder="Nombre" className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-xs outline-none focus:border-black" />
                 <input type="text" placeholder="Apellido" className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-xs outline-none focus:border-black" />
               </div>
               
               <div className="relative">
                 <span className="absolute left-3 top-3 text-xs text-gray-500 flex items-center gap-1">🇨🇴 +57</span>
                 <input type="tel" placeholder="Número Celular" className="w-full bg-white border border-gray-300 rounded pl-20 pr-4 py-3 text-xs outline-none focus:border-black" />
               </div>

               <input type="email" placeholder="Correo empresarial" className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-xs outline-none focus:border-black" />
               
               <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nombre de la empresa" className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-xs outline-none focus:border-black" />
                  <input type="text" placeholder="Sitio web de la empresa" className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-xs outline-none focus:border-black" />
               </div>

               <select className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-xs outline-none focus:border-black text-gray-500">
                 <option>¿Cómo nos conociste?</option>
                 <option>Linkedin</option>
                 <option>Búsqueda en Google</option>
                 <option>Referido</option>
               </select>

               <div className="flex items-start gap-2 pt-2">
                 <input type="checkbox" id="terms" className="mt-1" />
                 <label htmlFor="terms" className="text-[10px] text-gray-500 leading-tight">
                   He leído y acepto las <a href="#" className="underline">políticas de privacidad</a>
                 </label>
               </div>

               <button type="submit" className="w-full bg-[#CCCCCC] text-gray-600 font-bold py-3 rounded-full mt-4 hover:bg-gray-400 hover:text-white transition-colors">
                 Contacta a ventas
               </button>

             </form>
          </div>

        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactSection;
