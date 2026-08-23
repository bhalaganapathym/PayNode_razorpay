-- ==============================================================================
-- PayNode: Supabase PostgreSQL Schema
-- Tables: merchants, products, audit_logs
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MERCHANTS TABLE
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    razorpay_account_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL, -- Price in paise (e.g. 79900 = ₹799.00)
    category VARCHAR(100) NOT NULL DEFAULT 'Electronics',
    stock INT NOT NULL DEFAULT 10,
    image_url TEXT,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AUDIT LOGS TABLE (For autonomous agent actions & MCP tool invocations)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    tool_name VARCHAR(100) NOT NULL,
    arguments JSONB NOT NULL DEFAULT '{}'::jsonb,
    result JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'blocked_by_guardrail'
    execution_time_ms INT DEFAULT 0,
    actor_type VARCHAR(50) DEFAULT 'ai_buyer_agent',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- INDEXES for lightning-fast queries and real-time dashboard analytics
CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tool_name ON public.audit_logs(tool_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON public.audit_logs(status);

-- Enable Row Level Security (RLS) and permissive public access policies for demo/test mode
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for test/demo environment
DROP POLICY IF EXISTS "Allow public read access on merchants" ON public.merchants;
CREATE POLICY "Allow public read access on merchants" ON public.merchants FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access on merchants" ON public.merchants;
CREATE POLICY "Allow public write access on merchants" ON public.merchants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access on products" ON public.products;
CREATE POLICY "Allow public write access on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow public read access on audit_logs" ON public.audit_logs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access on audit_logs" ON public.audit_logs;
CREATE POLICY "Allow public write access on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
