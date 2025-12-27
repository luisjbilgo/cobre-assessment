import React from 'react';
import { LayoutGrid, Zap, Clock, Settings } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const WhyChooseSection: React.FC = () => {
  const features = [
    {
      icon: LayoutGrid,
      title: "Plataforma modular y API-first",
      description: "Integra solo lo que necesitas: pagos locales, internacionales y conexión bancaria, todo vía API y con arquitectura flexible."
    },
    {
      icon: Zap,
      title: "Ejecución en tiempo real, 24/7/365",
      description: "Procesa pagos y cobros en minutos, sin importar el banco*, el día o la hora."
    },
    {
      icon: Clock,
      title: "Visibilidad y control centralizados",
      description: "Consulta saldos, movimientos y estados de transacción en una sola plataforma. Actúa con trazabilidad total."
    },
    {
      icon: Settings,
      title: "Automatización operativa de punta a punta",
      description: "Desde la dispersión hasta la conciliación contable, elimina tareas manuales y reduce errores con flujos automatizados."
    }
  ];

  return (
    <section className="bg-[#F8F8F6] py-24 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <AnimatedSection>
                <h2 className="text-4xl font-serif text-[#111] mb-6">¿Por qué <br/> elegir Cobre?</h2>
                <button className="bg-[#111] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors">
                Contacta a ventas
                </button>
            </AnimatedSection>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {features.map((feature, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1}>
                <div className="mb-4 text-gray-600">
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-lg text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
