---
name: paynode-agentic-commerce
description: Model Context Protocol (MCP) gateway patterns, safety guardrails, price negotiations, and Razorpay payment rails for autonomous AI commerce.
---

# PayNode Agentic Commerce Skill

Complete guide for implementing agentic commerce protocols (x402 / UAP / ACP) using PayNode, FastMCP, and Razorpay rails.

## Architecture Blueprint
1. **Tool Exposure**: 6 MCP tools (`search_products`, `get_details`, `create_order`, `initiate_payment`, `check_status`, `negotiate_price`).
2. **Deterministic Guardrails**: Enforce a strict ₹1,000 purchase limit on the server before creating payment orders.
3. **Bounded Price Bargaining**:
   - $\ge 90\% \implies$ Auto-accept
   - $80\text{--}89\% \implies$ Counter-offer (midpoint formula)
   - $< 80\% \implies$ Reject (below merchant discount floor)
4. **Graceful Failure & Recovery**: If payment fails, auto-recover with alternative rails (UPI: `paynode@upi`).
5. **Real-Time Audit Trail**: 100% explainability logging with timestamps, actor type, arguments, and latency.
