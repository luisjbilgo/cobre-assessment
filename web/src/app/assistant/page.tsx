"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/layout/SectionShell";
import { clsx } from "clsx";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sql?: string; // To show the generated SQL for "wow" factor
}

const SUGGESTED_QUERIES = [
  "¿Cuál es el corredor con mayor tasa de fallo?",
  "Muestra el volumen total de transacciones por mes",
  "¿Cuántos usuarios Enterprise tienen transacciones fallidas?",
  "Analiza el comportamiento del corredor USD_MXN"
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola. Soy el asistente IA de Cobre. Tengo acceso directo a la base de datos de 50,000 transacciones. ¿Qué te gustaría saber?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, queryOverride?: string) => {
    e?.preventDefault();
    const query = queryOverride || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Error fetching response');

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        sql: data.sql 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, tuve un problema al procesar tu consulta. Por favor intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <SectionShell className="flex-1 flex flex-col py-8">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Bot className="h-8 w-8 text-cobre-accent" />
                Asistente IA SQL
              </h1>
              <p className="text-cobre-light/60">Consulta la base de datos en lenguaje natural.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-cobre-light/40 bg-cobre-dark/50 px-3 py-1 rounded-full border border-cobre-light/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Connected to SQLite DB
            </div>
          </div>

          <Card className="flex-1 flex flex-col bg-cobre-dark/80 backdrop-blur-xl border-cobre-light/10 overflow-hidden min-h-[500px]">
            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6"
            >
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={clsx(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-cobre-accent text-cobre-dark" : "bg-cobre-primary/20 text-cobre-primary"
                  )}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className="space-y-2">
                    <div className={clsx(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-cobre-accent text-cobre-dark rounded-tr-none" 
                        : "bg-white/5 text-cobre-light rounded-tl-none border border-white/5"
                    )}>
                      {msg.content}
                    </div>
                    {msg.sql && (
                      <div className="bg-black/50 p-3 rounded-xl border border-white/5 font-mono text-xs text-green-400 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-1 text-gray-500 uppercase tracking-widest text-[10px]">
                          <Sparkles size={10} /> Generated SQL
                        </div>
                        {msg.sql}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cobre-primary/20 text-cobre-primary flex items-center justify-center shrink-0">
                     <Bot size={16} />
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                    <Loader2 className="animate-spin text-cobre-accent" size={16} />
                    <span className="text-sm text-cobre-light/60">Analizando esquema y generando query...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              {messages.length === 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {SUGGESTED_QUERIES.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSubmit(undefined, q)}
                      className="text-xs bg-cobre-primary/10 hover:bg-cobre-primary/20 text-cobre-primary px-3 py-1.5 rounded-full transition-colors border border-cobre-primary/20"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              
              <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta sobre los datos..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cobre-accent/50 focus:border-transparent transition-all"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl w-12 h-12 flex items-center justify-center p-0"
                >
                  <Send size={20} />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </SectionShell>
    </div>
  );
}

