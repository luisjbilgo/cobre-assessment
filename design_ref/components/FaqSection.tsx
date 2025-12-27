import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "¿Qué es Cobre Connect?", a: "Cobre Connect es nuestra solución integral que centraliza tus operaciones bancarias, permitiéndote ver saldos y realizar movimientos desde una sola interfaz." },
    { q: "¿Cuáles son los bancos aliados de Cobre?", a: "Trabajamos con las principales instituciones financieras de la región, incluyendo Bancolombia, BBVA, y muchos más." },
    { q: "¿Para qué tipo de empresas está pensado Cobre Connect?", a: "Está diseñado para empresas con alto volumen transaccional que requieren agilidad, control y seguridad en sus operaciones financieras." },
    { q: "¿Qué beneficios ofrece Cobre Connect para los equipos financieros?", a: "Automatización de conciliación, reportes en tiempo real, reducción de errores manuales y ahorro significativo de tiempo operativo." },
    { q: "¿Cómo se conecta Cobre Connect con los bancos en Colombia?", a: "Utilizamos conexiones directas y seguras (APIs) cumpliendo con todos los estándares de seguridad bancaria." },
    { q: "¿Es seguro usar Cobre Connect para manejar información bancaria?", a: "Absolutamente. Contamos con certificaciones ISO 27001, SOC 2 y PCI DSS para garantizar la máxima seguridad." }
  ];

  return (
    <section className="bg-[#F8F8F6] py-20 px-6 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col items-start mb-12">
            <h2 className="text-3xl font-serif text-[#111]">Preguntas frecuentes</h2>
            <button className="text-gray-500 text-xs mt-2 underline">Expandir todas</button>
        </div>

        <div className="max-w-4xl">
          {faqs.map((faq, idx) => (
            <AnimatedSection key={idx} delay={idx * 0.05} className="border-b border-gray-300">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center py-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm md:text-base font-medium text-gray-700">{faq.q}</span>
                <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
