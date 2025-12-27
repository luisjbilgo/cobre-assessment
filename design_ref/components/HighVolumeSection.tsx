import React from 'react';
import { ArrowRight, Globe, Layers, ShieldCheck, Code2 } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const HighVolumeSection: React.FC = () => {
  return (
    <section className="bg-[#F8F8F6] py-24 px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <AnimatedSection className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-serif text-[#111] mb-6 leading-tight">
              Para empresas con alto <br/> volumen transaccional
            </h2>
            <p className="text-gray-600 mb-10">
              Diseñado para Fintechs con licencia, PSPs, Bancos y empresas que necesitan:
            </p>

            <div className="space-y-6">
              {[
                { icon: Globe, text: "Mover dinero dentro y fuera de su país." },
                { icon: Layers, text: "Centralizar cuentas, pagos y conciliación en un solo sistema." },
                { icon: ShieldCheck, text: "Garantizar velocidad, trazabilidad y control en cada operación." },
                { icon: Code2, text: "Integrar vía API o gestionar a través de una plataforma intuitiva." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border-b border-gray-200 hover:bg-white hover:shadow-sm rounded-lg transition-all duration-300">
                  <div className="mt-1 text-gray-400 bg-gray-100 p-2 rounded-md">
                    <item.icon size={18} />
                  </div>
                  <p className="text-gray-700 text-sm mt-2">{item.text}</p>
                </div>
              ))}
            </div>

            <button className="mt-10 bg-[#111] text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-black transition-colors">
              Contacta a ventas <ArrowRight size={16} />
            </button>
          </AnimatedSection>

          {/* Floating UI Card - "Movimientos" */}
          <AnimatedSection delay={0.2} className="lg:w-1/2 relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/50 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/50 rounded-full blur-3xl"></div>
             
             <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 relative z-10 max-w-md mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Movimientos</h3>
                  <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                </div>
                
                <div className="w-full">
                  <div className="grid grid-cols-3 text-[10px] text-gray-400 font-semibold mb-4 uppercase tracking-wider">
                    <div>Monto</div>
                    <div className="text-center">Estado</div>
                    <div className="text-right">Tipo</div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { amount: "10,000.00 USD", status: "Completado", type: "Internacional", statusColor: "text-green-600 bg-green-50" },
                      { amount: "54,000,000.00 COP", status: "Iniciado", type: "ACH", statusColor: "text-blue-600 bg-blue-50" },
                      { amount: "4,000,000.00 MXN", status: "Por aprobar", type: "SPEI", statusColor: "text-yellow-600 bg-yellow-50" },
                      { amount: "400,000,000.00 MXN", status: "Procesando", type: "Programación", statusColor: "text-purple-600 bg-purple-50" },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-3 items-center py-2 border-b border-gray-50 last:border-0">
                        <div className="text-xs font-medium text-gray-700">{row.amount}</div>
                        <div className="flex justify-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${row.statusColor}`}>{row.status}</span>
                        </div>
                        <div className="text-xs text-gray-500 text-right">{row.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};

export default HighVolumeSection;
