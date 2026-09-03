import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { AgentPlayground } from './components/AgentPlayground';
import { MerchantCatalog } from './components/MerchantCatalog';
import { AuditTrail } from './components/AuditTrail';
import { AnalyticsView } from './components/AnalyticsView';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agent');

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] text-black bg-graph selection:bg-[#FFD93D] selection:text-black relative">
      
      {/* Top Retro Marquee Ticker */}
      <div className="w-full bg-[#FFD93D] border-b-4 border-black py-1.5 overflow-hidden font-black text-xs uppercase tracking-widest flex whitespace-nowrap z-50 shadow-[0px_4px_0px_0px_#000]">
        <div className="flex animate-marquee space-x-8">
          <span>⚡ PAYNODE AGENTIC COMMERCE GATEWAY</span>
          <span>✦ MODEL CONTEXT PROTOCOL (MCP 2.0)</span>
          <span>🛡️ DETERMINISTIC ₹1,000 SAFETY GUARDRAIL</span>
          <span>💳 RAZORPAY REAL-TIME RAILS</span>
          <span>🚀 AUTONOMOUS AI BUYER AGENT</span>
          <span>⚡ PAYNODE AGENTIC COMMERCE GATEWAY</span>
          <span>✦ MODEL CONTEXT PROTOCOL (MCP 2.0)</span>
          <span>🛡️ DETERMINISTIC ₹1,000 SAFETY GUARDRAIL</span>
          <span>💳 RAZORPAY REAL-TIME RAILS</span>
          <span>🚀 AUTONOMOUS AI BUYER AGENT</span>
        </div>
      </div>

      {/* Header Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            {activeTab === 'agent' && <AgentPlayground />}
            {activeTab === 'merchant' && <MerchantCatalog />}
            {activeTab === 'audit' && <AuditTrail />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'architecture' && <ArchitectureExplorer />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Neo-brutalist Footer */}
      <footer className="border-t-4 border-black bg-[#FFD93D] mt-16 shadow-[0px_-6px_0px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black text-[#FFD93D] font-black text-base flex items-center justify-center border-2 border-black rotate-[-3deg] shadow-[3px_3px_0px_0px_#FFF]">
              P
            </div>
            <div>
              <span className="font-black text-sm uppercase tracking-wider block">
                PAYNODE // AGENTIC COMMERCE SYSTEM
              </span>
              <p className="text-xs font-bold text-black/80">
                x402 / Universal Autonomous Protocol • FastMCP Architecture
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-white border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000] rotate-1">
              ₹1,000 Hard Limit Gate
            </span>
            <span className="px-3 py-1 bg-[#C4B5FD] border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000] -rotate-1">
              Razorpay Rails Active
            </span>
            <span className="px-3 py-1 bg-[#FF6B6B] text-white border-2 border-black font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000]">
              FastMCP 200 OK
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
