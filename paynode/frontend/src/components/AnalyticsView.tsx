import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, ShieldCheck, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { AnalyticsData } from '../types';

const COLORS = ['#FF6B6B', '#FFD93D', '#38BDF8', '#10B981', '#C4B5FD', '#000000'];
const PIE_COLORS = {
  success: '#10B981',
  guardrail: '#FFD93D',
  failed: '#FF6B6B'
};

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="h-44 border-4 border-black bg-white shadow-neo" />
        <div className="h-44 border-4 border-black bg-white shadow-neo" />
        <div className="h-44 border-4 border-black bg-white shadow-neo" />
      </div>
    );
  }

  const pieData = [
    { name: 'Success', value: data.success_count, color: PIE_COLORS.success },
    { name: 'Guardrail Intervened', value: data.guardrail_blocked, color: PIE_COLORS.guardrail },
    { name: 'Failed / Declined', value: data.failed_count, color: PIE_COLORS.failed }
  ].filter(d => d.value > 0);

  const KPI_CARDS = [
    {
      label: 'TOTAL MCP CALLS',
      value: data.total_calls,
      icon: Zap,
      bg: 'bg-[#FFD93D]',
      sub: '100% Immutable Logs',
      subIcon: TrendingUp,
      rotate: 'rotate-[-1deg]'
    },
    {
      label: 'SETTLEMENT RATE',
      value: `${data.success_rate}%`,
      icon: ShieldCheck,
      bg: 'bg-[#10B981] text-black',
      sub: `${data.success_count} Transactions Settled`,
      rotate: 'rotate-1'
    },
    {
      label: 'GUARDRAIL BLOCKS',
      value: data.guardrail_blocked,
      icon: AlertTriangle,
      bg: 'bg-[#FF6B6B] text-white',
      sub: 'Enforcing Max ₹1,000 Limit',
      rotate: '-rotate-1'
    },
    {
      label: 'RAILS ACTIVE',
      value: 'RAZORPAY',
      icon: Activity,
      bg: 'bg-[#C4B5FD] text-black',
      sub: 'Orders + Payments APIs',
      rotate: 'rotate-1'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`border-4 border-black p-6 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all ${kpi.bg} ${kpi.rotate}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider">{kpi.label}</span>
                <div className="w-9 h-9 bg-black text-white flex items-center justify-center border-2 border-black">
                  <Icon className="w-5 h-5 stroke-[3px]" />
                </div>
              </div>
              <div className="text-4xl font-black font-sans mt-3 tracking-tight">
                {kpi.value}
              </div>
              <div className="flex items-center space-x-1.5 text-xs mt-2 font-bold uppercase">
                {kpi.subIcon && <kpi.subIcon className="w-4 h-4 stroke-[3px]" />}
                <span>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tool Call Activity Distribution */}
        <div className="neo-card p-6 sm:p-8 lg:col-span-2 space-y-4 bg-white">
          <div className="pb-3 border-b-4 border-black">
            <h3 className="text-xl font-black uppercase text-black flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-black text-[#FFD93D] flex items-center justify-center border-2 border-black">
                <Zap className="w-4 h-4 stroke-[3px]" />
              </div>
              <span>MCP TOOL INVOCATION FREQUENCY</span>
            </h3>
            <p className="text-xs font-bold text-black/70 mt-1 uppercase">
              Distribution of FastMCP tool invocations executed across all autonomous sessions
            </p>
          </div>

          <div className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.tool_distribution}>
                <XAxis 
                  dataKey="name" 
                  stroke="#000000" 
                  fontSize={11} 
                  tickLine={true}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  fontWeight={900}
                />
                <YAxis stroke="#000000" fontSize={11} tickLine={true} allowDecimals={false} fontWeight={900} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFDF5', 
                    border: '3px solid #000000', 
                    boxShadow: '4px 4px 0px #000000',
                    fontSize: '12px',
                    fontWeight: 900,
                    color: '#000000',
                    borderRadius: '0px'
                  }}
                  cursor={{ fill: 'rgba(255, 217, 61, 0.2)' }}
                />
                <Bar dataKey="count" fill="#FF6B6B" stroke="#000000" strokeWidth={2}>
                  {data.tool_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Execution Status Donut */}
        <div className="neo-card p-6 sm:p-8 space-y-4 bg-white">
          <div className="pb-3 border-b-4 border-black">
            <h3 className="text-xl font-black uppercase text-black flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-black text-[#FF6B6B] flex items-center justify-center border-2 border-black">
                <Activity className="w-4 h-4 stroke-[3px]" />
              </div>
              <span>EXECUTION INTEGRITY</span>
            </h3>
            <p className="text-xs font-bold text-black/70 mt-1 uppercase">
              Settlement success vs guardrail intervention
            </p>
          </div>

          <div className="h-72 flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-black font-black uppercase">No execution data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#000000"
                    strokeWidth={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFDF5', 
                      border: '3px solid #000000', 
                      boxShadow: '4px 4px 0px #000000',
                      fontSize: '12px',
                      fontWeight: 900,
                      borderRadius: '0px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="square"
                    formatter={(value) => <span className="text-[11px] text-black font-black uppercase">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
