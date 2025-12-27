"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign, Search, Target, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SectionShell } from "@/components/layout/SectionShell";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function InsightsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111111]">
      <SectionShell>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {/* Header Section */}
          <div className="text-center max-w-4xl mx-auto space-y-6 pt-10">
            <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
               <span>Análisis Estratégico Q3-Q4 2025</span>
            </motion.div>
            <motion.h1 variants={item} className="text-4xl md:text-6xl font-medium text-white leading-tight">
              Optimización de Corredores de Pago
            </motion.h1>
            <motion.p variants={item} className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Diagnóstico de 50,000 transacciones para recuperar $360k anuales y blindar el segmento Enterprise.
            </motion.p>
          </div>

          {/* Key Metrics Grid - High Impact */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <AlertTriangle className="w-16 h-16 text-red-500" />
               </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-red-400 text-xs font-medium uppercase tracking-widest">Fallo Crítico</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-medium text-white tracking-tight">18.3%</div>
                <p className="text-sm text-red-300/70 mt-2 font-light">Tasa de fallo USD→MXN<br/>(vs 5% baseline)</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-white/5 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <DollarSign className="w-16 h-16 text-white" />
               </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-gray-400 text-xs font-medium uppercase tracking-widest">Impacto Financiero</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-medium text-white tracking-tight">$360k</div>
                <p className="text-sm text-gray-500 mt-2 font-light">Pérdida anual proyectada<br/>en comisiones</p>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-white/5 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Briefcase className="w-16 h-16 text-white" />
               </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-gray-400 text-xs font-medium uppercase tracking-widest">Segmento Afectado</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-medium text-white tracking-tight">Enterprise</div>
                <p className="text-sm text-gray-500 mt-2 font-light">23.9% Tasa de rechazo<br/>en clientes VIP</p>
              </CardContent>
            </Card>

            <Card className="bg-emerald-500/5 border-emerald-500/20 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Target className="w-16 h-16 text-emerald-500" />
               </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-emerald-400 text-xs font-medium uppercase tracking-widest">Oportunidad</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-medium text-white tracking-tight">7.2x</div>
                <p className="text-sm text-emerald-300/70 mt-2 font-light">ROI proyectado<br/>(Payback en 1.7 meses)</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Deep Dive Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Root Cause Analysis */}
            <motion.div variants={item} className="space-y-6">
                <h2 className="text-2xl font-medium text-white flex items-center gap-3">
                    <Search className="w-6 h-6 text-gray-400" />
                    Diagnóstico de Causa Raíz
                </h2>
                <Card className="h-full bg-[#1A1A1A] border-white/5 hover:border-white/10 transition-colors">
                    <CardContent className="p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-medium text-white mb-3">El Problema: Fricción Regulatoria</h3>
                            <p className="text-gray-400 font-light leading-relaxed">
                                No es un fallo técnico ni de infraestructura. Los datos aíslan el problema en la interoperabilidad bancaria en México. Las transacciones <strong>mayores a $10,000 USD</strong> activan protocolos de revisión manual (AML/KYC) en los bancos receptores que son incompatibles con la promesa de "pagos inmediatos".
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Evidencia de Datos</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-2xl font-medium text-white mb-1">23.4%</div>
                                    <div className="text-xs text-gray-500">Tasa de fallo en Txns &gt;$10k</div>
                                </div>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="text-2xl font-medium text-white mb-1">5.1%</div>
                                    <div className="text-xs text-gray-500">Tasa de fallo en Colombia (Control)</div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 italic">
                                *La discrepancia con Colombia confirma que el problema es específico del destino México, no de la plataforma Cobre.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Strategic Plan */}
            <motion.div variants={item} className="space-y-6">
                <h2 className="text-2xl font-medium text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-gray-400" />
                    Plan de Acción: "Fix & Grow"
                </h2>
                <Card className="h-full bg-gradient-to-br from-[#1A1A1A] to-[#222] border-white/5 hover:border-white/10 transition-colors">
                     <CardContent className="p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-medium text-white mb-3">Estrategia Recomendada</h3>
                            <p className="text-gray-400 font-light leading-relaxed">
                                Recomendamos detener experimentos secundarios y centrar el Q1 2026 en la optimización operativa de USD→MXN. El objetivo es reducir la tasa de fallos al 7% en 6 meses.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Tácticas de Implementación</h4>
                            
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium text-white">1</div>
                                    <div>
                                        <h5 className="text-white font-medium text-sm">Negociación de SLA (Meses 1-2)</h5>
                                        <p className="text-sm text-gray-500 font-light mt-1">Establecer "carril rápido" con bancos para txns &gt;$10k.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium text-white">2</div>
                                    <div>
                                        <h5 className="text-white font-medium text-sm">Pre-validación KYC (Meses 2-3)</h5>
                                        <p className="text-sm text-gray-500 font-light mt-1">Validar cuentas Enterprise antes de la transacción para evitar rechazos en tiempo real.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium text-white">3</div>
                                    <div>
                                        <h5 className="text-white font-medium text-sm">Soporte "Guante Blanco"</h5>
                                        <p className="text-sm text-gray-500 font-light mt-1">Atención proactiva inmediata para fallos en segmento Enterprise.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
          </div>

          {/* Success Metrics */}
          <motion.div variants={item} className="bg-[#1A1A1A] rounded-3xl p-8 border border-white/5">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-xl font-medium text-white mb-2">Métricas de Éxito (6 Meses)</h3>
                    <p className="text-gray-400 font-light text-sm max-w-md">
                        Así mediremos el impacto de la estrategia de optimización una vez implementada en producción.
                    </p>
                </div>
                
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
                     <div className="flex flex-col items-center p-4 bg-black/20 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider mb-2">Tasa de Fallo</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-red-400 text-sm line-through">18.3%</span>
                            <ArrowRight className="w-3 h-3 text-gray-600" />
                            <span className="text-emerald-400 font-bold text-xl">&lt;7%</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-center p-4 bg-black/20 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider mb-2">Recuperación Mensual</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-gray-600 text-sm">$0</span>
                            <ArrowRight className="w-3 h-3 text-gray-600" />
                            <span className="text-emerald-400 font-bold text-xl">$30,000</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-center p-4 bg-black/20 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider mb-2">NPS Enterprise</span>
                         <div className="flex items-baseline gap-2">
                            <span className="text-emerald-400 font-bold text-xl">+15 pts</span>
                        </div>
                     </div>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </SectionShell>
    </div>
  );
}

// Helper icon component for metrics
function ArrowRight({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
