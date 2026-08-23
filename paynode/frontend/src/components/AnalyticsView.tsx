import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, ShieldCheck, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { AnalyticsData } from '../types';

const COLORS = ['#7C3AED', '#DB2777', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'];
const PIE_COLORS = {
  success: '#10B981',
  guardrail: '#F59E0B',
  failed: '#EF4444'
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
        <div className="h-40 rounded-[32px] bg-white/40 shadow-clayCard" />
        <div className="h-40 rounded-[32px] bg-white/40 shadow-clayCard" />
        <div className="h-40 rounded-[32px] bg-white/40 shadow-clayCard" />
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
      gradient: 'from-violet-400 to-violet-600',
      sub: '100% Audit Logged',
      subIcon: TrendingUp,
      subColor: 'text-emerald-500'
    },
    {
      label: 'SETTLEMENT RATE',
      value: `${data.success_rate}%`,
      icon: ShieldCheck,
      gradient: 'from-emerald-400 to-emerald-600',
      sub: `${data.success_count} successful`,
      subColor: 'text-clay-muted'
    },
    {
      label: 'GUARDRAIL BLOCKS',
      value: data.guardrail_blocked,
      icon: AlertTriangle,
      gradient: 'from-amber-400 to-amber-600',
      sub: 'Max ₹1,000 Gate',
      subColor: 'text-amber-500'
    },
    {
      label: 'RAILS ACTIVE',
      value: 'Razorpay',
      icon: Activity,
      gradient: 'from-pink-400 to-pink-600',
      sub: 'Orders + Payments APIs',
      subColor: 'text-sky-500'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="clay-card-interactive p-6 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-clay-muted" style={{ fontFamily: 'Nunito, sans-serif' }}>{kpi.label}</span>
                <div className={`w-10 h-10 rounded-[14px] bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-black text-clay-foreground mt-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {kpi.value}
              </div>
              <div className={`flex items-center space-x-1 text-[11px] ${kpi.subColor} mt-2 font-bold`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                {kpi.subIcon && <kpi.subIcon className="w-3.5 h-3.5" />}
                <span>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tool Call Activity Distribution */}
        <div className="clay-card p-6 sm:p-8 lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-base font-black text-clay-foreground flex items-center space-x-2.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <div className="p-2 rounded-[14px] bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-md">
                <Zap className="w-4 h-4" />
              </div>
              <span>MCP Tool Invocations</span>
            </h3>
            <p className="text-xs text-clay-muted mt-0.5 font-medium">
              Live breakdown of FastMCP tool calls executed by autonomous buyer agents.
            </p>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.tool_distribution}>
                <XAxis 
                  dataKey="name" 
                  stroke="#635F69" 
                  fontSize={11} 
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  fontFamily="Nunito"
                  fontWeight={700}
                />
                <YAxis stroke="#635F69" fontSize={11} tickLine={false} allowDecimals={false} fontFamily="Nunito" fontWeight={700} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    borderColor: '#EFEBF5', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    fontFamily: 'Nunito',
                    fontWeight: 700,
                    color: '#332F3A',
                    boxShadow: '16px 16px 32px rgba(160, 150, 180, 0.2), -10px -10px 24px rgba(255, 255, 255, 0.9)'
                  }}
                  cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[10, 10, 0, 0]}>
                  {data.tool_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Execution Status Donut */}
        <div className="clay-card p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-base font-black text-clay-foreground flex items-center space-x-2.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <div className="p-2 rounded-[14px] bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-md">
                <Activity className="w-4 h-4" />
              </div>
              <span>Execution Integrity</span>
            </h3>
            <p className="text-xs text-clay-muted mt-0.5 font-medium">
              Success vs Guardrail interventions.
            </p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-xs text-clay-muted font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.95)', 
                      borderColor: '#EFEBF5', 
                      borderRadius: '20px', 
                      fontSize: '12px',
                      fontFamily: 'Nunito',
                      fontWeight: 700,
                      color: '#332F3A',
                      boxShadow: '16px 16px 32px rgba(160, 150, 180, 0.2), -10px -10px 24px rgba(255, 255, 255, 0.9)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[11px] text-clay-foreground font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>{value}</span>}
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
