import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Sparkles, CheckCircle2, AlertTriangle, XCircle, 
  Terminal, ArrowRight, ShieldAlert, RefreshCw, Cpu,
  Sliders, ShieldCheck, Zap, Receipt, Copy, Check
} from 'lucide-react';
import { AgentTraceResult, AgentStep } from '../types';

const PRESET_INTENTS = [
  {
    title: "Instant Purchase Flow",
    intent: "Buy a wireless mouse under ₹1000",
    desc: "Discovers Logitech M330 (₹799) & captures Razorpay payment autonomously.",
    tag: "HAPPY PATH",
    tagColor: "bg-[#10B981] text-black"
  },
  {
    title: "Algorithmic Price Bargaining",
    intent: "Negotiate and buy Anker 5-in-1 USB-C Hub Adapter",
    desc: "Applies merchant bounded discount formula (80% floor & midpoint counter).",
    tag: "BARGAINING",
    tagColor: "bg-[#C4B5FD] text-black"
  },
  {
    title: "₹1,000 Safety Gate Intervention",
    intent: "Buy Keychron K2 Mechanical Keyboard",
    desc: "Attempts purchase of ₹4,499 item — intercepted & blocked by guardrail.",
    tag: "SECURITY GATE",
    tagColor: "bg-[#FF6B6B] text-white"
  },
  {
    title: "Decline & Graceful Fallback",
    intent: "Buy braided fast charging cable and simulate failure recovery",
    desc: "Handles card decline and auto-recovers via secondary UPI rails.",
    tag: "FAULT TOLERANCE",
    tagColor: "bg-[#38BDF8] text-black"
  }
];

export const AgentPlayground: React.FC = () => {
  const [intent, setIntent] = useState('');
  const [modelProvider, setModelProvider] = useState<'gemini' | 'claude' | 'simulation'>('gemini');
  const [isRunning, setIsRunning] = useState(false);
  const [traceResult, setTraceResult] = useState<AgentTraceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleRunAgent = async (intentToRun?: string) => {
    const targetIntent = intentToRun || intent;
    if (!targetIntent.trim()) return;

    setIsRunning(true);
    setError(null);
    setTraceResult(null);

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: targetIntent,
          model_provider: modelProvider,
          budget_limit: 100000
        })
      });

      if (!response.ok) {
        throw new Error(`Execution error: ${response.statusText}`);
      }

      const data: AgentTraceResult = await response.json();
      setTraceResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to execute agent loop');
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* ===== Hero Banner ===== */}
      <div className="neo-card p-8 sm:p-10 relative overflow-hidden bg-white">
        {/* Halftone accent corners */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-halftone opacity-30 pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-halftone opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FFD93D] border-3 border-black text-black font-black text-xs uppercase tracking-wider mb-4 shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
              <Sparkles className="w-3.5 h-3.5 stroke-[3px]" />
              <span>X402 / UNIVERSAL AGENTIC PAYMENTS PROTOCOL</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-none">
              AUTONOMOUS COMMERCE <br />
              <span className="bg-[#FF6B6B] text-white px-2 py-0.5 border-4 border-black inline-block mt-2 rotate-1 shadow-[4px_4px_0px_0px_#000]">
                INTELLIGENCE STUDIO
              </span>
            </h1>

            <p className="mt-4 text-base font-bold text-black/80 leading-relaxed max-w-xl">
              Dispatch high-level commercial intents to the autonomous buyer agent. PayNode executes multi-step catalog queries, enforces deterministic ₹1,000 limits, and settles transactions on Razorpay rails.
            </p>
          </div>

          {/* Quick Telemetry Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-72 flex-shrink-0">
            <div className="p-4 bg-[#FFD93D] border-4 border-black shadow-[6px_6px_0px_0px_#000] rotate-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-black tracking-wider">SAFETY GATE</span>
                <ShieldCheck className="w-5 h-5 stroke-[3px] text-black" />
              </div>
              <div className="text-2xl font-black text-black mt-1">₹1,000 MAX</div>
              <span className="text-[11px] font-bold text-black/75 uppercase tracking-wide">Deterministic Rule</span>
            </div>

            <div className="p-4 bg-[#C4B5FD] border-4 border-black shadow-[6px_6px_0px_0px_#000] -rotate-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-black tracking-wider">MCP RAILS</span>
                <Zap className="w-5 h-5 stroke-[3px] text-black" />
              </div>
              <div className="text-2xl font-black text-black mt-1">6 ACTIVE TOOLS</div>
              <span className="text-[11px] font-bold text-black/75 uppercase tracking-wide">Razorpay Integration</span>
            </div>
          </div>
        </div>

        {/* Preset Intent Triggers */}
        <div className="relative z-10 mt-10 pt-6 border-t-4 border-black grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESET_INTENTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIntent(preset.intent);
                handleRunAgent(preset.intent);
              }}
              disabled={isRunning}
              className="text-left p-4 bg-white border-4 border-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all group flex flex-col justify-between disabled:opacity-50"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 border-2 border-black font-black text-[10px] tracking-wider uppercase ${preset.tagColor}`}>
                    {preset.tag}
                  </span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[3px] group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="font-black text-black uppercase text-sm group-hover:text-[#FF6B6B] transition-colors leading-tight">
                  {preset.title}
                </div>
                <p className="text-xs font-bold text-black/70 mt-2 leading-relaxed">
                  {preset.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Command Center Form ===== */}
      <div className="neo-card p-6 sm:p-8 space-y-5 bg-[#FFFDF5]">
        
        {/* Model Engine Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-4 border-black">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 stroke-[3px] text-black" />
            <span className="text-xs font-black uppercase tracking-wider text-black">
              AGENT INTELLIGENCE ENGINE
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {[
              { id: 'gemini', label: 'Gemini 2.5 Flash' },
              { id: 'claude', label: 'Claude Schema' },
              { id: 'simulation', label: 'Autonomous Engine' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModelProvider(m.id as any)}
                disabled={isRunning}
                className={`px-3.5 py-1.5 border-3 border-black text-xs font-black uppercase tracking-wider transition-all ${
                  modelProvider === m.id
                    ? 'bg-[#FFD93D] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-black/5 active:translate-x-0.5 active:translate-y-0.5'
                }`}
              >
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input & Dispatch Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunAgent();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Bot className="w-6 h-6 text-black stroke-[3px]" />
              </div>
              <input
                type="text"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="TYPE COMMERCIAL INTENT: E.G., 'BUY A WIRELESS MOUSE UNDER ₹1000'..."
                disabled={isRunning}
                className="w-full pl-14 pr-5 py-4 h-16 neo-input text-black placeholder-black/40 text-sm font-bold uppercase tracking-tight"
              />
            </div>

            <button
              type="submit"
              disabled={isRunning || !intent.trim()}
              className="px-8 py-4 h-16 neo-btn neo-btn-primary text-sm font-black flex items-center justify-center space-x-2 min-w-[200px] disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-5 h-5 stroke-[3px] animate-spin" />
                  <span>REASONING...</span>
                </>
              ) : (
                <>
                  <span>DISPATCH AGENT</span>
                  <Send className="w-5 h-5 stroke-[3px]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-[#FF6B6B] text-white border-4 border-black shadow-[6px_6px_0px_0px_#000] text-sm font-black flex items-center space-x-3 uppercase">
          <XCircle className="w-6 h-6 stroke-[3px] flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ===== Execution Results & Settlement ===== */}
      <AnimatePresence>
        {traceResult && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-8"
          >
            
            {/* Outcome Hero Block */}
            <div className={`border-4 border-black p-8 shadow-neo-lg relative overflow-hidden ${
              traceResult.guardrail_status === 'VIOLATION_BLOCKED'
                ? 'bg-[#FF6B6B] text-white'
                : 'bg-[#FFD93D] text-black'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center border-3 border-black shadow-[4px_4px_0px_0px_#FFF] flex-shrink-0">
                    {traceResult.guardrail_status === 'VIOLATION_BLOCKED' ? (
                      <ShieldAlert className="w-8 h-8 stroke-[3px] text-[#FFD93D]" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 stroke-[3px] text-[#10B981]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                      <h2 className="text-2xl font-black uppercase tracking-tight">
                        {traceResult.guardrail_status === 'VIOLATION_BLOCKED'
                          ? 'GUARDRAIL INTERVENED — TRANSACTION BLOCKED'
                          : 'TRANSACTION SETTLED & VERIFIED ON RAILS'}
                      </h2>
                      <span className="text-xs font-black uppercase px-3 py-1 bg-black text-white border-2 border-black">
                        {traceResult.model_used}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-bold leading-relaxed max-w-3xl">
                      {traceResult.final_summary}
                    </p>
                  </div>
                </div>

                {/* Neo-brutalist Invoice Receipt Card */}
                <div className="p-5 bg-white text-black border-4 border-black shadow-[6px_6px_0px_0px_#000] lg:w-80 flex-shrink-0 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs font-black border-b-3 border-black pb-2">
                    <span className="flex items-center space-x-1.5 uppercase">
                      <Receipt className="w-4 h-4 stroke-[3px]" />
                      <span>OFFICIAL RECEIPT</span>
                    </span>
                    <span className="bg-[#10B981] text-black px-2 py-0.5 border-2 border-black text-[10px] font-black uppercase">
                      PAID
                    </span>
                  </div>

                  {traceResult.order_id && (
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-black/60">ORDER:</span>
                      <button 
                        onClick={() => copyToClipboard(traceResult.order_id!, 'order')}
                        className="text-black font-black hover:bg-[#FFD93D] px-1 flex items-center space-x-1"
                      >
                        <span>{traceResult.order_id.slice(0, 14)}...</span>
                        {copiedKey === 'order' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {traceResult.payment_id && (
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-black/60">PAYMENT:</span>
                      <button 
                        onClick={() => copyToClipboard(traceResult.payment_id!, 'pay')}
                        className="text-black font-black hover:bg-[#FFD93D] px-1 flex items-center space-x-1"
                      >
                        <span>{traceResult.payment_id.slice(0, 14)}...</span>
                        {copiedKey === 'pay' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t-3 border-black border-dashed flex items-center justify-between font-sans">
                    <span className="text-xs font-black uppercase">TOTAL SETTLED:</span>
                    <span className="text-xl font-black text-black">
                      ₹{traceResult.total_spent_inr.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Neural Decision & Tool Invocation Sequence */}
            <div className="neo-card p-6 sm:p-8 space-y-6 bg-white">
              <div className="flex items-center justify-between pb-4 border-b-4 border-black">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black">
                    <Terminal className="w-5 h-5 stroke-[3px]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-black">
                      AGENT DECISION TRACE ({traceResult.steps.length} STEPS)
                    </h3>
                    <p className="text-xs font-bold text-black/70 uppercase">
                      Deterministic tool loops, arguments, and verifiable outcomes
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 bg-[#C4B5FD] border-3 border-black font-mono text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000]">
                  TIME: {traceResult.elapsed_seconds}S
                </div>
              </div>

              <div className="space-y-4">
                {traceResult.steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-4 sm:p-5 bg-[#FFFDF5] border-3 border-black shadow-[4px_4px_0px_0px_#000] space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 bg-[#FFD93D] border-2 border-black text-black text-xs font-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                          {step.step}
                        </span>
                        <span className="text-sm font-black uppercase text-black">
                          {step.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 font-mono">
                        {step.status && (
                          <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 border-2 border-black ${
                            step.status === 'success' ? 'bg-[#10B981] text-black' :
                            step.status === 'blocked_by_guardrail' ? 'bg-[#FFD93D] text-black' :
                            'bg-[#FF6B6B] text-white'
                          }`}>
                            {step.status.replace(/_/g, ' ')}
                          </span>
                        )}
                        <span className="text-xs text-black/60 font-bold">
                          {step.timestamp}
                        </span>
                      </div>
                    </div>

                    {step.thought && (
                      <p className="text-xs font-bold text-black/85 pl-6 border-l-4 border-[#FF6B6B] py-1 leading-relaxed italic bg-white/50">
                        "{step.thought}"
                      </p>
                    )}

                    {step.tool_name && (
                      <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 font-mono">
                        {step.arguments && (
                          <div className="p-3 bg-white border-2 border-black text-black overflow-x-auto shadow-[3px_3px_0px_0px_#000]">
                            <span className="text-[#FF6B6B] font-black block mb-1 uppercase font-sans">
                              ARGS PAYLOAD:
                            </span>
                            <pre className="text-[11px] font-bold">{JSON.stringify(step.arguments, null, 2)}</pre>
                          </div>
                        )}
                        {step.result && (
                          <div className="p-3 bg-white border-2 border-black text-black overflow-x-auto shadow-[3px_3px_0px_0px_#000]">
                            <span className="text-[#38BDF8] font-black block mb-1 uppercase font-sans">
                              RAIL RESPONSE:
                            </span>
                            <pre className="text-[11px] font-bold">{JSON.stringify(step.result, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
