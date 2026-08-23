export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in paise
  category: string;
  stock: number;
  image_url?: string;
  sku?: string;
  is_active?: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  tool_name: string;
  arguments: any;
  result: any;
  status: 'success' | 'failed' | 'blocked_by_guardrail';
  execution_time_ms?: number;
  actor_type?: string;
}

export interface AgentStep {
  step: number;
  type: 'thought' | 'tool_execution' | 'system_note';
  title: string;
  thought?: string;
  tool_name?: string;
  arguments?: any;
  result?: any;
  status?: string;
  timestamp: string;
}

export interface AgentTraceResult {
  intent: string;
  model_used: string;
  steps: AgentStep[];
  final_summary: string;
  order_id: string | null;
  payment_id: string | null;
  total_spent_inr: number;
  guardrail_status: 'PASSED' | 'VIOLATION_BLOCKED';
  elapsed_seconds: number;
}

export interface AnalyticsData {
  total_calls: number;
  success_count: number;
  failed_count: number;
  guardrail_blocked: number;
  success_rate: number;
  tool_distribution: { name: string; count: number }[];
  guardrail_limit_inr: number;
}
