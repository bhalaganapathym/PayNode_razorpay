import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Search, ShieldCheck, CreditCard, CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

const STAGES = [
  {
    step: "01",
    title: "Intent Parsing",
    icon: Bot,
    color: "from-violet-400 to-violet-600",
    desc: "Autonomous LLM decodes budget constraints and product requirements."
  },
  {
    step: "02",
    title: "Catalog Discovery",
    icon: Search,
    color: "from-purple-400 to-purple-600",
    desc: "FastMCP tools query merchant inventory and price metadata."
  },
  {
    step: "03",
    title: "Guardrail Gate",
    icon: ShieldCheck,
    color: "from-pink-400 to-pink-600",
    desc: "Verifies ₹1,000 max purchase ceiling & 80% negotiation floor."
  },
  {
    step: "04",
    title: "Razorpay Order",
    icon: CreditCard,
    color: "from-amber-400 to-amber-600",
    desc: "Generates cryptographic order ID on Razorpay payment rails."
  },
  {
    step: "05",
    title: "Settlement",
    icon: CheckCircle2,
    color: "from-emerald-400 to-emerald-600",
    desc: "Payment captured, receipt generated, and audit log committed."
  }
];

export const PaymentTimeline: React.FC = () => {
  return (
    <div className="clay-card p-6 sm:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-clay-foreground flex items-center space-x-2.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
            <div className="p-2 rounded-[14px] bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-md">
              <CreditCard className="w-4 h-4" />
            </div>
            <span>Agentic Commerce Pipeline</span>
          </h3>
          <p className="text-xs text-clay-muted mt-1 font-medium">
            Every autonomous action flows through deterministic guardrails and cryptographic verification.
          </p>
        </div>
      </div>

      {/* 5-Step Pipeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 rounded-[24px] bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-1 transition-all relative flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black text-clay-muted group-hover:text-clay-accent transition-colors"
                    style={{ fontFamily: 'Nunito, sans-serif' }}>
                    STAGE {stage.step}
                  </span>
                  <div className={`w-9 h-9 rounded-[14px] bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="font-black text-sm text-clay-foreground group-hover:text-clay-accent transition-colors"
                  style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {stage.title}
                </h4>
                <p className="text-[11px] text-clay-muted mt-1 leading-relaxed font-medium">
                  {stage.desc}
                </p>
              </div>

              {idx < STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-300 to-violet-500 flex items-center justify-center text-white shadow-md">
                    <ArrowRight className="w-2.5 h-2.5" />
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
