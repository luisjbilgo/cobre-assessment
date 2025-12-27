import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const Testimonials: React.FC = () => {
  return (
    <section className="bg-[#F8F8F6] py-24 px-6">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[#111]">Más de 250 empresas líderes confían en Cobre</h2>
        </AnimatedSection>

        <div className="relative">
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar justify-center">
            
            {/* Card 1 */}
            <div className="min-w-[300px] md:w-[350px] bg-white p-8 rounded-xl shadow-sm snap-center">
              <div className="h-8 mb-6 font-bold text-xl tracking-tight text-purple-600">cabify</div>
              <p className="text-xs text-gray-500 leading-relaxed mb-8">
                "Nuestra alianza con Cobre no solo amplifica la propuesta de valor que ofrecemos a nuestros conductores en Cabify, sino que también refleja el compromiso conjunto de brindar soluciones financieras."
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/100/100?random=1" alt="Avatar" className="w-full h-full object-cover grayscale" />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-gray-900">Gabriel Schlesinger</div>
                    <div className="text-[10px] text-gray-500">Country Manager<br/>Cabify Colombia</div>
                 </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[300px] md:w-[350px] bg-white p-8 rounded-xl shadow-sm snap-center border-l-4 border-red-500">
               <div className="h-8 mb-6 font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 bg-red-500 rounded"></div>YANGO GROUP</div>
              <p className="text-xs text-gray-500 leading-relaxed mb-8">
                "Cobre helped Yango to create a seamless and realtime payouts experience for drivers and couriers and reduce transactional cost by 20%."
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/100/100?random=2" alt="Avatar" className="w-full h-full object-cover grayscale" />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-gray-900">Nikita Skublo</div>
                    <div className="text-[10px] text-gray-500">Operational Excellence<br/>Lead at Yango</div>
                 </div>
              </div>
            </div>

             {/* Card 3 */}
             <div className="min-w-[300px] md:w-[350px] bg-white p-8 rounded-xl shadow-sm snap-center">
               <div className="h-8 mb-6 font-bold text-xl flex items-center gap-1"><div className="w-4 h-4 bg-blue-600 rounded-full"></div>Telefónica</div>
              <p className="text-xs text-gray-500 leading-relaxed mb-8">
                "La inmediatez es hoy un factor clave para la competitividad de las empresas. De la mano de Cobre, y gracias a la infraestructura de Bre-B, avanzamos en nuestro compromiso."
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/100/100?random=3" alt="Avatar" className="w-full h-full object-cover grayscale" />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-gray-900">Fabián Hernández</div>
                    <div className="text-[10px] text-gray-500">CEO de Telefónica Movistar</div>
                 </div>
              </div>
            </div>

          </div>
          
          {/* Nav Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-black hidden md:flex">
             <ArrowLeft size={16} />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#111] w-10 h-10 rounded-full shadow-md flex items-center justify-center text-white hover:bg-black hidden md:flex">
             <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
