# PayNode: Model Context Protocol (MCP) Gateway for Agentic Commerce

[![FastMCP](https://img.shields.io/badge/FastMCP-Python%203.11-blue?style=for-the-badge&logo=python)](https://github.com/jlowin/fastmcp)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment%20Rails-0C2340?style=for-the-badge&logo=razorpay)](https://razorpay.com)
[![React 18](https://img.shields.io/badge/React%2018-Vite%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Framer%20Motion-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

> **PayNode** bridges autonomous AI agents with merchant product catalogs and Razorpay payment rails through the Model Context Protocol (MCP). It establishes deterministic safety guardrails, bounded price negotiations, and explainable audit trails for agentic commerce.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph AgentLayer ["🤖 Autonomous AI Agent Layer"]
        Agent["AI Buyer Agent<br/>(Gemini 2.5 Flash / Claude Sonnet / NIM)"]
    end

    subgraph PayNodeCore ["⚡ PayNode MCP Core & REST Bridge"]
        MCP["FastMCP Server<br/>(JSON-RPC / stdio & HTTP)"]
        REST["FastAPI REST Bridge<br/>(Port 8000)"]
        Guard["Safety & Budget Gate<br/>(Max ₹1,000 Cap & Price Bounds)"]
    end

    subgraph ExternalRails ["💳 Data & Payment Rails"]
        DB[("Supabase PostgreSQL / Local SQLite<br/>(products, audit_logs, merchants)")]
        RZP["Razorpay Payment Rails<br/>(Orders & Payments APIs)"]
    end

    subgraph WebUI ["✨ Stunning Modern Frontend (Port 5173)"]
        MerchantUI["🏪 Merchant Catalog Portal<br/>(CSV Upload, CRUD)"]
        AuditUI["🛡️ Audit Trail & Rails<br/>(5-Stage Pipeline, Realtime Log)"]
        Playground["🎮 Agent Playground<br/>(Live Simulator, Preset Intents)"]
        Analytics["📈 Analytics<br/>(Recharts Invocations & Settlement)"]
    end

    Agent <-->|MCP Tool Calls| MCP
    MCP --> Guard
    Guard --> DB
    Guard --> RZP
    REST <--> DB
    REST <--> RZP
    REST <--> MCP
    WebUI <-->|REST API| REST
```

---

## 🛠️ MCP Tool Definitions (6 Core Tools)

| Tool Name | Parameters | Return Type | Description |
| :--- | :--- | :--- | :--- |
| `search_products` | `query: str, category?: str, max_price?: int` | `list[dict]` | Search merchant catalog by keyword, category, or maximum price in paise. |
| `get_details` | `product_id: str` | `dict` | Retrieve full technical specifications, inventory stock, and pricing. |
| `negotiate_price` | `product_id: str, offered_price: int` | `dict` | Negotiate discount with merchant-defined floor rules (>=90% accept, 80-89% counter, <80% reject). |
| `create_order` | `product_id: str, quantity: int, agreed_price?: int` | `dict` | Create Razorpay order. **Enforces strict ₹1,000 autonomous purchase ceiling.** |
| `initiate_payment` | `order_id: str, payment_method?: str, simulate_failure?: bool` | `dict` | Authorize and capture payment on Razorpay rails with graceful retry support. |
| `check_status` | `order_id: str` | `dict` | Fetch real-time settlement and order status from Razorpay rails. |

---

## 🛡️ Safety Guardrails & Bounded Rules

1. **Autonomous Purchase Ceiling**:
   - Any order exceeding **₹1,000.00 (100,000 paise)** is strictly blocked by the server guardrail (`blocked_by_guardrail`) and requires explicit human co-signature.
2. **Merchant Discount Floor**:
   - Offers $\ge 90\%$ of listed price: **ACCEPTED**
   - Offers between $80\%$ and $89\%$: **COUNTER-OFFER** (midpoint formula)
   - Offers $< 80\%$: **REJECTED** (prevents predatory agent bargaining)
3. **100% Explainable Audit Trail**:
   - Every tool call logs arguments, results, latency in milliseconds, actor type, and execution status to `audit_logs`.
4. **Graceful Failure & Fallback**:
   - If card payment fails or is declined, agent automatically analyzes error code and retries with secondary rail (UPI: `paynode@upi`).

---

## 🚀 Quickstart Guide

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & **npm**

### 1. Configure Environment Variables
Create or verify `paynode/.env`:
```env
# Gemini API Key (Optional for LLM Mode)
GEMINI_API_KEY=your_gemini_api_key

# Razorpay Test Credentials (Verified Test Rails)
RAZORPAY_KEY_ID=rzp_test_sdfghjklfghjkl
RAZORPAY_KEY_SECRET=alewerghbngncvmvjvk

# Supabase (Optional - SQLite Local Fallback Included)
SUPABASE_URL=https://your-supabase-id.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

### 2. Seed Database
```bash
python database/seed_data.py
```

### 3. Run Automated Tests
```bash
python -m pytest tests/test_mcp_tools.py -v
```

### 4. Start FastMCP / REST Bridge Server (Port 8000)
```bash
python mcp_server/api_bridge.py
```

### 5. Launch React + Vite Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

---

