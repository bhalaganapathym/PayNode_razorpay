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
    title: "1. AI BUYER AGENT",
    icon: Cpu,
    bg: "bg-[#FFD93D]",
    desc: "Autonomous LLM reasoning loops parsing shopping intents into structured tool invocations.",
    badge: "ACTOR / CALLER"
  },
  {
    title: "2. FASTMCP GATEWAY",
    icon: Zap,
    bg: "bg-[#FF6B6B] text-white",
    desc: "Standard Model Context Protocol server exposing merchant tools via stdio & HTTP bridge.",
    badge: "PORT 8008"
  },
  {
    title: "3. SAFETY GUARDRAIL",
    icon: Lock,
    bg: "bg-[#38BDF8]",
    desc: "Deterministic financial circuit breaker enforcing max ₹1,000 ceiling without co-signature.",
    badge: "HARD CEILING"
  },
  {
    title: "4. RAZORPAY RAILS",
    icon: CreditCard,
    bg: "bg-[#10B981]",
    desc: "Orders and Payments APIs capturing settlement with automated UPI rail fallback.",
    badge: "SETTLED"
  }
];

export const ArchitectureExplorer: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState(MCP_TOOLS_LIST[0]);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="neo-card p-6 sm:p-8 bg-white relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#38BDF8] border-3 border-black text-black text-xs font-black uppercase mb-3 shadow-[3px_3px_0px_0px_#000] rotate-[-1deg]">
            <Server className="w-3.5 h-3.5 stroke-[3px]" />
            <span>PROTOCOL SPECIFICATION (X402 / UAP / MCP)</span>
          </div>
          <h2 className="text-3xl font-black uppercase text-black tracking-tight">
            PAYNODE SYSTEM ARCHITECTURE
          </h2>
          <p className="text-xs font-bold text-black/75 mt-1.5 uppercase tracking-wide">
            Model Context Protocol specifications for autonomous AI commerce over Razorpay payment rails.
          </p>
        </div>
      </div>

      {/* Protocol Visual Flow Diagram */}
      <div className="neo-card p-6 sm:p-8 space-y-6 bg-white">
        <div className="pb-3 border-b-4 border-black">
          <h3 className="text-xl font-black uppercase text-black flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-black text-[#FF6B6B] flex items-center justify-center border-2 border-black">
              <GitBranch className="w-4 h-4 stroke-[3px]" />
            </div>
            <span>INTERACTIVE ARCHITECTURE TOPOLOGY</span>
          </h3>
          <p className="text-xs font-bold text-black/70 mt-1 uppercase">
            Four-layer architectural schematic connecting agent intelligence to banking rails
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-2">
          {ARCH_NODES.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div 
                key={idx} 
                className="p-5 bg-[#FFFDF5] border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[10px_10px_0px_0px_#000] hover:-translate-y-1 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] ${node.bg}`}>
                    <Icon className="w-6 h-6 stroke-[3px]" />
                  </div>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 bg-black text-white border-2 border-black">
                    {node.badge}
                  </span>
                </div>
                <h4 className="font-black text-base uppercase text-black">{node.title}</h4>
                <p className="text-xs font-bold text-black/75 leading-relaxed">
                  {node.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MCP Tools Inspector Grid */}
      <div className="neo-card p-6 sm:p-8 space-y-6 bg-white">
        <div className="pb-3 border-b-4 border-black">
          <h3 className="text-xl font-black uppercase text-black flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-black text-[#FFD93D] flex items-center justify-center border-2 border-black">
              <Terminal className="w-4 h-4 stroke-[3px]" />
            </div>
            <span>FASTMCP COMMERCE TOOLS CATALOG</span>
          </h3>
          <p className="text-xs font-bold text-black/70 mt-1 uppercase">
            Select an MCP tool to inspect its formal signature, guardrail behavior, and underlying financial rail
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tool Selector List */}
          <div className="space-y-2.5 lg:col-span-1">
            {MCP_TOOLS_LIST.map((tool) => (
              <button
                key={tool.name}
                onClick={() => setSelectedTool(tool)}
                className={`w-full text-left p-3.5 border-3 border-black transition-all flex items-center justify-between text-xs active:translate-x-0.5 active:translate-y-0.5 ${
                  selectedTool.name === tool.name
                    ? 'bg-[#FF6B6B] text-white shadow-[4px_4px_0px_0px_#000] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-[#FFD93D] shadow-[3px_3px_0px_0px_#000]'
                }`}
              >
                <div>
                  <div className="font-mono font-black uppercase text-sm">
                    {tool.name}
                  </div>
                  <div className="text-[10px] uppercase font-bold mt-0.5 opacity-80">
                    {tool.category}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </button>
            ))}
          </div>

          {/* Selected Tool Details Card */}
          <div className="lg:col-span-2 p-6 bg-[#FFFDF5] border-4 border-black shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#FFD93D] border-2 border-black">
                  {selectedTool.category}
                </span>
                <h4 className="text-xl font-black uppercase text-black font-mono mt-2">
                  {selectedTool.name}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-black/60 block">UNDERLYING RAIL</span>
                <span className="text-xs font-mono font-black text-[#FF6B6B] uppercase">{selectedTool.rail}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="font-black font-sans uppercase text-black block mb-1.5">TOOL SIGNATURE:</span>
                <pre className="p-4 bg-white border-3 border-black text-black font-bold text-[11px] overflow-x-auto shadow-[3px_3px_0px_0px_#000]">
                  {selectedTool.signature}
                </pre>
              </div>

              <div>
                <span className="font-black font-sans uppercase text-black block mb-1.5">SPECIFICATION:</span>
                <p className="text-black font-bold font-sans text-xs leading-relaxed bg-white border-2 border-black p-3">
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
