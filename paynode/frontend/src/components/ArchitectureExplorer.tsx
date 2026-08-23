import React, { useState } from 'react';
import { 
  Terminal, ShieldCheck, Zap, CreditCard, 
  ArrowRight, Cpu, Lock, GitBranch, Server 
} from 'lucide-react';

const MCP_TOOLS_LIST = [
  {
    name: "search_products",
    category: "Discovery",
    signature: "search_products(query: str, category?: str, max_price?: int) -> List[Product]",
    desc: "Indexes merchant inventory and applies full-text or price filters.",
    rail: "Supabase / SQLite"
  },
  {
    name: "get_details",
    category: "Inspection",
    signature: "get_details(product_id: str) -> Product",
    desc: "Retrieves complete specification, inventory stock, and pricing.",
    rail: "Supabase / SQLite"
  },
  {
    name: "negotiate_price",
    category: "Bargaining",
    signature: "negotiate_price(product_id: str, offered_price: int) -> NegotiationResult",
    desc: "Enforces merchant discount floor rules (>=90% accept, 80-89% counter, <80% reject).",
    rail: "Bounded Algorithmic Rules"
  },
  {
    name: "create_order",
    category: "Financial Gate",
    signature: "create_order(product_id: str, quantity: int, agreed_price?: int) -> RazorpayOrder",
    desc: "Generates cryptographic order ID on Razorpay. Enforces ₹1,000 max purchase ceiling.",
    rail: "Razorpay Orders API"
  },
  {
    name: "initiate_payment",
    category: "Settlement",
    signature: "initiate_payment(order_id: str, payment_method?: str, simulate_failure?: bool) -> PaymentResult",
    desc: "Captures settlement. Automatically falls back from declined card to secondary UPI rails.",
    rail: "Razorpay Payments API"
  },
  {
    name: "check_status",
    category: "Verification",
    signature: "check_status(order_id: str) -> OrderStatus",
    desc: "Queries real-time order status and settlement receipt.",
    rail: "Razorpay Orders API"
  }
];

const ARCH_NODES = [
  {
    title: "1. AI Buyer Agent",
    icon: Cpu,
    gradient: "from-violet-400 to-violet-600",
    desc: "Gemini 2.5 Flash / Claude Sonnet model parsing human intent and executing MCP tool loops.",
    badge: "Caller / Actor"
  },
  {
    title: "2. FastMCP Gateway",
    icon: Zap,
    gradient: "from-pink-400 to-pink-600",
    desc: "Standard JSON-RPC / stdio & REST bridge server exposing 6 production commerce tools.",
    badge: "Port 8000"
  },
  {
    title: "3. Safety Guardrails",
    icon: Lock,
    gradient: "from-sky-400 to-sky-600",
    desc: "Deterministic ₹1,000 autonomous purchase ceiling and 80% merchant discount floor.",
    badge: "Max ₹1,000 Gate"
  },
  {
    title: "4. Payment Rails",
    icon: CreditCard,
    gradient: "from-emerald-400 to-emerald-600",
    desc: "Razorpay Orders & Payments APIs with immutable Supabase audit logging.",
    badge: "Testnet Settled"
  }
];

export const ArchitectureExplorer: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState(MCP_TOOLS_LIST[0]);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="clay-card p-7 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#0EA5E9]/6 rounded-full blur-3xl pointer-events-none clay-blob" />
        
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-600 text-xs font-bold mb-3 shadow-clayCard">
            <Server className="w-3.5 h-3.5" />
            <span style={{ fontFamily: 'Nunito, sans-serif' }}>Protocol Specification (x402 / UAP / MCP)</span>
          </div>
          <h2 className="text-2xl font-black text-clay-foreground tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
            PayNode System Architecture
          </h2>
          <p className="text-xs text-clay-muted mt-1.5 leading-relaxed font-medium">
            PayNode establishes standard MCP primitives so any autonomous agent can transact over Razorpay rails with deterministic safety constraints.
          </p>
        </div>
      </div>

      {/* Protocol Visual Flow Diagram */}
      <div className="clay-card p-7 sm:p-8 space-y-5">
        <h3 className="text-base font-black text-clay-foreground flex items-center space-x-2.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
          <div className="p-2 rounded-[14px] bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-md">
            <GitBranch className="w-4 h-4" />
          </div>
          <span>Interactive Architecture Topology</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {ARCH_NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div key={idx} className="p-5 rounded-[24px] bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-1 transition-all space-y-3 relative group">
                <div className={`w-10 h-10 rounded-[14px] bg-gradient-to-br ${node.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-black text-sm text-clay-foreground" style={{ fontFamily: 'Nunito, sans-serif' }}>{node.title}</h4>
                <p className="text-[11px] text-clay-muted leading-relaxed font-medium">
                  {node.desc}
                </p>
                <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full bg-violet-50 text-violet-600"
                  style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {node.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MCP Tools Inspector Grid */}
      <div className="clay-card p-7 sm:p-8 space-y-5">
        <div>
          <h3 className="text-base font-black text-clay-foreground flex items-center space-x-2.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
            <div className="p-2 rounded-[14px] bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-md">
              <Terminal className="w-4 h-4" />
            </div>
            <span>FastMCP Tools Catalog</span>
          </h3>
          <p className="text-xs text-clay-muted mt-0.5 font-medium">
            Select a tool to view its formal signature, guardrail behavior, and underlying rail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Tool Selector List */}
          <div className="space-y-2 lg:col-span-1">
            {MCP_TOOLS_LIST.map((tool) => (
              <button
                key={tool.name}
                onClick={() => setSelectedTool(tool)}
                className={`w-full text-left p-4 rounded-[20px] transition-all flex items-center justify-between text-xs active:scale-[0.97] ${
                  selectedTool.name === tool.name
                    ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton'
                    : 'bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5 text-clay-foreground'
                }`}
              >
                <div>
                  <div className={`font-black ${selectedTool.name === tool.name ? 'text-white' : 'text-clay-accent'}`}
                    style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {tool.name}
                  </div>
                  <div className={`text-[10px] mt-0.5 font-bold ${selectedTool.name === tool.name ? 'text-white/70' : 'text-clay-muted'}`}
                    style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {tool.category}
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 ${selectedTool.name === tool.name ? 'text-white' : 'text-clay-muted'}`} />
              </button>
            ))}
          </div>

          {/* Selected Tool Details Card */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-[24px] bg-white/80 shadow-clayCard space-y-4">
            <div className="flex items-center justify-between border-b border-violet-100/50 pb-3">
              <div>
                <span className="text-[10px] uppercase px-3 py-1 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600 font-black"
                  style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {selectedTool.category}
                </span>
                <h4 className="text-lg font-black text-clay-foreground mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {selectedTool.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-clay-muted font-bold block" style={{ fontFamily: 'Nunito, sans-serif' }}>UNDERLYING RAIL</span>
                <span className="text-xs font-black text-sky-500" style={{ fontFamily: 'Nunito, sans-serif' }}>{selectedTool.rail}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-black text-clay-muted block mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>SIGNATURE:</span>
                <pre className="p-4 rounded-[16px] bg-clay-inputBg shadow-clayPressed text-pink-500 font-mono text-[11px] overflow-x-auto font-bold">
                  {selectedTool.signature}
                </pre>
              </div>

              <div>
                <span className="text-[11px] font-black text-clay-muted block mb-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>DESCRIPTION:</span>
                <p className="text-clay-foreground leading-relaxed font-medium">
                  {selectedTool.desc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
