import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { AgentPlayground } from './components/AgentPlayground';
import { MerchantCatalog } from './components/MerchantCatalog';
import { AuditTrail } from './components/AuditTrail';
import { AnalyticsView } from './components/AnalyticsView';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agent');

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1FA] text-[#332F3A] selection:bg-violet-300 selection:text-violet-900 relative">

      {/* ===== Floating Background Blobs ===== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#8B5CF6]/10 blur-3xl clay-blob" />
        <div className="absolute -right-[10%] top-[20%] h-[55vh] w-[55vh] rounded-full bg-[#EC4899]/10 blur-3xl clay-blob-alt animation-delay-2000" />
        <div className="absolute bottom-[5%] left-[30%] h-[50vh] w-[50vh] rounded-full bg-[#0EA5E9]/10 blur-3xl clay-blob-slow animation-delay-4000" />
      </div>

      {/* Header Bar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content with Animated Tab Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {activeTab === 'agent' && <AgentPlayground />}
            {activeTab === 'merchant' && <MerchantCatalog />}
            {activeTab === 'audit' && <AuditTrail />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'architecture' && <ArchitectureExplorer />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="clay-card mt-12 mx-4 sm:mx-8 mb-6 py-6 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 animate-clay-breathe" />
            <span className="text-clay-muted font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
              PayNode — MCP Gateway for Agentic Commerce
            </span>
          </div>
          <div className="text-clay-muted text-xs">
            <span>₹1,000 Safety Gate • Razorpay Test Rails • FastMCP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
