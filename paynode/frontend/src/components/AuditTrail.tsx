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
    <div className="space-y-8">
      
      {/* 5-Stage Payment Rails Visualizer */}
      <PaymentTimeline />

      {/* Audit Log Header & Controls */}
      <div className="neo-card p-6 sm:p-8 space-y-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b-4 border-black">
          <div>
            <h2 className="text-2xl font-black uppercase text-black flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#FF6B6B] text-white flex items-center justify-center border-3 border-black shadow-[3px_3px_0px_0px_#000]">
                <Shield className="w-6 h-6 stroke-[3px]" />
              </div>
              <span>SOC AUDIT TRAIL & LOGS</span>
            </h2>
            <p className="text-xs font-bold text-black/75 mt-1 uppercase">
              Cryptographically verified record of all autonomous tool loops and monetary actions
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="neo-btn neo-btn-secondary px-5 py-2.5 text-xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 stroke-[3px] ${loading ? 'animate-spin' : ''}`} />
            <span>REFRESH AUDIT</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-black stroke-[3px] absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH TOOL, ARGUMENT, HASH..."
              className="w-full pl-12 pr-4 py-2.5 neo-input text-xs font-bold uppercase"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'success', 'failed', 'blocked_by_guardrail'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 border-3 border-black text-xs font-black uppercase transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-black text-[#FFD93D] shadow-[3px_3px_0px_0px_#FF6B6B] -translate-y-0.5'
                    : 'bg-white text-black hover:bg-[#FFD93D]'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="border-4 border-black bg-white shadow-neo-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black text-[#FFD93D] font-black uppercase border-b-4 border-black">
              <tr>
                <th className="px-5 py-4 tracking-wider">TIMESTAMP</th>
                <th className="px-5 py-4 tracking-wider">MCP TOOL / EVENT</th>
                <th className="px-5 py-4 tracking-wider">CALLER ACTOR</th>
                <th className="px-5 py-4 tracking-wider">RAIL STATUS</th>
                <th className="px-5 py-4 tracking-wider">LATENCY</th>
                <th className="px-5 py-4 text-right tracking-wider">RAW PAYLOAD</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-black">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center font-bold uppercase text-black/60 bg-[#FFFDF5]">
                    Loading audit trail from database...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center font-bold uppercase text-black/60 bg-[#FFFDF5]">
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
                        className="hover:bg-[#FFD93D]/20 cursor-pointer transition-colors"
                      >
                        <td className="px-5 py-4 font-mono font-bold whitespace-nowrap">
                          {dateStr}
                        </td>
                        <td className="px-5 py-4 font-mono font-black text-black">
                          {log.tool_name}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 border-2 border-black font-mono text-[10px] font-bold bg-[#C4B5FD] text-black">
                            {log.actor_type || 'ai_buyer_agent'}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono">
                          <span className={`px-2.5 py-1 border-2 border-black text-[10px] uppercase font-black ${
                            log.status === 'success' ? 'bg-[#10B981] text-black' :
                            log.status === 'blocked_by_guardrail' ? 'bg-[#FFD93D] text-black' :
                            'bg-[#FF6B6B] text-white'
                          }`}>
                            {log.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-black/80">
                          {log.execution_time_ms ? `${log.execution_time_ms}ms` : '<10ms'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="p-1 border-2 border-black bg-white hover:bg-[#FFD93D] shadow-[2px_2px_0px_0px_#000]">
                            {isExpanded ? <ChevronUp className="w-4 h-4 stroke-[3px]" /> : <ChevronDown className="w-4 h-4 stroke-[3px]" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded JSON Drawer */}
                      {isExpanded && (
                        <tr className="bg-[#FFFDF5] border-b-3 border-black">
                          <td colSpan={6} className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                              <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                                <span className="text-[#FF6B6B] font-black mb-2 block uppercase font-sans tracking-wide">
                                  INPUT ARGUMENTS PAYLOAD:
                                </span>
                                <pre className="p-3 bg-[#FFFDF5] border-2 border-black overflow-x-auto text-[11px] font-bold">
                                  {JSON.stringify(log.arguments, null, 2)}
                                </pre>
                              </div>
                              <div className="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                                <span className="text-[#38BDF8] font-black mb-2 block uppercase font-sans tracking-wide">
                                  GATEWAY RESULT PAYLOAD:
                                </span>
                                <pre className="p-3 bg-[#FFFDF5] border-2 border-black overflow-x-auto text-[11px] font-bold">
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
