import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ShieldCheck, Activity, Lock, Cpu, 
  ExternalLink, Layers, Terminal 
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [latency, setLatency] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<'online' | 'checking' | 'offline'>('checking');

  useEffect(() => {
    const pingServer = async () => {
      const start = performance.now();
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const ms = Math.round(performance.now() - start);
          setLatency(ms);
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch {
        setServerStatus('offline');
      }
    };

    pingServer();
    const interval = setInterval(pingServer, 10000);
    return () => clearInterval(interval);
  }, []);

  const TABS = [
    { id: 'agent', label: 'AI Buyer Agent', icon: Cpu },
    { id: 'merchant', label: 'Merchant Catalog', icon: Layers },
    { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'architecture', label: 'System Protocol', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-clayCard mx-4 sm:mx-8 mt-4 rounded-clay sm:rounded-clay-lg">
      <div className="px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={() => setActiveTab('agent')}>
            <div className="relative">
              <div className="w-11 h-11 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center shadow-clayButton transition-all group-hover:-translate-y-0.5">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 border-2 border-white" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  PayNode
                </span>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 tracking-wider">
                  MCP 2.0
                </span>
              </div>
              <p className="text-[11px] text-clay-muted font-medium tracking-tight">
                Agentic Commerce Gateway
              </p>
            </div>
          </div>

          {/* Center Navigation Bar with Framer Motion Pill */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-[24px] bg-clay-inputBg shadow-clayPressed">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-[20px] text-xs font-bold flex items-center space-x-2 transition-colors z-10 ${
                    isActive ? 'text-white' : 'text-clay-muted hover:text-clay-foreground'
                  }`}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-clay-muted'}`} />
                  <span>{tab.label}</span>

                  {/* Active Indicator Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] shadow-clayButton -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges */}
          <div className="flex items-center space-x-2.5">
            {/* Guardrail Limit Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-600 text-xs font-bold shadow-clayCard">
              <Lock className="w-3.5 h-3.5" />
              <span style={{ fontFamily: 'Nunito, sans-serif' }}>₹1,000 Gate</span>
            </div>

            {/* Razorpay Test Badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold shadow-clayCard">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span style={{ fontFamily: 'Nunito, sans-serif' }}>Razorpay</span>
            </div>

            {/* Server Ping */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 shadow-clayCard text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${
                serverStatus === 'online' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' :
                serverStatus === 'checking' ? 'bg-gradient-to-br from-amber-400 to-amber-500 animate-clay-breathe' : 'bg-gradient-to-br from-rose-400 to-rose-500'
              }`} />
              <span className="text-clay-muted font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {latency ? `${latency}ms` : 'Online'}
              </span>
            </div>

            {/* Swagger Docs */}
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-[20px] bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5 text-clay-muted hover:text-clay-accent transition-all"
              title="Open API Docs"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Mobile Navigation Scroll */}
        <div className="flex lg:hidden items-center space-x-2 py-3 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-[20px] text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton' 
                    : 'bg-clay-inputBg text-clay-muted shadow-clayPressed hover:text-clay-foreground'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
