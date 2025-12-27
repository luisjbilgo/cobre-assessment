"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SectionShell } from "@/components/layout/SectionShell";
import { Loader2, Filter, Download, RefreshCcw, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

// Data Interfaces
interface CorridorMetric {
  corridor: string;
  total_transactions: number;
  successful: number;
  failed: number;
  failure_rate: number;
  avg_amount: number;
  revenue_usd: number;
}

interface SegmentMetric {
  user_segment: string;
  failure_rate: number;
  avg_amount: number;
  total_transactions: number;
}

interface TrendMetric {
  transaction_date: string;
  txn_count: number;
  failure_rate: number;
  successful: number;
  failed: number;
}

interface AmountMetric {
  amount_bracket: string;
  txn_count: number;
  failure_rate: number;
  avg_amount: number;
}

export default function DashboardPage() {
  // State
  const [loading, setLoading] = useState(true);
  const [corridorData, setCorridorData] = useState<CorridorMetric[]>([]);
  const [segmentData, setSegmentData] = useState<SegmentMetric[]>([]);
  const [trendData, setTrendData] = useState<TrendMetric[]>([]);
  const [amountData, setAmountData] = useState<AmountMetric[]>([]);
  
  // Filters
  const [selectedCorridor, setSelectedCorridor] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("all");
  const [showCorridorFilter, setShowCorridorFilter] = useState(false);

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const [corridors, segments, trend, amounts] = await Promise.all([
          fetch('/data/corridor_performance.json').then(r => r.json()),
          fetch('/data/user_segments.json').then(r => r.json()),
          fetch('/data/daily_trend.json').then(r => r.json()),
          fetch('/data/amount_distribution.json').then(r => r.json())
        ]);
        
        setCorridorData(corridors);
        setSegmentData(segments);
        setTrendData(trend); 
        setAmountData(amounts);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Logic
  const filteredTrendData = trendData.filter(d => {
    if (timeRange === "7d") return new Date(d.transaction_date) >= new Date("2025-12-23"); // Mock date logic
    if (timeRange === "30d") return new Date(d.transaction_date) >= new Date("2025-12-01");
    return true;
  });

  const activeCorridorData = selectedCorridor === "all" 
    ? corridorData 
    : corridorData.filter(c => c.corridor === selectedCorridor);

  const totalVolume = activeCorridorData.reduce((acc, curr) => acc + (curr.total_transactions || 0), 0);
  const avgFailureRate = (activeCorridorData.reduce((acc, curr) => acc + (curr.failed || 0), 0) / totalVolume * 100) || 0;
  const totalRevenue = activeCorridorData.reduce((acc, curr) => acc + (curr.revenue_usd || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const COLORS = {
    primary: "#ffffff",
    secondary: "#333333",
    accent: "#266d6c", // Teal/Aquamarine from Cobre
    danger: "#ef4444",
    success: "#10b981",
    grid: "#333333"
  };

  const PIE_COLORS = {
    enterprise: "#ffffff", // Primary white
    sme: "#266d6c", // Cobre Teal
    retail: "#333333" // Dark Gray
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#111] text-white">
      <SectionShell>
        <div className="space-y-8">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative">
            <div>
              <h1 className="text-3xl font-medium text-white mb-1">Panel de Control</h1>
              <p className="text-gray-400 font-light text-sm">Visión general del rendimiento transaccional.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Corridor Filter Dropdown (Hidden by default, toggled by Filter button) */}
              {showCorridorFilter && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 z-50 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl p-2 w-48"
                >
                  <div className="text-xs text-gray-500 font-medium px-2 py-1 mb-1">Filtrar por Corredor</div>
                  <button 
                    onClick={() => { setSelectedCorridor("all"); setShowCorridorFilter(false); }}
                    className={clsx("w-full text-left px-2 py-1.5 rounded text-sm transition-colors", selectedCorridor === "all" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}
                  >
                    Todos
                  </button>
                  {corridorData.map(c => (
                    <button 
                      key={c.corridor}
                      onClick={() => { setSelectedCorridor(c.corridor); setShowCorridorFilter(false); }}
                      className={clsx("w-full text-left px-2 py-1.5 rounded text-sm transition-colors", selectedCorridor === c.corridor ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white")}
                    >
                      {c.corridor}
                    </button>
                  ))}
                </motion.div>
              )}

              <div className="flex items-center bg-[#1A1A1A] rounded-lg p-1 border border-white/10">
                <button 
                  onClick={() => setTimeRange("all")}
                  className={clsx("px-3 py-1.5 text-xs font-medium rounded-md transition-all", timeRange === "all" ? "bg-white text-black" : "text-gray-400 hover:text-white")}
                >
                  Todo
                </button>
                <button 
                  onClick={() => setTimeRange("30d")}
                  className={clsx("px-3 py-1.5 text-xs font-medium rounded-md transition-all", timeRange === "30d" ? "bg-white text-black" : "text-gray-400 hover:text-white")}
                >
                  30D
                </button>
                <button 
                  onClick={() => setTimeRange("7d")}
                  className={clsx("px-3 py-1.5 text-xs font-medium rounded-md transition-all", timeRange === "7d" ? "bg-white text-black" : "text-gray-400 hover:text-white")}
                >
                  7D
                </button>
              </div>

              <button 
                onClick={() => setShowCorridorFilter(!showCorridorFilter)}
                className={clsx("p-2 border rounded-lg transition-colors flex items-center gap-2", showCorridorFilter || selectedCorridor !== "all" ? "bg-white text-black border-white" : "bg-[#1A1A1A] border-white/10 text-gray-400 hover:text-white hover:bg-white/5")}
              >
                <Filter size={16} />
                {selectedCorridor !== "all" && <span className="text-xs font-medium max-w-[60px] truncate">{selectedCorridor}</span>}
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardContent className="p-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Volumen Total</div>
                <div className="text-3xl font-medium text-white">{totalVolume.toLocaleString()}</div>
                <div className="text-emerald-500 text-xs mt-2 flex items-center gap-1">
                  ↑ 12% <span className="text-gray-500">vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardContent className="p-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Tasa de Fallo Promedio</div>
                <div className="text-3xl font-medium text-white">{avgFailureRate.toFixed(1)}%</div>
                <div className={clsx("text-xs mt-2 flex items-center gap-1", avgFailureRate > 5 ? "text-red-500" : "text-emerald-500")}>
                  {avgFailureRate > 5 ? "↑ Sobre objetivo (5%)" : "↓ En objetivo"}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardContent className="p-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Ingresos Estimados</div>
                <div className="text-3xl font-medium text-white">${totalRevenue.toLocaleString()}</div>
                <div className="text-gray-500 text-xs mt-2">
                  Basado en comisiones del 0.5%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Trend Chart */}
            <Card className="lg:col-span-2 bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white font-medium">Volumen de Transacciones</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredTrendData}>
                    <defs>
                      <linearGradient id="colorTxn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis 
                      dataKey="transaction_date" 
                      stroke="#666" 
                      tick={{fill: '#666', fontSize: 12}}
                      tickFormatter={(val) => val.slice(5)} 
                      minTickGap={30}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#666" 
                      tick={{fill: '#666', fontSize: 12}}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="txn_count" 
                      stroke={COLORS.accent} 
                      fillOpacity={1} 
                      fill="url(#colorTxn)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Segment Pie Chart */}
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white font-medium">Distribución por Segmento</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="total_transactions"
                      nameKey="user_segment"
                    >
                      {segmentData.map((entry, index) => {
                        const segmentKey = entry.user_segment.toLowerCase() as keyof typeof PIE_COLORS;
                        return <Cell key={`cell-${index}`} fill={PIE_COLORS[segmentKey] || COLORS.secondary} />;
                      })}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                       itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                   <div className="text-center">
                      <span className="block text-2xl font-bold text-white">{segmentData.length}</span>
                      <span className="text-xs text-gray-500">Segmentos</span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             
             {/* Corridor Performance Bar Chart */}
             <Card className="bg-[#1A1A1A] border-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white font-medium">Rendimiento por Corredor</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={corridorData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
                    <XAxis type="number" stroke="#666" tick={{fontSize: 10}} />
                    <YAxis dataKey="corridor" type="category" stroke="#fff" width={80} tick={{fontSize: 11}} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                    />
                    <Bar dataKey="successful" stackId="a" fill={COLORS.accent} radius={[0, 4, 4, 0]} name="Exitosas" />
                    <Bar dataKey="failed" stackId="a" fill={COLORS.danger} radius={[0, 4, 4, 0]} name="Fallidas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Amount Distribution & Failure Rate (Composed Chart) */}
            <Card className="bg-[#1A1A1A] border-white/5">
              <CardHeader>
                <CardTitle className="text-white font-medium">Distribución por Monto y Tasa de Fallo</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={amountData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="amount_bracket" stroke="#666" tick={{fontSize: 11}} />
                    <YAxis yAxisId="left" stroke="#666" tick={{fontSize: 11}} label={{ value: 'Transacciones', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" stroke={COLORS.danger} tick={{fontSize: 11}} label={{ value: 'Fallo %', angle: 90, position: 'insideRight', fill: COLORS.danger, fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                    />
                    <Bar yAxisId="left" dataKey="txn_count" name="Volumen" fill={COLORS.accent} radius={[4, 4, 0, 0]} barSize={40} fillOpacity={0.8} />
                    <Line yAxisId="right" type="monotone" dataKey="failure_rate" name="Fallo %" stroke={COLORS.danger} strokeWidth={2} dot={{ r: 4, fill: COLORS.danger, strokeWidth: 2, stroke: '#111' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        </div>
      </SectionShell>
    </div>
  );
}
