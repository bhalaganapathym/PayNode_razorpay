# Audit Dashboard (PayNode)

The Audit Dashboard & Safety Visualizer is hosted inside the unified PayNode React Application (`paynode/frontend/src/components/AuditTrail.tsx` & `paynode/frontend/src/components/AnalyticsView.tsx`).

### Features:
- Real-time immutable audit trail table with status pills, execution latency, and expandable JSON payload inspector.
- 5-Stage Agentic Commerce Rails visualizer (Intent -> Discovery -> Guardrail -> Order -> Settlement).
- Recharts visualizations: Tool Call frequency distribution and execution integrity donut.
- Autonomous purchase ceiling (₹1,000 max) and bounded negotiation rule monitors.
