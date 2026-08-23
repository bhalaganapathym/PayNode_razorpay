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
    tag: "Happy Path",
    color: "from-emerald-400 to-emerald-600"
  },
  {
    title: "Algorithmic Price Bargaining",
    intent: "Negotiate and buy Anker 5-in-1 USB-C Hub Adapter",
    desc: "Applies merchant bounded discount formula (80% floor & midpoint counter).",
    tag: "Bargaining",
    color: "from-purple-400 to-purple-600"
  },
  {
    title: "₹1,000 Safety Gate Intervention",
    intent: "Buy Keychron K2 Mechanical Keyboard",
    desc: "Attempts purchase of ₹4,499 item — intercepted & blocked by guardrail.",
    tag: "Security Gate",
    color: "from-amber-400 to-amber-600"
  },
  {
    title: "Decline & Graceful Fallback",
    intent: "Buy braided fast charging cable and simulate failure recovery",
    desc: "Handles card decline and auto-recovers via secondary UPI rails.",
    tag: "Fault Tolerance",
    color: "from-sky-400 to-sky-600"
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
      
      {/* ===== Top HUD Banner ===== */}
      <div className="clay-card p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#7C3AED]/8 rounded-full blur-3xl pointer-events-none clay-blob" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#EC4899]/8 rounded-full blur-3xl pointer-events-none clay-blob-alt animation-delay-2000" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600 text-xs font-bold mb-4 shadow-clayCard">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span style={{ fontFamily: 'Nunito, sans-serif' }}>x402 / Universal Agentic Payments Protocol</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-clay-foreground tracking-tight leading-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Autonomous Commerce{' '}
              <span className="clay-text-gradient">Intelligence Studio</span>
            </h1>

            <p className="mt-3 text-sm text-clay-muted leading-relaxed font-medium">
              Dispatch high-level shopping goals to the autonomous buyer agent. PayNode manages multi-step tool discovery, bounded discount negotiations, strict financial safety gates, and Razorpay cryptographic settlement.
            </p>
          </div>

          {/* Quick Telemetry Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:w-64 flex-shrink-0">
            <div className="p-4 rounded-[24px] bg-white/80 shadow-clayCard flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-clay-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>Safety Gate</span>
                <div className="text-sm font-black text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>₹1,000 Cap</div>
              </div>
            </div>

            <div className="p-4 rounded-[24px] bg-white/80 shadow-clayCard flex items-center space-x-3">
              <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-clay-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>MCP Tools</span>
                <div className="text-sm font-black text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>6 Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Intent Triggers */}
        <div className="relative z-10 mt-8 pt-6 border-t border-violet-100/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PRESET_INTENTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIntent(preset.intent);
                handleRunAgent(preset.intent);
              }}
              disabled={isRunning}
              className="text-left p-5 rounded-[24px] bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-1 active:scale-[0.96] active:shadow-clayPressed transition-all text-xs group flex flex-col justify-between disabled:opacity-50 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-br shadow-md" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}>
                    <span className={`absolute inset-0 rounded-full bg-gradient-to-br ${preset.color}`} />
                    <span className="relative z-10">{preset.tag}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-clay-muted group-hover:text-clay-accent group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="font-extrabold text-clay-foreground group-hover:text-clay-accent transition-colors" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {preset.title}
                </div>
                <p className="text-[11px] text-clay-muted mt-1.5 leading-relaxed font-medium">
                  {preset.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Interactive Command Center Bar ===== */}
      <div className="clay-card p-6 sm:p-8 space-y-4">
        
        {/* Model Provider Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-violet-100/50">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-clay-accent" />
            <span className="text-xs font-black text-clay-foreground uppercase tracking-wider" style={{ fontFamily: 'Nunito, sans-serif' }}>Agent Intelligence Engine</span>
          </div>

          <div className="flex items-center space-x-2">
            {[
              { id: 'gemini', label: 'Gemini 2.5 Flash' },
              { id: 'claude', label: 'Claude Schema' },
              { id: 'simulation', label: 'Autonomous Engine' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModelProvider(m.id as any)}
                disabled={isRunning}
                className={`px-4 py-2 rounded-[20px] text-xs font-bold transition-all ${
                  modelProvider === m.id
                    ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton'
                    : 'bg-clay-inputBg text-clay-muted shadow-clayPressed hover:text-clay-foreground'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Prompt Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunAgent();
          }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Bot className="w-5 h-5 text-clay-accent" />
              </div>
              <input
                type="text"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Type autonomous intent: e.g., 'Find an Anker USB-C hub under ₹1000, negotiate price, and pay'..."
                disabled={isRunning}
                className="w-full pl-14 pr-5 py-4 h-16 rounded-[20px] clay-input text-clay-foreground placeholder-clay-muted/60 text-sm font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isRunning || !intent.trim()}
              className="px-8 py-4 h-16 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white font-bold text-sm shadow-clayButton hover:shadow-clayButtonHover hover:-translate-y-1 active:scale-[0.92] active:shadow-clayPressed flex items-center justify-center space-x-2 transition-all disabled:opacity-50 min-w-[160px]"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Reasoning...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Agent</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-5 rounded-[24px] bg-rose-50 text-rose-600 text-sm flex items-center space-x-3 shadow-clayCard font-medium">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ===== Live Execution Results ===== */}
      <AnimatePresence>
        {traceResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            
            {/* Outcome Hero Card */}
            <div className={`rounded-[32px] p-7 sm:p-8 relative overflow-hidden shadow-clayCard ${
              traceResult.guardrail_status === 'VIOLATION_BLOCKED'
                ? 'bg-gradient-to-br from-amber-50 to-orange-50'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3.5 rounded-[20px] shadow-clayCard ${
                    traceResult.guardrail_status === 'VIOLATION_BLOCKED'
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                      : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                  }`}>
                    {traceResult.guardrail_status === 'VIOLATION_BLOCKED' ? (
                      <ShieldAlert className="w-8 h-8" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                      <h2 className="text-xl font-black text-clay-foreground tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        {traceResult.guardrail_status === 'VIOLATION_BLOCKED'
                          ? 'Guardrail Intervened — Purchase Blocked'
                          : 'Transaction Settled & Verified'}
                      </h2>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/80 text-clay-muted shadow-clayCard">
                        {traceResult.model_used}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-clay-muted leading-relaxed max-w-3xl font-medium">
                      {traceResult.final_summary}
                    </p>
                  </div>
                </div>

                {/* Receipt Pill */}
                <div className="p-5 rounded-[24px] bg-white/80 shadow-clayCard lg:w-72 flex-shrink-0 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-clay-muted">
                    <span className="flex items-center space-x-1.5">
                      <Receipt className="w-3.5 h-3.5 text-pink-500" />
                      <span style={{ fontFamily: 'Nunito, sans-serif' }}>RECEIPT</span>
                    </span>
                    <span className="text-emerald-500 font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>PAID</span>
                  </div>

                  {traceResult.order_id && (
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-clay-muted">Order:</span>
                      <button 
                        onClick={() => copyToClipboard(traceResult.order_id!, 'order')}
                        className="text-clay-accent hover:underline flex items-center space-x-1 font-bold"
                      >
                        <span>{traceResult.order_id.slice(0, 14)}...</span>
                        {copiedKey === 'order' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}

                  {traceResult.payment_id && (
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-clay-muted">Payment:</span>
                      <button 
                        onClick={() => copyToClipboard(traceResult.payment_id!, 'pay')}
                        className="text-emerald-500 hover:underline flex items-center space-x-1 font-bold"
                      >
                        <span>{traceResult.payment_id.slice(0, 14)}...</span>
                        {copiedKey === 'pay' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}

                  <div className="pt-2.5 border-t border-violet-100/50 flex items-center justify-between">
                    <span className="text-xs text-clay-muted font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>Total Settled:</span>
                    <span className="text-lg font-black text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      ₹{traceResult.total_spent_inr.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Neural Decision & Tool Invocation Sequence */}
            <div className="clay-card p-7 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-[16px] bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-md">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Agent Decision Trace ({traceResult.steps.length} Steps)
                    </h3>
                    <p className="text-xs text-clay-muted font-medium">
                      Step-by-step reasoning, MCP arguments, and responses.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold px-4 py-2 rounded-full bg-white/80 shadow-clayCard text-clay-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Latency: <span className="text-clay-accent">{traceResult.elapsed_seconds}s</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {traceResult.steps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="p-5 rounded-[24px] bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-7 h-7 rounded-[12px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white text-[11px] font-black flex items-center justify-center shadow-md" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {step.step}
                        </span>
                        <span className="text-xs font-bold text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {step.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {step.status && (
                          <span className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-black ${
                            step.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            step.status === 'blocked_by_guardrail' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                            {step.status.replace(/_/g, ' ')}
                          </span>
                        )}
                        <span className="text-[11px] text-clay-muted font-medium">
                          {step.timestamp}
                        </span>
                      </div>
                    </div>

                    {step.thought && (
                      <p className="text-xs text-clay-muted italic pl-9 border-l-3 border-clay-accent/30 leading-relaxed font-medium">
                        "{step.thought}"
                      </p>
                    )}

                    {step.tool_name && (
                      <div className="pl-9 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        {step.arguments && (
                          <div className="p-3.5 rounded-[16px] bg-clay-inputBg shadow-clayPressed text-clay-foreground overflow-x-auto">
                            <span className="text-pink-500 font-black block mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>ARGS:</span>
                            <pre className="text-[11px] font-mono text-clay-muted">{JSON.stringify(step.arguments, null, 2)}</pre>
                          </div>
                        )}
                        {step.result && (
                          <div className="p-3.5 rounded-[16px] bg-clay-inputBg shadow-clayPressed text-clay-foreground overflow-x-auto">
                            <span className="text-sky-500 font-black block mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>RESPONSE:</span>
                            <pre className="text-[11px] font-mono text-clay-muted">{JSON.stringify(step.result, null, 2)}</pre>
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
