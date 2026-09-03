import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Search, ShieldCheck, CreditCard, CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

const STAGES = [
  {
    step: "01",
    title: "INTENT PARSE",
    icon: Bot,
    color: "bg-[#FFD93D] text-black",
    desc: "Autonomous agent decodes user budget rules and target product constraints."
  },
  {
    step: "02",
    title: "MCP DISCOVERY",
    icon: Search,
    color: "bg-[#C4B5FD] text-black",
    desc: "FastMCP tools query merchant inventory, stock, and discount rules."
  },
  {
    step: "03",
    title: "SAFETY GATE",
    icon: ShieldCheck,
    color: "bg-[#38BDF8] text-black",
    desc: "Enforces deterministic ₹1,000 maximum ceiling and 80% discount floor."
  },
  {
    step: "04",
    title: "RAZORPAY ORDER",
    icon: CreditCard,
    color: "bg-[#FF6B6B] text-white",
    desc: "Generates cryptographic order ID on real-time Razorpay payment rails."
  },
  {
    step: "05",
    title: "SETTLEMENT",
    icon: CheckCircle2,
    color: "bg-[#10B981] text-black",
    desc: "Payment authorized, captured, and immutably written to audit log."
  }
];

export const PaymentTimeline: React.FC = () => {
  return (
    <div className="neo-card p-6 sm:p-8 space-y-5 bg-white">
      <div className="flex items-center justify-between pb-3 border-b-4 border-black">
        <div>
          <h3 className="text-xl font-black uppercase text-black flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-black text-[#FFD93D] flex items-center justify-center border-2 border-black">
              <CreditCard className="w-5 h-5 stroke-[3px]" />
            </div>
            <span>AGENTIC COMMERCE PAYMENT PIPELINE (X402)</span>
          </h3>
          <p className="text-xs font-bold text-black/70 mt-1 uppercase">
            Sequential guardrail verification and payment settlement flow
          </p>
        </div>
      </div>

      {/* 5-Step Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-[#FFFDF5] border-4 border-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-y-1 transition-all relative flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 bg-black text-white border-2 border-black">
                    STAGE {stage.step}
                  </span>
                  <div className={`w-10 h-10 border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${stage.color}`}>
                    <Icon className="w-5 h-5 stroke-[3px]" />
                  </div>
                </div>
                <h4 className="font-black text-sm uppercase text-black group-hover:text-[#FF6B6B] transition-colors">
                  {stage.title}
                </h4>
                <p className="text-xs font-bold text-black/70 mt-1.5 leading-relaxed">
                  {stage.desc}
                </p>
              </div>

              {idx < STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20">
                  <div className="w-6 h-6 bg-black text-white border-2 border-black flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
