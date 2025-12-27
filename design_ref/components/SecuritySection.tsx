import React from 'react';
import { ShieldCheck, Lock, FileCheck, Eye, Cpu, Activity } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const SecuritySection: React.FC = () => {
  return (
    <section className="bg-[#1a1f1e] text-white py-24 px-6">
      <div className="container mx-auto text-center">
        <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Seguridad y cumplimiento de clase mundial</h2>
            <p className="text-gray-400 mb-16">Certificaciones que validan nuestra infraestructura:</p>
        </AnimatedSection>

        {/* Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: "ISO 27001:2022", desc: "Gestión integral de la seguridad de la información.", icon: ShieldCheck },
            { title: "SOC 2 Type II", desc: "Control riguroso sobre datos sensibles en entornos cloud.", icon: FileCheck },
            { title: "PCI DSS v4.0.1", desc: "Cumplimiento para la protección de información de tarjetas.", icon: Lock },
          ].map((item, idx) => (
            <AnimatedSection key={idx} delay={idx * 0.1} className="border border-gray-700/50 bg-[#222625] p-8 rounded-xl flex flex-col items-center hover:border-gray-500 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <item.icon size={32} className="text-white" />
              </div>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </AnimatedSection>
          ))}
        </div>

        {/* Advanced Security Features */}
        <div className="border border-gray-700/50 rounded-2xl p-10 bg-[#222625]/50 backdrop-blur-sm">
            <h3 className="text-xl mb-10 text-gray-200">Protección de nivel bancario impulsada por IA para que tus pagos fluyan con confianza</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                    { title: "Cumplimiento proactivo", desc: "Auditamos cada movimiento con modelos predictivos que superan los estándares globales.", icon: Eye },
                    { title: "Plataforma de decisión dinámica", desc: "Evaluamos cada transacción en milisegundos con inteligencia predictiva.", icon: Cpu },
                    { title: "Monitoreo inteligente 24/7", desc: "Detectamos anomalías en tiempo real y frenamos amenazas al instante.", icon: Activity },
                 ].map((item, idx) => (
                     <div key={idx} className="text-center group">
                         <div className="flex justify-center mb-4">
                            <div className="p-3 bg-teal-900/30 rounded-lg group-hover:bg-teal-800/50 transition-colors">
                                <item.icon className="text-teal-400" size={24} />
                            </div>
                         </div>
                         <h4 className="font-semibold text-sm mb-3">{item.title}</h4>
                         <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                     </div>
                 ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default SecuritySection;
