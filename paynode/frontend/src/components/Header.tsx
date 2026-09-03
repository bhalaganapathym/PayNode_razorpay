import React, { useEffect, useState } from 'react';
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
    <header className="sticky top-6 z-40 mx-4 sm:mx-8 mt-4">
      <div className="neo-card bg-white p-3 sm:p-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer select-none group" 
            onClick={() => setActiveTab('agent')}
          >
            <div className="w-12 h-12 bg-[#FFD93D] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rotate-[-2deg] group-hover:rotate-0 transition-transform">
              <Zap className="w-7 h-7 text-black stroke-[3px]" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black uppercase tracking-tighter text-black">
                  PAYNODE
                </span>
                <span className="bg-[#FF6B6B] text-white border-2 border-black font-black text-[10px] px-2 py-0.5 uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                  MCP 2.0
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-black/70">
                Agentic Commerce Engine
              </p>
            </div>
          </div>

          {/* Center Navigation Bar */}
          <nav className="hidden lg:flex items-center space-x-2 bg-[#FFFDF5] p-1.5 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider flex items-center space-x-2 border-2 border-black transition-all ${
                    isActive 
                      ? 'bg-[#FF6B6B] text-white shadow-[3px_3px_0px_0px_#000] -translate-y-0.5' 
                      : 'bg-white text-black hover:bg-[#FFD93D] active:translate-x-0.5 active:translate-y-0.5'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[3px]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Badges */}
          <div className="flex items-center space-x-2.5">
            {/* Guardrail Limit Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#38BDF8] border-3 border-black text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000] rotate-1">
              <Lock className="w-3.5 h-3.5 stroke-[3px]" />
              <span>₹1,000 CAP</span>
            </div>

            {/* Razorpay Test Badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-[#10B981] border-3 border-black text-black text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000] -rotate-1">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[3px]" />
              <span>RAZORPAY</span>
            </div>

            {/* Latency Meter */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border-3 border-black text-xs font-black shadow-[3px_3px_0px_0px_#000]">
              <span className={`w-3 h-3 border-2 border-black ${
                serverStatus === 'online' ? 'bg-[#10B981]' :
                serverStatus === 'checking' ? 'bg-[#FFD93D] animate-pulse' : 'bg-[#FF6B6B]'
              }`} />
              <span className="font-mono text-xs">
                {latency ? `${latency}MS` : 'ONLINE'}
              </span>
            </div>

            {/* Swagger API Docs */}
            <a
              href="http://localhost:8008/docs"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-[#FFD93D] border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:bg-[#FF6B6B] hover:text-white transition-colors"
              title="Open OpenAPI Specs"
            >
              <ExternalLink className="w-4 h-4 stroke-[3px]" />
            </a>
          </div>

        </div>

        {/* Mobile Navigation Scroll */}
        <div className="flex lg:hidden items-center space-x-2 mt-3 pt-3 border-t-3 border-black overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive 
                    ? 'bg-[#FF6B6B] text-white shadow-[3px_3px_0px_0px_#000]' 
                    : 'bg-white text-black hover:bg-[#FFD93D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[3px]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
