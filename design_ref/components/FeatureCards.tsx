import React from 'react';
import { ArrowRight, Globe, Zap, Network } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const FeatureCards: React.FC = () => {
  return (
    <section className="bg-[#111111] pb-24 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Full Width */}
          <AnimatedSection className="col-span-1 md:col-span-2 bg-[#1A1A1A] rounded-3xl p-8 md:p-12 overflow-hidden relative min-h-[400px] flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10 mb-8 md:mb-0">
              <span className="text-xs font-semibold text-gray-400 border border-gray-700 px-3 py-1 rounded-full mb-6 inline-block">Popular</span>
              <h3 className="text-3xl md:text-4xl text-white font-medium mb-4">Cross Border Payments</h3>
              <p className="text-gray-400 mb-6 font-light">Pagos internacionales en minutos, no días</p>
              <ul className="text-gray-500 text-sm space-y-2 mb-8">
                <li>• Mueve USD, COP, MXN, CNY y más con 40% menos costos.</li>
                <li>• Opera 24/7 sin ventanas cambiarias ni profundos.</li>
                <li>• Fondos disponibles el mismo día con trazabilidad total.</li>
              </ul>
              <button className="bg-white text-black text-sm px-5 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors">
                Conoce más <ArrowRight size={14} />
              </button>
            </div>
            
            {/* Abstract UI Mockup */}
            <div className="md:w-1/2 w-full relative">
                <div className="bg-[#222] border border-gray-800 rounded-xl p-4 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                        <span className="text-gray-300 text-xs font-medium">Pago Internacional</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 w-1/3 bg-gray-700 rounded"></div>
                        <div className="flex justify-between items-center bg-[#111] p-2 rounded">
                            <div className="text-white text-sm">$ 10,000 USD</div>
                            <ArrowRight size={12} className="text-gray-500"/>
                            <div className="text-white text-sm">$ 42,000,000 COP</div>
                        </div>
                        <div className="h-8 w-full bg-white text-black text-xs font-bold rounded flex items-center justify-center">Continuar</div>
                    </div>
                </div>
                {/* Code snippet decoration */}
                <div className="absolute -top-10 -left-10 bg-black/80 backdrop-blur text-green-400 font-mono text-xs p-3 rounded-lg border border-gray-800 shadow-xl hidden md:block">
                    {`{ "currency-pair": "USD-COP" }`}
                </div>
            </div>
          </AnimatedSection>

          {/* Card 2: Local Payments */}
          <AnimatedSection delay={0.2} className="bg-[#1A1A1A] rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[400px]">
             <h3 className="text-3xl text-white font-medium mb-2">Local Payments</h3>
             <p className="text-gray-400 text-sm mb-6">Pagos inmediatos 24/7 en Colombia</p>
             <ul className="text-gray-500 text-xs space-y-2 mb-8">
                <li>• Accede al 100% de las cuentas en Colombia.</li>
                <li>• Liquidez inmediata, sin límites de monto ni horario.</li>
                <li>• Pagos Bre-B para empresas en 20 segundos. <span className="bg-gray-800 text-white px-1 rounded text-[10px]">Nuevo</span></li>
              </ul>
              
              {/* Progress Bar UI */}
              <div className="bg-[#222] border border-gray-800 rounded-xl p-6 mt-4">
                 <div className="flex justify-between text-gray-400 text-xs mb-2">
                    <span>Procesando</span>
                    <span>100%</span>
                 </div>
                 <div className="flex gap-1 mb-2">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className={`h-8 flex-1 rounded-sm ${i < 18 ? 'bg-gray-400' : 'bg-gray-800'} animate-pulse`} style={{animationDelay: `${i * 0.05}s`}}></div>
                    ))}
                 </div>
                 <div className="flex justify-between items-center text-white text-sm font-medium">
                    <span>Instantáneo</span>
                    <span>0s</span>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8">
                <button className="bg-white text-black text-sm px-5 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    Conoce más <ArrowRight size={14} />
                </button>
              </div>
          </AnimatedSection>

          {/* Card 3: Connect */}
          <AnimatedSection delay={0.3} className="bg-[#1A1A1A] rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[400px]">
             <h3 className="text-3xl text-white font-medium mb-2">Connect</h3>
             <p className="text-gray-400 text-sm mb-6">Todos tus bancos en una sola plataforma</p>
             <ul className="text-gray-500 text-xs space-y-2 mb-8">
                <li>• Inicia pagos en Bancolombia, BBVA, Occidente o Bogotá sin cambiar de portal.</li>
                <li>• Consulta saldos y movimientos en tiempo real.</li>
                <li>• Automatiza conciliación y reportes.</li>
              </ul>

              {/* Bank Cards UI */}
              <div className="flex -space-x-4 mt-8 px-4">
                 <div className="w-40 h-24 bg-gradient-to-br from-gray-800 to-black rounded-lg border border-gray-700 shadow-lg transform -rotate-6 flex items-center justify-center text-gray-500 text-xs">
                    •••• 5678
                 </div>
                 <div className="w-40 h-24 bg-[#2a2a2a] rounded-lg border border-gray-600 shadow-xl transform rotate-3 flex flex-col justify-between p-3 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                        <span className="text-white text-[10px] font-bold">Banco de Bogotá</span>
                    </div>
                    <div className="text-white text-sm font-mono">$42,000,000</div>
                    <div className="text-[8px] text-yellow-500 bg-yellow-500/10 self-start px-1 rounded">Por aprobar</div>
                 </div>
              </div>

              <div className="absolute bottom-8 left-8">
                <button className="bg-white text-black text-sm px-5 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    Conoce más <ArrowRight size={14} />
                </button>
              </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
