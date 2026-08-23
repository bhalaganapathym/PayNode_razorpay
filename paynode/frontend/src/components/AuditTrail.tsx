import React, { useState, useEffect } from 'react';
import { 
  Shield, Search, RefreshCw, 
  CheckCircle, XCircle, ChevronDown, ChevronUp, ShieldAlert 
} from 'lucide-react';
import { AuditLogItem } from '../types';
import { PaymentTimeline } from './PaymentTimeline';

export const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-logs?limit=100');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          JSON.stringify(log.arguments).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          JSON.stringify(log.result).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* 5-Stage Payment Rails Visualizer */}
      <PaymentTimeline />

      {/* Audit Log Header & Controls */}
      <div className="clay-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-clay-foreground flex items-center space-x-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              <div className="p-2 rounded-[14px] bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <span>Real-Time Audit Trail</span>
            </h2>
            <p className="text-xs text-clay-muted mt-1.5 font-medium">
              Every tool invocation, transaction, and guardrail decision is immutably logged.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-5 py-2.5 rounded-[20px] bg-white/80 shadow-clayCard hover:shadow-clayCardHover hover:-translate-y-0.5 text-clay-muted text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-[0.96] active:shadow-clayPressed"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-clay-muted absolute left-5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tool, argument, result..."
              className="w-full pl-12 pr-5 py-3 rounded-[20px] clay-input text-clay-foreground placeholder-clay-muted/60 text-xs font-medium"
            />
          </div>

          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            {['all', 'success', 'failed', 'blocked_by_guardrail'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-[16px] text-xs font-bold capitalize transition-all active:scale-[0.95] ${
                  statusFilter === st
                    ? 'bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton'
                    : 'bg-white/80 text-clay-muted shadow-clayCard hover:-translate-y-0.5'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="clay-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-clay-inputBg text-clay-muted font-bold border-b border-violet-100/50">
              <tr>
                <th className="px-5 py-4" style={{ fontFamily: 'Nunito, sans-serif' }}>TIMESTAMP</th>
                <th className="px-5 py-4" style={{ fontFamily: 'Nunito, sans-serif' }}>TOOL / EVENT</th>
                <th className="px-5 py-4" style={{ fontFamily: 'Nunito, sans-serif' }}>ACTOR</th>
                <th className="px-5 py-4" style={{ fontFamily: 'Nunito, sans-serif' }}>STATUS</th>
                <th className="px-5 py-4" style={{ fontFamily: 'Nunito, sans-serif' }}>LATENCY</th>
                <th className="px-5 py-4 text-right" style={{ fontFamily: 'Nunito, sans-serif' }}>DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-100/30 text-clay-foreground">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-clay-muted font-medium">
                    Loading audit trail from database...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-clay-muted font-medium">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  const dateStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="hover:bg-violet-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-3.5 text-clay-muted font-medium whitespace-nowrap">
                          {dateStr}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-clay-accent" style={{ fontFamily: 'Nunito, sans-serif' }}>
                          {log.tool_name}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold"
                            style={{ fontFamily: 'Nunito, sans-serif' }}>
                            {log.actor_type || 'ai_buyer_agent'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-black ${
                            log.status === 'success' ? 'bg-emerald-50 text-emerald-600' :
                            log.status === 'blocked_by_guardrail' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                            {log.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-clay-muted font-medium">
                          {log.execution_time_ms ? `${log.execution_time_ms}ms` : '<10ms'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button className="p-1.5 rounded-[12px] text-clay-muted hover:text-clay-accent hover:bg-violet-50 transition-all">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded JSON Drawer */}
                      {isExpanded && (
                        <tr className="bg-clay-inputBg/50">
                          <td colSpan={6} className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                              <div>
                                <span className="text-pink-500 font-black mb-2 block" style={{ fontFamily: 'Nunito, sans-serif' }}>ARGUMENTS PAYLOAD</span>
                                <pre className="p-4 rounded-[16px] bg-clay-inputBg shadow-clayPressed text-clay-muted overflow-x-auto font-mono">
                                  {JSON.stringify(log.arguments, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <span className="text-sky-500 font-black mb-2 block" style={{ fontFamily: 'Nunito, sans-serif' }}>RESULT PAYLOAD</span>
                                <pre className="p-4 rounded-[16px] bg-clay-inputBg shadow-clayPressed text-clay-muted overflow-x-auto font-mono">
                                  {JSON.stringify(log.result, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
